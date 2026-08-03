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

  const HERO_TEXT = 'Someone has been waiting to tell you something\u2026';

  const LETTER_TEXT = `Hello Didi... \u{1F60A}

Maine shayad kabhi tumhe birthday wish nahi kiya...

Lekin iska matlab ye kabhi nahi tha ki tum mere liye important nahi ho.

Bas shayad main kabhi bol hi nahi paaya...`;

  /* ============================================================
     Ambient starfield (canvas) — twinkling, gently drifting
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
        parallax: Math.random() * 0.4 + 0.1,
        hue: Math.random() > 0.82 ? 'gold' : 'white',
        glow: isBig,
      };
    });
  }

  let t = 0;
  let parallaxX = 0, parallaxY = 0;
  let shootingStars = [];

  function scheduleShootingStar() {
    if (prefersReducedMotion) return;
    const delay = (Math.random() * 10 + 15) * 1000; // 15-25s
    setTimeout(() => {
      const startX = Math.random() * w * 0.6 + w * 0.1;
      const startY = Math.random() * h * 0.25;
      const angle = Math.PI / 4 + Math.random() * 0.3;
      shootingStars.push({
        x: startX, y: startY,
        vx: Math.cos(angle) * 11, vy: Math.sin(angle) * 11,
        life: 1, trail: [],
      });
      scheduleShootingStar();
    }, delay);
  }
  scheduleShootingStar();

  function drawShootingStars() {
    shootingStars.forEach(s => {
      s.trail.unshift({ x: s.x, y: s.y });
      if (s.trail.length > 14) s.trail.pop();
      s.x += s.vx;
      s.y += s.vy;
      s.life -= 0.02;

      ctx.beginPath();
      for (let i = 0; i < s.trail.length; i++) {
        const pt = s.trail[i];
        const a = (1 - i / s.trail.length) * Math.max(s.life, 0) * 0.9;
        ctx.fillStyle = `rgba(255,255,255,${a})`;
        const size = (1 - i / s.trail.length) * 1.8;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, size, 0, Math.PI * 2);
        ctx.fill();
      }
    });
    shootingStars = shootingStars.filter(s => s.life > 0 && s.x < w + 50 && s.y < h + 50);
  }

  function drawStars() {
    ctx.clearRect(0, 0, w, h);
    t += 1;
    for (const s of stars) {
      const alpha = s.baseAlpha + Math.sin(t * s.twinkleSpeed + s.phase) * s.twinkleAmp;
      const clamped = Math.min(Math.max(alpha, 0.05), 1);
      const color = s.hue === 'gold' ? '232,194,122' : '255,255,255';
      const px = s.x + parallaxX * s.parallax;
      const py = s.y + parallaxY * s.parallax;

      if (s.glow) {
        const grad = ctx.createRadialGradient(px, py, 0, px, py, s.r * 5);
        grad.addColorStop(0, `rgba(${color},${clamped * 0.5})`);
        grad.addColorStop(1, `rgba(${color},0)`);
        ctx.beginPath();
        ctx.fillStyle = grad;
        ctx.arc(px, py, s.r * 5, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.beginPath();
      ctx.fillStyle = `rgba(${color},${clamped})`;
      ctx.arc(px, py, s.r, 0, Math.PI * 2);
      ctx.fill();

      if (!prefersReducedMotion) {
        s.y -= s.drift;
        if (s.y < -4) { s.y = h + 4; s.x = Math.random() * w; }
      }
    }
    if (shootingStars.length) drawShootingStars();
    requestAnimationFrame(drawStars);
  }

  resizeCanvas();
  window.addEventListener('resize', resizeCanvas, { passive: true });
  drawStars();

  /* ============================================================
     Cursor glow + subtle star parallax (desktop only)
  ============================================================ */
  const cursorGlow = document.getElementById('cursor-glow');
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    document.addEventListener('mousemove', (e) => {
      document.body.classList.add('cursor-ready');
      cursorGlow.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      parallaxX = (e.clientX / w - 0.5) * -18;
      parallaxY = (e.clientY / h - 0.5) * -18;
    }, { passive: true });
  }

  /* ============================================================
     Fireflies — soft glowing particles drifting upward
  ============================================================ */
  const fireflyField = document.getElementById('fireflies');
  function spawnFireflies(count) {
    for (let i = 0; i < count; i++) {
      const f = document.createElement('span');
      f.className = 'firefly';
      f.style.left = Math.random() * 100 + '%';
      f.style.top = Math.random() * 100 + '%';
      f.style.setProperty('--fx1', (Math.random() * 50 - 25) + 'px');
      f.style.setProperty('--fy1', (-(Math.random() * 40 + 20)) + 'px');
      f.style.setProperty('--fx2', (Math.random() * 50 - 25) + 'px');
      f.style.setProperty('--fy2', (-(Math.random() * 60 + 40)) + 'px');
      f.style.setProperty('--fx3', (Math.random() * 50 - 25) + 'px');
      f.style.setProperty('--fy3', (-(Math.random() * 80 + 60)) + 'px');
      f.style.setProperty('--fx4', (Math.random() * 40 - 20) + 'px');
      f.style.setProperty('--fy4', (-(Math.random() * 110 + 90)) + 'px');
      const dur = Math.random() * 10 + 14;
      f.style.animationDuration = dur + 's, ' + (dur * 0.5) + 's';
      f.style.animationDelay = (-Math.random() * dur) + 's, ' + (-Math.random() * dur) + 's';
      fireflyField.appendChild(f);
    }
  }
  if (!prefersReducedMotion) spawnFireflies(16);

  /* ============================================================
     Synthesized sound effects — no audio files needed
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

  function playNote(freq, duration) {
    const ac = getAudioCtx();
    if (!ac) return;
    const now = ac.currentTime;
    const osc = ac.createOscillator();
    osc.type = 'triangle';
    osc.frequency.value = freq;
    const gain = ac.createGain();
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.16, now + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
    osc.connect(gain).connect(ac.destination);
    osc.start(now);
    osc.stop(now + duration + 0.05);
  }

  function playPaperSound() {
    const ac = getAudioCtx();
    if (!ac) return;
    const now = ac.currentTime;
    const bufferSize = ac.sampleRate * 0.55;
    const buffer = ac.createBuffer(1, bufferSize, ac.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      const env = Math.sin((i / bufferSize) * Math.PI);
      data[i] = (Math.random() * 2 - 1) * env * 0.6;
    }
    const noise = ac.createBufferSource();
    noise.buffer = buffer;
    const hp = ac.createBiquadFilter();
    hp.type = 'highpass';
    hp.frequency.value = 900;
    const gain = ac.createGain();
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.28, now + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
    noise.connect(hp).connect(gain).connect(ac.destination);
    noise.start(now);
    noise.stop(now + 0.55);
  }

  function playPageTurn() {
    const ac = getAudioCtx();
    if (!ac) return;
    const now = ac.currentTime;
    const bufferSize = ac.sampleRate * 0.22;
    const buffer = ac.createBuffer(1, bufferSize, ac.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      const env = Math.pow(1 - i / bufferSize, 1.6);
      data[i] = (Math.random() * 2 - 1) * env;
    }
    const noise = ac.createBufferSource();
    noise.buffer = buffer;
    const hp = ac.createBiquadFilter();
    hp.type = 'highpass';
    hp.frequency.value = 1400;
    const gain = ac.createGain();
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.16, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.24);
    noise.connect(hp).connect(gain).connect(ac.destination);
    noise.start(now);
    noise.stop(now + 0.25);
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
    const notes = [523.25, 659.25, 783.99, 1046.5];
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
    document.body.classList.toggle('blur-stars', n === 2);
  }
  showAct(1);

  function vibrate(pattern) {
    if ('vibrate' in navigator) {
      try { navigator.vibrate(pattern); } catch (e) { /* no-op */ }
    }
  }

  /* ============================================================
     PAGE 1 — typewriter hero line
  ============================================================ */
  const heroTypeText = document.getElementById('heroTypeText');

  function startHeroTypewriter() {
    if (prefersReducedMotion) {
      heroTypeText.textContent = HERO_TEXT;
      return;
    }
    const caret = document.createElement('span');
    caret.className = 'type-caret';
    let i = 0;
    const speed = 34;
    function tick() {
      if (i <= HERO_TEXT.length) {
        heroTypeText.textContent = HERO_TEXT.slice(0, i);
        heroTypeText.appendChild(caret);
        i++;
        setTimeout(tick, speed);
      } else {
        setTimeout(() => caret.remove(), 900);
      }
    }
    setTimeout(tick, 300);
  }
  startHeroTypewriter();

  /* ============================================================
     PAGE 1 -> screen flash -> loader -> PAGE 2
  ============================================================ */
  const openBtn = document.getElementById('openBtn');
  const loader = document.getElementById('loader');
  const screenFlash = document.getElementById('screenFlash');

  openBtn.addEventListener('click', () => {
    vibrate(18);
    getAudioCtx();
    playNote(660, 0.5);
    openBtn.disabled = true;
    openBtn.classList.add('is-tapped');
    document.body.classList.add('stars-converging');
    attemptMusicStart();

    setTimeout(() => { screenFlash.classList.add('is-active'); }, 350);
    setTimeout(() => { loader.classList.add('is-active'); }, 900);
    setTimeout(() => { screenFlash.classList.remove('is-active'); }, 1400);
    setTimeout(() => {
      loader.classList.remove('is-active');
      document.body.classList.remove('stars-converging');
      showAct(2);
    }, 2900);
  });

  /* ============================================================
     PAGE 2 — envelope, then the letter types itself out
  ============================================================ */
  const envelopeStage = document.getElementById('envelopeStage');
  const envelopeBtn = document.getElementById('envelopeBtn');
  const letterCard = document.getElementById('letterCard');
  const typeText = document.getElementById('typeText');
  const continueBtn = document.getElementById('continueBtn');

  const letterSignature = document.getElementById('letterSignature');

  function startTypewriter() {
    typeText.textContent = '';
    const caret = document.createElement('span');
    caret.className = 'caret';

    if (prefersReducedMotion) {
      typeText.textContent = LETTER_TEXT;
      letterSignature.classList.add('is-shown');
      continueBtn.classList.remove('is-hidden');
      return;
    }

    let i = 0;
    const speed = 28;
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
          letterSignature.classList.add('is-shown');
          setTimeout(() => continueBtn.classList.remove('is-hidden'), 500);
        }, 400);
      }
    }
    tick();
  }

  let envelopeOpened = false;
  envelopeBtn.addEventListener('click', () => {
    if (envelopeOpened) return;
    envelopeOpened = true;
    vibrate([8, 30, 10]);
    playPaperSound();
    envelopeBtn.classList.add('is-cracking');
    document.body.classList.add('envelope-focus');

    setTimeout(() => { envelopeBtn.classList.add('is-open'); }, 320);

    // nudge the music a touch louder for this personal moment
    if (!bgMusic.paused) {
      const targetVol = Math.min(bgMusic.volume + 0.18, 0.85);
      const startVol = bgMusic.volume;
      const steps = 12;
      let s = 0;
      const rampId = setInterval(() => {
        s++;
        bgMusic.volume = startVol + (targetVol - startVol) * (s / steps);
        if (s >= steps) clearInterval(rampId);
      }, 60);
    }

    setTimeout(() => {
      envelopeStage.classList.add('is-hidden');
      letterCard.classList.add('is-shown');
      startTypewriter();
    }, 1050);
  });

  continueBtn.addEventListener('click', () => {
    vibrate(12);
    playNote(587, 0.45);
    document.body.classList.remove('envelope-focus');
    showAct(3);
    startGallery();
  });

  /* ============================================================
     PAGE 3 — swipeable polaroid-story gallery
  ============================================================ */
  const galleryStage = document.getElementById('galleryStage');
  const slidesEl = document.getElementById('slides');
  const dotsEl = document.getElementById('galleryDots');
  const toFinaleBtn = document.getElementById('toFinaleBtn');

  let galleryBuilt = false;
  let currentSlide = 0;

  function buildGallery() {
    PHOTO_DATA.forEach((photo, idx) => {
      const slide = document.createElement('div');
      slide.className = 'slide ' + (idx % 2 === 0 ? 'slide-from-left' : 'slide-from-right');
      slide.dataset.index = idx;

      const polaroid = document.createElement('div');
      polaroid.className = 'polaroid';
      const tilt = (idx % 2 === 0 ? -1 : 1) * (Math.random() * 2 + 1.5);
      polaroid.style.setProperty('--tilt', tilt.toFixed(1) + 'deg');

      const photoBox = document.createElement('div');
      photoBox.className = 'polaroid-photo';
      const img = document.createElement('img');
      img.src = photo.src;
      img.alt = photo.caption;
      img.loading = idx === 0 ? 'eager' : 'lazy';
      img.addEventListener('error', () => {
        photoBox.classList.add('slide-missing');
        photoBox.innerHTML = `<div class="slide-missing-note">Photo not found<br><code>${photo.src}</code></div>`;
      });
      photoBox.appendChild(img);

      const caption = document.createElement('p');
      caption.className = 'polaroid-caption';
      caption.innerHTML = `<span>${photo.caption}</span><span class="heart-mini">\u2661</span>`;

      polaroid.appendChild(photoBox);
      polaroid.appendChild(caption);
      slide.appendChild(polaroid);
      slidesEl.appendChild(slide);

      const dot = document.createElement('span');
      dotsEl.appendChild(dot);
    });
    galleryBuilt = true;
  }

  function renderSlide(idx) {
    const slides = slidesEl.querySelectorAll('.slide');
    const dots = dotsEl.querySelectorAll('span');
    slides.forEach((s, i) => {
      s.classList.toggle('is-active', i === idx);
      s.classList.toggle('is-prev', i === idx - 1);
    });
    dots.forEach((d, i) => {
      d.classList.toggle('done', i < idx);
      d.classList.toggle('active', i === idx);
    });
    if (idx === PHOTO_DATA.length - 1) {
      toFinaleBtn.classList.remove('is-hidden');
    }
  }

  function goToSlide(idx) {
    if (idx < 0 || idx >= PHOTO_DATA.length || idx === currentSlide) return;
    currentSlide = idx;
    vibrate(8);
    playPageTurn();
    renderSlide(currentSlide);
  }

  function startGallery() {
    if (!galleryBuilt) buildGallery();
    currentSlide = 0;
    renderSlide(0);
  }

  // swipe navigation
  let touchStartX = 0, touchStartY = 0, touchActive = false;
  galleryStage.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
    touchActive = true;
  }, { passive: true });

  galleryStage.addEventListener('touchend', (e) => {
    if (!touchActive) return;
    touchActive = false;
    const dx = e.changedTouches[0].clientX - touchStartX;
    const dy = e.changedTouches[0].clientY - touchStartY;
    if (Math.abs(dx) < 40 || Math.abs(dx) < Math.abs(dy)) return;
    if (dx < 0) {
      goToSlide(currentSlide + 1);
    } else {
      goToSlide(currentSlide - 1);
    }
  }, { passive: true });

  // click/tap zones for non-touch devices
  galleryStage.addEventListener('click', (e) => {
    if (touchActive) return;
    const rect = galleryStage.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / rect.width;
    if (relX < 0.4) {
      goToSlide(currentSlide - 1);
    } else if (relX > 0.6) {
      goToSlide(currentSlide + 1);
    }
  });

  toFinaleBtn.addEventListener('click', () => {
    vibrate(14);
    playNote(784, 0.55);
    showAct(4);
  });

  /* ============================================================
     PAGE 4 — gift box, then heart-particle formation + celebration
  ============================================================ */
  const giftStage = document.getElementById('giftStage');
  const giftBox = document.getElementById('giftBox');
  const finaleInner = document.getElementById('finaleInner');
  const finaleTitle = document.getElementById('finaleTitle');
  const finaleSub = document.getElementById('finaleSub');

  const heartCanvas = document.getElementById('heartCanvas');
  const hctx = heartCanvas.getContext('2d');
  let heartTargets = [];
  let heartParticles = [];
  let heartRunning = false;

  function resizeHeartCanvas() {
    heartCanvas.width = window.innerWidth;
    heartCanvas.height = window.innerHeight;
    buildHeartTargets();
  }
  window.addEventListener('resize', resizeHeartCanvas, { passive: true });

  function buildHeartTargets() {
    const cx = heartCanvas.width / 2;
    const cy = heartCanvas.height * 0.27;
    const scale = Math.min(heartCanvas.width, heartCanvas.height) * 0.017;
    heartTargets = [];
    const count = prefersReducedMotion ? 60 : 140;
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count;
      const hx = 16 * Math.pow(Math.sin(angle), 3);
      const hy = 13 * Math.cos(angle) - 5 * Math.cos(2 * angle) - 2 * Math.cos(3 * angle) - Math.cos(4 * angle);
      heartTargets.push({ x: cx + hx * scale, y: cy - hy * scale });
    }
  }

  function seedHeartParticles() {
    heartParticles = heartTargets.map(target => ({
      x: Math.random() * heartCanvas.width,
      y: heartCanvas.height + Math.random() * 200,
      tx: target.x,
      ty: target.y,
      phase: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.04 + 0.05,
      size: Math.random() * 1.6 + 1.6,
      color: Math.random() > 0.5 ? '248,227,171' : '232,138,138',
    }));
  }

  let heartFrame = 0;
  function drawHearts() {
    hctx.clearRect(0, 0, heartCanvas.width, heartCanvas.height);
    heartFrame++;
    heartParticles.forEach(p => {
      p.x += (p.tx - p.x) * p.speed;
      p.y += (p.ty - p.y) * p.speed;
      const twinkle = 0.55 + Math.sin(heartFrame * 0.05 + p.phase) * 0.35;
      hctx.beginPath();
      hctx.fillStyle = `rgba(${p.color},${Math.max(twinkle, 0.15)})`;
      hctx.shadowColor = `rgba(${p.color},0.8)`;
      hctx.shadowBlur = 6;
      hctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      hctx.fill();
    });
    if (heartRunning) requestAnimationFrame(drawHearts);
  }

  /* ---- confetti + fireworks canvas ---- */
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
        type: 'spark', x, y,
        vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed,
        r: Math.random() * 1.8 + 1.2, color, life: 1,
        decay: Math.random() * 0.012 + 0.014,
      });
    }
    playCrackle();
  }

  function drawConfetti() {
    cctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    confettiPieces.forEach(p => {
      if (p.type === 'confetti') {
        p.y += p.speed; p.x += p.drift; p.rotation += p.rotSpeed;
        cctx.save();
        cctx.translate(p.x, p.y);
        cctx.rotate((p.rotation * Math.PI) / 180);
        cctx.globalAlpha = p.opacity;
        cctx.fillStyle = p.color;
        cctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        cctx.restore();
      } else if (p.type === 'spark') {
        p.x += p.vx; p.y += p.vy; p.vy += 0.045; p.vx *= 0.985; p.life -= p.decay;
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
    confettiPieces = confettiPieces.filter(p => p.type === 'confetti' ? p.y < confettiCanvas.height + 30 : p.life > 0);
    if (confettiRunning) requestAnimationFrame(drawConfetti);
  }

  /* ---- balloons ---- */
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
    wrap.innerHTML = balloonSvg(BALLOON_COLORS[Math.floor(Math.random() * BALLOON_COLORS.length)]) + '<span class="string"></span>';
    balloonField.appendChild(wrap);
    if (withSound) setTimeout(() => playPop(), 200 + Math.random() * 300);
    setTimeout(() => wrap.remove(), 14000);
  }

  /* ---- floating hearts ---- */
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

  const callBar = document.getElementById('callBar');
  const callBtn = document.getElementById('callBtn');
  const thankYouMsg = document.getElementById('thankYouMsg');
  let heartInterval = null;
  let balloonInterval = null;
  let finaleStarted = false;
  let awaitingCallReturn = false;

  function startFinale() {
    if (finaleStarted) return;
    finaleStarted = true;

    resizeHeartCanvas();
    seedHeartParticles();
    heartRunning = true;
    drawHearts();

    resizeConfetti();
    confettiRunning = true;
    drawConfetti();

    if (!prefersReducedMotion) {
      heartInterval = setInterval(spawnHeart, 600);
      let balloonCount = 0;
      balloonInterval = setInterval(() => {
        balloonCount++;
        spawnBalloon(balloonCount % 3 === 0);
      }, 900);
    } else {
      spawnBalloon(false);
      spawnBalloon(false);
    }

    document.body.classList.add('is-bright');
    vibrate([10, 40, 10, 40, 30]);
    playChime();
    spawnConfetti(prefersReducedMotion ? 40 : 120);

    // first firework launches after a beat of golden-light silence
    setTimeout(() => {
      const x = confettiCanvas.width * 0.5;
      const y = confettiCanvas.height * 0.4;
      spawnFirework(x, y);

      const burstSpots = prefersReducedMotion ? 1 : 5;
      for (let i = 1; i <= burstSpots; i++) {
        setTimeout(() => {
          const bx = confettiCanvas.width * (0.2 + Math.random() * 0.6);
          const by = confettiCanvas.height * (0.45 + Math.random() * 0.3);
          spawnFirework(bx, by);
        }, i * (prefersReducedMotion ? 500 : 420) + Math.random() * 150);
      }
    }, prefersReducedMotion ? 300 : 900);

    setTimeout(() => { confettiRunning = false; }, 5600);

    // ---- sequential ending: title -> (2s) -> "I love you" -> (2s) -> call button ----
    const titleAt = prefersReducedMotion ? 500 : 1900;
    setTimeout(() => { finaleTitle.classList.add('is-shown'); }, titleAt);
    setTimeout(() => {
      finaleSub.textContent = 'I love you.';
      finaleSub.classList.add('is-shown');
    }, titleAt + 2000);
    setTimeout(() => {
      callBar.classList.add('is-shown');
      callBtn.classList.add('is-pulsing');
    }, titleAt + 4000);

    // ---- ambient settle: fireworks/balloons/hearts wind down after a while ----
    setTimeout(() => {
      clearInterval(heartInterval);
      clearInterval(balloonInterval);
      heartsField.classList.add('is-fading');
      balloonField.classList.add('is-fading');
      heartCanvas.classList.add('is-settled');
      document.body.classList.remove('is-bright');
    }, titleAt + 7000);
  }

  giftBox.addEventListener('click', () => {
    vibrate([12, 30, 10, 30, 40]);
    getAudioCtx();
    giftBox.classList.add('is-opening');
    playPaperSound();

    // bow falls, ribbon unties, lid opens, golden light bursts
    setTimeout(() => playChime(), 500);

    setTimeout(() => {
      giftStage.classList.add('is-hidden');
      showAct(4);
      startFinale();
    }, 1050);
  });

  /* ---- welcome back from the phone call: a quiet closing moment ---- */
  callBtn.addEventListener('click', () => {
    vibrate(20);
    awaitingCallReturn = true;
  });

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && awaitingCallReturn) {
      awaitingCallReturn = false;
      settleIntoQuietEnding();
    }
  });

  function settleIntoQuietEnding() {
    document.body.classList.add('is-quiet-ending');
    confettiRunning = false;
    cctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    confettiPieces = [];
    heartRunning = false;
    hctx.clearRect(0, 0, heartCanvas.width, heartCanvas.height);
    heartsField.innerHTML = '';
    balloonField.innerHTML = '';

    setTimeout(() => {
      thankYouMsg.classList.add('is-shown');
    }, 900);
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

})();
