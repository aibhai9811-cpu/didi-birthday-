/* ============================================================
   FOR MY DIDI — script.js
   ============================================================ */
(() => {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ----------------------------------------------------------
     Replace / extend these captions + photos.
     Put files in assets/images/ and list them here in order.
  ---------------------------------------------------------- */
  const PHOTO_DATA = [
    { src: 'assets/images/gallery-1.jpg', caption: 'A smile that always makes home feel like home.' },
    { src: 'assets/images/gallery-2.jpg', caption: 'No matter how far you are, you\u2019ll always be my Didi.' },
    { src: 'assets/images/gallery-3.jpg', caption: 'Distance changed the address, not our relationship.' },
    { src: 'assets/images/gallery-4.jpg', caption: 'Some people don\u2019t need to try. You just are the calm.' },
    { src: 'assets/images/gallery-5.jpg', caption: 'Every golden hour reminds me of you.' },
    { src: 'assets/images/gallery-6.jpg', caption: 'I miss you more than I say.' },
  ];

  const LETTER_TEXT = `Hello Didi... \u{1F60A}

Maine shayad kabhi tumhe birthday wish nahi kiya...

Lekin iska matlab ye kabhi nahi tha ki tum mere liye important nahi ho.

Bas shayad main kabhi bol hi nahi paaya...`;

  /* ============================================================
     Ambient starfield (canvas)
  ============================================================ */
  const starCanvas = document.getElementById('stars');
  const ctx = starCanvas.getContext('2d');
  let stars = [];
  let w, h, dpr;

  function resizeCanvas() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = window.innerWidth;
    h = window.innerHeight;
    starCanvas.width = w * dpr;
    starCanvas.height = h * dpr;
    starCanvas.style.width = w + 'px';
    starCanvas.style.height = h + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    seedStars();
  }

  function seedStars() {
    const count = Math.round((w * h) / 9000);
    stars = new Array(count).fill(0).map(() => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.3 + 0.25,
      baseAlpha: Math.random() * 0.5 + 0.35,
      twinkleSpeed: Math.random() * 0.015 + 0.004,
      phase: Math.random() * Math.PI * 2,
      drift: Math.random() * 0.06 + 0.01,
      hue: Math.random() > 0.85 ? 'gold' : 'white',
    }));
  }

  let t = 0;
  function drawStars() {
    ctx.clearRect(0, 0, w, h);
    t += 1;
    for (const s of stars) {
      const alpha = s.baseAlpha + Math.sin(t * s.twinkleSpeed + s.phase) * 0.28;
      ctx.beginPath();
      ctx.fillStyle = s.hue === 'gold'
        ? `rgba(232,194,122,${Math.max(alpha, 0.08)})`
        : `rgba(255,255,255,${Math.max(alpha, 0.08)})`;
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();

      if (!prefersReducedMotion) {
        s.y -= s.drift;
        if (s.y < -4) { s.y = h + 4; s.x = Math.random() * w; }
      }
    }
    requestAnimationFrame(drawStars);
  }

  resizeCanvas();
  window.addEventListener('resize', resizeCanvas, { passive: true });
  drawStars();

  /* ============================================================
     Cursor glow (desktop only)
  ============================================================ */
  const cursorGlow = document.getElementById('cursor-glow');
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    document.addEventListener('mousemove', (e) => {
      document.body.classList.add('cursor-ready');
      cursorGlow.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    }, { passive: true });
  }

  /* ============================================================
     Act navigation
  ============================================================ */
  const acts = Array.from(document.querySelectorAll('.act'));
  function showAct(n) {
    acts.forEach(a => a.classList.toggle('is-active', a.dataset.act === String(n)));
    window.scrollTo({ top: 0, behavior: 'auto' });
  }
  showAct(1);

  function vibrate(pattern) {
    if ('vibrate' in navigator) {
      try { navigator.vibrate(pattern); } catch (e) { /* no-op */ }
    }
  }

  /* ============================================================
     PAGE 1 -> loader -> PAGE 2
  ============================================================ */
  const openBtn = document.getElementById('openBtn');
  const loader = document.getElementById('loader');

  openBtn.addEventListener('click', () => {
    vibrate(18);
    openBtn.disabled = true;
    loader.classList.add('is-active');
    attemptMusicStart();

    setTimeout(() => {
      loader.classList.remove('is-active');
      showAct(2);
      startTypewriter();
    }, 2000);
  });

  /* ============================================================
     PAGE 2 — typewriter letter
  ============================================================ */
  const typeText = document.getElementById('typeText');
  const continueBtn = document.getElementById('continueBtn');

  function startTypewriter() {
    typeText.textContent = '';
    const caret = document.createElement('span');
    caret.className = 'caret';

    if (prefersReducedMotion) {
      typeText.textContent = LETTER_TEXT;
      continueBtn.classList.remove('is-hidden');
      return;
    }

    let i = 0;
    const speed = 28; // ms per character
    function tick() {
      if (i <= LETTER_TEXT.length) {
        typeText.textContent = LETTER_TEXT.slice(0, i);
        typeText.appendChild(caret);
        i++;
        const ch = LETTER_TEXT[i - 1];
        const pause = (ch === '.' || ch === '\n') ? speed * 6 : speed;
        setTimeout(tick, pause);
      } else {
        setTimeout(() => {
          caret.remove();
          continueBtn.classList.remove('is-hidden');
        }, 400);
      }
    }
    tick();
  }

  continueBtn.addEventListener('click', () => {
    vibrate(12);
    showAct(3);
    startGallery();
  });

  /* ============================================================
     PAGE 3 — cinematic gallery
  ============================================================ */
  const slidesEl = document.getElementById('slides');
  const captionEl = document.getElementById('galleryCaption');
  const progressEl = document.getElementById('galleryProgress');
  const toFinaleBtn = document.getElementById('toFinaleBtn');

  let galleryBuilt = false;
  let galleryTimer = null;
  let currentSlide = 0;
  const SLIDE_DURATION = 6000;

  function buildGallery() {
    PHOTO_DATA.forEach((photo, idx) => {
      const slide = document.createElement('div');
      slide.className = 'slide';
      slide.dataset.index = idx;

      const img = document.createElement('img');
      img.src = photo.src;
      img.alt = photo.caption;
      img.loading = idx === 0 ? 'eager' : 'lazy';
      slide.appendChild(img);
      slidesEl.appendChild(slide);

      const bar = document.createElement('span');
      progressEl.appendChild(bar);
    });
    galleryBuilt = true;
  }

  function renderSlide(idx) {
    const slides = slidesEl.querySelectorAll('.slide');
    const bars = progressEl.querySelectorAll('span');

    slides.forEach((s, i) => s.classList.toggle('is-active', i === idx));
    bars.forEach((b, i) => {
      b.classList.toggle('done', i < idx);
      b.classList.toggle('active', i === idx);
    });

    captionEl.classList.remove('is-shown');
    setTimeout(() => {
      captionEl.textContent = PHOTO_DATA[idx].caption;
      captionEl.classList.add('is-shown');
    }, 250);
  }

  function nextSlide() {
    currentSlide++;
    if (currentSlide >= PHOTO_DATA.length) {
      clearInterval(galleryTimer);
      toFinaleBtn.classList.remove('is-hidden');
      return;
    }
    renderSlide(currentSlide);
  }

  function startGallery() {
    if (!galleryBuilt) buildGallery();
    currentSlide = 0;
    renderSlide(0);
    clearInterval(galleryTimer);
    galleryTimer = setInterval(nextSlide, SLIDE_DURATION);
  }

  toFinaleBtn.addEventListener('click', () => {
    vibrate(14);
    showAct(4);
    startFinale();
  });

  /* ============================================================
     PAGE 4 — confetti + floating hearts
  ============================================================ */
  const confettiCanvas = document.getElementById('confetti');
  const cctx = confettiCanvas.getContext('2d');
  let confettiPieces = [];
  let confettiRunning = false;
  const CONFETTI_COLORS = ['#e8c27a', '#f8e3ab', '#6fa3d8', '#f2f0ea'];

  function resizeConfetti() {
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeConfetti, { passive: true });

  function spawnConfetti(count) {
    for (let i = 0; i < count; i++) {
      confettiPieces.push({
        x: Math.random() * confettiCanvas.width,
        y: -20 - Math.random() * confettiCanvas.height * 0.4,
        w: Math.random() * 6 + 4,
        h: Math.random() * 10 + 6,
        color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
        speed: Math.random() * 1.5 + 1.2,
        drift: Math.random() * 1.2 - 0.6,
        rotation: Math.random() * 360,
        rotSpeed: Math.random() * 4 - 2,
        opacity: Math.random() * 0.5 + 0.5,
      });
    }
  }

  function drawConfetti() {
    cctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    confettiPieces.forEach(p => {
      p.y += p.speed;
      p.x += p.drift;
      p.rotation += p.rotSpeed;

      cctx.save();
      cctx.translate(p.x, p.y);
      cctx.rotate((p.rotation * Math.PI) / 180);
      cctx.globalAlpha = p.opacity;
      cctx.fillStyle = p.color;
      cctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      cctx.restore();
    });
    confettiPieces = confettiPieces.filter(p => p.y < confettiCanvas.height + 30);

    if (confettiRunning) requestAnimationFrame(drawConfetti);
  }

  const heartsField = document.getElementById('heartsField');
  const HEART_SYMBOLS = ['\u2764\uFE0F', '\u2728', '\u{1F49B}'];
  function spawnHeart() {
    const heart = document.createElement('span');
    heart.className = 'floating-heart';
    heart.textContent = HEART_SYMBOLS[Math.floor(Math.random() * HEART_SYMBOLS.length)];
    heart.style.left = Math.random() * 100 + '%';
    heart.style.setProperty('--drift', (Math.random() * 120 - 60) + 'px');
    heart.style.setProperty('--rot', (Math.random() * 40 - 20) + 'deg');
    heart.style.animationDuration = (Math.random() * 4 + 7) + 's';
    heart.style.fontSize = (Math.random() * 0.8 + 0.9) + 'rem';
    heartsField.appendChild(heart);
    setTimeout(() => heart.remove(), 12000);
  }

  let heartInterval = null;
  let finaleStarted = false;

  function startFinale() {
    if (finaleStarted) return;
    finaleStarted = true;
    vibrate([10, 40, 10, 40, 30]);

    resizeConfetti();
    confettiRunning = true;
    spawnConfetti(prefersReducedMotion ? 40 : 140);
    drawConfetti();
    setTimeout(() => { confettiRunning = false; }, 6500);

    if (!prefersReducedMotion) {
      heartInterval = setInterval(spawnHeart, 550);
      setTimeout(() => clearInterval(heartInterval), 20000);
    }
  }

  /* ============================================================
     Background music
  ============================================================ */
  const bgMusic = document.getElementById('bgMusic');
  const musicToggle = document.getElementById('musicToggle');
  let musicIntentional = false;

  function attemptMusicStart() {
    bgMusic.volume = 0.55;
    const playPromise = bgMusic.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          musicIntentional = true;
          musicToggle.classList.add('is-playing');
          musicToggle.setAttribute('aria-pressed', 'true');
        })
        .catch(() => {
          // autoplay blocked — the floating button remains available
          musicToggle.classList.remove('is-playing');
          musicToggle.setAttribute('aria-pressed', 'false');
        });
    }
  }

  musicToggle.addEventListener('click', () => {
    if (bgMusic.paused) {
      bgMusic.volume = 0.55;
      bgMusic.play().then(() => {
        musicIntentional = true;
        musicToggle.classList.add('is-playing');
        musicToggle.setAttribute('aria-pressed', 'true');
      }).catch(() => {});
    } else {
      bgMusic.pause();
      musicIntentional = false;
      musicToggle.classList.remove('is-playing');
      musicToggle.setAttribute('aria-pressed', 'false');
    }
  });

  /* call button — gentle vibration on tap */
  document.getElementById('callBtn').addEventListener('click', () => vibrate(20));

})();
