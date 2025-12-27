// Global layout utilities for BUILD WITH AI

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
window.addEventListener("DOMContentLoaded", () => {
  layout.renderHeader();
  layout.renderFooter();
});
