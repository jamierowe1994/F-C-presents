/* ═══════════════════════════════════════════════════════════════
   Fine & Country — Private Presentation Demo
   Stage flow:  mac | mobile-mail  →  welcome  →  deck
   ═══════════════════════════════════════════════════════════════ */

(() => {
  'use strict';

  // ── Config — everything personalised lives here ──────────────
  const CONFIG = {
    clientName: 'Mr Henderson',
    welcomeAutoAdvanceMs: 5200,
    notificationDelayMs: 2200,
  };

  const body = document.body;
  const desktopIntroQuery = window.matchMedia('(min-width: 1024px)');

  // ── Stage management ─────────────────────────────────────────
  const setStage = (stage) => { body.dataset.stage = stage; };

  // ── Live clocks ──────────────────────────────────────────────
  const fmtMac = (d) => {
    const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const hh = String(d.getHours()).padStart(2, '0');
    const mm = String(d.getMinutes()).padStart(2, '0');
    return `${days[d.getDay()]} ${d.getDate()} ${months[d.getMonth()]}  ${hh}:${mm}`;
  };
  const tickClocks = () => {
    const now = new Date();
    const macClock = document.getElementById('mbClock');
    const mmClock = document.getElementById('mmClock');
    if (macClock) macClock.textContent = fmtMac(now);
    if (mmClock) mmClock.textContent = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
  };
  tickClocks();
  setInterval(tickClocks, 15000);

  // Dock calendar shows today's date
  const calIcon = document.querySelector('.dock-icon[title="Calendar"] svg');
  if (calIcon) {
    const now = new Date();
    const months = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
    const texts = calIcon.querySelectorAll('text');
    if (texts[0]) texts[0].textContent = months[now.getMonth()];
    if (texts[1]) texts[1].textContent = now.getDate();
  }

  // ── Intro: choose desktop mac scene or mobile mail ───────────
  const macNotif = document.getElementById('macNotif');
  const mailWindow = document.getElementById('mailWindow');
  const mailBadge = document.getElementById('mailBadge');
  const mwTitle = document.querySelector('.mw-title');

  let notifTimer = null;
  const applyIntroStage = () => {
    if (desktopIntroQuery.matches) {
      setStage('mac');
      if (!notifTimer) notifTimer = setTimeout(() => macNotif.classList.add('show'), CONFIG.notificationDelayMs);
    } else {
      setStage('mobile-mail');
    }
  };
  applyIntroStage();
  // Keep the intro responsive until the presentation begins
  desktopIntroQuery.addEventListener('change', () => {
    if (body.dataset.stage === 'mac' || body.dataset.stage === 'mobile-mail') applyIntroStage();
  });

  const openMail = () => {
    macNotif.classList.add('hide');
    mailWindow.classList.add('open');
    mailWindow.setAttribute('aria-hidden', 'false');
    document.getElementById('mbAppName').textContent = 'Mail';
  };
  const closeMail = () => {
    mailWindow.classList.remove('open');
    mailWindow.setAttribute('aria-hidden', 'true');
    document.getElementById('mbAppName').textContent = 'Finder';
  };

  macNotif.addEventListener('click', openMail);
  document.getElementById('dockMail').addEventListener('click', openMail);
  document.getElementById('mwClose').addEventListener('click', closeMail);

  // Mark the F&C email read once the window opens
  mailWindow.addEventListener('transitionend', () => {
    if (mailWindow.classList.contains('open')) {
      setTimeout(() => {
        const dot = document.querySelector('.ml-dot');
        if (dot) dot.style.opacity = '0';
        if (mailBadge) mailBadge.style.display = 'none';
        if (mwTitle) mwTitle.textContent = 'Inbox';
      }, 900);
    }
  }, { once: true });

  // ── Welcome sequence ─────────────────────────────────────────
  const welcome = document.getElementById('welcome');
  let welcomeTimer = null;

  const startWelcome = (e) => {
    if (e) e.preventDefault();
    setStage('welcome');
    welcome.setAttribute('aria-hidden', 'false');
    requestAnimationFrame(() => {
      welcome.classList.add('visible');
      setTimeout(() => welcome.classList.add('play'), 350);
    });
    welcomeTimer = setTimeout(startDeck, CONFIG.welcomeAutoAdvanceMs);
  };

  const startDeck = () => {
    clearTimeout(welcomeTimer);
    setStage('deck');
    document.getElementById('deck').setAttribute('aria-hidden', 'false');
    document.getElementById('deckChrome').setAttribute('aria-hidden', 'false');
    goTo(0, true);
  };

  document.getElementById('emailCta').addEventListener('click', startWelcome);
  document.getElementById('emailCtaMobile').addEventListener('click', startWelcome);
  document.getElementById('welcomeBegin').addEventListener('click', startDeck);
  document.getElementById('skipIntro').addEventListener('click', startWelcome);

  // ── Deck engine ──────────────────────────────────────────────
  const slides = Array.from(document.querySelectorAll('.slide'));
  const sideNav = document.getElementById('sideNav');
  const bbDots = document.getElementById('bbDots');
  const bbLabel = document.getElementById('bbLabel');
  const progressFill = document.getElementById('progressFill');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const bbPrev = document.getElementById('bbPrev');
  const bbNext = document.getElementById('bbNext');
  let current = -1;
  let animLock = false;

  // Build navigation
  slides.forEach((slide, i) => {
    const label = slide.dataset.label || `Slide ${i + 1}`;

    const item = document.createElement('button');
    item.className = 'sn-item';
    item.setAttribute('aria-label', label);
    item.innerHTML = `<span class="sn-label">${label}</span><span class="sn-dot"></span>`;
    item.addEventListener('click', () => goTo(i));
    sideNav.appendChild(item);

    const dot = document.createElement('button');
    dot.className = 'bb-dot';
    dot.setAttribute('aria-label', label);
    dot.addEventListener('click', () => goTo(i));
    bbDots.appendChild(dot);
  });
  const snItems = Array.from(sideNav.children);
  const dotItems = Array.from(bbDots.children);

  // Counter animation
  const animateCounters = (slide) => {
    slide.querySelectorAll('.count').forEach((el) => {
      if (el.dataset.done) return;
      el.dataset.done = '1';
      const target = parseInt(el.dataset.count, 10);
      const duration = 1600;
      const start = performance.now();
      const step = (t) => {
        const p = Math.min((t - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 4);
        el.textContent = Math.round(target * eased);
        if (p < 1) requestAnimationFrame(step);
      };
      setTimeout(() => requestAnimationFrame(step), 500);
    });
  };

  const goTo = (index, force = false) => {
    if (!force && (animLock || index === current)) return;
    if (index < 0 || index >= slides.length) return;
    animLock = true;
    setTimeout(() => { animLock = false; }, 900);

    if (current >= 0) slides[current].classList.remove('active');
    current = index;
    const slide = slides[current];
    slide.classList.add('active');
    slide.scrollTop = 0;
    animateCounters(slide);

    snItems.forEach((el, i) => el.classList.toggle('active', i === current));
    dotItems.forEach((el, i) => el.classList.toggle('active', i === current));
    bbLabel.textContent = slide.dataset.label.replace(/&amp;/g, '&');
    progressFill.style.width = `${((current + 1) / slides.length) * 100}%`;
    prevBtn.disabled = bbPrev.disabled = current === 0;
    nextBtn.disabled = bbNext.disabled = current === slides.length - 1;
  };

  const next = () => goTo(current + 1);
  const prev = () => goTo(current - 1);

  prevBtn.addEventListener('click', prev);
  nextBtn.addEventListener('click', next);
  bbPrev.addEventListener('click', prev);
  bbNext.addEventListener('click', next);
  document.getElementById('coverHint').addEventListener('click', next);

  // Keyboard
  document.addEventListener('keydown', (e) => {
    if (body.dataset.stage !== 'deck') {
      if (e.key === 'Escape' && body.dataset.stage === 'welcome') startDeck();
      return;
    }
    if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') { e.preventDefault(); next(); }
    if (e.key === 'ArrowLeft' || e.key === 'PageUp') { e.preventDefault(); prev(); }
    if (e.key === 'Home') goTo(0);
    if (e.key === 'End') goTo(slides.length - 1);
  });

  // Trackpad / wheel (desktop) — only when slide isn't internally scrollable
  let wheelAccum = 0;
  let wheelCooldown = false;
  document.addEventListener('wheel', (e) => {
    if (body.dataset.stage !== 'deck' || wheelCooldown) return;
    const slide = slides[current];
    const scrollable = slide.scrollHeight > slide.clientHeight + 4;
    if (scrollable) {
      const atTop = slide.scrollTop <= 0;
      const atBottom = slide.scrollTop + slide.clientHeight >= slide.scrollHeight - 4;
      if ((e.deltaY > 0 && !atBottom) || (e.deltaY < 0 && !atTop)) return;
    }
    wheelAccum += e.deltaY;
    if (Math.abs(wheelAccum) > 120) {
      wheelCooldown = true;
      setTimeout(() => { wheelCooldown = false; }, 1100);
      wheelAccum > 0 ? next() : prev();
      wheelAccum = 0;
    }
  }, { passive: true });

  // Touch swipe (mobile) — horizontal only, so vertical scroll still works
  let touchX = 0, touchY = 0;
  document.addEventListener('touchstart', (e) => {
    touchX = e.touches[0].clientX;
    touchY = e.touches[0].clientY;
  }, { passive: true });
  document.addEventListener('touchend', (e) => {
    if (body.dataset.stage !== 'deck') return;
    const dx = e.changedTouches[0].clientX - touchX;
    const dy = e.changedTouches[0].clientY - touchY;
    if (Math.abs(dx) > 64 && Math.abs(dx) > Math.abs(dy) * 1.6) {
      dx < 0 ? next() : prev();
    }
  }, { passive: true });

  // Agent video placeholder — wire the real film in here when supplied
  document.getElementById('agentVideo').addEventListener('click', () => {
    alert('Video placeholder — Anthony’s welcome film drops in here.');
  });

  // Deep link: #presentation skips the intro entirely
  if (location.hash === '#presentation' || new URLSearchParams(location.search).has('presentation')) {
    startDeck();
  }
})();
