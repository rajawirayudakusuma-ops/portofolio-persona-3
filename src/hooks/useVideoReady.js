import { useEffect, useRef, useState } from 'react';

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

export function useVideoReady(videoSrc, enabled = true) {
  const videoRef = useRef(null);
  const [readyState, setReadyState] = useState('idle');
  const [progress, setProgress] = useState(0);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!enabled) {
      setReadyState('idle');
      setProgress(0);
      setIsReady(false);
      return undefined;
    }

    const video = videoRef.current;
    if (!video) {
      setReadyState('loading');
      setProgress(0);
      return undefined;
    }

    let cancelled = false;
    let rafId = null;

    const finish = () => {
      if (!cancelled) {
        setReadyState('ready');
        setProgress(100);
        setIsReady(true);
      }
    };

    const updateProgress = () => {
      if (cancelled) return;

      const buffered = video.buffered;
      const current = video.currentTime;
      const total = video.duration || 1;
      let nextProgress = 0;

      if (buffered && buffered.length > 0) {
        const end = buffered.end(buffered.length - 1);
        nextProgress = (end / total) * 100;
      } else if (video.readyState >= 2) {
        nextProgress = 50;
      }

      nextProgress = clamp(nextProgress, 0, 100);
      setProgress((prev) => (prev < nextProgress ? nextProgress : prev));

      if (video.readyState >= 3 || nextProgress >= 100) {
        finish();
        return;
      }

      rafId = window.requestAnimationFrame(updateProgress);
    };

    const onCanPlayThrough = () => {
      if (!cancelled) {
        setReadyState('canplaythrough');
        setProgress(100);
        setIsReady(true);
      }
    };

    const onLoadedData = () => {
      if (!cancelled) {
        setReadyState('loadeddata');
      }
    };

    const onError = () => {
      if (!cancelled) {
        setReadyState('error');
        setProgress(100);
        setIsReady(true);
      }
    };

    video.preload = 'auto';
    video.load();

    video.addEventListener('loadeddata', onLoadedData);
    video.addEventListener('canplaythrough', onCanPlayThrough);
    video.addEventListener('error', onError);

    rafId = window.requestAnimationFrame(updateProgress);

    return () => {
      cancelled = true;
      if (rafId) {
        window.cancelAnimationFrame(rafId);
      }
      video.removeEventListener('loadeddata', onLoadedData);
      video.removeEventListener('canplaythrough', onCanPlayThrough);
      video.removeEventListener('error', onError);
    };
  }, [videoSrc, enabled]);

  return { videoRef, readyState, progress, isReady };
}
