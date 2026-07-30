/* Sydney Financial Services — interactions */
(function () {
  "use strict";

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- sticky header state ---- */
  const header = document.querySelector(".site-header");
  const onScrollHeader = () => {
    if (!header) return;
    header.classList.toggle("scrolled", window.scrollY > 12);
  };
  onScrollHeader();
  window.addEventListener("scroll", onScrollHeader, { passive: true });

  /* ---- mobile nav ---- */
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".nav");
  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("mobile-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    nav.querySelectorAll(".nav-links a").forEach((a) =>
      a.addEventListener("click", () => nav.classList.remove("mobile-open"))
    );
  }

  /* ---- scroll reveals ---- */
  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !reduce) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("in"));
  }

  /* ---- holographic medallion: spins continuously, accelerates on scroll ----
     angular speed = base + (scroll depth * depthFactor) + short-lived scroll velocity kick.
     The further down the page, the faster the steady rotation. */
  const spinner = document.querySelector(".holo-spin");
  if (spinner && !reduce) {
    let angle = 0;
    let lastScroll = window.scrollY;
    let velocity = 0;     // deg/frame kick from scroll movement
    let lastT = performance.now();

    const BASE = 0.12;        // idle deg per frame
    const DEPTH = 2.6;        // max extra deg per frame at full scroll depth
    const KICK = 0.06;        // how strongly raw scroll movement adds spin
    const FRICTION = 0.92;    // velocity decay

    window.addEventListener(
      "scroll",
      () => {
        const now = window.scrollY;
        velocity += Math.abs(now - lastScroll) * KICK;
        lastScroll = now;
      },
      { passive: true }
    );

    const maxScroll = () =>
      Math.max(1, document.documentElement.scrollHeight - window.innerHeight);

    function frame(t) {
      const dt = Math.min(2.5, (t - lastT) / 16.67); // normalise to ~60fps
      lastT = t;

      const depth = Math.min(1, window.scrollY / maxScroll()); // 0 → 1 down the page
      const speed = BASE + depth * DEPTH + velocity;

      angle = (angle + speed * dt) % 360;
      spinner.style.transform = "rotate(" + angle.toFixed(2) + "deg)";

      velocity *= FRICTION;
      if (velocity < 0.001) velocity = 0;

      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  /* ---- contact form (front-end only; opens mail client) ---- */
  const form = document.querySelector("#enquiry");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const data = new FormData(form);
      const name = (data.get("name") || "").toString().trim();
      const email = (data.get("email") || "").toString().trim();
      const phone = (data.get("phone") || "").toString().trim();
      const loan = (data.get("loan") || "").toString().trim();
      const msg = (data.get("message") || "").toString().trim();
      const subject = encodeURIComponent("Loan enquiry — " + (loan || "General"));
      const body = encodeURIComponent(
        `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nLoan type: ${loan}\n\n${msg}`
      );
      window.location.href =
        `mailto:costa@sydneyfinancialservices.au?subject=${subject}&body=${body}`;
      const note = form.querySelector(".form-note");
      if (note) note.textContent = "Opening your email app to send this enquiry…";
    });
  }

  /* ---- year in footer ---- */
  document.querySelectorAll("[data-year]").forEach((el) => {
    el.textContent = new Date().getFullYear();
  });
})();
