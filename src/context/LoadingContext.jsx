import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import LoadingScreen from '../components/LoadingScreen/LoadingScreen';
import { useVideoReady } from '../hooks/useVideoReady';

const LoadingContext = createContext(null);

export function LoadingProvider({ children }) {
  const location = useLocation();
  const [videoSrc, setVideoSrc] = useState(null);
  const [visible, setVisible] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const { videoRef, progress, isReady } = useVideoReady(videoSrc, Boolean(videoSrc));

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updatePreference = () => setReducedMotion(mediaQuery.matches);
    updatePreference();
    mediaQuery.addEventListener('change', updatePreference);
    return () => mediaQuery.removeEventListener('change', updatePreference);
  }, []);

  useEffect(() => {
    setVisible(true);
  }, [location.pathname]);

  useEffect(() => {
    if (!videoSrc) return;

    if (isReady) {
      const timer = window.setTimeout(() => setVisible(false), 300);
      return () => window.clearTimeout(timer);
    }

    return undefined;
  }, [isReady, videoSrc]);

  const beginLoad = useCallback((src) => {
    setVideoSrc(src);
    setVisible(true);
  }, []);

  const value = useMemo(() => ({
    beginLoad,
    videoRef,
    progress,
    isReady,
  }), [beginLoad, isReady, progress, videoRef]);

  return (
    <LoadingContext.Provider value={value}>
      {children}
      <LoadingScreen progress={progress} visible={visible} reducedMotion={reducedMotion} />
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  const context = useContext(LoadingContext);

  if (!context) {
    throw new Error('useLoading must be used within LoadingProvider');
  }

  return context;
}
