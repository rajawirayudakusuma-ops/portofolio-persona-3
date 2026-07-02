import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { BGM_AUDIO_SRC } from './mediaPaths';

let audioInstance = null;
let audioMuted = true;

const AudioContext = createContext(null);

async function attemptPlayback(audio) {
  if (!audio || audio.muted || !audio.paused) return;

  try {
    await audio.play();
  } catch (error) {
    console.log('BGM autoplay blocked:', error);
  }
}

export function AudioProvider({ children }) {
  const audioRef = useRef(null);
  const [isMuted, setIsMuted] = useState(audioMuted);

  useEffect(() => {
    if (!audioInstance) {
      audioInstance = document.createElement('audio');
      audioInstance.src = BGM_AUDIO_SRC;
      audioInstance.loop = true;
      audioInstance.volume = 0.3;
      audioInstance.id = 'app-bgm-audio';
      audioInstance.preload = 'auto';
      document.body.appendChild(audioInstance);
    }

    audioRef.current = audioInstance;
    audioInstance.muted = audioMuted;

    if (!audioMuted) {
      void attemptPlayback(audioInstance);
    }
  }, []);

  const setMuted = useCallback((nextMuted) => {
    audioMuted = !!nextMuted;
    setIsMuted(audioMuted);

    if (audioRef.current) {
      audioRef.current.muted = audioMuted;

      if (audioMuted) {
        audioRef.current.pause();
      } else {
        void attemptPlayback(audioRef.current);
      }
    }
  }, []);

  const toggleMute = useCallback(() => {
    setMuted(!audioMuted);
  }, [setMuted]);

  const resumePlayback = useCallback(() => {
    if (!audioRef.current || audioMuted) return;
    if (audioRef.current.paused) {
      void attemptPlayback(audioRef.current);
    }
  }, []);

  const value = useMemo(() => ({
    isMuted,
    setMuted,
    toggleMute,
    resumePlayback,
    audioRef,
  }), [isMuted, setMuted, toggleMute, resumePlayback]);

  return <AudioContext.Provider value={value}>{children}</AudioContext.Provider>;
}

export function useAudio() {
  const context = useContext(AudioContext);

  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }

  return context;
}
