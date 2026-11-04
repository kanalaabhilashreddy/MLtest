document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector(".site-header");
  const menuToggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".main-nav");

  const setHeader = () => header?.classList.toggle("scrolled", window.scrollY > 10);
  setHeader();
  window.addEventListener("scroll", setHeader, { passive: true });

  menuToggle?.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(open));
    document.body.classList.toggle("menu-open", open);
  });

  nav?.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      menuToggle?.setAttribute("aria-expanded", "false");
      document.body.classList.remove("menu-open");
    });
  });

  const revealItems = document.querySelectorAll(".reveal");
  const revealAll = () => revealItems.forEach(item => item.classList.add("is-visible"));
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: "0px 0px -40px 0px" });
    revealItems.forEach(item => observer.observe(item));
    // Fail safe for cached/blocked browsers where observers do not fire.
    window.setTimeout(revealAll, 1800);
  } else {
    revealAll();
  }

  // WHAT WE WORK ON: one-at-a-time mental-skills explorer.
  const topicData = {
    focus: { eyebrow: "01 · ATTENTIONAL CONTROL", title: "Focus on the cue that matters.", text: "Stay connected to the relevant cue when distractions, noise and changing demands compete for attention.", image: "assets/what-we-work-on/focused-mind-powerful-game.png", alt: "Visual representing focus and attention", caption: "FOCUS · ATTENTION · AWARENESS", highlights: ["01 · Selective attention", "02 · Refocusing", "03 · Cue awareness", "04 · Consistency"], tags: ["Focus", "Attention", "Performance routines"] },
    confidence: { eyebrow: "02 · SELF-BELIEF", title: "Build trust in preparation and execution.", text: "Strengthen belief in the process, recognise personal strengths and build confidence that is grounded in preparation rather than outcome alone.", image: "assets/what-we-work-on/focused-preparation-to-peak-performance.png", alt: "Visual representing confidence and self-belief", caption: "CONFIDENCE · TRUST · EXECUTION", highlights: ["01 · Self-belief", "02 · Preparation", "03 · Process trust", "04 · Execution"], tags: ["Confidence", "Self-belief", "Preparation"] },
    pressure: { eyebrow: "03 · PRESSURE & AROUSAL", title: "Respond to pressure with greater control.", text: "Recognise pressure responses and learn practical ways to regulate arousal, stay composed and keep attention connected to the task.", image: "assets/what-we-work-on/from-chaos-to-calm-focus-in-motion.png", alt: "Visual representing pressure and arousal regulation", caption: "PRESSURE · REGULATION · COMPOSURE", highlights: ["01 · Arousal awareness", "02 · Breathing", "03 · Regulation", "04 · Composure"], tags: ["Pressure", "Arousal", "Self-regulation"] },
    error: { eyebrow: "04 · ERROR RECOVERY", title: "Reset after the mistake. Reconnect with the next action.", text: "Develop reliable reset routines that help athletes acknowledge an error, release unhelpful attention and return to the next performance cue.", image: "assets/what-we-work-on/athletes-reset-to-victory.png", alt: "Visual representing error recovery and resetting", caption: "RESET · RECOVER · RECONNECT", highlights: ["01 · Acknowledge", "02 · Release", "03 · Refocus", "04 · Next action"], tags: ["Error recovery", "Reset routines", "Resilience"] },
    emotion: { eyebrow: "05 · EMOTIONAL REGULATION", title: "Understand the trigger. Choose the response.", text: "Notice emotional patterns, identify triggers and practise responses that support clear decisions and effective performance in demanding moments.", image: "assets/what-we-work-on/from-stress-to-purposeful-action.png", alt: "Visual representing emotional regulation", caption: "AWARENESS · RESPONSE · BALANCE", highlights: ["01 · Trigger awareness", "02 · Emotional cues", "03 · Response choice", "04 · Regulation"], tags: ["Emotional regulation", "Awareness", "Response"] },
    competition: { eyebrow: "06 · COMPETITION PREPARATION", title: "Prepare the routine before the moment arrives.", text: "Build practical routines, attentional cues and competition plans that help athletes prepare for different scenarios and stay connected to their process.", image: "assets/what-we-work-on/athletes-pre-performance-routine.png", alt: "Visual representing competition preparation", caption: "PREPARATION · ROUTINE · READINESS", highlights: ["01 · Pre-performance routine", "02 · Cue words", "03 · Scenario planning", "04 · Readiness"], tags: ["Competition", "Routines", "Preparation"] },
    decision: { eyebrow: "07 · DECISION-MAKING", title: "Make clearer decisions when demands increase.", text: "Strengthen awareness, flexible thinking and decision-making when time, fatigue, uncertainty or consequence increase.", image: "assets/what-we-work-on/from-overthinking-to-decisive-action.png", alt: "Visual representing decision-making under pressure", caption: "AWARENESS · CHOICE · ADAPTATION", highlights: ["01 · Situational awareness", "02 · Flexible thinking", "03 · Decision cues", "04 · Adaptability"], tags: ["Decision-making", "Awareness", "Adaptability"] },
    recovery: { eyebrow: "08 · RECOVERY & SUSTAINABLE PERFORMANCE", title: "Build performance that can be sustained.", text: "Support recovery, reflection and healthy performance habits so that development does not depend on staying in a constant state of pressure.", image: "assets/what-we-work-on/purple-gold-athletic-growth-journey.png", alt: "Visual representing recovery and sustainable performance", caption: "RECOVERY · BALANCE · LONG-TERM GROWTH", highlights: ["01 · Recovery habits", "02 · Reflection", "03 · Load awareness", "04 · Sustainable growth"], tags: ["Recovery", "Wellbeing", "Sustainable performance"] }
  };
  const topicButtons = [...document.querySelectorAll(".topic-tab")];
  const topicImage = document.getElementById("topic-image");
  const topicCaption = document.getElementById("topic-caption");
  const topicEyebrow = document.getElementById("topic-eyebrow");
  const topicTitle = document.getElementById("topic-title");
  const topicDescription = document.getElementById("topic-description");
  const topicHighlights = document.getElementById("topic-highlights");
  const topicTags = document.getElementById("topic-tags");
  const topicPanel = document.getElementById("topic-panel");
  const setTopic = key => {
    const data = topicData[key];
    if (!data) return;
    topicButtons.forEach(button => {
      const active = button.dataset.topic === key;
      button.classList.toggle("active", active);
      button.setAttribute("aria-selected", String(active));
      button.tabIndex = active ? 0 : -1;
    });
    if (topicImage) { topicImage.src = data.image; topicImage.alt = data.alt; }
    if (topicCaption) topicCaption.textContent = data.caption;
    if (topicEyebrow) topicEyebrow.textContent = data.eyebrow;
    if (topicTitle) topicTitle.textContent = data.title;
    if (topicDescription) topicDescription.textContent = data.text;
    if (topicHighlights) topicHighlights.innerHTML = data.highlights.map(item => `<span>${item}</span>`).join("");
    if (topicTags) topicTags.innerHTML = data.tags.map(item => `<span>${item}</span>`).join("");
    if (topicPanel) topicPanel.setAttribute("aria-labelledby", `topic-tab-${key}`);
  };
  topicButtons.forEach((button, index) => {
    button.id = `topic-tab-${button.dataset.topic}`;
    button.addEventListener("click", () => setTopic(button.dataset.topic));
    button.addEventListener("keydown", event => {
      if (!["ArrowRight", "ArrowLeft", "Home", "End"].includes(event.key)) return;
      event.preventDefault();
      const next = event.key === "Home" ? 0 : event.key === "End" ? topicButtons.length - 1 : (index + (event.key === "ArrowRight" ? 1 : -1) + topicButtons.length) % topicButtons.length;
      topicButtons[next].focus();
      setTopic(topicButtons[next].dataset.topic);
    });
  });
  setTopic("focus");


  // WAYS TO WORK WITH US: compact tabbed service explorer.
  const serviceData = {
    individual: {
      eyebrow: "01 · INDIVIDUAL PERFORMANCE",
      title: "Mental training built around the athlete.",
      text: "Structured one-to-one mental training shaped around the athlete's sport, role, current needs and competition demands.",
      image: "assets/ways-to-work-with-us/holistic-athletic-mindset-coaching.png",
      alt: "Visual representing individual athlete confidence and performance",
      caption: "INDIVIDUAL · SPORT-SPECIFIC · PRACTICAL",
      highlights: ["01 · Initial performance assessment", "02 · Individual mental-skills training", "03 · Competition preparation", "04 · Review and follow-up"],
      note: "For athletes at different stages of development.",
      link: "individual-performance.html",
      linkText: "Explore individual work →"
    },
    teams: {
      eyebrow: "02 · ACADEMIES & TEAM ENVIRONMENTS",
      title: "Make mental training part of everyday development.",
      text: "Embedded mental training for academies and teams that want psychology to become part of the training environment, not a last-minute intervention.",
      image: "assets/ways-to-work-with-us/integrated-athlete-mental-training-session.png",
      alt: "Visual representing team preparation and performance",
      caption: "ACADEMIES · TEAMS · DEVELOPMENT",
      highlights: ["01 · Group mental-training sessions", "02 · Sport-specific modules", "03 · Coach alignment", "04 · Competition support"],
      note: "Programmes shaped around the sport and environment.",
      link: "academies.html",
      linkText: "Discuss an academy programme →"
    },
    people: {
      eyebrow: "03 · COACHES, PARENTS & ORGANISATIONS",
      title: "Support the people who shape performance.",
      text: "Education and consultation for the people around the athlete, helping create environments that support learning, confidence and sustainable performance.",
      image: "assets/ways-to-work-with-us/collaborative-sports-psychology-team-meeting.png",
      alt: "Visual representing people and performance development",
      caption: "COACHES · PARENTS · ORGANISATIONS",
      highlights: ["01 · Coach education", "02 · Parent workshops", "03 · Athlete-management support", "04 · High-performance consultation"],
      note: "Practical support for the wider performance system.",
      link: "services.html",
      linkText: "Explore consultation support →"
    }
  };
  const serviceButtons = [...document.querySelectorAll(".service-tab")];
  const serviceImage = document.getElementById("service-image");
  const serviceCaption = document.getElementById("service-caption");
  const serviceEyebrow = document.getElementById("service-eyebrow");
  const serviceTitle = document.getElementById("service-title");
  const serviceDescription = document.getElementById("service-description");
  const serviceHighlights = document.getElementById("service-highlights");
  const serviceNote = document.getElementById("service-note");
  const serviceLink = document.getElementById("service-link");
  const servicePanel = document.getElementById("service-panel");
  const setService = key => {
    const data = serviceData[key];
    if (!data) return;
    serviceButtons.forEach(button => {
      const active = button.dataset.service === key;
      button.classList.toggle("active", active);
      button.setAttribute("aria-selected", String(active));
      button.tabIndex = active ? 0 : -1;
    });
    if (serviceImage) { serviceImage.src = data.image; serviceImage.alt = data.alt; }
    if (serviceCaption) serviceCaption.textContent = data.caption;
    if (serviceEyebrow) serviceEyebrow.textContent = data.eyebrow;
    if (serviceTitle) serviceTitle.textContent = data.title;
    if (serviceDescription) serviceDescription.textContent = data.text;
    if (serviceHighlights) serviceHighlights.innerHTML = data.highlights.map(item => `<span>${item}</span>`).join("");
    if (serviceNote) serviceNote.textContent = data.note;
    if (serviceLink) { serviceLink.href = data.link; serviceLink.textContent = data.linkText; }
    if (servicePanel) servicePanel.setAttribute("aria-labelledby", `service-tab-${key}`);
  };
  serviceButtons.forEach((button, index) => {
    button.addEventListener("click", () => setService(button.dataset.service));
    button.addEventListener("keydown", event => {
      if (!["ArrowRight", "ArrowLeft", "Home", "End"].includes(event.key)) return;
      event.preventDefault();
      const next = event.key === "Home" ? 0 : event.key === "End" ? serviceButtons.length - 1 : (index + (event.key === "ArrowRight" ? 1 : -1) + serviceButtons.length) % serviceButtons.length;
      serviceButtons[next].focus();
      setService(serviceButtons[next].dataset.service);
    });
  });
  setService("individual");

  // One-at-a-time story selector: documented work, athlete voices and founder.
  const storyData = {
    sahil: {
      eyebrow: "DOCUMENTED WORK · THE INDIAN EXPRESS", title: "Sahil Jadhav",
      role: "Compound archer · Mental performance",
      text: "The Indian Express profiled Sahil Jadhav's work with Mind Lead founder and sports psychologist Kanala Hindola, including the mental training, confidence-building and routines developed over three years of working together.",
      image: "https://thebridge.in/h-upload/2025/07/26/62486-copy-of-live-blog.webp",
      alt: "Sahil Jadhav wearing his World University Games gold medal",
      caption: "ARCHERY",
      highlights: ["01 · Confidence", "02 · Mental routines", "03 · Breathing and visualisation", "04 · Performing under pressure"],
      tags: ["Archery", "Mental performance"],
      link: "https://indianexpress.com/article/sports/sahil-jadhav-psychologist-two-gold-asiad-la-olympics-archery-10914514/",
      linkText: "Read the Indian Express feature ↗"
    },
    prathamesh: {
      eyebrow: "DOCUMENTED WORK · HINDUSTAN TIMES", title: "Prathamesh Jawkar",
      role: "Archer · Competition preparation",
      text: "Hindustan Times reported Jawkar's work with sports psychologist Hindola Kanala and described mindfulness and visualisation in his preparation.",
      image: "https://im.rediff.com/sports/2023/sep/09prthamesh.jpg?h=900&w=670", alt: "Prathamesh Jawkar celebrating at an archery competition", caption: "ARCHERY",
      highlights: ["01 · Mindfulness", "02 · Visualisation", "03 · Preparation", "04 · Competition"], tags: ["Archery"],
      link: "https://www.hindustantimes.com/sports/others/prathamesh-jawkars-archery-journey-a-chance-start-a-filmy-trigger-and-golden-finish-at-asian-games-101699003930531.html", linkText: "Read the report ↗"
    },
    madhura: {
      eyebrow: "DOCUMENTED WORK · WORLD ARCHERY", title: "Madhura Dhamangaonkar",
      role: "Archer · Mental conditioning",
      text: "World Archery documented mental conditioning support during Dhamangaonkar's comeback, including breathing and visualisation.",
      image: "https://www.worldarchery.sport/sites/default/files/styles/header_desktop/public/2025-07/DA6_4966.jpg.webp?h=ae7ebcda&itok=CbiVIIOe", alt: "Madhura Dhamangaonkar competing in compound archery", caption: "ARCHERY",
      highlights: ["01 · Breathing", "02 · Visualisation", "03 · Resilience", "04 · Comeback"], tags: ["Archery", "Mental conditioning"],
      link: "https://www.worldarchery.sport/news/202006/madhura-dhamangaonkar-journey-perseverance-resilience-and-positive-mindset", linkText: "Read World Archery ↗"
    },
    priyansh: {
      eyebrow: "ATHLETE VOICE · ARCHERY", title: "Priyansh",
      role: "Archer · Mental preparation",
      text: "“She made me think I was a champion until I became one.”",
      image: "https://thebridge.in/h-upload/2023/07/09/48574-screenshot-2023-07-09t094240896.jpg", alt: "Priyansh drawing his compound bow in competition", caption: "ARCHERY",
      highlights: ["01 · Self-belief", "02 · Confidence", "03 · Preparation", "04 · Performance"], tags: ["Athlete voice", "Archery"],
      link: "", linkText: ""
    },
    vidyadhar: {
      eyebrow: "ATHLETE VOICE · CRICKET", title: "Vidyadhar Patil",
      role: "Cricketer · Daily mental skills",
      text: "“I follow mental skills on a daily basis and it is one of the keys to doing well.”",
      image: "https://media.crictracker.com/media/featureimage/2019/12/Vidyadhar-Patil-1.jpg", alt: "Vidyadhar Patil bowling in cricket training", caption: "CRICKET",
      highlights: ["01 · Daily practice", "02 · Mental skills", "03 · Consistency", "04 · Performance"], tags: ["Athlete voice", "Cricket"],
      link: "", linkText: ""
    }
  };
  const storyButtons = [...document.querySelectorAll(".story-pill")];
  const storyImage = document.getElementById("story-image");
  const storyCaption = document.getElementById("story-photo-caption");
  const storyEyebrow = document.getElementById("story-eyebrow");
  const storyTitle = document.getElementById("story-title");
  const storyRole = document.getElementById("story-role");
  const storyText = document.getElementById("story-text");
  const storyHighlights = document.getElementById("story-highlights");
  const storyTags = document.getElementById("story-tags");
  const storyLink = document.getElementById("story-link");
  const storyPanel = document.getElementById("story-panel");

  const setStory = (key) => {
    const data = storyData[key];
    if (!data || key === "hindola") return;
    storyButtons.forEach(button => {
      const active = button.dataset.story === key;
      button.classList.toggle("active", active);
      button.setAttribute("aria-selected", String(active));
      button.tabIndex = active ? 0 : -1;
    });
    if (storyImage) {
      storyImage.onerror = null;
      storyImage.classList.remove("founder-image", "image-fallback");
      storyImage.alt = data.alt;
      storyImage.src = data.image;
      if (key === "sahil") {
        const sahilFallbacks = [
          "https://media.newindianexpress.com/newindianexpress/2025-07-29/j0z8thff/archery2.jpg?auto=format%2Ccompress&enlarge=true&fit=max&h=900&w=1200",
          "https://www.worldarchery.sport/sites/default/files/styles/header_desktop/public/2025-07/250723_RR25_Archery_Essen_EG_0038_1.jpeg?h=0650bbfd&itok=xbMCCc3u"
        ];
        let fallbackIndex = 0;
        storyImage.onerror = () => {
          if (fallbackIndex < sahilFallbacks.length) {
            storyImage.src = sahilFallbacks[fallbackIndex++];
          } else {
            storyImage.onerror = null;
            storyImage.classList.add("image-fallback");
          }
        };
      }
    }
    if (storyCaption) storyCaption.textContent = data.caption;
    if (storyEyebrow) storyEyebrow.textContent = data.eyebrow;
    if (storyTitle) storyTitle.textContent = data.title;
    if (storyRole) storyRole.textContent = data.role;
    if (storyText) storyText.textContent = data.text;
    if (storyHighlights) storyHighlights.innerHTML = data.highlights.map(item => `<span>${item}</span>`).join("");
    if (storyTags) storyTags.innerHTML = data.tags.map(item => `<span>${item}</span>`).join("");
    if (storyLink) {
      storyLink.href = data.link || "#";
      storyLink.textContent = data.linkText;
      storyLink.hidden = !data.link;
    }
    if (storyPanel) storyPanel.setAttribute("aria-labelledby", `story-tab-${key}`);
  };
  storyButtons.forEach((button, index) => {
    button.addEventListener("click", () => setStory(button.dataset.story));
    button.addEventListener("keydown", event => {
      if (!["ArrowRight", "ArrowLeft", "Home", "End"].includes(event.key)) return;
      event.preventDefault();
      const next = event.key === "Home" ? 0 : event.key === "End" ? storyButtons.length - 1 : (index + (event.key === "ArrowRight" ? 1 : -1) + storyButtons.length) % storyButtons.length;
      storyButtons[next].focus();
      setStory(storyButtons[next].dataset.story);
    });
  });
  setStory("sahil");

  document.querySelectorAll(".faq-item button").forEach(button => {
    button.addEventListener("click", () => {
      const item = button.closest(".faq-item");
      const isOpen = item.classList.contains("open");

      document.querySelectorAll(".faq-item").forEach(other => {
        other.classList.remove("open");
        other.querySelector("button")?.setAttribute("aria-expanded", "false");
      });

      if (!isOpen) {
        item.classList.add("open");
        button.setAttribute("aria-expanded", "true");
      }
    });
  });

  // Keep the UI usable when a remote editorial image is unavailable.
  document.querySelectorAll("img").forEach(img => {
    img.addEventListener("error", () => {
      if (img.id === "story-image") return;
      if (img.dataset.fallbackApplied) return;
      img.dataset.fallbackApplied = "true";
      const fallback = img.closest(".quote-media, .founder-image-wrap, .hero-split-visual")?.querySelector("img[data-local-fallback]");
      if (fallback && fallback.src !== img.src) img.src = fallback.src;
      else img.classList.add("image-fallback");
    }, { once: true });
  });

  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
});

