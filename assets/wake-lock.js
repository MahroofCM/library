/* YMU Library: keep the phone screen on while a lesson is playing.
   Load with <script src="../../assets/wake-lock.js"></script> in a chapter page (any relative path works).
   Works with any book engine: it watches audio/video playback and speech narration, holds a Screen Wake Lock
   while either is active, and lets the screen sleep normally a little while after playback stops.
   Older iPhones and some in-app browsers have no Wake Lock API, so there it plays a tiny silent, muted,
   invisible looping video instead, which phones also treat as "keep awake". */
(function () {
  if (window.__ymuWake) return; window.__ymuWake = 1;
  var me = document.currentScript;
  var videoSrc = me ? new URL('keepawake.mp4', me.src).href : 'keepawake.mp4';
  var GRACE = 90 * 1000;          // stay awake this long after narration stops (thinking time on questions)
  var media = new Set(), lastActive = 0, lock = null, asking = false, video = null;
  var hasAPI = 'wakeLock' in navigator;

  // Track every media element the page plays, including `new Audio()` clips that never join the DOM.
  var P = window.HTMLMediaElement && HTMLMediaElement.prototype;
  if (P && P.play) {
    var play = P.play;
    P.play = function () {
      if (this !== video) { media.add(this); lastActive = Date.now(); setTimeout(tick, 0); }
      return play.apply(this, arguments);
    };
  }
  // Speech-synthesis narration (single-file books).
  var ss = window.speechSynthesis;
  if (ss && ss.speak) {
    var speak = ss.speak.bind(ss);
    try { ss.speak = function (u) { lastActive = Date.now(); setTimeout(tick, 0); return speak(u); }; } catch (e) {}
  }

  function playing() {
    var on = false;
    media.forEach(function (m) {
      if (!m.isConnected && !m.src) { media.delete(m); return; }
      if (!m.paused && !m.ended) on = true;
    });
    if (ss && (ss.speaking || ss.pending) && !ss.paused) on = true;
    return on;
  }

  function acquire() {
    if (document.visibilityState !== 'visible') return;
    if (hasAPI) {
      if (lock || asking) return;
      asking = true;
      navigator.wakeLock.request('screen').then(function (l) {
        asking = false; lock = l;
        l.addEventListener('release', function () { if (lock === l) lock = null; });
      }).catch(function () { asking = false; hasAPI = false; acquire(); });   // blocked (e.g. some in-app browsers): use the video
      return;
    }
    if (!video) {
      video = document.createElement('video');
      video.setAttribute('playsinline', ''); video.setAttribute('muted', ''); video.setAttribute('aria-hidden', 'true');
      video.muted = true; video.loop = true; video.src = videoSrc;
      video.style.cssText = 'position:fixed;left:0;top:0;width:1px;height:1px;opacity:0;pointer-events:none;z-index:-1';
      document.body.appendChild(video);
    }
    if (video.paused) { var p = video.play(); if (p && p.catch) p.catch(function () {}); }
  }
  function release() {
    if (lock) { var l = lock; lock = null; l.release().catch(function () {}); }
    if (video && !video.paused) video.pause();
  }

  function tick() {
    if (playing()) lastActive = Date.now();
    if (lastActive && Date.now() - lastActive < GRACE) acquire(); else release();
  }
  setInterval(tick, 4000);
  // The browser drops the lock whenever the tab is hidden; take it back when the reader returns.
  document.addEventListener('visibilitychange', function () { if (document.visibilityState === 'visible') tick(); });
  // Any tap counts as activity, and on iPhone the fallback video may only start from a tap.
  ['pointerdown', 'keydown'].forEach(function (t) {
    addEventListener(t, function () { setTimeout(tick, 50); }, { passive: true, capture: true });
  });
})();
