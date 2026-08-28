(() => {
  "use strict";

  const $ = id => document.getElementById(id);
  const tabs = [...document.querySelectorAll(".lab-tab")];
  const stage = $("lab-stage");
  const live = $("lab-live");
  const instruction = $("lab-instruction");
  const start = $("lab-start");
  const restart = $("lab-restart");
  const runAgain = $("lab-run-again");
  const results = $("lab-results");
  const scoreEl = $("lab-score");
  const roundEl = $("lab-round");
  const timeEl = $("lab-time");
  const titleEl = $("module-title");
  const kickerEl = $("module-kicker");
  const descEl = $("module-description");
  const feedback = $("lab-feedback");

  if (!stage || !start) return;

  const modules = {
    focus: {
      title: "Focus Control",
      kicker: "SELECTIVE ATTENTION",
      description: "Select only the target word. Ignore the red distractions.",
      targetWords: ["FOCUS", "LOCK", "CALM", "READY"],
      distractors: ["PANIC", "DOUBT", "RUSH", "FEAR", "NOISE", "WORRY"],
      rounds: 10
    },
    reaction: {
      title: "Reaction Time",
      kicker: "RESPONSE SPEED",
      description: "Wait for the target to appear, then react as quickly as possible.",
      rounds: 7
    },
    pressure: {
      title: "Pressure Control",
      kicker: "PERFORM UNDER PRESSURE",
      description: "Hit the gold target while the window gets shorter. Red targets are distractions.",
      rounds: 10
    },
    decision: {
      title: "Decision Under Pressure",
      kicker: "RAPID DECISION-MAKING",
      description: "Choose the strongest response before the timer expires.",
      rounds: 8
    }
  };

  let current = "focus";
  let running = false;
  let round = 0;
  let score = 0;
  let timer = null;
  let roundTimer = null;
  let moduleData = {};
  let sessionResults = {focus:null,reaction:null,decision:null,pressure:null};

  function clearTimers() {
    clearInterval(timer);
    clearTimeout(roundTimer);
    timer = null;
    roundTimer = null;
  }

  function clearLive() {
    live.innerHTML = "";
  }

  function updateHeader() {
    const m = modules[current];
    kickerEl.textContent = m.kicker;
    titleEl.textContent = m.title;
    descEl.textContent = m.description;
    scoreEl.textContent = score;
    roundEl.textContent = `0/${m.rounds}`;
    timeEl.textContent = current === "reaction" ? "—" : "30";
  }

  function selectModule(name) {
    if (running) return;
    current = name;
    tabs.forEach(tab => {
      const active = tab.dataset.module === name;
      tab.classList.toggle("active", active);
      tab.setAttribute("aria-selected", String(active));
    });
    updateHeader();
    instruction.classList.remove("hidden");
    live.classList.add("hidden");
    results.classList.add("hidden");
    restart.classList.add("hidden");
    clearLive();
    feedback.textContent = "Educational performance demonstration — not a clinical or diagnostic assessment.";
  }

  tabs.forEach(tab => tab.addEventListener("click", () => selectModule(tab.dataset.module)));

  function randomPosition(el, padding = 30) {
    const rect = stage.getBoundingClientRect();
    const maxX = Math.max(padding, rect.width - el.offsetWidth - padding);
    const maxY = Math.max(padding, rect.height - el.offsetHeight - padding);
    el.style.left = `${padding + Math.random() * Math.max(0, maxX - padding)}px`;
    el.style.top = `${padding + Math.random() * Math.max(0, maxY - padding)}px`;
  }

  function setStageActive() {
    instruction.classList.add("hidden");
    live.classList.remove("hidden");
    clearLive();
  }

  function startGame() {
    clearTimers();
    clearLive();
    results.classList.add("hidden");
    running = true;
    round = 0;
    score = 0;
    moduleData = {
      correct: 0,
      attempts: 0,
      reactionTimes: [],
      decisions: 0,
      decisionCorrect: 0,
      pressureHits: 0,
      pressureMisses: 0,
      focusHits: 0
    };
    restart.classList.remove("hidden");
    scoreEl.textContent = "0";
    instruction.classList.add("hidden");
    live.classList.remove("hidden");

    if (current === "focus") startFocus();
    if (current === "reaction") startReaction();
    if (current === "pressure") startPressure();
    if (current === "decision") startDecision();
  }

  function finishModule() {
    clearTimers();
    clearLive();
    running = false;
    restart.classList.add("hidden");

    let value;
    if (current === "focus") {
      value = Math.round((moduleData.focusHits / modules.focus.rounds) * 100);
      sessionResults.focus = value;
    }
    if (current === "reaction") {
      const avg = moduleData.reactionTimes.length
        ? moduleData.reactionTimes.reduce((a,b)=>a+b,0) / moduleData.reactionTimes.length
        : 999;
      value = Math.max(1, Math.min(100, Math.round(100 - Math.max(0, avg - 180) / 5)));
      sessionResults.reaction = Math.round(avg);
    }
    if (current === "pressure") {
      value = Math.round((moduleData.pressureHits / modules.pressure.rounds) * 100);
      sessionResults.pressure = value;
    }
    if (current === "decision") {
      value = Math.round((moduleData.decisionCorrect / modules.decision.rounds) * 100);
      sessionResults.decision = value;
    }

    if (current === "focus") sessionResults.focus = Math.max(0, Math.min(100, value));
    if (current === "pressure") sessionResults.pressure = Math.max(0, Math.min(100, value));
    if (current === "decision") sessionResults.decision = Math.max(0, Math.min(100, value));

    showModuleSummary();
  }

  function showModuleSummary() {
    instruction.classList.remove("hidden");
    live.classList.add("hidden");
    const summary = {
      focus: `Focus accuracy: ${sessionResults.focus}%`,
      reaction: `Average reaction time: ${sessionResults.reaction} ms`,
      pressure: `Pressure-control accuracy: ${sessionResults.pressure}%`,
      decision: `Decision accuracy: ${sessionResults.decision}%`
    };
    instruction.querySelector("h4").textContent = "Challenge Complete";
    instruction.querySelector("p").textContent = summary[current];
    start.textContent = "Next Challenge";

    const order = ["focus","reaction","pressure","decision"];
    const next = order[(order.indexOf(current) + 1) % order.length];
    start.onclick = () => {
      if (current === "decision") {
        renderResults();
      } else {
        selectModule(next);
        startGame();
      }
    };
  }

  function startFocus() {
    setStageActive();
    nextFocusRound();
  }

  function nextFocusRound() {
    round++;
    roundEl.textContent = `${round}/${modules.focus.rounds}`;
    const target = document.createElement("button");
    target.className = "lab-target";
    target.textContent = modules.focus.targetWords[Math.floor(Math.random()*modules.focus.targetWords.length)];
    target.type = "button";
    randomPosition(target, 35);
    live.appendChild(target);

    const distractorCount = 4 + Math.min(5, Math.floor(round / 2));
    for (let i=0;i<distractorCount;i++) {
      const d = document.createElement("span");
      d.className = "lab-distractor";
      d.textContent = modules.focus.distractors[Math.floor(Math.random()*modules.focus.distractors.length)];
      randomPosition(d, 20);
      live.appendChild(d);
    }

    target.addEventListener("click", () => {
      moduleData.focusHits++;
      score += 10;
      scoreEl.textContent = score;
      if (round >= modules.focus.rounds) finishModule();
      else {
        clearLive();
        setTimeout(nextFocusRound, 160);
      }
    });

    roundTimer = setTimeout(() => {
      if (!running) return;
      if (round >= modules.focus.rounds) finishModule();
      else {
        clearLive();
        nextFocusRound();
      }
    }, Math.max(750, 1600 - round*50));
  }

  function startReaction() {
    setStageActive();
    round = 0;
    moduleData.reactionTimes = [];
    nextReactionRound();
  }

  function nextReactionRound() {
    round++;
    roundEl.textContent = `${round}/${modules.reaction.rounds}`;
    const wait = 650 + Math.random() * 1500;
    const waitText = document.createElement("div");
    waitText.className = "reaction-wait";
    waitText.textContent = "WAIT FOR GOLD";
    live.appendChild(waitText);

    roundTimer = setTimeout(() => {
      if (!running) return;
      clearLive();
      const target = document.createElement("button");
      target.className = "reaction-target";
      target.type = "button";
      target.textContent = "REACT";
      randomPosition(target, 60);
      live.appendChild(target);
      const shown = performance.now();

      const response = () => {
        const ms = Math.round(performance.now() - shown);
        moduleData.reactionTimes.push(ms);
        score += Math.max(5, Math.round(1000 / Math.max(1, ms) * 10));
        scoreEl.textContent = score;
        target.remove();
        if (round >= modules.reaction.rounds) finishModule();
        else setTimeout(nextReactionRound, 180);
      };
      target.addEventListener("click", response, {once:true});
    }, wait);
  }

  function startPressure() {
    setStageActive();
    nextPressureRound();
  }

  function nextPressureRound() {
    round++;
    roundEl.textContent = `${round}/${modules.pressure.rounds}`;
    const target = document.createElement("button");
    target.className = "pressure-target";
    target.type = "button";
    target.textContent = "EXECUTE";
    randomPosition(target, 30);
    live.appendChild(target);

    const danger = document.createElement("span");
    danger.className = "lab-distractor";
    danger.textContent = round > 5 ? "PRESSURE" : "DISTRACT";
    randomPosition(danger, 20);
    live.appendChild(danger);

    const windowMs = Math.max(450, 1350 - round * 75);
    roundTimer = setTimeout(() => {
      if (!running) return;
      moduleData.pressureMisses++;
      if (round >= modules.pressure.rounds) finishModule();
      else { clearLive(); nextPressureRound(); }
    }, windowMs);

    target.addEventListener("click", () => {
      clearTimeout(roundTimer);
      moduleData.pressureHits++;
      score += Math.max(5, 15 - round);
      scoreEl.textContent = score;
      if (round >= modules.pressure.rounds) finishModule();
      else { clearLive(); setTimeout(nextPressureRound, 120); }
    }, {once:true});
  }

  const decisions = [
    ["Final seconds. Your routine is disrupted. What is the best response?", "Return to one simple cue", "Add more technical thoughts", true],
    ["You make an early mistake. What next?", "Reset and execute the next action", "Keep replaying the mistake", true],
    ["Crowd noise spikes before execution. What helps?", "Anchor attention to the process", "Fight the noise mentally", true],
    ["Confidence drops after a poor attempt. What is useful?", "Use a familiar reset routine", "Change everything immediately", true],
    ["You feel highly activated before performance. What is the priority?", "Regulate and focus on controllables", "Try to eliminate every feeling", true],
    ["A teammate makes an error. What helps the team?", "Clear, constructive communication", "Blame the mistake", true],
    ["Your plan stops working. What should you do?", "Adapt while keeping the objective", "Freeze because the plan changed", true],
    ["You have limited time to decide. What matters most?", "Use a trained decision cue", "Search for a perfect answer", true]
  ];

  function startDecision() {
    setStageActive();
    nextDecisionRound();
  }

  function nextDecisionRound() {
    round++;
    roundEl.textContent = `${round}/${modules.decision.rounds}`;
    const item = decisions[round-1];
    const card = document.createElement("div");
    card.className = "decision-card";
    card.innerHTML = `<h4>${item[0]}</h4><p>Choose within the performance window.</p>`;
    const options = document.createElement("div");
    options.className = "decision-options";

    [item[1], item[2]].forEach((text, idx) => {
      const b = document.createElement("button");
      b.className = "decision-option";
      b.type = "button";
      b.textContent = text;
      b.addEventListener("click", () => {
        moduleData.decisions++;
        if (idx === 0) {
          moduleData.decisionCorrect++;
          score += 12;
        } else score = Math.max(0, score - 4);
        scoreEl.textContent = score;
        if (round >= modules.decision.rounds) finishModule();
        else { clearLive(); setTimeout(nextDecisionRound, 150); }
      }, {once:true});
      options.appendChild(b);
    });
    card.appendChild(options);
    live.appendChild(card);

    roundTimer = setTimeout(() => {
      if (!running) return;
      if (round >= modules.decision.rounds) finishModule();
      else { clearLive(); nextDecisionRound(); }
    }, 3500);
  }

  function renderResults() {
    clearTimers();
    running = false;
    clearLive();
    instruction.classList.add("hidden");
    live.classList.add("hidden");
    restart.classList.add("hidden");
    results.classList.remove("hidden");

    $("result-focus").textContent = `${sessionResults.focus ?? "—"}%`;
    $("result-reaction").textContent = sessionResults.reaction ? `${sessionResults.reaction} ms` : "—";
    $("result-decision").textContent = `${sessionResults.decision ?? "—"}%`;
    $("result-pressure").textContent = `${sessionResults.pressure ?? "—"}%`;

    const focus = sessionResults.focus || 0;
    const decision = sessionResults.decision || 0;
    const pressure = sessionResults.pressure || 0;
    const reactionScore = sessionResults.reaction ? Math.max(0, Math.min(100, 100 - Math.max(0, sessionResults.reaction - 180) / 5)) : 0;
    const consistency = Math.round((focus + decision + pressure + reactionScore) / 4);

    $("result-consistency").textContent = `${consistency}%`;
    $("performance-state").textContent =
      consistency >= 85 ? "STRONG PERFORMANCE" :
      consistency >= 70 ? "SOLID FOUNDATION" :
      consistency >= 50 ? "BUILDING CONTROL" : "TRAINING OPPORTUNITY";

    feedback.textContent = "Session complete. Results are illustrative and not diagnostic.";
  }

  function resetAll() {
    clearTimers();
    running = false;
    sessionResults = {focus:null,reaction:null,decision:null,pressure:null};
    results.classList.add("hidden");
    selectModule("focus");
    start.textContent = "Start Challenge";
    start.onclick = startGame;
  }

  start.addEventListener("click", startGame);
  restart.addEventListener("click", resetAll);
  runAgain.addEventListener("click", resetAll);

  // Ensure normal click behaviour after module summaries.
  selectModule("focus");
})();
