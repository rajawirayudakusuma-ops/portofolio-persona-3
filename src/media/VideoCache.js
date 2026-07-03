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

    function cleanupListeners() {
      video.removeEventListener('loadeddata', onLoadedData);
      video.removeEventListener('canplaythrough', onCanPlayThrough);
      video.removeEventListener('error', onError);
      video.removeEventListener('stalled', onStalled);
    }

    function markReady() {
      entry.status = 'ready';
      entry.readyState = video.readyState;
      cleanupListeners();
      entry.resolve(entry);
    }

    function onLoadedData() {
      entry.readyState = video.readyState;
      // don't resolve yet; wait for canplaythrough for reliable playback
    }

    function onCanPlayThrough() {
      markReady();
    }

    function onStalled() {
      // treat as not ready; allow retries via error
    }

    function onError() {
      cleanupListeners();
      entry.status = 'error';
      if (entry.retries < DEFAULT_RETRIES) {
        entry.retries += 1;
        // try again after a short backoff but not using setTimeout for loading screen
        // create a replacement element to retry
        const nv = makeVideoElement(src + (entry.retries === 1 ? '' : ''));
        entry.video = nv;
        video.removeAttribute('src');
        video.load?.();
        // reattach listeners
        nv.addEventListener('loadeddata', onLoadedData);
        nv.addEventListener('canplaythrough', onCanPlayThrough);
        nv.addEventListener('error', onError);
        nv.addEventListener('stalled', onStalled);
        // start load
        nv.load();
      } else {
        entry.reject(new Error('failed-to-load'));
      }
    }

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
