const DEFAULT_RETRIES = 2;

export default function createVideoCache() {
  const map = new Map();

  function makeVideoElement(src) {
    const v = document.createElement('video');
    v.src = src;
    v.muted = true;
    v.loop = true;
    v.playsInline = true;
    v.preload = 'auto';
    v.setAttribute('data-media-manager', 'video');
    v.crossOrigin = 'anonymous';
    return v;
  }

  function ensure(src) {
    if (!src) return Promise.reject(new Error('no-src'));
    if (map.has(src)) {
      const entry = map.get(src);
      if (entry.status === 'ready') return Promise.resolve(entry);
      return entry.promise;
    }

    let resolveP, rejectP;
    const promise = new Promise((res, rej) => { resolveP = res; rejectP = rej; });

    const video = makeVideoElement(src);
    const entry = {
      src,
      video,
      status: 'loading',
      retries: 0,
      promise,
      resolve: resolveP,
      reject: rejectP,
      readyState: 0,
    };

    function cleanupListeners(el = entry.video) {
      try {
        el.removeEventListener('loadeddata', onLoadedData);
        el.removeEventListener('canplaythrough', onCanPlayThrough);
        el.removeEventListener('error', onError);
        el.removeEventListener('stalled', onStalled);
      } catch (e) {
        // ignore
      }
    }

    function markReady(v) {
      const vid = v || entry.video;
      entry.status = 'ready';
      entry.readyState = vid.readyState;
      cleanupListeners(vid);
      entry.resolve(entry);
    }

    function onLoadedData(e) {
      const v = e?.currentTarget || entry.video;
      entry.readyState = v.readyState;
      // don't resolve yet; wait for canplaythrough for reliable playback
    }

    function onCanPlayThrough(e) {
      const v = e?.currentTarget || entry.video;
      markReady(v);
    }

    function onStalled() {
      // treat as not ready; allow retries via error
    }

    function onError(e) {
      const failedEl = e?.currentTarget || entry.video;
      cleanupListeners(failedEl);
      entry.status = 'error';
      if (entry.retries < DEFAULT_RETRIES) {
        entry.retries += 1;
        // create a replacement element to retry
        const nv = makeVideoElement(src);
        // replace the entry.video after removing listeners from failedEl
        entry.video = nv;
        // attach listeners to the new element
        nv.addEventListener('loadeddata', onLoadedData);
        nv.addEventListener('canplaythrough', onCanPlayThrough);
        nv.addEventListener('error', onError);
        nv.addEventListener('stalled', onStalled);
        // start load
        try { nv.load(); } catch (err) { /* ignore */ }
      } else {
        entry.reject(new Error('failed-to-load'));
      }
    }

    // attach listeners to the initial video element
    video.addEventListener('loadeddata', onLoadedData);
    video.addEventListener('canplaythrough', onCanPlayThrough);
    video.addEventListener('error', onError);
    video.addEventListener('stalled', onStalled);

    // start loading
    try {
      video.load();
    } catch (e) {
      // some browsers may throw, let events handle it
    }

    // if already in a playable readyState, resolve immediately
    try {
      if (video.readyState >= 3) {
        markReady(video);
      }
    } catch (e) {
      // ignore
    }

    map.set(src, entry);

    return promise;
  }

  function get(src) {
    const entry = map.get(src);
    return entry ? entry.video : null;
  }

  function has(src) {
    return map.has(src) && map.get(src).status === 'ready';
  }

  function allKeys() {
    return Array.from(map.keys());
  }

  return {
    ensure,
    get,
    has,
    allKeys,
  };
}
