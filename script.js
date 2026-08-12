/* =========================================================
   IITK SAMANVAY 2026 — site scripts
   ========================================================= */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- AOS ---------- */
  function initAOS() {
    // if AOS never loads, nothing may stay hidden
    function unhide() {
      document.querySelectorAll('[data-aos]').forEach(function (n) {
        n.removeAttribute('data-aos');
        n.removeAttribute('data-aos-delay');
      });
    }

    if (typeof AOS === 'undefined') { unhide(); return; }

    if (reduceMotion) { unhide(); return; }

    AOS.init({
      duration: 650,
      easing: 'ease-out-cubic',
      once: true,          // animate a single time — cheaper, and no replay on scroll-back
      offset: 60,
      delay: 0,
      disable: function () { return window.innerWidth < 576; }
    });

    // images finish loading after AOS measures, so re-measure once everything settles
    window.addEventListener('load', function () { AOS.refreshHard(); });
  }

  /* ---------- countdown ---------- */
  function initCountdown() {
    var wrap = document.getElementById('cdWrap');
    if (!wrap) return;

    var target = new Date(wrap.getAttribute('data-target')).getTime();
    var fields = {
      days: wrap.querySelector('[data-cd="days"]'),
      hours: wrap.querySelector('[data-cd="hours"]'),
      minutes: wrap.querySelector('[data-cd="minutes"]'),
      seconds: wrap.querySelector('[data-cd="seconds"]')
    };

    function pad(n) { return String(n).padStart(2, '0'); }

    // subtle pop whenever a digit actually changes
    function set(el, value) {
      if (!el || el.textContent === value) return;
      el.textContent = value;
      if (reduceMotion) return;
      el.classList.add('tick');
      setTimeout(function () { el.classList.remove('tick'); }, 180);
    }

    function tick() {
      var diff = target - Date.now();

      if (diff <= 0) {
        wrap.innerHTML = '<div class="cd-box" style="width:auto;padding:30px 44px">' +
          '<span class="cd-num" style="font-size:1.7rem">Happening Now</span>' +
          '<span class="cd-label">15 October 2026</span></div>';
        clearInterval(timer);
        return;
      }

      var s = Math.floor(diff / 1000);
      set(fields.days, String(Math.floor(s / 86400)));
      set(fields.hours, pad(Math.floor(s % 86400 / 3600)));
      set(fields.minutes, pad(Math.floor(s % 3600 / 60)));
      set(fields.seconds, pad(s % 60));
    }

    tick();
    var timer = setInterval(tick, 1000);
  }

  /* ---------- count-up for "At a Glance" ---------- */
  function initCountUp() {
    var nums = document.querySelectorAll('.glance-num[data-count]');
    if (!nums.length) return;

    if (reduceMotion || !('IntersectionObserver' in window)) return;

    function run(el) {
      var end = parseInt(el.getAttribute('data-count'), 10);
      var suffix = el.getAttribute('data-suffix') || '';
      var dur = 1400;
      var start = null;

      function step(ts) {
        if (start === null) start = ts;
        var p = Math.min((ts - start) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(end * eased) + suffix;
        if (p < 1) requestAnimationFrame(step);
      }

      el.textContent = '0' + suffix;
      requestAnimationFrame(step);
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          run(e.target);
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.5 });

    nums.forEach(function (n) { io.observe(n); });
  }

  /* ---------- promo video facade ---------- */
  function initVideo() {
    var frame = document.getElementById('promoVideo');
    if (!frame) return;

    var id = (frame.getAttribute('data-video-id') || '').trim();
    if (!id) return; // no video yet — keep the "Coming Soon" facade

    var caption = frame.querySelector('.play small');
    if (caption) caption.textContent = 'Watch the Film';

    frame.addEventListener('click', function () {
      frame.innerHTML = '<iframe src="https://www.youtube.com/embed/' + id +
        '?autoplay=1&rel=0" title="IITK Samanvay 2026" allow="accelerometer; autoplay; clipboard-write; ' +
        'encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>';
    }, { once: true });
  }

  /* ---------- speaker preview grid on index.html ---------- */
  function initSpeakerPreview() {
    var grid = document.getElementById('speakerPreview');
    if (!grid || typeof SAMANVAY === 'undefined') return;

    grid.innerHTML = SAMANVAY.panellists.slice(0, 8).map(samanvaySpeakerCard).join('');
  }

  /* ---------- panel titles pulled from speakers.js ---------- */
  function initPanelTitles() {
    if (typeof SAMANVAY === 'undefined') return;

    document.querySelectorAll('.panel-card').forEach(function (card) {
      var kicker = card.querySelector('.panel-kicker');
      var title = card.querySelector('.panel-title');
      if (!kicker || !title) return;

      var t = SAMANVAY.panelTitles[kicker.textContent.trim().replace('Panel Session', 'Panel')];
      if (t) title.textContent = t;
    });
  }

  /* ---------- venue strip: duplicate the tiles for a seamless loop ---------- */
  function initVenueMarquee() {
    var track = document.getElementById('vmTrack');
    if (!track || track.dataset.cloned === '1') return;

    track.innerHTML += track.innerHTML;   // exactly 2x, matching the -50% keyframe
    track.dataset.cloned = '1';
  }

  /* ---------- venue: rotate the Bharat Mandapam photographs ---------- */
  function initVenueSlider() {
    var slider = document.getElementById('venueSlider');
    var dots = document.getElementById('venueDots');
    if (!slider) return;

    var slides = Array.prototype.slice.call(slider.querySelectorAll('img'));
    if (slides.length < 2) { if (dots) dots.style.display = 'none'; return; }

    var i = 0;
    var timer = null;

    function go(n) {
      i = (n + slides.length) % slides.length;
      slides.forEach(function (s, k) { s.classList.toggle('is-on', k === i); });
      if (dots) {
        dots.querySelectorAll('button').forEach(function (b, k) {
          b.classList.toggle('is-on', k === i);
        });
      }
    }

    function start() {
      stop();
      if (reduceMotion) return;
      timer = setInterval(function () { go(i + 1); }, 5000);
    }

    function stop() { if (timer) clearInterval(timer); timer = null; }

    if (dots) {
      dots.innerHTML = slides.map(function (s, k) {
        return '<button type="button" aria-label="Photograph ' + (k + 1) + '"' +
          (k === 0 ? ' class="is-on"' : '') + '></button>';
      }).join('');

      dots.querySelectorAll('button').forEach(function (b, k) {
        b.addEventListener('click', function () { go(k); start(); });
      });
    }

    slider.parentNode.addEventListener('mouseenter', stop);
    slider.parentNode.addEventListener('mouseleave', start);

    go(0);
    start();
  }

  /* ---------- gallery: build tiles from GALLERY (speakers.js) ---------- */
  function initGallery() {
    var grid = document.getElementById('galleryGrid');
    if (!grid || typeof GALLERY === 'undefined') return;

    var aosLive = typeof AOS !== 'undefined' && !reduceMotion && window.innerWidth >= 576;

    grid.innerHTML = GALLERY.map(function (g, i) {
      var aosLive = typeof AOS !== 'undefined' && !reduceMotion && window.innerWidth >= 576;
      var anim = aosLive ? ' data-aos="fade-up" data-aos-delay="' + (i % 4) * 70 + '"' : '';
      var cls = 'g-item m-0' + (g.size ? ' g-' + g.size : '');
      return '<figure class="' + cls + '"' + anim + '>' +
        '<img src="' + g.src + '" alt="' + (g.alt || '') + '" loading="lazy">' +
        '</figure>';
    }).join('');

    // a missing file should never leave an empty box in the grid
    grid.querySelectorAll('img').forEach(function (im) {
      im.addEventListener('error', function () {
        if (im.parentNode) im.parentNode.remove();
      });
    });
  }

  /* ---------- gallery lightbox ---------- */
  function initLightbox() {
    var box = document.getElementById('lightbox');
    var grid = document.getElementById('galleryGrid');
    if (!box || !grid) return;

    var imgs = Array.prototype.slice.call(grid.querySelectorAll('img'));
    if (!imgs.length) return;
    var view = box.querySelector('img');
    var idx = 0;

    function show(i) {
      idx = (i + imgs.length) % imgs.length;
      view.src = imgs[idx].src;
      view.alt = imgs[idx].alt || '';
    }

    function open(i) {
      show(i);
      box.classList.add('open');
      box.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }

    function close() {
      box.classList.remove('open');
      box.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    imgs.forEach(function (im, i) {
      im.parentNode.addEventListener('click', function () { open(i); });
    });

    box.querySelector('.lb-close').addEventListener('click', close);
    box.querySelector('.lb-prev').addEventListener('click', function (e) { e.stopPropagation(); show(idx - 1); });
    box.querySelector('.lb-next').addEventListener('click', function (e) { e.stopPropagation(); show(idx + 1); });
    box.addEventListener('click', function (e) { if (e.target === box) close(); });

    document.addEventListener('keydown', function (e) {
      if (!box.classList.contains('open')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') show(idx - 1);
      if (e.key === 'ArrowRight') show(idx + 1);
    });
  }

  /* ---------- bio modal (shared) ---------- */
  function initBioModal() {
    if (document.getElementById('bioModal')) return;

    var modal = document.createElement('div');
    modal.className = 'modal fade';
    modal.id = 'bioModal';
    modal.tabIndex = -1;
    modal.setAttribute('aria-hidden', 'true');
    modal.innerHTML =
      '<div class="modal-dialog modal-dialog-centered modal-lg modal-dialog-scrollable">' +
        '<div class="modal-content">' +
          '<div class="modal-header">' +
            '<h5 class="modal-title" id="bioTitle">Speaker Details</h5>' +
            '<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>' +
          '</div>' +
          '<div class="modal-body">' +
            '<div class="row g-4 align-items-start">' +
              '<div class="col-12 col-md-5" id="bioImageWrap">' +
                '<div style="border-radius:14px;overflow:hidden;aspect-ratio:4/5;background:var(--champagne)">' +
                  '<img id="bioImage" alt="" style="width:100%;height:100%;object-fit:cover">' +
                '</div>' +
              '</div>' +
              '<div class="col-12 col-md-7">' +
                '<h4 class="feature-name" style="font-size:1.5rem;margin-top:0" id="bioName"></h4>' +
                '<p class="feature-desig" id="bioDesignation"></p>' +
                '<p class="feature-org" id="bioOrganization"></p>' +
                '<span class="speaker-badge" style="position:static;display:inline-block" id="bioPanel"></span>' +
                '<hr>' +
                '<p id="bioText" class="mb-0"></p>' +
              '</div>' +
            '</div>' +
          '</div>' +
          '<div class="modal-footer">' +
            '<button type="button" class="btn-gtu-ghost btn-sm-gtu" data-bs-dismiss="modal">Close</button>' +
          '</div>' +
        '</div>' +
      '</div>';

    document.body.appendChild(modal);

    document.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-read-more]');
      if (!btn) return;

      var data;
      try {
        data = JSON.parse(btn.getAttribute('data-read-more'));
      } catch (err) {
        return;
      }

      modal.querySelector('#bioTitle').textContent = data.name || 'Speaker Details';
      modal.querySelector('#bioName').textContent = data.name || '';
      modal.querySelector('#bioDesignation').textContent = data.designation || '';
      modal.querySelector('#bioOrganization').textContent = data.organization || '';

      var panelChip = modal.querySelector('#bioPanel');
      var label = [data.panel, data.role].filter(Boolean).join(' · ');
      panelChip.textContent = label;
      panelChip.style.display = label ? 'inline-block' : 'none';

      modal.querySelector('#bioText').textContent = data.bio || 'Details will be updated soon.';

      var wrap = modal.querySelector('#bioImageWrap');
      var img = modal.querySelector('#bioImage');
      if (data.image) {
        wrap.style.display = '';
        img.src = data.image;
        img.alt = data.name || '';
      } else {
        wrap.style.display = 'none';
      }
    });
  }

  /* ---------- floating contact widget ---------- */
  function initFloatDock() {
    var dock = document.getElementById('floatDock');
    var fab = document.getElementById('fdFab');
    var panel = document.getElementById('fdPanel');
    if (!dock || !fab || !panel) return;

    function setOpen(open) {
      dock.classList.toggle('is-open', open);
      fab.setAttribute('aria-expanded', open ? 'true' : 'false');
    }

    fab.addEventListener('click', function (e) {
      e.stopPropagation();
      setOpen(!dock.classList.contains('is-open'));
    });

    // tapping anything inside the panel should not close it mid-action
    panel.addEventListener('click', function (e) { e.stopPropagation(); });

    document.addEventListener('click', function () { setOpen(false); });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && dock.classList.contains('is-open')) {
        setOpen(false);
        fab.focus();
      }
    });
  }

  /* ---------- nav: highlight the section in view ---------- */
  function initNavSpy() {
    var links = Array.prototype.slice.call(
      document.querySelectorAll('.gtu-nav .nav-link[href^="#"]')
    );
    if (!links.length || !('IntersectionObserver' in window)) return;

    var map = {};
    links.forEach(function (l) {
      var el = document.querySelector(l.getAttribute('href'));
      if (el) map[el.id] = l;
    });

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        links.forEach(function (l) { l.classList.remove('active'); });
        if (map[e.target.id]) map[e.target.id].classList.add('active');
      });
    }, { rootMargin: '-45% 0px -50% 0px' });

    Object.keys(map).forEach(function (id) {
      io.observe(document.getElementById(id));
    });
  }

  /* ---------- close mobile menu after tapping a link ---------- */
  function initMobileMenuClose() {
    var collapse = document.getElementById('navbarNav');
    if (!collapse) return;

    collapse.querySelectorAll('.nav-link, .btn-gtu').forEach(function (a) {
      a.addEventListener('click', function () {
        if (window.innerWidth < 1200 && collapse.classList.contains('show')) {
          var inst = bootstrap.Collapse.getInstance(collapse) ||
            new bootstrap.Collapse(collapse, { toggle: false });
          inst.hide();
        }
      });
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    initAOS();
    initCountdown();
    initCountUp();
    initVideo();
    initSpeakerPreview();
    initPanelTitles();
    initVenueMarquee();
    initVenueSlider();
    initGallery();
    if (typeof AOS !== 'undefined' && !reduceMotion && window.innerWidth >= 576) AOS.refresh();
    initLightbox();
    initBioModal();
    initFloatDock();
    initNavSpy();
    initMobileMenuClose();
  });
})();
