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

  const sportData = {
    archery: {
      eyebrow: "ARCHERY · PRECISION", title: "Precision under pressure.",
      text: "Attention control, arousal regulation, routine consistency, breathing, visualisation and trust in execution can become central when small changes can affect the outcome.",
      demands: ["01 · Arousal", "02 · Attention", "03 · Routine", "04 · Execution"],
      image: "assets/mental-performance/mental_performance_01_01.jpg", alt: "Archery athlete in a focused performance environment", caption: "FOCUS · PRECISION · COMPOSURE", tags: ["Archery", "Precision sport", "Competition preparation"]
    },
    cricket: {
      eyebrow: "CRICKET · DECISION-MAKING", title: "Stay connected to the next ball.",
      text: "Waiting, changing match situations, role demands and consequence require flexible attention, emotional control and the ability to reset between deliveries or innings moments.",
      demands: ["01 · Patience", "02 · Decisions", "03 · Reset", "04 · Composure"],
      image: "assets/mental-performance/mental_performance_01_03.jpg", alt: "Cricket athlete in a stadium", caption: "DECISION · COMPOSURE · EXECUTION", tags: ["Cricket", "Decision-making", "Pressure moments"]
    },
    badminton: {
      eyebrow: "BADMINTON · REACTION", title: "Reset between points.",
      text: "Fast transitions, errors, fatigue and short recovery windows make the ability to refocus and return to the next decision especially important.",
      demands: ["01 · Reset", "02 · Focus", "03 · Reaction", "04 · Adaptability"],
      image: "assets/mental-performance/mental_performance_01_04.jpg", alt: "Badminton athlete in motion", caption: "REACTION · ADAPTABILITY · FOCUS", tags: ["Badminton", "Reaction speed", "Adaptability"]
    },
    athletics: {
      eyebrow: "ATHLETICS · PREPARATION", title: "Prepare the response before the start.",
      text: "Performance preparation, attentional control, routines and emotional regulation can help athletes stay connected to the process before and during high-demand competition moments.",
      demands: ["01 · Preparation", "02 · Focus", "03 · Routine", "04 · Resilience"],
      image: "assets/mental-performance/mental_performance_02_04.jpg", alt: "Athlete preparing to sprint", caption: "PREPARATION · FOCUS · RESILIENCE", tags: ["Athletics", "Performance preparation", "Mental toughness"]
    },
    shooting: {
      eyebrow: "SHOOTING · CONCENTRATION", title: "Make composure repeatable.",
      text: "Precision, concentration, routine consistency and control of arousal can be central when execution depends on small, repeatable decisions.",
      demands: ["01 · Concentration", "02 · Control", "03 · Routine", "04 · Consistency"],
      image: "assets/mental-performance/mental_performance_01_05.jpg", alt: "Shooting athlete in a controlled stance", caption: "CONCENTRATION · CONTROL · CONSISTENCY", tags: ["Shooting", "Concentration", "Precision"]
    },
    other: {
      eyebrow: "OTHER SPORTS · BROADER PERFORMANCE", title: "Different sports. Transferable mental skills.",
      text: "Mind Lead also works across gymnastics, football, basketball, swimming, squash, table tennis, chess and other sporting environments, adapting the work to the demands of the sport.",
      demands: ["01 · Adaptability", "02 · Focus", "03 · Regulation", "04 · Decision-making"],
      image: "assets/mental-performance/mental_performance_03_01.jpg", alt: "Multi-sport stadium performance environment", caption: "ADAPTABILITY · FOCUS · COMPOSURE", tags: ["Gymnastics", "Football", "Basketball", "Swimming", "Squash", "Table tennis", "Chess", "And more"]
    }
  };

  const sportButtons = document.querySelectorAll(".sport-pill");
  const sportEyebrow = document.getElementById("sport-eyebrow");
  const sportTitle = document.getElementById("sport-title");
  const sportText = document.getElementById("sport-text");
  const sportImage = document.getElementById("sport-image");
  const sportCaption = document.getElementById("sport-photo-caption");
  const sportList = document.getElementById("sport-list");
  const demandNodes = document.querySelectorAll("#sport-demands span");

  const setSport = (key) => {
    const data = sportData[key];
    if (!data) return;
    sportButtons.forEach(btn => {
      const active = btn.dataset.sport === key;
      btn.classList.toggle("active", active);
      btn.setAttribute("aria-selected", String(active));
    });
    if (sportEyebrow) sportEyebrow.textContent = data.eyebrow;
    if (sportTitle) sportTitle.textContent = data.title;
    if (sportText) sportText.textContent = data.text;
    if (sportImage) { sportImage.src = data.image; sportImage.alt = data.alt; }
    if (sportCaption) sportCaption.textContent = data.caption;
    demandNodes.forEach((node, index) => node.textContent = data.demands[index] || "");
    if (sportList) sportList.innerHTML = data.tags.map(tag => `<span>${tag}</span>`).join("");
  };

  sportButtons.forEach(button => button.addEventListener("click", () => setSport(button.dataset.sport)));

  document.querySelectorAll("[data-sport-link]").forEach(link => {
    link.addEventListener("click", () => {
      const key = link.dataset.sportLink;
      if (!sportData[key]) return;
      setSport(key);
      requestAnimationFrame(() => {
        document.getElementById("sports")?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });
  });

  setSport("archery");

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
