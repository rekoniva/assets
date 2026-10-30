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
  // Same-page links to a collapsible section open it, even when the hash is already set.
  document.addEventListener('click', function (ev) {
    var link = ev.target.closest('a[href^="#"]');
    var el = link && document.getElementById(decodeURIComponent(link.getAttribute('href').slice(1)));
    if (el && el.tagName === 'DETAILS') el.open = true;
  });

  // Audit page: expand / collapse every section.
  var accButtons = document.querySelector('.acc-buttons');
  if (accButtons) {
    var accs = Array.prototype.slice.call(document.querySelectorAll('.audit-acc'));
    accButtons.hidden = false;
    accButtons.addEventListener('click', function (ev) {
      var b = ev.target.closest('[data-acc]');
      if (b) accs.forEach(function (d) { d.open = b.getAttribute('data-acc') === 'open'; });
    });
  }

  // Printing shows every collapsible section, then puts them back.
  var printState = [];
  window.addEventListener('beforeprint', function () {
    printState = Array.prototype.map.call(document.querySelectorAll('main details'), function (d) {
      var was = d.open; d.open = true; return [d, was];
    });
  });
  window.addEventListener('afterprint', function () {
    printState.forEach(function (p) { p[0].open = p[1]; });
  });

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
    var params = new URLSearchParams(location.search);
    if (params.get('q') || params.get('cat')) {
      dq.value = params.get('q') || '';
      dcat.value = params.get('cat') || '';
      run();
    }
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

  // "Read more" for folded intro text.
  Array.prototype.forEach.call(document.querySelectorAll('.fold-toggle'), function (btn) {
    var body = btn.previousElementSibling;
    btn.addEventListener('click', function () {
      var open = body.hidden;
      body.hidden = !open;
      btn.textContent = open ? 'Show less' : 'Read more';
      btn.setAttribute('aria-expanded', String(open));
    });
  });

  // Site search (search.html): every word must match; title matches rank first; grouped by kind.
  var results = document.getElementById('search-results');
  if (results && window.PLH_INDEX) {
    var input = document.getElementById('search-q');
    var sstatus = document.getElementById('search-status');
    var ORDER = ['Pages', 'Topics', 'Events', 'People', 'Businesses'];
    var LIMIT = 6;
    var esc = function (t) { return String(t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
    var data = window.PLH_INDEX.map(function (it) {
      it.tl = it.t.toLowerCase();
      it.all = (it.t + ' ' + it.c + ' ' + it.d + ' ' + it.x).toLowerCase();
      return it;
    });
    var render = function () {
      var q = input.value.trim().toLowerCase();
      var words = q.split(/\s+/).filter(Boolean);
      if (!words.length) { results.innerHTML = ''; sstatus.textContent = ''; return; }
      var hits = data.filter(function (it) {
        return words.every(function (w) { return it.all.indexOf(w) !== -1; });
      }).map(function (it) {
        var score = (it.tl === q ? 100 : 0) + (it.tl.indexOf(q) === 0 ? 50 : 0) + (it.tl.indexOf(q) !== -1 ? 30 : 0) +
          words.filter(function (w) { return it.tl.indexOf(w) !== -1; }).length * 10;
        return { it: it, score: score };
      }).sort(function (a, b) { return b.score - a.score; });
      // Groups follow their best match (a business named "Golf…" outranks a page that mentions golf).
      var best = {};
      hits.forEach(function (h) { if (!(h.it.k in best)) best[h.it.k] = h.score; });
      var kinds = ORDER.filter(function (k) { return k in best; }).sort(function (a, b) {
        return (best[b] - best[a]) || (ORDER.indexOf(a) - ORDER.indexOf(b));
      });
      var html = '';
      kinds.forEach(function (kind) {
        var group = hits.filter(function (h) { return h.it.k === kind; });
        if (!group.length) return;
        html += '<section class="sr-group"><h2>' + kind + ' <span class="row-count">(' + group.length + ')</span></h2><ul class="sr-list">';
        group.forEach(function (h, i) {
          var it = h.it;
          html += '<li' + (i >= LIMIT ? ' hidden' : '') + '><a href="' + esc(it.u) + '"><strong>' + esc(it.t) + '</strong>' +
            (it.c ? '<span class="sr-ctx">' + esc(it.c) + '</span>' : '') +
            (it.d ? '<span class="sr-desc">' + esc(it.d) + '</span>' : '') + '</a></li>';
        });
        html += '</ul>';
        if (group.length > LIMIT) html += '<button type="button" class="desc-toggle sr-more">Show all ' + group.length + '</button>';
        html += '</section>';
      });
      results.innerHTML = html;
      sstatus.textContent = hits.length ? hits.length + (hits.length === 1 ? ' result' : ' results') + ' for \u201c' + input.value.trim() + '\u201d.' :
        'No results for \u201c' + input.value.trim() + '\u201d. Try a business name, an event, or a word like \u201cmembership\u201d.';
    };
    results.addEventListener('click', function (ev) {
      var b = ev.target.closest('.sr-more');
      if (!b) return;
      Array.prototype.forEach.call(b.previousElementSibling.querySelectorAll('li[hidden]'), function (li) { li.hidden = false; });
      b.remove();
    });
    var t = 0;
    input.addEventListener('input', function () { clearTimeout(t); t = setTimeout(render, 120); });
    input.form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      history.replaceState(null, '', 'search.html?q=' + encodeURIComponent(input.value.trim()));
      render();
    });
    input.value = new URLSearchParams(location.search).get('q') || '';
    render();
  }

  // Contact form: show the confirmation after Netlify redirects back with ?sent=1.
  var ok = document.querySelector('.form-success');
  if (ok && /[?&]sent=1/.test(location.search)) ok.hidden = false;

  // Homepage video: poster + big play button; plays only when tapped, with native controls.
  Array.prototype.forEach.call(document.querySelectorAll('.video-frame'), function (frame) {
    var video = frame.querySelector('video');
    var play = frame.querySelector('.video-play');
    if (!video || !play) return;
    video.controls = false;
    play.hidden = false;
    play.addEventListener('click', function () {
      frame.classList.add('is-playing');
      video.controls = true;
      video.play();
      video.focus();
    });
  });
})();
