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

/* ================= PRINT RESUME (PDF 저장) ================= */

function joinLinks(links) {
  return (links || []).map((l) => `${l.label}: ${l.href}`).join("  ·  ");
}

function printHighlightHTML(h) {
  const parts = [];
  if (h.why) parts.push(`<p><b>Why</b> — ${h.why}</p>`);
  if (h.what) parts.push(`<p><b>What</b> — ${h.what}</p>`);
  if (h.how) parts.push(`<p><b>How</b> — ${h.how}</p>`);
  const code = h.code ? `<pre>${h.code.snippet}</pre>` : "";
  return `<div class="pr-item"><p class="pr-item-title">${h.title}</p>${parts.join("")}${code}</div>`;
}

function printTroubleshootingHTML(t) {
  const parts = [];
  if (t.problem) parts.push(`<p><b>Problem</b> — ${t.problem}</p>`);
  if (t.cause) parts.push(`<p><b>Cause</b> — ${t.cause}</p>`);
  if (t.solution) parts.push(`<p><b>Solution</b> — ${t.solution}</p>`);
  const code = t.code ? `<pre>${t.code.snippet}</pre>` : "";
  return `<div class="pr-item"><p class="pr-item-title">${t.title}</p>${parts.join("")}${code}</div>`;
}

function printDecisionHTML(d) {
  const parts = [`<p><b>Decision</b> — ${d.decision}</p>`];
  if (d.reason) parts.push(`<p><b>Reason</b> — ${d.reason}</p>`);
  if (d.tradeoff) parts.push(`<p><b>Trade-off</b> — ${d.tradeoff}</p>`);
  return `<div class="pr-item"><p class="pr-item-title">${d.title}</p>${parts.join("")}</div>`;
}

function printProjectHTML(project) {
  const sections = [];

  sections.push(`
    <h3>${project.title} — ${project.subtitle}</h3>
    <p class="pr-meta">${project.type} · ${project.period}</p>
    <p class="pr-overview">${project.overview}</p>
    <p class="pr-stack"><b>Stack</b> — ${(project.stack || []).join(", ")}</p>
    <p class="pr-stack"><b>규모</b> — ${project.scale}</p>
    ${project.role ? `<p class="pr-stack"><b>역할</b> — ${project.role}</p>` : ""}
    ${project.links && project.links.length ? `<p class="pr-links"><b>Links</b> — ${joinLinks(project.links)}</p>` : ""}
  `);

  if (project.highlights && project.highlights.length) {
    sections.push(`<h4>주요 구현</h4>${project.highlights.map(printHighlightHTML).join("")}`);
  }
  if (project.troubleshooting && project.troubleshooting.length) {
    sections.push(`<h4>트러블슈팅</h4>${project.troubleshooting.map(printTroubleshootingHTML).join("")}`);
  }
  if (project.decisions && project.decisions.length) {
    sections.push(`<h4>기술적 의사결정</h4>${project.decisions.map(printDecisionHTML).join("")}`);
  }
  if (project.learnings && project.learnings.length) {
    sections.push(`<h4>배운 점</h4><ul>${project.learnings.map((l) => `<li>${l}</li>`).join("")}</ul>`);
  }
  if (project.minorFeatures && project.minorFeatures.length) {
    sections.push(`<h4>기타 기능</h4><ul>${project.minorFeatures.map((f) => `<li>${f}</li>`).join("")}</ul>`);
  }
  if (project.minorTroubleshooting && project.minorTroubleshooting.length) {
    sections.push(
      `<h4>기타 트러블슈팅</h4><ul>${project.minorTroubleshooting
        .map((t) => `<li><b>${t.problem}</b> — 원인: ${t.cause} / 해결: ${t.solution}</li>`)
        .join("")}</ul>`
    );
  }
  if (project.needsInput && project.needsInput.length) {
    sections.push(`<h4>추가 예정 항목</h4><ul>${project.needsInput.map((n) => `<li>${n}</li>`).join("")}</ul>`);
  }

  return `<article class="pr-project">${sections.join("")}</article>`;
}

function renderPrintResume() {
  const container = document.getElementById("print-resume");

  const contactLine = PROFILE.contact.map((c) => `${c.label}: ${c.value}`).join("  ·  ");

  const educationHTML = PROFILE.education
    .map((edu) => `<li><b>${edu.period}</b> — ${edu.school}${edu.detail ? ` · ${edu.detail}` : ""}</li>`)
    .join("");

  const certHTML = PROFILE.certifications
    .map(
      (c) =>
        `<li><b>${c.date}</b> — ${c.name}${c.issuer ? ` · ${c.issuer}` : ""}${c.regNo ? ` · 등록번호 ${c.regNo}` : ""}</li>`
    )
    .join("");

  const awardsHTML = AWARDS.map(
    (a) => `<li><b>${a.date}</b> — ${a.title} · ${a.org}${a.description ? ` · ${a.description}` : ""}</li>`
  ).join("");

  const activitiesHTML = ACTIVITIES.map(
    (a) => `<li><b>${a.period}</b> — ${a.title} · ${a.org}${a.description ? ` · ${a.description}` : ""}</li>`
  ).join("");

  const techHTML = TECH_STACK.categories
    .map((cat) => `<li><b>${cat.label}</b> — ${cat.items.join(", ")}</li>`)
    .join("");

  const projectsHTML = PROJECT_DETAILS.map(printProjectHTML).join("");

  container.innerHTML = `
    <header class="pr-header">
      <h1>${PROFILE.name}</h1>
      <p class="pr-title">${PROFILE.title}</p>
      <p class="pr-contact">${contactLine}</p>
    </header>

    <section class="pr-section">
      <h2>Bio</h2>
      <p>${PROFILE.bio}</p>
    </section>

    <section class="pr-section">
      <h2>학력</h2>
      <ul>${educationHTML}</ul>
    </section>

    <section class="pr-section">
      <h2>자격증</h2>
      <ul>${certHTML}</ul>
    </section>

    <section class="pr-section">
      <h2>수상</h2>
      <ul>${awardsHTML}</ul>
    </section>

    <section class="pr-section">
      <h2>교육 이수 및 대외활동</h2>
      <ul>${activitiesHTML}</ul>
    </section>

    <section class="pr-section">
      <h2>기술 스택</h2>
      <ul>${techHTML}</ul>
    </section>

    <section class="pr-section pr-projects">
      <h2>Projects</h2>
      ${projectsHTML}
    </section>
  `;
}

function initPrintResume() {
  const button = document.getElementById("footer-name-btn");
  if (!button) return;

  button.addEventListener("click", () => {
    document.body.classList.add("print-mode");
    window.print();
  });

  window.addEventListener("afterprint", () => {
    document.body.classList.remove("print-mode");
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
renderPrintResume();
initModal();
initPrintResume();
