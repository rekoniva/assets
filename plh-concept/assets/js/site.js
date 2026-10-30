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

  // Tapping a menu link closes the menu, so same-page links (e.g. membership.html#sponsorship) visibly land.
  Array.prototype.forEach.call(document.querySelectorAll('#site-menu a'), function (link) {
    link.addEventListener('click', function () { setNav(false); closeSubs(); });
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

  // Directory: keyword (business name or category) + consolidated category; matching groups open, the rest hide.
  var dform = document.querySelector('[data-dir-search]');
  if (dform) {
    var dq = dform.querySelector('#dir-q');
    var dcat = dform.querySelector('#dir-cat');
    var groups = Array.prototype.slice.call(document.querySelectorAll('.dir-group'));
    var status = document.getElementById('dir-status');
    var idle = status.textContent;
    var run = function () {
      var q = dq.value.trim().toLowerCase();
      var cat = dcat.value;
      var active = q !== '' || cat !== '';
      var names = {};
      groups.forEach(function (g) {
        var inCat = cat === '' || g.getAttribute('data-group') === cat;
        var hits = 0;
        Array.prototype.forEach.call(g.querySelectorAll('.biz'), function (b) {
          var match = inCat && (q === '' || b.getAttribute('data-search').indexOf(q) !== -1);
          b.hidden = !match;
          if (match) { hits++; names[b.querySelector('h3').textContent] = 1; }
        });
        g.hidden = active && hits === 0;
        g.open = active && hits > 0;
      });
      var total = Object.keys(names).length;
      status.textContent = !active ? idle :
        total === 0 ? 'No businesses match. Try another word or category.' :
        total + (total === 1 ? ' business matches.' : ' businesses match.');
    };
    dq.addEventListener('input', run);
    dcat.addEventListener('change', run);
    dform.addEventListener('submit', function (ev) { ev.preventDefault(); run(); });
  }

  // Photo carousels: arrows step one photo, swipe/scroll snaps, counter follows along.
  Array.prototype.forEach.call(document.querySelectorAll('.carousel'), function (car) {
    var track = car.querySelector('.carousel-track');
    var prev = car.querySelector('.carousel-prev');
    var next = car.querySelector('.carousel-next');
    var count = car.querySelector('.carousel-count');
    var n = track.children.length;
    var index = function () { return Math.round(track.scrollLeft / Math.max(track.clientWidth, 1)); };
    var update = function () {
      var i = index();
      count.textContent = (i + 1) + ' / ' + n;
      prev.disabled = i <= 0;
      next.disabled = i >= n - 1;
      // Slides of different heights (testimonials): size the track to the one showing.
      if (car.classList.contains('auto-height') && track.children[i]) {
        track.style.height = track.children[i].offsetHeight + 'px';
      }
    };
    window.addEventListener('resize', function () { update(); });
    var go = function (d) { track.scrollTo({ left: (index() + d) * track.clientWidth }); };
    prev.addEventListener('click', function () { go(-1); });
    next.addEventListener('click', function () { go(1); });
    var raf = 0;
    track.addEventListener('scroll', function () {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    });
    update();
  });

  // Event calendar: fold long descriptions to three lines with a Read more / Show less toggle.
  Array.prototype.forEach.call(document.querySelectorAll('#calendar .event-desc'), function (d) {
    d.classList.add('clamped');
    if (d.scrollHeight <= d.clientHeight + 2) { d.classList.remove('clamped'); return; }
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'desc-toggle';
    btn.textContent = 'Read more';
    btn.setAttribute('aria-expanded', 'false');
    btn.addEventListener('click', function () {
      var open = d.classList.toggle('clamped') === false;
      btn.textContent = open ? 'Show less' : 'Read more';
      btn.setAttribute('aria-expanded', String(open));
    });
    d.insertAdjacentElement('afterend', btn);
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
