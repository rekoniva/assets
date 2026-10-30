// Partnership Lake Houston concept: menu disclosure + tap-to-play video.
// Menu follows the WAI-ARIA disclosure navigation pattern (no library needed).
(function () {
  var doc = document.documentElement;
  var navToggle = document.querySelector('.nav-toggle');
  var subToggles = Array.prototype.slice.call(document.querySelectorAll('.sub-toggle'));
  var desktop = window.matchMedia('(min-width: 1024px)');

  function closeSubs(except) {
    subToggles.forEach(function (b) {
      if (b !== except) b.setAttribute('aria-expanded', 'false');
    });
  }

  function setNav(open) {
    if (!navToggle) return;
    navToggle.setAttribute('aria-expanded', String(open));
    navToggle.querySelector('.sr-only').textContent = open ? 'Close menu' : 'Open menu';
    doc.classList.toggle('nav-open', open);
  }

  if (navToggle) {
    navToggle.addEventListener('click', function () {
      setNav(navToggle.getAttribute('aria-expanded') !== 'true');
    });
  }

  subToggles.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var open = btn.getAttribute('aria-expanded') !== 'true';
      if (desktop.matches) closeSubs(btn);
      btn.setAttribute('aria-expanded', String(open));
    });
  });

  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    var openBtn = subToggles.filter(function (b) { return b.getAttribute('aria-expanded') === 'true'; })[0];
    if (openBtn && desktop.matches) { closeSubs(); openBtn.focus(); return; }
    if (doc.classList.contains('nav-open')) { setNav(false); navToggle.focus(); }
  });

  document.addEventListener('click', function (e) {
    if (desktop.matches && !e.target.closest('.menu-item')) closeSubs();
  });

  // Close desktop dropdowns when focus leaves them.
  document.addEventListener('focusin', function (e) {
    if (desktop.matches && !e.target.closest('.menu-item')) closeSubs();
  });

  desktop.addEventListener('change', function () { setNav(false); closeSubs(); });

  // Open a collapsible section when a link points at it (e.g. membership level chips).
  function openTarget() {
    var id = decodeURIComponent(location.hash.slice(1));
    var el = id && document.getElementById(id);
    if (el && el.tagName === 'DETAILS') el.open = true;
  }
  window.addEventListener('hashchange', openTarget);
  openTarget();

  // Directory: filter the category list as you type.
  Array.prototype.forEach.call(document.querySelectorAll('[data-filter]'), function (input) {
    var items = document.querySelectorAll(input.getAttribute('data-filter') + ' > li');
    input.addEventListener('input', function () {
      var q = input.value.trim().toLowerCase();
      Array.prototype.forEach.call(items, function (li) {
        li.hidden = q !== '' && li.textContent.toLowerCase().indexOf(q) === -1;
      });
    });
  });

  // Contact form: show the confirmation after Netlify redirects back with ?sent=1.
  var ok = document.querySelector('.form-success');
  if (ok && /[?&]sent=1/.test(location.search)) ok.hidden = false;

  // Hero background video: muted loop on tablet/desktop only, never for reduced-motion users.
  var hv = document.querySelector('.hero-video');
  var hp = document.querySelector('.hero-pause');
  if (hv && hp && window.matchMedia('(min-width: 768px)').matches &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    hv.src = hv.getAttribute('data-src');
    var p = hv.play();
    var shown = function () { hv.closest('.hero').classList.add('has-video'); hp.hidden = false; };
    if (p && p.then) p.then(shown).catch(function () {}); else shown();
    hp.addEventListener('click', function () {
      var pause = !hv.paused;
      if (pause) hv.pause(); else hv.play();
      hp.setAttribute('aria-pressed', String(pause));
      hp.querySelector('.sr-only').textContent = pause ? 'Play background video' : 'Pause background video';
    });
  }
})();
