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

  /* ---- holographic medallion ----
     Smooth continuous 3D flip on the X axis. As you scroll down the hero it
     tumbles a little faster, zooms in to fill the screen, then fades so the
     page below stays readable. */
  const holo = document.querySelector(".holo");
  const spinner = document.querySelector(".holo-spin");
  const hero = document.querySelector(".hero");
  if (spinner && !reduce) {
    let t0 = performance.now();
    let curScale = 1, curOpacity = 1;

    function frame(now) {
      const elapsed = now - t0;                 // ms since load
      const heroH = (hero ? hero.offsetHeight : window.innerHeight);
      const p = Math.min(1, Math.max(0, window.scrollY / (heroH * 0.9))); // 0→1 through hero

      // smooth base spin on the Y axis (~60°/s) + extra turn driven by scroll depth
      const spinY = elapsed * 0.06 + p * 320;

      // zoom in to fill the screen, then fade out over the last stretch
      const targetScale = 1 + p * 4.6;
      const targetOpacity = p < 0.68 ? 1 : Math.max(0, 1 - (p - 0.68) / 0.32);

      curScale += (targetScale - curScale) * 0.12;
      curOpacity += (targetOpacity - curOpacity) * 0.16;

      spinner.style.transform =
        "rotateY(" + spinY.toFixed(2) + "deg) scale(" + curScale.toFixed(3) + ")";
      if (holo) holo.style.opacity = curOpacity.toFixed(3);

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
