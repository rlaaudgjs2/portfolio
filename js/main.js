function renderProfile() {
  document.getElementById("profile-photo").src = PROFILE.photo;
  document.getElementById("profile-name").textContent = PROFILE.name;
  document.getElementById("profile-title").textContent = PROFILE.title;
  document.getElementById("profile-bio").textContent = PROFILE.bio;

  const contact = document.getElementById("profile-contact");
  PROFILE.contact.forEach((item) => {
    const a = document.createElement("a");
    a.href = item.href;
    a.textContent = item.value;
    a.className = "contact-link";
    if (item.href.startsWith("http")) {
      a.target = "_blank";
      a.rel = "noopener noreferrer";
    }
    contact.appendChild(a);
  });

  const educationList = document.getElementById("education-list");
  PROFILE.education.forEach((edu) => {
    const li = document.createElement("li");
    li.innerHTML = `<span class="info-period">${edu.period}</span><span class="info-detail">${edu.school} · ${edu.detail}</span>`;
    educationList.appendChild(li);
  });

  const certList = document.getElementById("certification-list");
  PROFILE.certifications.forEach((cert) => {
    const li = document.createElement("li");
    li.innerHTML = `<span class="info-period">${cert.date}</span><span class="info-detail">${cert.name}</span>`;
    certList.appendChild(li);
  });
}

function renderProjects() {
  const timeline = document.getElementById("project-timeline");
  const sorted = [...PROJECTS].sort((a, b) => b.year - a.year);

  sorted.forEach((project) => {
    const item = document.createElement("article");
    item.className = "project-item";
    item.tabIndex = 0;
    item.setAttribute("role", "button");
    item.setAttribute("aria-label", `${project.year}년 프로젝트 ${project.title} 자세히 보기`);

    item.innerHTML = `
      <div class="project-year">${project.year}</div>
      <div class="project-card">
        <img class="project-thumb" src="${project.thumbnail}" alt="${project.title}" />
        <div class="project-card-body">
          <h3>${project.title}</h3>
          <p>${project.summary}</p>
        </div>
      </div>
    `;

    const open = () => openModal(project);
    item.addEventListener("click", open);
    item.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        open();
      }
    });

    timeline.appendChild(item);
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

document.getElementById("footer-year").textContent = new Date().getFullYear();

renderProfile();
renderProjects();
initModal();
