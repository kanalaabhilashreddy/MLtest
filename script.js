(() => {
  const body = document.body;

  // Mobile navigation
  const menuBtn = document.querySelector('.menu-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');

  menuBtn?.addEventListener('click', () => {
    const open = mobileMenu.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', String(open));
    mobileMenu.setAttribute('aria-hidden', String(!open));
    body.style.overflow = open ? 'hidden' : '';
  });

  mobileMenu?.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      menuBtn?.setAttribute('aria-expanded', 'false');
      mobileMenu.setAttribute('aria-hidden', 'true');
      body.style.overflow = '';
    });
  });

  // Scroll reveal
  const revealItems = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const delay = [...entry.target.parentElement.children].indexOf(entry.target) * 55;
        entry.target.style.transitionDelay = `${Math.min(delay, 300)}ms`;
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px' });

  revealItems.forEach(el => observer.observe(el));

  // Animated counters
  const counters = document.querySelectorAll('[data-count]');
  const countObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = Number(el.dataset.count);
      const duration = 1500;
      const start = performance.now();

      const tick = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 4);
        el.textContent = Math.floor(target * eased).toLocaleString();
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      countObserver.unobserve(el);
    });
  }, { threshold: .5 });
  counters.forEach(el => countObserver.observe(el));

  // Subtle hero parallax
  const hero = document.querySelector('.hero');
  const orbOne = document.querySelector('.orb-one');
  const orbTwo = document.querySelector('.orb-two');

  window.addEventListener('scroll', () => {
    if (!hero || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const y = window.scrollY;
    if (y < window.innerHeight * 1.2) {
      orbOne.style.transform = `translate3d(0, ${y * .10}px, 0)`;
      orbTwo.style.transform = `translate3d(0, ${y * -.06}px, 0)`;
    }
  }, { passive: true });

  // Magnetic buttons
  if (window.matchMedia('(pointer:fine)').matches) {
    document.querySelectorAll('.magnetic').forEach(el => {
      el.addEventListener('mousemove', e => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - (r.left + r.width / 2)) * .18;
        const y = (e.clientY - (r.top + r.height / 2)) * .18;
        el.style.transform = `translate(${x}px, ${y}px)`;
      });
      el.addEventListener('mouseleave', () => {
        el.style.transform = '';
      });
    });

    // Custom cursor
    const dot = document.querySelector('.cursor-dot');
    const ring = document.querySelector('.cursor-ring');
    window.addEventListener('mousemove', e => {
      dot.style.left = `${e.clientX}px`;
      dot.style.top = `${e.clientY}px`;
      ring.style.left = `${e.clientX}px`;
      ring.style.top = `${e.clientY}px`;
    });
    document.querySelectorAll('a, button').forEach(el => {
      el.addEventListener('mouseenter', () => ring.classList.add('hover'));
      el.addEventListener('mouseleave', () => ring.classList.remove('hover'));
    });
  }

  // Current year
  document.getElementById('year').textContent = new Date().getFullYear();

  // Smooth anchor handling
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
})();

