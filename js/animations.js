document.addEventListener("DOMContentLoaded", () => {
  /* ================= SCROLL REVEAL ================= */

  const revealElements = document.querySelectorAll(".reveal");

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );

  revealElements.forEach((element) => revealObserver.observe(element));

  /* ================= HERO HIGHLIGHT ================= */

  const highlight = document.querySelector(".highlight");

  if (highlight) {
    setTimeout(() => {
      highlight.classList.add("visible");
    }, 1000);
  }

  /* ================= TECH STACK TABS ================= */

  const tabs = document.querySelectorAll(".tech-tab");
  const panels = document.querySelectorAll(".tech-panel");

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const target = tab.dataset.target;

      tabs.forEach((item) => item.classList.remove("active"));
      panels.forEach((panel) => panel.classList.remove("active"));

      tab.classList.add("active");

      const targetPanel = document.querySelector(`[data-panel="${target}"]`);
      if (targetPanel) targetPanel.classList.add("active");
    });
  });

  /* ================= HEADER ACTIVE SECTION ================= */

  const navLinks = document.querySelectorAll(".nav-link");
  const sections = document.querySelectorAll("main section[id]");

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        navLinks.forEach((link) => {
          const target = link.getAttribute("href");
          if (target === `#${entry.target.id}`) {
            link.classList.add("active");
          } else {
            link.classList.remove("active");
          }
        });
      });
    },
    { threshold: 0.25, rootMargin: "-20% 0px -60% 0px" }
  );

  sections.forEach((section) => sectionObserver.observe(section));

  /* ================= MOBILE MENU ================= */

  const mobileButton = document.querySelector(".mobile-menu");
  const nav = document.querySelector(".nav");

  if (mobileButton && nav) {
    mobileButton.addEventListener("click", () => {
      nav.classList.toggle("mobile-open");
    });

    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        nav.classList.remove("mobile-open");
      });
    });
  }

  /* ================= PROJECT IMAGE PARALLAX ================= */

  const projectImages = document.querySelectorAll(".project-image, .modal-visual");

  projectImages.forEach((image) => {
    image.addEventListener("mousemove", (event) => {
      const rect = image.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = (y - centerY) / 45;
      const rotateY = (centerX - x) / 45;

      image.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    image.addEventListener("mouseleave", () => {
      image.style.transform = "";
    });
  });

  /* ================= SMOOTH SCROLL ================= */

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");
      if (targetId === "#") {
        event.preventDefault();
        return;
      }

      const target = document.querySelector(targetId);
      if (!target) return;

      event.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
});
