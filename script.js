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
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealItems.forEach(item => observer.observe(item));
  } else {
    revealItems.forEach(item => item.classList.add("is-visible"));
  }

  const sportData = {
    archery: {
      eyebrow: "ARCHERY · PRECISION", title: "Precision under pressure.",
      text: "Attention control, arousal regulation, routine consistency, breathing, visualisation and trust in execution can become central when small changes can affect the outcome.",
      demands: ["01 · Arousal", "02 · Attention", "03 · Routine", "04 · Execution"],
      image: "assets/sports/archery.jpg", alt: "Archery athlete in a focused performance environment", caption: "FOCUS · PRECISION · COMPOSURE", tags: ["Archery", "Precision sport", "Competition preparation"]
    },
    cricket: {
      eyebrow: "CRICKET · DECISION-MAKING", title: "Stay connected to the next ball.",
      text: "Waiting, changing match situations, role demands and consequence require flexible attention, emotional control and the ability to reset between deliveries or innings moments.",
      demands: ["01 · Patience", "02 · Decisions", "03 · Reset", "04 · Composure"],
      image: "assets/sports/cricket.jpg", alt: "Cricket athlete in a stadium", caption: "DECISION · COMPOSURE · EXECUTION", tags: ["Cricket", "Decision-making", "Pressure moments"]
    },
    badminton: {
      eyebrow: "BADMINTON · REACTION", title: "Reset between points.",
      text: "Fast transitions, errors, fatigue and short recovery windows make the ability to refocus and return to the next decision especially important.",
      demands: ["01 · Reset", "02 · Focus", "03 · Reaction", "04 · Adaptability"],
      image: "assets/sports/badminton.jpg", alt: "Badminton athlete in motion", caption: "REACTION · ADAPTABILITY · FOCUS", tags: ["Badminton", "Reaction speed", "Adaptability"]
    },
    athletics: {
      eyebrow: "ATHLETICS · PREPARATION", title: "Prepare the response before the start.",
      text: "Performance preparation, attentional control, routines and emotional regulation can help athletes stay connected to the process before and during high-demand competition moments.",
      demands: ["01 · Preparation", "02 · Focus", "03 · Routine", "04 · Resilience"],
      image: "assets/sports/athletics.jpg", alt: "Athlete preparing to sprint", caption: "PREPARATION · FOCUS · RESILIENCE", tags: ["Athletics", "Performance preparation", "Mental toughness"]
    },
    shooting: {
      eyebrow: "SHOOTING · CONCENTRATION", title: "Make composure repeatable.",
      text: "Precision, concentration, routine consistency and control of arousal can be central when execution depends on small, repeatable decisions.",
      demands: ["01 · Concentration", "02 · Control", "03 · Routine", "04 · Consistency"],
      image: "assets/sports/shooting.jpg", alt: "Shooting athlete in a controlled stance", caption: "CONCENTRATION · CONTROL · CONSISTENCY", tags: ["Shooting", "Concentration", "Precision"]
    },
    other: {
      eyebrow: "OTHER SPORTS · BROADER PERFORMANCE", title: "Different sports. Transferable mental skills.",
      text: "Mind Lead also works across gymnastics, football, basketball, swimming, squash, table tennis, chess and other sporting environments, adapting the work to the demands of the sport.",
      demands: ["01 · Adaptability", "02 · Focus", "03 · Regulation", "04 · Decision-making"],
      image: "assets/backgrounds/stadium.jpg", alt: "Multi-sport stadium performance environment", caption: "ADAPTABILITY · FOCUS · COMPOSURE", tags: ["Gymnastics", "Football", "Basketball", "Swimming", "Squash", "Table tennis", "Chess", "And more"]
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

  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
});
