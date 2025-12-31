// Global layout utilities for BUILD WITH AI
const API = {
  version: '/api/version',
  uiConfig: '/api/ui-config',
  templates: '/api/templates',
  announcements: '/api/announcements',
  generate: '/api/generate-template',
  domain: '/api/domain'
};

const layout = {
  renderHeader() {
    const header = document.querySelector("header");
    if (header) {
      header.innerHTML = `
        <div>BUILD WITH AI — Template Builder</div>
      `;
    }
  },

  renderFooter() {
    const footer = document.querySelector("footer");
    if (footer) {
      footer.innerHTML = `
        <div>© ${new Date().getFullYear()} BUILD WITH AI</div>
      `;
    }
  },

  openModal(id) {
    const modal = document.getElementById(id);
    if (modal) modal.classList.add("active");
  },

  closeModal(id) {
    const modal = document.getElementById(id);
    if (modal) modal.classList.remove("active");
  },

  showSkeleton(container) {
    if (!container) return;
    container.innerHTML = `
      <div class="skeleton" style="width: 80%"></div>
      <div class="skeleton" style="width: 60%"></div>
      <div class="skeleton" style="width: 90%"></div>
      <div class="skeleton" style="width: 70%"></div>
    `;
  }
};

// Auto-render header/footer on load
window.addEventListener("DOMContentLoaded", async () => {
  layout.renderHeader();
  layout.renderFooter();
  try {
    const res = await fetch(API.version);
    if (res && res.ok) {
      const j = await res.json();
      const header = document.querySelector('header');
      if (header && j && j.version) {
        const ver = document.createElement('div');
        ver.className = 'muted version-info';
        ver.textContent = `v ${j.version}`;
        ver.style.marginLeft = '12px';
        header.appendChild(ver);
      }
    }
  } catch (e) {
    // silent
  }
});
