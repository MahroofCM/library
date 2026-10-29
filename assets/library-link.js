/* YMU Library: "back to the library" link for every book home page.
   Load with <script src="../assets/library-link.js" defer></script> (or "assets/..." from the repo root).
   The library root is worked out from this script's own URL, so it works on any host or path.
   Placement: before the cover kicker, and at the start of the contents bar. If neither exists, a small
   fixed pill sits at the top left. */
(function () {
  if (window.__ymuLibLink) return; window.__ymuLibLink = 1;
  var me = document.currentScript;
  var root = me ? new URL('..', me.src).href : '/';

  function lang() {
    var l = new URLSearchParams(location.search).get('lang');
    if (!l) l = (document.documentElement.lang || '').slice(0, 2);
    return l === 'ml' ? 'ml' : 'en';
  }
  function make(cls) {
    var ml = lang() === 'ml', a = document.createElement('a');
    a.className = 'ymu-lib ' + cls;
    a.href = root + '?lang=' + lang();
    a.setAttribute('aria-label', ml ? 'YMU ലൈബ്രറിയിലേക്ക് മടങ്ങുക' : 'Back to the YMU Library');
    a.innerHTML = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M10 3 5 8l5 5"/></svg><span>' + (ml ? 'ലൈബ്രറി' : 'Library') + '</span>';
    a.addEventListener('click', function () { try { localStorage.setItem('ymu:lang', lang()); } catch (e) {} });
    return a;
  }

  var css = document.createElement('style');
  css.textContent =
    '.ymu-lib{display:inline-flex;align-items:center;gap:6px;flex:none;min-height:36px;padding:0 14px 0 10px;border:1px solid rgba(201,162,39,.45);border-radius:999px;' +
    'background:rgba(10,15,27,.55);color:#C9A227;font-family:inherit;font-weight:600;font-size:12px;line-height:1;letter-spacing:.14em;text-transform:uppercase;text-decoration:none;' +
    'transition:background-color .3s cubic-bezier(.16,1,.3,1),color .3s cubic-bezier(.16,1,.3,1),border-color .3s cubic-bezier(.16,1,.3,1)}' +
    ':root:lang(ml) .ymu-lib{letter-spacing:0;text-transform:none;font-size:13px}' +
    '.ymu-lib svg{width:14px;height:14px;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round;transition:transform .45s cubic-bezier(.16,1,.3,1)}' +
    '.ymu-lib:hover{background:#C9A227;color:#15120A;border-color:#C9A227}.ymu-lib:hover svg{transform:translateX(-3px)}' +
    '.ymu-lib:focus-visible{outline:2px solid #C9A227;outline-offset:3px}' +
    '.ymu-lib.on-cover{margin:0 auto 18px;width:max-content}' +
    '.ymu-lib.in-bar{margin-right:4px}' +
    '.ymu-lib.float{position:fixed;z-index:999;left:max(12px,env(safe-area-inset-left,0px));top:max(12px,env(safe-area-inset-top,0px));backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px)}' +
    '@media (prefers-reduced-motion:reduce){.ymu-lib,.ymu-lib svg{transition:none}}';
  document.head.appendChild(css);

  function place() {
    var placed = 0;
    // cover: papermorph (#cover / #book) and single-file books (#v-cover)
    var kick = document.querySelector('#kick, #cover .kicker, #book .kicker, #v-cover .kicker');
    if (kick && kick.parentNode) {
      var a = make('on-cover');
      if (getComputedStyle(kick).textAlign === 'center' || getComputedStyle(kick.parentNode).textAlign === 'center') a.style.display = 'flex';
      else a.style.margin = '0 0 18px';
      kick.parentNode.insertBefore(a, kick); placed++;
    }
    // contents bar
    var bar = document.querySelector('#contents header.top, .c-top');
    if (bar) { bar.insertBefore(make('in-bar'), bar.firstChild); placed++; }
    if (!placed) document.body.appendChild(make('float'));
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', place); else place();
})();
