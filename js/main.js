function renderHero() {
  document.getElementById("hero-greeting").textContent = PROFILE.heroGreeting;
  document.getElementById("hero-title").innerHTML = `개발자<br />${PROFILE.name}입니다.`;
  document.getElementById("hero-description").textContent = PROFILE.heroDescription;
}

function renderContactList(containerId) {
  const container = document.getElementById(containerId);
  PROFILE.contact.forEach((item) => {
    const a = document.createElement("a");
    a.href = item.href;
    a.textContent = item.value;
    a.className = "contact-link";
    if (item.href.startsWith("http")) {
      a.target = "_blank";
      a.rel = "noopener noreferrer";
    }
    container.appendChild(a);
  });
}

function renderAbout() {
  document.getElementById("profile-photo").src = PROFILE.photo;
  document.getElementById("profile-bio").textContent = PROFILE.bio;

  renderContactList("profile-contact");
  renderContactList("footer-contact");

  const educationList = document.getElementById("education-list");
  PROFILE.education.forEach((edu, i) => {
    const li = document.createElement("li");
    li.className = "reveal";
    li.style.transitionDelay = `${i * 80}ms`;
    li.innerHTML = `<span class="info-period">${edu.period}</span><span class="info-detail">${edu.school} · ${edu.detail}</span>`;
    educationList.appendChild(li);
  });

  const certList = document.getElementById("certification-list");
  PROFILE.certifications.forEach((cert, i) => {
    const li = document.createElement("li");
    li.className = "reveal";
    li.style.transitionDelay = `${i * 80}ms`;
    li.innerHTML = `<span class="info-period">${cert.date}</span><span class="info-detail">${cert.name}</span>`;
    certList.appendChild(li);
  });
}

function renderProjects() {
  const list = document.getElementById("project-list");
  const sorted = [...PROJECTS].sort((a, b) => b.year - a.year);

  sorted.forEach((project, i) => {
    const row = document.createElement("article");
    row.className = "project-row reveal";
    row.style.transitionDelay = `${i * 100}ms`;
    row.tabIndex = 0;
    row.setAttribute("role", "button");
    row.setAttribute("aria-label", `${project.year}년 프로젝트 ${project.title} 자세히 보기`);

    const tags = (project.stack || [])
      .map((tag) => `<span class="tag">${tag}</span>`)
      .join("");

    row.innerHTML = `
      <div class="project-row-index">${String(i + 1).padStart(2, "0")}</div>
      <div class="project-row-content">
        <span class="project-row-year">${project.year}</span>
        <h3>${project.title}</h3>
        <p>${project.summary}</p>
        ${tags ? `<div class="project-row-tags">${tags}</div>` : ""}
      </div>
      <div class="project-row-media">
        <img src="${project.thumbnail}" alt="${project.title}" />
      </div>
    `;

    const open = () => openModal(project);
    row.addEventListener("click", open);
    row.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        open();
      }
    });

    list.appendChild(row);
  });
}

function openModal(project) {
  const modal = document.getElementById("project-modal");
  document.getElementById("modal-photo").src = project.thumbnail;
  document.getElementById("modal-photo").alt = project.title;
  document.getElementById("modal-year").textContent = project.year;
  document.getElementById("modal-title").textContent = project.title;
  document.getElementById("modal-content").textContent = project.mainContent;
  document.getElementById("modal-scale").textContent = project.scale;

  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  const modal = document.getElementById("project-modal");
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

function initModal() {
  document.querySelectorAll("[data-close-modal]").forEach((el) => {
    el.addEventListener("click", closeModal);
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });
}

function initReveal() {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
  );

  document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
}

document.getElementById("footer-year").textContent = new Date().getFullYear();

renderHero();
renderAbout();
renderProjects();
initModal();
initReveal();
