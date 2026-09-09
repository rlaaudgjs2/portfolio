/* ================= HERO ================= */

function renderHero() {
  document.getElementById("hero-greeting").textContent = PROFILE.heroGreeting;
  document.getElementById("hero-name").textContent = PROFILE.name;
  document.getElementById("hero-description").textContent = PROFILE.heroDescription;

  const logo = document.getElementById("logo");
  const initial = PROFILE.name ? PROFILE.name.charAt(0) : "D";
  logo.innerHTML = `${initial}<span>.</span>`;
}

/* ================= ABOUT ================= */

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
  document.getElementById("about-name-title").textContent = `${PROFILE.name} · ${PROFILE.title}`;
  document.getElementById("profile-bio").textContent = PROFILE.bio;

  renderContactList("profile-contact");

  const educationList = document.getElementById("education-list");
  PROFILE.education.forEach((edu) => {
    const li = document.createElement("li");
    const title = edu.detail ? `${edu.school} · ${edu.detail}` : edu.school;
    li.innerHTML = `<span class="info-period">${edu.period}</span><span class="info-title">${title}</span>`;
    educationList.appendChild(li);
  });

  const certList = document.getElementById("certification-list");
  PROFILE.certifications.forEach((cert) => {
    const li = document.createElement("li");
    li.innerHTML = `<span class="info-period">${cert.date}</span><span class="info-title">${cert.name}</span>`;
    certList.appendChild(li);
  });
}

/* ================= PROJECTS ================= */

function categoryLabel(project) {
  return project.type && project.type.includes("개인") ? "SOLO PROJECT" : "TEAM PROJECT";
}

function projectVisualHTML(index, project) {
  const kind = index % 3;
  const label = String(index + 1).padStart(2, "0");

  if (kind === 0) {
    return `
      <div class="phone">
        <div class="phone-screen">
          <span class="phone-dot"></span>
          <strong>${label}</strong>
          <small>${(project.stack && project.stack[0]) || ""}</small>
        </div>
      </div>
    `;
  }

  if (kind === 1) {
    return `<div class="abstract-ui"><div></div><div></div><div></div></div>`;
  }

  return `<div class="talk-lines"><i></i><i></i><i></i><i></i></div>`;
}

function renderTags(container, items) {
  container.innerHTML = "";
  (items || []).forEach((item) => {
    const span = document.createElement("span");
    span.textContent = item;
    container.appendChild(span);
  });
}

function renderProjects() {
  const list = document.getElementById("project-list");

  PROJECT_DETAILS.forEach((project, index) => {
    const article = document.createElement("article");
    article.className = "project reveal";
    article.tabIndex = 0;
    article.setAttribute("role", "button");
    article.setAttribute("aria-label", `${project.title} 자세히 보기`);

    article.innerHTML = `
      <div class="project-meta">
        <span>${String(index + 1).padStart(2, "0")}</span>
        <span>${categoryLabel(project)}</span>
        <span>${project.period}</span>
      </div>
      <div class="project-content">
        <div class="project-info">
          <h3>${project.title}</h3>
          <p class="project-subtitle">${project.subtitle}</p>
          <p class="project-description">${project.overview}</p>
          <div class="tags" data-tags></div>
          <button type="button" class="project-link">자세히 보기<span>→</span></button>
        </div>
        <div class="project-image ${project.id}">
          <span class="image-label">${project.title.toUpperCase()}</span>
          ${projectVisualHTML(index, project)}
        </div>
      </div>
    `;

    renderTags(article.querySelector("[data-tags]"), project.stack);

    const open = () => openModal(project, index);
    article.addEventListener("click", open);
    article.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        open();
      }
    });

    list.appendChild(article);
  });
}

/* ================= EXPERIENCE ================= */

function renderExperience() {
  const timeline = document.getElementById("timeline-list");

  PROFILE.education.forEach((edu) => {
    const item = document.createElement("div");
    item.className = "timeline-item reveal";
    item.innerHTML = `
      <span class="timeline-date">${edu.period}</span>
      <div>
        <h3>${edu.school}</h3>
        <p>${edu.detail}</p>
      </div>
    `;
    timeline.appendChild(item);
  });

  PROFILE.certifications.forEach((cert) => {
    const item = document.createElement("div");
    item.className = "timeline-item reveal";
    const detail = cert.issuer
      ? `${cert.issuer}${cert.regNo ? ` · 등록번호 ${cert.regNo}` : ""}`
      : "자격증 취득";
    item.innerHTML = `
      <span class="timeline-date">${cert.date}</span>
      <div>
        <h3>${cert.name}</h3>
        <p>${detail}</p>
      </div>
    `;
    timeline.appendChild(item);
  });
}

/* ================= AWARDS & ACTIVITIES ================= */

