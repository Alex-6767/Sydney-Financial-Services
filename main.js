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
     At rest: a slow, gentle Y-axis spin.
     On scroll, the page pins (the hero is sticky over a tall wrapper) so it
     appears to hold still while the emblem speeds up, grows to engulf the
     whole screen, and fades. After that the page carries on scrolling. */
  const pin = document.querySelector(".hero-pin");
  const holo = document.querySelector(".holo");
  const spinner = document.querySelector(".holo-spin");
  const heroCopy = document.querySelector(".hero-copy");
  const scrollHint = document.querySelector(".scroll-hint");

  if (spinner && pin && !reduce) {
    const t0 = performance.now();
    let curScale = 1, curOpacity = 1;

    function frame(now) {
      const elapsed = now - t0;

      // progress through the pinned zone: 0 at top, 1 as the pin releases
      const total = pin.offsetHeight - window.innerHeight;
      const scrolled = Math.min(total, Math.max(0, -pin.getBoundingClientRect().top));
      const p = total > 0 ? scrolled / total : 0;

      // gentle constant spin (~18s/turn) that speeds up as you scroll in
      const spinY = elapsed * 0.02 + p * 540;

      // ease-in growth so it stays calm at first, then rushes to engulf
      const targetScale = 1 + p * p * 11;
      // hold fully visible while it grows, then dissolve near the end
      const targetOpacity = p < 0.62 ? 1 : Math.max(0, 1 - (p - 0.62) / 0.34);

      curScale += (targetScale - curScale) * 0.14;
      curOpacity += (targetOpacity - curOpacity) * 0.18;

      spinner.style.transform =
        "rotateY(" + spinY.toFixed(2) + "deg) scale(" + curScale.toFixed(3) + ")";
      if (holo) holo.style.opacity = curOpacity.toFixed(3);

      // fade the headline/buttons out quickly as the emblem takes over
      const textOp = Math.max(0, 1 - p / 0.26);
      if (heroCopy) heroCopy.style.opacity = textOp.toFixed(3);
      if (scrollHint) scrollHint.style.opacity = textOp.toFixed(3);

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
