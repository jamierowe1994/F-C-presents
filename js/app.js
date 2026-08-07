/* ═══════════════════════════════════════════════════════════════
   Fine & Country — Private Presentation Demo
   Stage flow:  mac | mobile-mail  →  welcome  →  deck
   ═══════════════════════════════════════════════════════════════ */

(() => {
  'use strict';

  // ── Config — everything personalised lives here ──────────────
  const CONFIG = {
    clientName: 'Mr Henderson',
    notificationDelayMs: 2200,
  };

  const body = document.body;
  const desktopIntroQuery = window.matchMedia('(min-width: 1024px)');

  const setStage = (stage) => { body.dataset.stage = stage; };

  // ── Live clocks & dock calendar ──────────────────────────────
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

  // ── Menu bar dropdowns ───────────────────────────────────────
  const MENUS = {
    apple: [
      { t: 'About This Mac' }, { sep: true },
      { t: 'System Settings…' }, { t: 'App Store…' }, { sep: true },
      { t: 'Recent Items', k: '›' }, { sep: true },
      { t: 'Force Quit…', k: '⌥⌘⎋' }, { sep: true },
      { t: 'Sleep' }, { t: 'Restart…' }, { t: 'Shut Down…' }, { sep: true },
      { t: 'Lock Screen', k: '⌃⌘Q' }, { t: 'Log Out John Henderson…', k: '⇧⌘Q' },
    ],
    app: [
      { t: 'About' }, { sep: true },
      { t: 'Settings…', k: '⌘,' }, { sep: true },
      { t: 'Hide', k: '⌘H' }, { t: 'Hide Others', k: '⌥⌘H' }, { t: 'Show All', dim: true }, { sep: true },
      { t: 'Quit', k: '⌘Q' },
    ],
    file: [
      { t: 'New Message', k: '⌘N' }, { t: 'New Mailbox…' }, { sep: true },
      { t: 'Open', k: '⌘O', dim: true }, { t: 'Close', k: '⌘W' }, { sep: true },
      { t: 'Save', k: '⌘S', dim: true }, { t: 'Export as PDF…' }, { sep: true },
      { t: 'Print…', k: '⌘P' },
    ],
    edit: [
      { t: 'Undo', k: '⌘Z', dim: true }, { t: 'Redo', k: '⇧⌘Z', dim: true }, { sep: true },
      { t: 'Cut', k: '⌘X' }, { t: 'Copy', k: '⌘C' }, { t: 'Paste', k: '⌘V' }, { sep: true },
      { t: 'Select All', k: '⌘A' }, { sep: true },
      { t: 'Find', k: '⌘F' },
    ],
    view: [
      { t: 'as Columns' }, { t: 'as List' }, { t: 'as Gallery' }, { sep: true },
      { t: 'Show Tab Bar', k: '⇧⌘T' }, { t: 'Show All Tabs', dim: true }, { sep: true },
      { t: 'Enter Full Screen', k: '⌃⌘F' },
    ],
    go: [
      { t: 'Back', k: '⌘[', dim: true }, { t: 'Forward', k: '⌘]', dim: true }, { sep: true },
      { t: 'Recents', k: '⇧⌘F' }, { t: 'Documents', k: '⇧⌘O' }, { t: 'Desktop', k: '⇧⌘D' },
      { t: 'Downloads', k: '⌥⌘L' }, { t: 'Home', k: '⇧⌘H' }, { sep: true },
      { t: 'Connect to Server…', k: '⌘K' },
    ],
    window: [
      { t: 'Minimise', k: '⌘M' }, { t: 'Zoom' }, { sep: true },
      { t: 'Tile Window to Left of Screen' }, { t: 'Tile Window to Right of Screen' }, { sep: true },
      { t: 'Bring All to Front', dim: true },
    ],
    help: [
      { t: 'Search' }, { sep: true },
      { t: 'macOS Help', k: '⌘?' },
    ],
  };

  const macMenu = document.getElementById('macMenu');
  const macMenuList = document.getElementById('macMenuList');
  const menuTriggers = Array.from(document.querySelectorAll('.mb-menu-trigger'));
  let openMenuKey = null;

  const closeMenu = () => {
    macMenu.hidden = true;
    openMenuKey = null;
    menuTriggers.forEach((t) => t.classList.remove('open'));
  };

  const openMenu = (trigger) => {
    const key = trigger.dataset.menu;
    if (openMenuKey === key) { closeMenu(); return; }
    const items = MENUS[key] || [];
    macMenuList.innerHTML = items.map((it) => {
      if (it.sep) return '<li class="sep" aria-hidden="true"></li>';
      const cls = it.dim ? ' class="dim"' : '';
      const kbd = it.k ? `<span class="kbd">${it.k}</span>` : '';
      return `<li${cls}><span>${it.t}</span>${kbd}</li>`;
    }).join('');
    const rect = trigger.getBoundingClientRect();
    macMenu.style.left = `${Math.max(8, rect.left)}px`;
    macMenu.hidden = false;
    openMenuKey = key;
    menuTriggers.forEach((t) => t.classList.toggle('open', t === trigger));
  };

  menuTriggers.forEach((t) => {
    t.addEventListener('click', (e) => { e.stopPropagation(); openMenu(t); });
    // macOS behaviour: with a menu open, hovering another title switches to it
    t.addEventListener('mouseenter', () => { if (openMenuKey && openMenuKey !== t.dataset.menu) openMenu(t); });
  });
  document.addEventListener('click', (e) => {
    if (openMenuKey && !macMenu.contains(e.target)) closeMenu();
  });
  macMenu.addEventListener('click', () => closeMenu());

  // ── Intro: desktop mac scene or mobile mail ──────────────────
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
  desktopIntroQuery.addEventListener('change', () => {
    if (body.dataset.stage === 'mac' || body.dataset.stage === 'mobile-mail') applyIntroStage();
  });

  let mailOpened = false;
  const openMail = () => {
    macNotif.classList.add('hide');
    mailWindow.classList.remove('minimised');
    mailWindow.classList.add('open');
    mailWindow.setAttribute('aria-hidden', 'false');
    document.getElementById('mbAppName').textContent = 'Mail';
    if (!mailOpened) {
      mailOpened = true;
      setTimeout(() => {
        const dot = document.querySelector('.ml-dot');
        if (dot) dot.style.opacity = '0';
        if (mailBadge) mailBadge.style.display = 'none';
        if (mwTitle) mwTitle.textContent = 'Inbox';
      }, 1500);
    }
  };
  const closeMail = () => {
    mailWindow.classList.remove('open', 'maximised', 'minimised');
    mailWindow.style.top = ''; mailWindow.style.left = '';
    mailWindow.setAttribute('aria-hidden', 'true');
    document.getElementById('mbAppName').textContent = 'Finder';
  };

  macNotif.addEventListener('click', openMail);
  document.getElementById('dockMail').addEventListener('click', openMail);
  document.getElementById('mwClose').addEventListener('click', closeMail);
  document.getElementById('mwMax').addEventListener('click', () => mailWindow.classList.toggle('maximised'));
  document.getElementById('mwMin').addEventListener('click', () => {
    mailWindow.classList.add('minimised');
    mailWindow.classList.remove('open');
    document.getElementById('mbAppName').textContent = 'Finder';
  });

  // Window dragging via title bar
  const titlebar = document.getElementById('mwTitlebar');
  let drag = null;
  titlebar.addEventListener('mousedown', (e) => {
    if (e.target.closest('.tl')) return;
    if (mailWindow.classList.contains('maximised')) return;
    const rect = mailWindow.getBoundingClientRect();
    drag = { dx: e.clientX - rect.left, dy: e.clientY - rect.top };
    mailWindow.classList.add('dragging');
    e.preventDefault();
  });
  document.addEventListener('mousemove', (e) => {
    if (!drag) return;
    const w = mailWindow.offsetWidth;
    let x = e.clientX - drag.dx + w / 2; // centre-based because of translateX(-50%)
    let y = e.clientY - drag.dy;
    y = Math.max(30, Math.min(y, window.innerHeight - 60));
    mailWindow.style.left = `${x}px`;
    mailWindow.style.top = `${y}px`;
  });
  document.addEventListener('mouseup', () => {
    if (drag) { drag = null; mailWindow.classList.remove('dragging'); }
  });
  titlebar.addEventListener('dblclick', (e) => {
    if (e.target.closest('.tl')) return;
    mailWindow.classList.toggle('maximised');
  });

  // ── Welcome sequence — waits for Begin ───────────────────────
  const welcome = document.getElementById('welcome');

  const startWelcome = (e) => {
    if (e) e.preventDefault();
    closeMenu();
    setStage('welcome');
    welcome.setAttribute('aria-hidden', 'false');
    requestAnimationFrame(() => {
      welcome.classList.add('visible');
      setTimeout(() => welcome.classList.add('play'), 350);
    });
  };

  const startDeck = () => {
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
  const dpList = document.getElementById('dpList');
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

    const li = document.createElement('li');
    li.className = 'dp-item';
    li.innerHTML = `<button><span class="dp-num">${String(i + 1).padStart(2, '0')}</span><span class="dp-label">${label}</span></button>`;
    li.querySelector('button').addEventListener('click', () => goTo(i));
    dpList.appendChild(li);

    const dot = document.createElement('button');
    dot.className = 'bb-dot';
    dot.setAttribute('aria-label', label);
    dot.addEventListener('click', () => goTo(i));
    bbDots.appendChild(dot);
  });
  const dpItems = Array.from(dpList.children);
  const dotItems = Array.from(bbDots.children);

  // Left panel toggle
  const deckPanel = document.getElementById('deckPanel');
  const dpToggle = document.getElementById('dpToggle');
  const desktopNav = window.matchMedia('(min-width: 1024px)');
  const applyPanelState = (open) => {
    deckPanel.classList.toggle('closed', !open);
    dpToggle.classList.toggle('closed', !open);
    dpToggle.setAttribute('aria-expanded', String(open));
    dpToggle.setAttribute('aria-label', open ? 'Hide navigation' : 'Show navigation');
    body.classList.toggle('panel-open', open && desktopNav.matches);
  };
  let panelOpen = true;
  dpToggle.addEventListener('click', () => { panelOpen = !panelOpen; applyPanelState(panelOpen); });
  desktopNav.addEventListener('change', () => applyPanelState(panelOpen));
  applyPanelState(true);

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
    handleFilmOnSlideChange(slide);

    dpItems.forEach((el, i) => el.classList.toggle('active', i === current));
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

  // Keyboard
  document.addEventListener('keydown', (e) => {
    if (body.dataset.stage !== 'deck') {
      if (e.key === 'Escape' && body.dataset.stage === 'welcome') startDeck();
      return;
    }
    if (e.target.tagName === 'TEXTAREA' || e.target.tagName === 'INPUT') return;
    if (e.key === 'ArrowRight' || e.key === 'PageDown') { e.preventDefault(); next(); }
    if (e.key === 'ArrowLeft' || e.key === 'PageUp') { e.preventDefault(); prev(); }
    if (e.key === 'Home') goTo(0);
    if (e.key === 'End') goTo(slides.length - 1);
  });

  // Trackpad / wheel (desktop)
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

  // Touch swipe (mobile) — horizontal only
  let touchX = 0, touchY = 0;
  document.addEventListener('touchstart', (e) => {
    touchX = e.touches[0].clientX;
    touchY = e.touches[0].clientY;
  }, { passive: true });
  document.addEventListener('touchend', (e) => {
    if (body.dataset.stage !== 'deck') return;
    if (e.target.closest('.film') || e.target.closest('.ask-form')) return;
    const dx = e.changedTouches[0].clientX - touchX;
    const dy = e.changedTouches[0].clientY - touchY;
    if (Math.abs(dx) > 64 && Math.abs(dx) > Math.abs(dy) * 1.6) {
      dx < 0 ? next() : prev();
    }
  }, { passive: true });

  // ── The film player ──────────────────────────────────────────
  const film = document.getElementById('fcFilm');
  const filmStage = document.getElementById('filmStage');
  const filmPlay = document.getElementById('filmPlay');
  const filmMute = document.getElementById('filmMute');
  const filmVolume = document.getElementById('filmVolume');
  const filmFull = document.getElementById('filmFull');
  const filmTrack = document.getElementById('filmTrack');
  const filmTrackFill = document.getElementById('filmTrackFill');
  const filmTrackThumb = document.getElementById('filmTrackThumb');
  const filmTime = document.getElementById('filmTime');
  const icPlay = filmPlay.querySelector('.ic-play');
  const icPause = filmPlay.querySelector('.ic-pause');
  const icMuted = filmMute.querySelector('.ic-muted');
  const icSound = filmMute.querySelector('.ic-sound');

  const fmtTime = (s) => {
    if (!isFinite(s)) return '0:00';
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${String(sec).padStart(2, '0')}`;
  };

  const refreshPlayIcon = () => {
    icPlay.style.display = film.paused ? '' : 'none';
    icPause.style.display = film.paused ? 'none' : '';
    filmPlay.setAttribute('aria-label', film.paused ? 'Play' : 'Pause');
  };
  const refreshMuteIcon = () => {
    const muted = film.muted || film.volume === 0;
    icMuted.style.display = muted ? '' : 'none';
    icSound.style.display = muted ? 'none' : '';
    filmMute.setAttribute('aria-label', muted ? 'Unmute' : 'Mute');
  };

  filmPlay.addEventListener('click', () => { film.paused ? film.play() : film.pause(); });
  filmStage.addEventListener('click', (e) => {
    if (e.target.closest('.film-corner')) return;
    film.paused ? film.play() : film.pause();
  });
  film.addEventListener('play', refreshPlayIcon);
  film.addEventListener('pause', refreshPlayIcon);

  filmMute.addEventListener('click', () => {
    film.muted = !film.muted;
    if (!film.muted && film.volume === 0) film.volume = 1;
    refreshMuteIcon();
  });
  filmVolume.addEventListener('input', () => {
    film.volume = parseFloat(filmVolume.value);
    film.muted = film.volume === 0;
    refreshMuteIcon();
  });

  filmFull.addEventListener('click', () => {
    const target = filmStage;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else if (target.requestFullscreen) {
      target.requestFullscreen();
    } else if (film.webkitEnterFullscreen) {
      film.webkitEnterFullscreen(); // iOS Safari
    }
  });

  film.addEventListener('timeupdate', () => {
    const p = film.duration ? (film.currentTime / film.duration) * 100 : 0;
    filmTrackFill.style.width = `${p}%`;
    filmTrackThumb.style.left = `${p}%`;
    filmTime.textContent = `${fmtTime(film.currentTime)} / ${fmtTime(film.duration)}`;
  });
  film.addEventListener('loadedmetadata', () => {
    filmTime.textContent = `0:00 / ${fmtTime(film.duration)}`;
  });

  const seekFromEvent = (e) => {
    const rect = filmTrack.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    if (film.duration) film.currentTime = ratio * film.duration;
  };
  let scrubbing = false;
  filmTrack.addEventListener('mousedown', (e) => { scrubbing = true; seekFromEvent(e); });
  document.addEventListener('mousemove', (e) => { if (scrubbing) seekFromEvent(e); });
  document.addEventListener('mouseup', () => { scrubbing = false; });
  filmTrack.addEventListener('touchstart', seekFromEvent, { passive: true });
  filmTrack.addEventListener('touchmove', seekFromEvent, { passive: true });

  // Autoplay (muted, per browser policy) when its slide arrives; pause on leave
  const handleFilmOnSlideChange = (slide) => {
    if (slide.classList.contains('slide-expect')) {
      film.muted = true;
      refreshMuteIcon();
      const attempt = film.play();
      if (attempt) attempt.catch(() => {});
    } else if (!film.paused) {
      film.pause();
    }
  };
  refreshPlayIcon();
  refreshMuteIcon();

  // Agent video placeholder — wire the real film in here when supplied
  document.getElementById('agentVideo').addEventListener('click', () => {
    alert('Video placeholder — Anthony’s personal welcome drops in here.');
  });

  // Marketing cards — tap/click toggles (hover handles desktop)
  document.querySelectorAll('.mk-card').forEach((card) => {
    card.addEventListener('click', () => {
      const open = card.classList.toggle('open');
      card.setAttribute('aria-expanded', String(open));
    });
  });

  // ── Ask form ─────────────────────────────────────────────────
  const askForm = document.getElementById('askForm');
  askForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const msg = document.getElementById('askMessage').value.trim();
    if (!msg) return;
    // Demo behaviour: show the thank-you state.
    // Production: POST to an endpoint or open a prefilled mailto.
    askForm.hidden = true;
    document.getElementById('askThanks').hidden = false;
  });

  // Deep link: #presentation skips the intro entirely
  if (location.hash === '#presentation' || new URLSearchParams(location.search).has('presentation')) {
    startDeck();
  }
})();
