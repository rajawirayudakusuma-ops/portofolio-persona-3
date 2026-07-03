let singleton = null;

export function createAudioManager(src, opts = {}) {
  if (singleton) return singleton;

  const audio = document.createElement('audio');
  audio.src = src;
  audio.loop = opts.loop ?? true;
  audio.volume = typeof opts.volume === 'number' ? opts.volume : 0.3;
  audio.id = opts.id ?? 'app-bgm-audio';
  audio.preload = 'auto';
  audio.setAttribute('data-media-manager', 'audio');
  // keep muted state as false by default; provider will control

  document.body.appendChild(audio);

  let isMuted = false;

  function setMuted(next) {
    isMuted = !!next;
    audio.muted = isMuted;
    return isMuted;
  }

  function toggleMute() {
    setMuted(!isMuted);
    return isMuted;
  }

  async function resumePlayback() {
    if (!audio) return;
    if (audio.paused && !audio.muted) {
      try {
        await audio.play();
      } catch (e) {
        // autoplay may be blocked; do nothing. Caller can retry on interaction
      }
    }
  }

  singleton = {
    audio,
    setMuted,
    toggleMute,
    resumePlayback,
    getRef: () => audio,
    isMuted: () => isMuted,
  };

  return singleton;
}

export function getAudioManager() {
  return singleton;
}
