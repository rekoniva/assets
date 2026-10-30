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

  // Directory: keyword + category search across all letter groups; matching letters open, the rest hide.
  var dform = document.querySelector('[data-dir-search]');
  if (dform) {
    var dq = dform.querySelector('#dir-q');
    var dcat = dform.querySelector('#dir-cat');
    var groups = Array.prototype.slice.call(document.querySelectorAll('.dir-group'));
    var status = document.getElementById('dir-status');
    var run = function () {
      var q = dq.value.trim().toLowerCase();
      var cat = dcat.value;
      var active = q !== '' || cat !== '';
      var total = 0;
      groups.forEach(function (g) {
        var hits = 0;
        Array.prototype.forEach.call(g.querySelectorAll('li'), function (li) {
          var t = li.textContent;
          var match = (q === '' || t.toLowerCase().indexOf(q) !== -1) && (cat === '' || t === cat);
          li.hidden = !match;
          if (match) hits++;
        });
        total += hits;
        g.hidden = active && hits === 0;
        g.open = active && hits > 0;
      });
      status.textContent = !active ? '' :
        total === 0 ? 'No results. Try another word or category.' :
        total + (total === 1 ? ' result.' : ' results.');
    };
    dq.addEventListener('input', run);
    dcat.addEventListener('change', run);
    dform.addEventListener('submit', function (ev) { ev.preventDefault(); run(); });
  }

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