/* Mind Lead interaction layer: refined custom cursor for precise desktop pointers. */
(() => {
  const finePointer = window.matchMedia?.('(pointer: fine)').matches;
  const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  if (!finePointer || reducedMotion) return;

  const ring = document.createElement('div');
  const dot = document.createElement('div');
  ring.className = 'cursor-ring';
  dot.className = 'cursor-dot';
  ring.setAttribute('aria-hidden', 'true');
  dot.setAttribute('aria-hidden', 'true');
  document.body.append(ring, dot);
  document.body.classList.add('cursor-ready');

  let x = window.innerWidth / 2;
  let y = window.innerHeight / 2;
  let ringX = x;
  let ringY = y;
  let raf = 0;

  const render = () => {
    ringX += (x - ringX) * 0.18;
    ringY += (y - ringY) * 0.18;
    ring.style.transform = `translate3d(${ringX}px,${ringY}px,0)`;
    dot.style.transform = `translate3d(${x}px,${y}px,0)`;
    raf = requestAnimationFrame(render);
  };
  render();

  window.addEventListener('mousemove', (event) => {
    x = event.clientX;
    y = event.clientY;
    ring.style.opacity = '1';
    dot.style.opacity = '1';
  }, { passive: true });

  document.addEventListener('mouseover', (event) => {
    const target = event.target.closest?.('a, button, [role="button"]');
    if (target) ring.classList.add('is-hover');
  });
  document.addEventListener('mouseout', (event) => {
    const target = event.target.closest?.('a, button, [role="button"]');
    if (target && !target.contains(event.relatedTarget)) ring.classList.remove('is-hover');
  });
  document.addEventListener('mousedown', () => ring.classList.add('is-click'));
  document.addEventListener('mouseup', () => ring.classList.remove('is-click'));

  window.addEventListener('blur', () => {
    ring.style.opacity = '0';
    dot.style.opacity = '0';
  });
  window.addEventListener('focus', () => {
    ring.style.opacity = '1';
    dot.style.opacity = '1';
  });

  window.addEventListener('pagehide', () => cancelAnimationFrame(raf), { once: true });
})();