function renderAwards() {
  const list = document.getElementById("awards-list");

  AWARDS.forEach((award) => {
    const item = document.createElement("div");
    item.className = "timeline-item reveal";
    const detail = award.description ? `${award.org} · ${award.description}` : award.org;
    item.innerHTML = `
      <span class="timeline-date">${award.date}</span>
      <div>
        <h3>${award.title}</h3>
        <p>${detail}</p>
      </div>
    `;
    list.appendChild(item);
  });

  ACTIVITIES.forEach((activity) => {
    const item = document.createElement("div");
    item.className = "timeline-item reveal";
    const detail = activity.description ? `${activity.org} · ${activity.description}` : activity.org;
    item.innerHTML = `
      <span class="timeline-date">${activity.period}</span>
      <div>
        <h3>${activity.title}</h3>
        <p>${detail}</p>
      </div>
    `;
    list.appendChild(item);
  });
}

/* ================= TECH ================= */

function renderTech() {
  const tabsContainer = document.getElementById("tech-tabs");
  const panelsContainer = document.getElementById("tech-panels");

  const allItems = [...new Set(TECH_STACK.categories.flatMap((cat) => cat.items))];

  const allTab = document.createElement("button");
  allTab.type = "button";
  allTab.className = "tech-tab active";
  allTab.dataset.target = "all";
  allTab.textContent = "전체";
  tabsContainer.appendChild(allTab);

  const allPanel = document.createElement("div");
  allPanel.className = "tech-panel active";
  allPanel.dataset.panel = "all";
  allPanel.innerHTML = allItems.map((item) => `<span>${item}</span>`).join("");
  panelsContainer.appendChild(allPanel);

  TECH_STACK.categories.forEach((cat) => {
    const tab = document.createElement("button");
    tab.type = "button";
    tab.className = "tech-tab";
    tab.dataset.target = cat.id;
    tab.textContent = cat.label;
    tabsContainer.appendChild(tab);

    const panel = document.createElement("div");
    panel.className = "tech-panel";
    panel.dataset.panel = cat.id;
    panel.innerHTML = cat.items.map((item) => `<span>${item}</span>`).join("");
    panelsContainer.appendChild(panel);
  });
}

/* ================= CONTACT ================= */

function renderContact() {
  document.getElementById("contact-description").textContent = PROFILE.contactDescription;

  const email = PROFILE.contact.find((item) => item.label === "Email");
  if (email) {
    const emailLink = document.getElementById("contact-email");
    emailLink.href = email.href;
    document.getElementById("contact-email-text").textContent = email.value;
  }

  const socialLinks = document.getElementById("social-links");
  PROFILE.contact
    .filter((item) => item.label !== "Email")
    .forEach((item) => {
      const a = document.createElement("a");
      a.href = item.href;
      a.textContent = item.value;
      if (item.href.startsWith("http")) {
        a.target = "_blank";
        a.rel = "noopener noreferrer";
      }
      socialLinks.appendChild(a);
    });
}

/* ================= FOOTER ================= */

function renderFooter() {
  document.getElementById("footer-copy").textContent = `© ${new Date().getFullYear()}`;
  document.getElementById("footer-name").textContent = PROFILE.name;
}

/* ================= MODAL ================= */

function openModal(project, index) {
  const modal = document.getElementById("project-modal");

  const visual = document.getElementById("modal-visual");
  visual.className = `modal-visual ${project.id}`;
  visual.innerHTML = `
    <span class="image-label">${project.title.toUpperCase()}</span>
    ${projectVisualHTML(index, project)}
  `;

  document.getElementById("modal-meta").textContent = `${categoryLabel(project)} · ${project.period}`;
  document.getElementById("modal-title").textContent = project.title;
  document.getElementById("modal-subtitle").textContent = project.subtitle;
  document.getElementById("modal-overview").textContent = project.overview;
  document.getElementById("modal-scale").textContent = project.scale;

  renderTags(document.getElementById("modal-tags"), project.stack);

  const linksContainer = document.getElementById("modal-links");
  linksContainer.innerHTML = "";
  (project.links || []).forEach((link) => {
    const a = document.createElement("a");
    a.href = link.href;
    a.textContent = link.label;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    linksContainer.appendChild(a);
  });

  const highlightsField = document.getElementById("modal-highlights-field");
  const highlightsList = document.getElementById("modal-highlights");
  highlightsList.innerHTML = "";
  if (project.highlights && project.highlights.length) {
    project.highlights.forEach((h) => {
      const li = document.createElement("li");
      li.innerHTML = `<strong>${h.title}</strong><span>${h.what || h.how || ""}</span>`;
      highlightsList.appendChild(li);
    });
    highlightsField.hidden = false;
  } else {
    highlightsField.hidden = true;
  }

  const troubleshootingField = document.getElementById("modal-troubleshooting-field");
  const troubleshootingList = document.getElementById("modal-troubleshooting");
  troubleshootingList.innerHTML = "";
  if (project.troubleshooting && project.troubleshooting.length) {
    project.troubleshooting.forEach((t) => {
      const li = document.createElement("li");
      li.innerHTML = `<strong>${t.title}</strong><span>${t.solution}</span>`;
      troubleshootingList.appendChild(li);
    });
    troubleshootingField.hidden = false;
  } else {
    troubleshootingField.hidden = true;
  }

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

renderHero();
renderAbout();
renderProjects();
renderExperience();
renderAwards();
renderTech();
renderContact();
renderFooter();
initModal();
