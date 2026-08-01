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
    { src: 'assets/images/20220812_093508.jpg', caption: 'Where it all began — the years before I knew how to say it.' },
    { src: 'assets/images/IMG_20250111_163717706.jpg', caption: 'A smile that always makes home feel like home.' },
    { src: 'assets/images/IMG-20251015-WA0187.jpg', caption: 'No matter how far you are, you\u2019ll always be my Didi.' },
    { src: 'assets/images/IMG_20260123_171413.jpg', caption: 'Distance changed the address, not our relationship.' },
    { src: 'assets/images/IMG_20260123_171456.jpg', caption: 'Some people don\u2019t need to try. You just are the calm.' },
    { src: 'assets/images/IMG_20260123_171806.jpg', caption: 'Every golden hour reminds me of you.' },
    { src: 'assets/images/20260420_203738.jpg', caption: 'I miss you more than I say.' },
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
    const count = Math.round((w * h) / 7000);
    stars = new Array(count).fill(0).map(() => {
      const isBig = Math.random() > 0.88;
      return {
        x: Math.random() * w,
        y: Math.random() * h,
        r: isBig ? Math.random() * 1.6 + 1.1 : Math.random() * 1.1 + 0.3,
        baseAlpha: Math.random() * 0.35 + 0.25,
        twinkleAmp: Math.random() * 0.5 + 0.35,
        twinkleSpeed: Math.random() * 0.03 + 0.012,
        phase: Math.random() * Math.PI * 2,
        drift: Math.random() * 0.05 + 0.01,
        hue: Math.random() > 0.82 ? 'gold' : 'white',
        glow: isBig,
      };
    });
  }

  let t = 0;
  function drawStars() {
    ctx.clearRect(0, 0, w, h);
    t += 1;
    for (const s of stars) {
      const alpha = s.baseAlpha + Math.sin(t * s.twinkleSpeed + s.phase) * s.twinkleAmp;
      const clamped = Math.min(Math.max(alpha, 0.05), 1);
      const color = s.hue === 'gold' ? '232,194,122' : '255,255,255';

      if (s.glow) {
        ctx.beginPath();
        const grad = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r * 5);
        grad.addColorStop(0, `rgba(${color},${clamped * 0.5})`);
        grad.addColorStop(1, `rgba(${color},0)`);
        ctx.fillStyle = grad;
        ctx.arc(s.x, s.y, s.r * 5, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.beginPath();
      ctx.fillStyle = `rgba(${color},${clamped})`;
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
     Synthesized sound effects (crackers / balloon pops / chime)
     No audio files needed — generated with the Web Audio API.
  ============================================================ */
  let actx = null;
  function getAudioCtx() {
    if (!actx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (AC) actx = new AC();
    }
    if (actx && actx.state === 'suspended') actx.resume();
    return actx;
  }

  function playCrackle() {
    const ac = getAudioCtx();
    if (!ac) return;
    const now = ac.currentTime;
    const bufferSize = ac.sampleRate * 0.35;
    const buffer = ac.createBuffer(1, bufferSize, ac.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 2.2);
    }
    const noise = ac.createBufferSource();
    noise.buffer = buffer;

    const bandpass = ac.createBiquadFilter();
    bandpass.type = 'bandpass';
    bandpass.frequency.value = 1800 + Math.random() * 2200;
    bandpass.Q.value = 0.8;

    const gain = ac.createGain();
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.5, now + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.32);

    noise.connect(bandpass).connect(gain).connect(ac.destination);
    noise.start(now);
    noise.stop(now + 0.36);

    // a couple of tiny secondary pops for a "string of crackers" feel
    const echoes = Math.floor(Math.random() * 2) + 1;
    for (let e = 0; e < echoes; e++) {
      setTimeout(() => {
        const ac2 = getAudioCtx();
        if (!ac2) return;
        const n2 = ac2.currentTime;
        const osc = ac2.createOscillator();
        osc.type = 'square';
        osc.frequency.setValueAtTime(1400 + Math.random() * 1200, n2);
        const g2 = ac2.createGain();
        g2.gain.setValueAtTime(0.18, n2);
        g2.gain.exponentialRampToValueAtTime(0.001, n2 + 0.08);
        osc.connect(g2).connect(ac2.destination);
        osc.start(n2);
        osc.stop(n2 + 0.09);
      }, 60 + e * (70 + Math.random() * 60));
    }
  }

  function playPop() {
    const ac = getAudioCtx();
    if (!ac) return;
    const now = ac.currentTime;
    const osc = ac.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(520, now);
    osc.frequency.exponentialRampToValueAtTime(90, now + 0.16);

    const gain = ac.createGain();
    gain.gain.setValueAtTime(0.22, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

    osc.connect(gain).connect(ac.destination);
    osc.start(now);
    osc.stop(now + 0.2);
  }

  function playChime() {
    const ac = getAudioCtx();
    if (!ac) return;
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5 E5 G5 C6
    notes.forEach((freq, i) => {
      const start = ac.currentTime + i * 0.14;
      const osc = ac.createOscillator();
      osc.type = 'triangle';
      osc.frequency.value = freq;
      const gain = ac.createGain();
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(0.22, start + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.9);
      osc.connect(gain).connect(ac.destination);
      osc.start(start);
      osc.stop(start + 0.95);
    });
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
    getAudioCtx(); // unlock audio on this first real user gesture
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
  const SLIDE_DURATION = 1000;

  function buildGallery() {
    PHOTO_DATA.forEach((photo, idx) => {
      const slide = document.createElement('div');
      slide.className = 'slide';
      slide.dataset.index = idx;

      const img = document.createElement('img');
      img.src = photo.src;
      img.alt = photo.caption;
      img.loading = idx === 0 ? 'eager' : 'lazy';
      img.addEventListener('error', () => {
        slide.classList.add('slide-missing');
        slide.innerHTML = `<div class="slide-missing-note">Photo not found<br><code>${photo.src}</code></div>`;
      });
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

    slides.forEach((s, i) => {
      s.classList.toggle('is-active', i === idx);
      s.classList.toggle('is-prev', i === idx - 1);
    });
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
        type: 'confetti',
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

  const FIREWORK_COLORS = ['#e8c27a', '#f8e3ab', '#6fa3d8', '#ff9e7a', '#f2f0ea', '#c58cf0'];

  function spawnFirework(x, y) {
    const color = FIREWORK_COLORS[Math.floor(Math.random() * FIREWORK_COLORS.length)];
    const count = prefersReducedMotion ? 16 : 34;
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + Math.random() * 0.2;
      const speed = Math.random() * 3.2 + 1.6;
      confettiPieces.push({
        type: 'spark',
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        r: Math.random() * 1.8 + 1.2,
        color,
        life: 1,
        decay: Math.random() * 0.012 + 0.014,
      });
    }
    playCrackle();
  }

  function drawConfetti() {
    cctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    confettiPieces.forEach(p => {
      if (p.type === 'confetti') {
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
      } else if (p.type === 'spark') {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.045; // gentle gravity
        p.vx *= 0.985;
        p.life -= p.decay;

        cctx.save();
        cctx.globalAlpha = Math.max(p.life, 0);
        cctx.fillStyle = p.color;
        cctx.shadowColor = p.color;
        cctx.shadowBlur = 8;
        cctx.beginPath();
        cctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        cctx.fill();
        cctx.restore();
      }
    });
    confettiPieces = confettiPieces.filter(p =>
      p.type === 'confetti' ? p.y < confettiCanvas.height + 30 : p.life > 0
    );

    if (confettiRunning) requestAnimationFrame(drawConfetti);
  }

  const callBar = document.getElementById('callBar');
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

  const balloonField = document.getElementById('balloonField');
  const BALLOON_COLORS = ['#e8c27a', '#e77a7a', '#6fa3d8', '#f2f0ea', '#c58cf0'];

  function balloonSvg(color) {
    return `<svg viewBox="0 0 46 58" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="23" cy="24" rx="21" ry="24" fill="${color}" />
      <ellipse cx="16" cy="15" rx="6" ry="8" fill="rgba(255,255,255,0.25)" />
      <polygon points="20,47 26,47 23,54" fill="${color}" />
    </svg>`;
  }

  function spawnBalloon(withSound) {
    const wrap = document.createElement('div');
    wrap.className = 'balloon';
    wrap.style.left = (Math.random() * 84 + 4) + '%';
    wrap.style.setProperty('--sway1', (Math.random() * 40 + 10) + 'px');
    wrap.style.setProperty('--sway2', (-(Math.random() * 40 + 10)) + 'px');
    wrap.style.animationDuration = (Math.random() * 4 + 9) + 's';
    wrap.style.width = (Math.random() * 16 + 40) + 'px';
    wrap.innerHTML = balloonSvg(BALLOON_COLORS[Math.floor(Math.random() * BALLOON_COLORS.length)])
      + '<span class="string"></span>';
    balloonField.appendChild(wrap);

    if (withSound) setTimeout(() => playPop(), 200 + Math.random() * 300);
    setTimeout(() => wrap.remove(), 14000);
  }

  let heartInterval = null;
  let balloonInterval = null;
  let finaleStarted = false;

  function startFinale() {
    if (finaleStarted) return;
    finaleStarted = true;
    vibrate([10, 40, 10, 40, 30]);

    resizeConfetti();
    confettiRunning = true;
    spawnConfetti(prefersReducedMotion ? 40 : 120);
    drawConfetti();

    // celebratory chime right away
    playChime();

    // a burst of crackers across the sky over the first few seconds
    const burstSpots = prefersReducedMotion ? 2 : 6;
    for (let i = 0; i < burstSpots; i++) {
      setTimeout(() => {
        const x = confettiCanvas.width * (0.2 + Math.random() * 0.6);
        const y = confettiCanvas.height * (0.15 + Math.random() * 0.35);
        spawnFirework(x, y);
      }, 250 + i * (prefersReducedMotion ? 500 : 380) + Math.random() * 200);
    }
    setTimeout(() => { confettiRunning = false; }, 7000);

    if (!prefersReducedMotion) {
      heartInterval = setInterval(spawnHeart, 600);
      setTimeout(() => clearInterval(heartInterval), 18000);

      let balloonCount = 0;
      balloonInterval = setInterval(() => {
        balloonCount++;
        spawnBalloon(balloonCount % 3 === 0);
      }, 900);
      setTimeout(() => clearInterval(balloonInterval), 16000);
    } else {
      spawnBalloon(false);
      spawnBalloon(false);
    }

    // let the sky settle for a beat, then invite her to call
    setTimeout(() => {
      callBar.classList.add('is-shown');
    }, prefersReducedMotion ? 600 : 1800);
  }

  /* ============================================================
     Background music
  ============================================================ */
  const bgMusic = document.getElementById('bgMusic');
  const musicToggle = document.getElementById('musicToggle');
  let musicIntentional = false;
  let musicFileMissing = false;

  bgMusic.addEventListener('error', () => {
    musicFileMissing = true;
    musicToggle.classList.add('is-missing');
    musicToggle.setAttribute('title', 'assets/music/after_the_longest_sunday.mp3 not found');
  });

  function attemptMusicStart() {
    if (musicFileMissing) return;
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
    if (musicFileMissing) return;
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
