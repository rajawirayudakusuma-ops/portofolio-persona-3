import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import createVideoCache from '../media/VideoCache';
import { createAudioManager } from '../media/AudioManager';
import LoadingScreen from '../components/LoadingScreen/LoadingScreen';
import { ROUTE_VIDEO_SRCS, BGM_AUDIO_SRC } from '../mediaPaths';

const MediaContext = createContext(null);

export function MediaProvider({ children }) {
  const videoCacheRef = useRef(null);
  const audioManagerRef = useRef(null);
  const mountedContainers = useRef(new Map()); // src -> container

  const [loadingVisible, setLoadingVisible] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(null);

  useEffect(() => {
    videoCacheRef.current = createVideoCache();
    audioManagerRef.current = createAudioManager(BGM_AUDIO_SRC, { volume: 0.3 });

    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = () => setReducedMotion(mq.matches);
    onChange();
    mq.addEventListener('change', onChange);

    function onVisibility() {
      if (document.visibilityState === 'visible') {
        audioManagerRef.current?.resumePlayback();
      }
    }

    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('focus', onVisibility);

    return () => {
      mq.removeEventListener('change', onChange);
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('focus', onVisibility);
    };
  }, []);

  // intelligent preload: after first page ready, queue other videos
  const startBackgroundPreload = useCallback(() => {
    if (!cache) return;
    const all = Object.values(ROUTE_VIDEO_SRCS);
    // don't block UI: iterate and ensure each
    (async () => {
      for (const src of all) {
        if (!src) continue;
        try {
          await cache.ensure(src);
        } catch (e) {
          // ignore preload errors, video will retry on demand
        }
      }
    })();
  }, []);

  const requestBackground = useCallback(async (src, container) => {
    if (!videoCacheRef.current) throw new Error('video cache not initialized');
    setLoadingVisible(true);
    setLoadingProgress(0);
    setCurrentSrc(src);

    const cache = videoCacheRef.current;

    // if already ready, mount quickly
    try {
      const entry = await cache.ensure(src);

      // attach video element into container
      const videoEl = entry.video;
      if (container && container instanceof HTMLElement) {
        // Prepare a node to append. If the cached master video is already
        // attached to a different container (or in use), clone it to avoid
        // moving the master node and causing a flash on the previous page.
        let nodeToAppend = videoEl;

        const isAttachedElsewhere = videoEl.parentElement && videoEl.parentElement !== container;
        if (isAttachedElsewhere) {
          // clone the element; cloneNode(true) copies attributes but not playback state.
          // This keeps the original visible where it is and shows the clone in the new container.
          nodeToAppend = videoEl.cloneNode(true);
          nodeToAppend.setAttribute('data-media-clone', '1');
          // keep styling consistent
          nodeToAppend.style.position = 'absolute';
          nodeToAppend.style.inset = '0';
          nodeToAppend.style.width = '100%';
          nodeToAppend.style.height = '100%';
          nodeToAppend.style.objectFit = 'cover';
          nodeToAppend.style.zIndex = '0';
          nodeToAppend.style.pointerEvents = 'none';
          nodeToAppend.muted = true;
          try {
            // attempt playback on clone (muted autoplay typically allowed)
            await nodeToAppend.play();
          } catch (e) {
            // ignore
          }
        } else {
          nodeToAppend = videoEl;
          nodeToAppend.style.position = 'absolute';
          nodeToAppend.style.inset = '0';
          nodeToAppend.style.width = '100%';
          nodeToAppend.style.height = '100%';
          nodeToAppend.style.objectFit = 'cover';
          nodeToAppend.style.zIndex = '0';
          nodeToAppend.style.pointerEvents = 'none';
          nodeToAppend.muted = true;
          try {
            await nodeToAppend.play();
          } catch (e) {
            // ignore
          }
        }

        // remove earlier mounted node for this container if different
        const prev = mountedContainers.current.get(container);
        if (prev && prev.src !== src && prev.node && prev.node.parentElement === container) {
          try { container.removeChild(prev.node); } catch (e) { /* ignore */ }
        }

        container.appendChild(nodeToAppend);
        mountedContainers.current.set(container, { src, node: nodeToAppend });
      }

      setLoadingProgress(100);
      setLoadingVisible(false);

      // start background preloads once first successful
      startBackgroundPreload();

      return entry;
    } catch (e) {
      // failed to load: provide graceful fallback by hiding loading after brief fallback
      console.error('video failed to load', src, e);
      setLoadingProgress(100);
      setLoadingVisible(false);
      return null;
    }
  }, [startBackgroundPreload]);

  const getAudio = useCallback(() => ({
    audioRef: audioManagerRef.current?.getRef(),
    isMuted: audioManagerRef.current?.isMuted() ?? false,
    setMuted: (m) => audioManagerRef.current?.setMuted(m),
    toggleMute: () => audioManagerRef.current?.toggleMute(),
    resumePlayback: () => audioManagerRef.current?.resumePlayback(),
  }), []);

  const value = useMemo(() => ({
    requestBackground,
    getAudio,
    loading: { visible: loadingVisible, progress: loadingProgress, reducedMotion },
    currentSrc,
    videoCache: videoCacheRef.current,
  }), [requestBackground, getAudio, loadingVisible, loadingProgress, reducedMotion, currentSrc]);

  return (
    <MediaContext.Provider value={value}>
      {children}
      <LoadingScreen progress={loadingProgress} visible={loadingVisible} reducedMotion={reducedMotion} />
    </MediaContext.Provider>
  );
}

export function useMedia() {
  const ctx = useContext(MediaContext);
  if (!ctx) throw new Error('useMedia must be used inside MediaProvider');
  return ctx;
}

export default MediaProvider;