// Continuous, accessible organisation-logo marquee.
document.addEventListener("DOMContentLoaded", () => {
  const rail = document.querySelector(".partner-logo-scroll");
  const track = rail?.querySelector(".partner-logo-track");
  const original = track?.querySelector(".partner-logo-grid");
  if (!rail || !track || !original || track.dataset.loopReady) return;
  track.dataset.loopReady = "true";
  const duplicate = original.cloneNode(true);
  duplicate.classList.remove("reveal", "is-visible");
  duplicate.setAttribute("aria-hidden", "true");
  duplicate.querySelectorAll("a, button, [tabindex]").forEach(item => item.setAttribute("tabindex", "-1"));
  duplicate.querySelectorAll("img").forEach(img => img.setAttribute("alt", ""));
  track.appendChild(duplicate);
  rail.addEventListener("focusin", () => rail.classList.add("is-paused"));
  rail.addEventListener("focusout", event => { if (!rail.contains(event.relatedTarget)) rail.classList.remove("is-paused"); });
  rail.addEventListener("touchstart", () => rail.classList.add("is-paused"), { passive: true });
  rail.addEventListener("touchend", () => rail.classList.remove("is-paused"), { passive: true });
});


// Automatic horizontal logo scrolling on mobile, with pause-on-interaction.
document.addEventListener("DOMContentLoaded", () => {
  const grid = document.querySelector(".partner-logo-grid");
  if (!grid || grid.dataset.autoScrollReady === "true") return;
  grid.dataset.autoScrollReady = "true";

  const mobileQuery = window.matchMedia("(max-width: 700px)");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let rafId = 0;
  let lastTime = 0;
  let loopWidth = 0;
  let paused = false;
  let active = false;

  const originalCards = [...grid.children];
  if (originalCards.length < 3) return;

  const cloneFragment = document.createDocumentFragment();
  originalCards.forEach(card => {
    const clone = card.cloneNode(true);
    clone.setAttribute("aria-hidden", "true");
    clone.removeAttribute("title");
    clone.querySelectorAll("[id]").forEach(el => el.removeAttribute("id"));
    clone.querySelectorAll("a, button, [tabindex]").forEach(el => el.setAttribute("tabindex", "-1"));
    clone.querySelectorAll("img").forEach(img => img.setAttribute("alt", ""));
    cloneFragment.appendChild(clone);
  });
  grid.appendChild(cloneFragment);

  const measure = () => {
    loopWidth = grid.scrollWidth / 2;
  };

  const stop = () => {
    active = false;
    if (rafId) cancelAnimationFrame(rafId);
    rafId = 0;
    lastTime = 0;
  };

  const tick = timestamp => {
    if (!active) return;
    if (!paused && loopWidth > 0) {
      if (!lastTime) lastTime = timestamp;
      const elapsed = Math.min(timestamp - lastTime, 40);
      lastTime = timestamp;
      // Approximately 22 pixels per second: calm, unobtrusive movement.
      grid.scrollLeft += elapsed * 0.022;
      if (grid.scrollLeft >= loopWidth) grid.scrollLeft -= loopWidth;
    } else {
      lastTime = timestamp;
    }
    rafId = requestAnimationFrame(tick);
  };

  const start = () => {
    stop();
    if (!mobileQuery.matches || reduceMotion.matches) return;
    measure();
    if (loopWidth <= grid.clientWidth + 8) return;
    active = true;
    rafId = requestAnimationFrame(tick);
  };

  grid.addEventListener("pointerenter", () => { paused = true; });
  grid.addEventListener("pointerleave", () => { paused = false; });
  grid.addEventListener("touchstart", () => { paused = true; }, { passive: true });
  grid.addEventListener("touchend", () => { paused = false; }, { passive: true });
  grid.addEventListener("touchcancel", () => { paused = false; }, { passive: true });
  grid.addEventListener("focusin", () => { paused = true; });
  grid.addEventListener("focusout", event => {
    if (!grid.contains(event.relatedTarget)) paused = false;
  });

  if (mobileQuery.addEventListener) {
    mobileQuery.addEventListener("change", start);
    reduceMotion.addEventListener("change", start);
  } else {
    mobileQuery.addListener(start);
    reduceMotion.addListener(start);
  }
  window.addEventListener("resize", () => {
    measure();
    if (mobileQuery.matches && !active) start();
  }, { passive: true });
  window.addEventListener("pagehide", stop, { once: true });
  start();
});
