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
    const cache = videoCacheRef.current;
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
        // keep previous video in place until new one mounted
        // remove any existing children that were previously mounted for this container
        // but only after new video is ready and appended
        videoEl.style.position = 'absolute';
        videoEl.style.inset = '0';
        videoEl.style.width = '100%';
        videoEl.style.height = '100%';
        videoEl.style.objectFit = 'cover';
        videoEl.style.zIndex = '0';
        videoEl.style.pointerEvents = 'none';
        videoEl.muted = true;

        // ensure it's playing (muted autoplay allowed)
        try {
          await videoEl.play();
        } catch (e) {
          // ignore play errors; canplaythrough ensured readiness
        }

        // Append after play attempt to avoid flashing
        container.appendChild(videoEl);

        // remove earlier mounted video if any different src
        const prev = mountedContainers.current.get(container);
        if (prev && prev !== src) {
          const prevVideo = videoCacheRef.current.get(prev);
          if (prevVideo && prevVideo.parentElement === container) {
            container.removeChild(prevVideo);
          }
        }

        mountedContainers.current.set(container, src);
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