/* ===== Mind Lead Performance Lab — final stable engine ===== */
(() => {
  const lab = document.querySelector('.mind-lab');
  if (!lab) return;

  const $ = (selector) => lab.querySelector(selector);

  const modules = [...lab.querySelectorAll('.lab-module')];
  const intro = $('#game-intro');
  const stage = $('#game-stage');
  const results = $('#game-results');
  const startButton = $('#game-start');
  const restartButton = $('#game-restart');
  const consoleBox = $('.lab-console');

  const status = $('#lab-status');
  const roundOut = $('#lab-round');
  const scoreOut = $('#lab-score');
  const levelOut = $('#lab-difficulty');

  const kicker = $('#game-kicker');
  const title = $('#game-title');
  const description = $('#game-description');
  const instruction = $('#stage-instruction');
  const message = $('#stage-message');

  const focusGrid = $('#focus-grid');
  const reactionTarget = $('#reaction-target');
  const pressureTarget = $('#pressure-target');
  const decisionOptions = $('#decision-options');

  const dashModule = $('#dash-module');
  const dashProgress = $('#dash-progress');
  const dashProgressText = $('#dash-progress-text');
  const dashAccuracy = $('#dash-accuracy');
  const dashReaction = $('#dash-reaction');
  const dashConsistency = $('#dash-consistency');
  const dashRounds = $('#dash-rounds');
  const dashState = $('#dash-state');
  const dashStateCopy = $('#dash-state-copy');

  const resultScore = $('#result-score');
  const resultAccuracy = $('#result-accuracy');
  const resultReaction = $('#result-reaction');
  const resultConsistency = $('#result-consistency');
  const resultRounds = $('#result-rounds');
  const resultState = $('#result-classification');

  const config = {
    focus: [
      'FOCUS CONTROL',
      'Find the target.',
      'Select the target symbol and ignore the distractors. The grid becomes harder each round.'
    ],
    reaction: [
      'REACTION TIME',
      'Wait. Then react.',
      'Wait for the blue signal, then respond as quickly as you can. Early responses are misses.'
    ],
    pressure: [
      'PRESSURE CONTROL',
      'Beat the clock.',
      'Respond inside a progressively tighter window while the target becomes smaller.'
    ],
    decision: [
      'DECISION UNDER PRESSURE',
      'Choose quickly.',
      'Read the scenario and select the best response before the decision window closes.'
    ]
  };

  const scenarios = [
    ['Your opponent changes tactics mid-match. What comes first?', ['Stick to the plan','Observe → reset → adapt','Rush the next play','Ask someone else'], 1],
    ['You make an early mistake. Your next move?', ['Replay the error','Force a big play','Reset attention to the next action','Stop taking risks'], 2],
    ['You feel nervous before a key attempt.', ['Fight the feeling','Use your routine + breathe','Avoid the moment','Tell yourself to relax'], 1],
    ['The score is tight and distractions rise.', ['Track everything','Narrow attention to the next cue','Speed up','Think about the outcome'], 1],
    ['A teammate is struggling under pressure.', ['Criticise immediately','Ignore it','Use clear, calm communication','Take over'], 2],
    ['You have 5 seconds to decide.', ['Search for certainty','Use your trained cue and commit','Wait for someone else','Change strategy'], 1],
    ['Your usual routine is disrupted.', ['Abandon the routine','Create a short reset sequence','Panic','Pretend nothing changed'], 1],
    ['You are performing well. What next?', ['Protect the result','Stay with the process cues','Think about winning','Take bigger risks'], 1]
  ];

  const TOTAL_ROUNDS = 8;

  let game = 'focus';
  let round = 0;
  let score = 0;
  let hits = 0;
  let misses = 0;
  let reactionTimes = [];
  let roundResults = [];
  let timerId = null;
  let ready = false;
  let startTime = 0;
  let sessionActive = false;

  function clearTimer() {
    if (timerId !== null) {
      window.clearTimeout(timerId);
      timerId = null;
    }
  }

  function later(callback, delay) {
    clearTimer();
    timerId = window.setTimeout(() => {
      timerId = null;
      callback();
    }, delay);
  }

  function setVisible(element, visible, display = 'block') {
    if (!element) return;
    element.hidden = !visible;
    element.classList.toggle('is-active', visible);
    element.style.display = visible ? display : 'none';
  }

  function level() {
    return Math.min(4, 1 + Math.floor(Math.max(0, round - 1) / 2));
  }

  function showOnlyGame(gameName) {
    setVisible(focusGrid, gameName === 'focus', 'grid');
    setVisible(reactionTarget, gameName === 'reaction', 'block');
    setVisible(pressureTarget, gameName === 'pressure', 'block');
    setVisible(decisionOptions, gameName === 'decision', 'grid');
  }

  function reset() {
    clearTimer();
    round = 0;
    score = 0;
    hits = 0;
    misses = 0;
    reactionTimes = [];
    roundResults = [];
    ready = false;
    sessionActive = false;

    setVisible(intro, true, 'flex');
    setVisible(stage, false, 'flex');
    setVisible(results, false, 'block');
    showOnlyGame('');

    focusGrid.innerHTML = '';
    decisionOptions.innerHTML = '';
    reactionTarget.className = 'reaction-target';
    pressureTarget.className = 'pressure-target';

    consoleBox.classList.remove('running', 'complete');
    status.textContent = 'READY';
    roundOut.textContent = `0 / ${TOTAL_ROUNDS}`;
    levelOut.textContent = '1';
    message.textContent = '';

    updateDashboard();
  }

  function selectModule(name) {
    if (!config[name]) return;

    game = name;
    const current = config[name];

    modules.forEach((button) => {
      const active = button.dataset.game === name;
      button.classList.toggle('active', active);
      button.setAttribute('aria-selected', active ? 'true' : 'false');
    });

    kicker.textContent = current[0];
    title.textContent = current[1];
    description.textContent = current[2];
    dashModule.textContent = name === 'decision' ? 'DECISION' : current[0].replace(' CONTROL', '');

    reset();
  }

  function startGame(event) {
    if (event) event.preventDefault();

    clearTimer();

    // Full reset before every new session, including Run Again.
    round = 0;
    score = 0;
    hits = 0;
    misses = 0;
    reactionTimes = [];
    roundResults = [];
    ready = false;
    sessionActive = true;

    setVisible(intro, false);
    setVisible(results, false);
    setVisible(stage, true, 'flex');
    showOnlyGame(game);

    consoleBox.classList.add('running');
    consoleBox.classList.remove('complete');
    status.textContent = 'LIVE';
    message.textContent = '';

    updateDashboard();
    nextRound();
  }

  function nextRound() {
    clearTimer();

    if (!sessionActive) return;

    if (round >= TOTAL_ROUNDS) {
      finish();
      return;
    }

    round += 1;
    roundOut.textContent = `${round} / ${TOTAL_ROUNDS}`;
    levelOut.textContent = String(level());
    message.textContent = '';

    showOnlyGame(game);

    if (game === 'focus') {
      runFocusRound();
    } else if (game === 'reaction') {
      runReactionRound();
    } else if (game === 'pressure') {
      runPressureRound();
    } else {
      runDecisionRound();
    }

    updateDashboard();
  }

  function record(hit, milliseconds = 0) {
    if (hit) {
      hits += 1;
      score += 100 + Math.max(0, (5 - level()) * 8);
    } else {
      misses += 1;
    }

    if (milliseconds > 0) reactionTimes.push(milliseconds);
    roundResults.push({ hit, milliseconds });
    updateDashboard();
  }

  function runFocusRound() {
    ready = true;

    const size = Math.min(6, 3 + level());
    const total = size * size;
    const targetIndex = Math.floor(Math.random() * total);
    const symbols = ['△', '○', '□', '◇', '✕'];
    const targetSymbol = symbols[Math.floor(Math.random() * symbols.length)];
    const distractors = symbols.filter((symbol) => symbol !== targetSymbol);

    focusGrid.innerHTML = '';
    focusGrid.style.gridTemplateColumns = `repeat(${size}, minmax(0, 1fr))`;
    instruction.textContent = `SELECT ${targetSymbol} — IGNORE DISTRACTORS`;

    for (let index = 0; index < total; index += 1) {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'focus-cell';
      button.textContent = index === targetIndex
        ? targetSymbol
        : distractors[Math.floor(Math.random() * distractors.length)];
      button.setAttribute('aria-label', index === targetIndex ? 'Target' : 'Distractor');

      button.addEventListener('click', () => {
        if (!sessionActive || !ready || button.disabled) return;

        ready = false;
        clearTimer();
        record(index === targetIndex);
        [...focusGrid.children].forEach((cell) => { cell.disabled = true; });
        message.textContent = index === targetIndex ? 'TARGET FOUND' : 'DISTRACTOR — RESET';
        later(nextRound, 450);
      });

      focusGrid.appendChild(button);
    }

    later(() => {
      if (!sessionActive || !ready) return;

      ready = false;
      [...focusGrid.children].forEach((cell) => { cell.disabled = true; });
      record(false);
      message.textContent = 'TIME — NEXT ROUND';
      later(nextRound, 450);
    }, Math.max(1800, 4300 - level() * 500));
  }

  function runReactionRound() {
    ready = false;
    reactionTarget.className = 'reaction-target';
    instruction.textContent = 'WAIT FOR BLUE — THEN TAP OR PRESS ENTER';

    const wait = 900 + Math.random() * 900;

    later(() => {
      if (!sessionActive) return;

      ready = true;
      reactionTarget.className = 'reaction-target ready';
      startTime = performance.now();
      instruction.textContent = 'GO — RESPOND NOW';

      later(() => {
        if (!sessionActive || !ready) return;

        ready = false;
        reactionTarget.className = 'reaction-target';
        record(false);
        message.textContent = 'TOO SLOW';
        later(nextRound, 450);
      }, Math.max(900, 1700 - level() * 100));
    }, wait);
  }

  function answerReaction() {
    if (!sessionActive || game !== 'reaction') return;

    if (!ready) {
      clearTimer();
      ready = false;
      reactionTarget.className = 'reaction-target too-soon';
      record(false);
      message.textContent = 'TOO SOON';
      later(nextRound, 450);
      return;
    }

    const milliseconds = performance.now() - startTime;
    clearTimer();
    ready = false;
    reactionTarget.className = 'reaction-target';
    record(true, milliseconds);
    message.textContent = `${Math.round(milliseconds)} MS`;
    later(nextRound, 450);
  }

  function runPressureRound() {
    ready = true;

    const limit = Math.max(700, 2300 - (round - 1) * 130);
    const size = Math.max(135, 210 - (round - 1) * 7);

    pressureTarget.style.width = `${size}px`;
    pressureTarget.style.height = `${size}px`;
    pressureTarget.className = 'pressure-target ready';
    instruction.textContent = `RESPOND WITHIN ${limit} MS`;
    startTime = performance.now();

    later(() => {
      if (!sessionActive || !ready) return;

      ready = false;
      pressureTarget.className = 'pressure-target';
      record(false, limit);
      message.textContent = 'WINDOW MISSED';
      later(nextRound, 450);
    }, limit);
  }

  function answerPressure() {
    if (!sessionActive || game !== 'pressure' || !ready) return;

    const milliseconds = performance.now() - startTime;
    clearTimer();
    ready = false;
    pressureTarget.className = 'pressure-target';
    record(true, milliseconds);
    message.textContent = `${Math.round(milliseconds)} MS — CONTROLLED`;
    later(nextRound, 450);
  }

  function runDecisionRound() {
    const scenario = scenarios[(round - 1) % scenarios.length];
    const limit = Math.max(5500, 8000 - (round - 1) * 360);

    instruction.textContent = `READ + DECIDE — ${Math.ceil(limit / 1000)} SEC`;
    decisionOptions.innerHTML = '';

    const question = document.createElement('div');
    question.className = 'decision-question';
    question.textContent = scenario[0];
    decisionOptions.appendChild(question);

    startTime = performance.now();
    ready = true;

    scenario[1].forEach((answer, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'decision-option';
      button.textContent = answer;

      button.addEventListener('click', () => {
        if (!sessionActive || !ready) return;

        const milliseconds = performance.now() - startTime;
        clearTimer();
        ready = false;

        const correct = index === scenario[2] && milliseconds <= limit;
        record(correct, milliseconds);

        [...decisionOptions.querySelectorAll('button')].forEach((option) => {
          option.disabled = true;
        });

        message.textContent = correct
          ? `${Math.round(milliseconds)} MS — GOOD DECISION`
          : `${Math.round(milliseconds)} MS — RESET`;

        later(nextRound, 500);
      });

      decisionOptions.appendChild(button);
    });

    later(() => {
      if (!sessionActive || !ready) return;

      ready = false;
      record(false, limit);
      [...decisionOptions.querySelectorAll('button')].forEach((option) => {
        option.disabled = true;
      });
      message.textContent = 'DECISION WINDOW CLOSED';
      later(nextRound, 500);
    }, limit);
  }

  function getConsistency() {
    if (reactionTimes.length < 2) return null;

    const average = reactionTimes.reduce((sum, value) => sum + value, 0) / reactionTimes.length;
    const variance = reactionTimes.reduce(
      (sum, value) => sum + Math.pow(value - average, 2),
      0
    ) / reactionTimes.length;

    const standardDeviation = Math.sqrt(variance);
    return Math.round(
      Math.max(0, Math.min(100, 100 - (standardDeviation / Math.max(average, 1)) * 100))
    );
  }

  function classify(accuracy, consistency) {
    if (accuracy >= 85 && (consistency === null || consistency >= 75)) {
      return ['CONTROLLED', 'Strong accuracy with a stable response pattern in this session.'];
    }
    if (accuracy >= 70 || (consistency !== null && consistency >= 60)) {
      return ['ADAPTING', 'Useful control with some variability as the challenge changed.'];
    }
    if (accuracy >= 50) {
      return ['BUILDING', 'Room to build more repeatable responses under pressure.'];
    }
    return ['EXPLORING', 'Use this session as a starting point, not a judgement.'];
  }

  function updateDashboard() {
    const progress = Math.round((round / TOTAL_ROUNDS) * 100);
    const attempts = hits + misses;
    const accuracy = attempts ? Math.round((hits / attempts) * 100) : 0;
    const average = reactionTimes.length
      ? Math.round(reactionTimes.reduce((sum, value) => sum + value, 0) / reactionTimes.length)
      : null;
    const consistency = getConsistency();

    scoreOut.textContent = String(score);
    dashProgress.style.width = `${progress}%`;
    dashProgressText.textContent = `${progress}%`;
    dashAccuracy.textContent = attempts ? `${accuracy}%` : '—';
    dashReaction.textContent = average !== null ? `${average}ms` : '—';
    dashConsistency.textContent = consistency !== null ? `${consistency}%` : '—';

    dashRounds.innerHTML = '';
    for (let index = 0; index < TOTAL_ROUNDS; index += 1) {
      const dot = document.createElement('i');
      dot.className = 'round-dot';

      if (index < roundResults.length) {
        dot.classList.add(roundResults[index].hit ? 'hit' : 'miss');
      }

      if (index === round - 1) {
        dot.classList.add('current');
      }

      dot.setAttribute('aria-label', `Round ${index + 1}`);
      dashRounds.appendChild(dot);
    }

    const currentState = classify(accuracy, consistency);
    dashState.textContent = attempts ? currentState[0] : 'READY';
    dashStateCopy.textContent = attempts
      ? currentState[1]
      : 'Complete a few rounds to generate a session signal.';
  }

  function finish() {
    clearTimer();
    ready = false;
    sessionActive = false;

    setVisible(stage, false);
    showOnlyGame('');
    setVisible(results, true, 'block');

    consoleBox.classList.remove('running');
    consoleBox.classList.add('complete');
    status.textContent = 'COMPLETE';

    const accuracy = Math.round((hits / TOTAL_ROUNDS) * 100);
    const average = reactionTimes.length
      ? Math.round(reactionTimes.reduce((sum, value) => sum + value, 0) / reactionTimes.length)
      : null;
    const consistency = getConsistency();
    const currentState = classify(accuracy, consistency);

    resultScore.textContent = String(score);
    resultAccuracy.textContent = `${accuracy}%`;
    resultReaction.textContent = average !== null ? `${average}ms` : '—';
    resultConsistency.textContent = consistency !== null ? `${consistency}%` : '—';
    resultRounds.textContent = `${TOTAL_ROUNDS} / ${TOTAL_ROUNDS}`;
    resultState.textContent = currentState[0];

    updateDashboard();
  }

  modules.forEach((button) => {
    button.addEventListener('click', () => selectModule(button.dataset.game));
  });

  startButton.addEventListener('click', startGame);
  restartButton.addEventListener('click', (event) => { event.preventDefault(); startGame(event); });

  reactionTarget.addEventListener('click', answerReaction);
  pressureTarget.addEventListener('click', answerPressure);

  lab.addEventListener('keydown', (event) => {
    const isActionKey = event.key === 'Enter' || event.key === ' ';
    if (!isActionKey) return;

    const target = event.target;
    if (target.matches('input, textarea, select, a')) return;

    if (target === startButton) {
      event.preventDefault();
      startGame(event);
      return;
    }

    if (target === restartButton) {
      event.preventDefault();
      startGame(event);
      return;
    }

    if (sessionActive && game === 'reaction') {
      event.preventDefault();
      answerReaction();
    } else if (sessionActive && game === 'pressure') {
      event.preventDefault();
      answerPressure();
    }
  });

  selectModule('focus');
})();
