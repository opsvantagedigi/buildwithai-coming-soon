/* =========================================================
   DOMAIN PURCHASE FLOW — BUILD WITH AI
   ========================================================= */

function applyDomainPurchaseFlow() {
  // Create modal overlay
  let modal = document.createElement("div");
  modal.className = "bwai-ai-modal-overlay";
  modal.style.display = "flex";
  modal.innerHTML = `
    <div class="bwai-ai-modal">
      <div class="bwai-ai-modal-header">
        <h2 class="bwai-ai-modal-title">Secure your domain now</h2>
        <button class="bwai-ai-modal-close" id="domain-modal-close">×</button>
      </div>
      <div class="bwai-ai-modal-step" id="domain-purchase-step">
        <form id="domain-purchase-form" class="bwai-layout-stack-md" autocomplete="off">
          <label class="bwai-text-accent">Domain Name</label>
          <input type="text" id="domain-purchase-input" class="bwai-input" placeholder="yourbrand.com" />
          <button class="bwai-btn bwai-btn--primary" id="domain-purchase-search">Check Availability</button>
        </form>
        <div id="domain-purchase-result" class="bwai-text-muted"></div>
        <button class="bwai-btn bwai-btn--primary" id="domain-purchase-register" style="display:none;">Register Domain</button>
        <div id="domain-purchase-register-result" class="bwai-text-muted"></div>
      </div>
    </div>
  `;
  document.body.appendChild(modal);

  // Close modal
  $("#domain-modal-close", modal).addEventListener("click", () => {
    modal.remove();
  });

  // Domain search
  const form = $("#domain-purchase-form", modal);
  const input = $("#domain-purchase-input", modal);
  const searchBtn = $("#domain-purchase-search", modal);
  const result = $("#domain-purchase-result", modal);
  const registerBtn = $("#domain-purchase-register", modal);
  const registerResult = $("#domain-purchase-register-result", modal);

  let lastDomain = "";
  let available = false;

  function showResult(type, message) {
    result.textContent = message;
    result.className = "bwai-text-muted";
    removeClass(result, "bwai-text-success");
    removeClass(result, "bwai-text-error");
    removeClass(result, "bwai-text-warning");
    if (type === "success") addClass(result, "bwai-text-success");
    if (type === "error") addClass(result, "bwai-text-error");
    if (type === "warning") addClass(result, "bwai-text-warning");
  }

  function showRegisterResult(type, message) {
    registerResult.textContent = message;
    registerResult.className = "bwai-text-muted";
    removeClass(registerResult, "bwai-text-success");
    removeClass(registerResult, "bwai-text-error");
    removeClass(registerResult, "bwai-text-warning");
    if (type === "success") addClass(registerResult, "bwai-text-success");
    if (type === "error") addClass(registerResult, "bwai-text-error");
    if (type === "warning") addClass(registerResult, "bwai-text-warning");
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const domain = input.value.trim();
    if (!domain) {
      showResult("warning", "Please enter a domain name.");
      registerBtn.style.display = "none";
      return;
    }
    searchBtn.textContent = "Checking...";
    searchBtn.disabled = true;
    showResult("", "");
    registerBtn.style.display = "none";
    try {
      const res = await fetch("/domain/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain })
      });
      const data = await res.json();
      lastDomain = domain;
      available = !!data.available;
      if (available) {
        showResult("success", `Available — ${domain}`);
        registerBtn.style.display = "inline-block";
      } else {
        showResult("error", `Taken — ${domain}`);
        registerBtn.style.display = "none";
      }
    } catch (err) {
      showResult("warning", "Error checking domain. Please try again.");
      registerBtn.style.display = "none";
    }
    searchBtn.textContent = "Check Availability";
    searchBtn.disabled = false;
  });

  registerBtn.addEventListener("click", async () => {
    registerBtn.textContent = "Registering...";
    registerBtn.disabled = true;
    showRegisterResult("", "");
    // Placeholder registration body
    const body = {
      domain: lastDomain,
      contact: {
        name: "AI User",
        email: "user@example.com",
        phone: "000-000-0000",
        address: "N/A"
      },
      nameservers: []
    };
    try {
      const res = await fetch("/domain/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      if (data.success) {
        showRegisterResult("success", "Domain registered successfully!");
      } else {
        showRegisterResult("error", data.message || "Registration failed.");
      }
    } catch (err) {
      showRegisterResult("warning", "Error registering domain. Please try again.");
    }
    registerBtn.textContent = "Register Domain";
    registerBtn.disabled = false;
  });
}
/* =========================================================
   BUILD WITH AI — Global Interactivity Layer (layout.js)
   Enterprise-grade behavior system for all pages
   ========================================================= */

/* ---------------------------------------------------------
   1. Utility helpers
   --------------------------------------------------------- */

const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => scope.querySelectorAll(selector);

function smoothScrollTo(el) {
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
}

function addClass(el, className) {
  if (el) el.classList.add(className);
}

function removeClass(el, className) {
  if (el) el.classList.remove(className);
}

/* ---------------------------------------------------------
   2. Template selection system
   --------------------------------------------------------- */

let selectedTemplate = null;

function selectTemplate(templateId) {
  const items = $$(".bwai-template-item");

  items.forEach(item => {
    removeClass(item, "bwai-template-item--active");
  });

  const active = $(`.bwai-template-item[data-template-id="${templateId}"]`);
  if (active) {
    addClass(active, "bwai-template-item--active");
    selectedTemplate = templateId;
  }

  console.log("Selected template:", selectedTemplate);
}

function initTemplateSelection() {
  const list = $("#template-list");
  if (!list) return;

  list.addEventListener("click", (e) => {
    const item = e.target.closest(".bwai-template-item");
    if (!item) return;

    const id = item.getAttribute("data-template-id");
    selectTemplate(id);
  });
}

/* ---------------------------------------------------------
   3. Smooth scroll for “Browse templates”
   --------------------------------------------------------- */

function initBrowseTemplates() {
  const btn = $("#btn-browse-templates");
  const section = $(".bwai-content-grid");

  if (!btn || !section) return;

  btn.addEventListener("click", () => {
    smoothScrollTo(section);
  });
}

/* ---------------------------------------------------------
   4. Preview link interactions
   --------------------------------------------------------- */

function initPreviewLink() {
  const link = $("#preview-cta-link");
  if (!link) return;

  link.addEventListener("click", (e) => {
    e.preventDefault();
    alert("Template preview routing will plug into your builder view.");
  });
}

/* ---------------------------------------------------------
   5. AI modal trigger (placeholder)
   --------------------------------------------------------- */

function initAIModalTriggers() {
  const startAI = $("#btn-start-ai");
  const ctaStartAI = $("#cta-start-ai");

  const trigger = () => {
    // Placeholder — will be replaced with real modal logic
    alert("AI generation flow will open here. Hook into /generate-template when ready.");
  };

  if (startAI) startAI.addEventListener("click", trigger);
  if (ctaStartAI) ctaStartAI.addEventListener("click", trigger);
}

/* ---------------------------------------------------------
   6. Dashboard navigation
   --------------------------------------------------------- */

function initDashboardNavigation() {
  const openDashboard = $("#cta-open-dashboard");
  if (!openDashboard) return;

  openDashboard.addEventListener("click", () => {
    window.location.href = "/dashboard.html";
  });
}

/* ---------------------------------------------------------
   7. Domain modal initialization
   --------------------------------------------------------- */

function initDomainModal() {
  const modal = document.getElementById('domain-modal');
  const openBtn = document.getElementById('open-domain-modal');
  const closeBtn = document.getElementById('modal-close-btn');
  const domainInput = document.getElementById('modal-domain-input');
  const searchBtn = document.getElementById('modal-domain-search-btn');
  const result = document.getElementById('modal-domain-result');
  // Registration panel elements
  const regPanel = document.getElementById('domain-registration-panel');
  const regName = document.getElementById('reg-name');
  const regEmail = document.getElementById('reg-email');
  const regPhone = document.getElementById('reg-phone');
  const regAddress = document.getElementById('reg-address');
  const regNs1 = document.getElementById('reg-ns1');
  const regNs2 = document.getElementById('reg-ns2');
  const regSubmitBtn = document.getElementById('reg-submit-btn');
  const regStatus = document.getElementById('reg-status');
  // WHOIS panel elements
  const whoisPanel = document.getElementById('whois-panel');
  const whoisDomainInput = document.getElementById('whois-domain-input');
  const whoisCheckBtn = document.getElementById('whois-check-btn');
  const whoisResult = document.getElementById('whois-result');
  // DNS panel elements
  const dnsPanel = document.getElementById('dns-panel');
  const dnsARecord = document.getElementById('dns-a-record');
  const dnsSubmitBtn = document.getElementById('dns-submit-btn');
  const dnsStatus = document.getElementById('dns-status');

  // Helper for fade transitions
  function fadeIn(el) {
    if (el) {
      el.classList.remove('bwai-fade-out');
      el.classList.add('bwai-fade-in');
      el.style.display = '';
    }
  }
  function fadeOut(el) {
    if (el) {
      el.classList.remove('bwai-fade-in');
      el.classList.add('bwai-fade-out');
      setTimeout(() => { el.style.display = 'none'; }, 300);
    }
  }

  // Reset logic when modal opens
  function resetModal() {
    if (domainInput) domainInput.value = '';
    if (result) { result.textContent = ''; result.className = 'bwai-domain-result'; fadeIn(result); }
    if (regStatus) { regStatus.textContent = ''; regStatus.className = 'bwai-status-text'; fadeIn(regStatus); }
    if (dnsStatus) { dnsStatus.textContent = ''; dnsStatus.className = 'bwai-status-text'; fadeIn(dnsStatus); }
    if (whoisResult) { whoisResult.textContent = ''; whoisResult.className = 'bwai-status-text'; fadeIn(whoisResult); }
    if (regPanel) fadeOut(regPanel);
    if (whoisPanel) fadeIn(whoisPanel);
    if (dnsPanel) fadeIn(dnsPanel);
  }

  function showModal() {
    modal.classList.remove('hidden');
    document.body.classList.add('bwai-modal-open');
    resetModal();
  }
  function hideModal() {
    modal.classList.add('hidden');
    document.body.classList.remove('bwai-modal-open');
    if (regPanel) fadeOut(regPanel);
    if (whoisPanel) fadeOut(whoisPanel);
    if (dnsPanel) fadeOut(dnsPanel);
  }

  if (openBtn) openBtn.addEventListener('click', showModal);
  if (closeBtn) closeBtn.addEventListener('click', hideModal);

  // Domain search
  if (searchBtn) {
    searchBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      const domain = domainInput.value.trim();
      if (!domain) {
        result.textContent = 'Please enter a domain name.';
        result.className = 'bwai-domain-result bwai-warning-text';
        fadeIn(result);
        if (regPanel) fadeOut(regPanel);
        return;
      }
      searchBtn.classList.add('bwai-loading');
      searchBtn.disabled = true;
      result.textContent = '';
      if (regPanel) fadeOut(regPanel);
      try {
        const res = await fetch('/domain/check', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ domain })
        });
        const data = await res.json();
        if (data.available) {
          result.textContent = `Available — ${domain}`;
          result.className = 'bwai-domain-result bwai-success-text';
          fadeIn(result);
          if (regPanel) fadeIn(regPanel);
        } else {
          result.textContent = `Taken — ${domain}`;
          result.className = 'bwai-domain-result bwai-error-text';
          fadeIn(result);
          if (regPanel) fadeOut(regPanel);
        }
      } catch (err) {
        result.textContent = 'Error checking domain. Please try again.';
        result.className = 'bwai-domain-result bwai-warning-text';
        fadeIn(result);
        if (regPanel) fadeOut(regPanel);
      }
      searchBtn.classList.remove('bwai-loading');
      searchBtn.disabled = false;
    });
  }

  // Domain registration
  if (regSubmitBtn) {
    regSubmitBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      const domain = domainInput.value.trim();
      const name = regName.value.trim();
      const email = regEmail.value.trim();
      const phone = regPhone.value.trim();
      const address = regAddress.value.trim();
      const ns1 = regNs1.value.trim();
      const ns2 = regNs2.value.trim();
      if (!domain || !name || !email || !phone || !address) {
        regStatus.textContent = 'Please fill in all required fields.';
        regStatus.className = 'bwai-status-text bwai-warning-text';
        fadeIn(regStatus);
        return;
      }
      regSubmitBtn.classList.add('bwai-loading');
      regSubmitBtn.disabled = true;
      regStatus.textContent = '';
      regStatus.className = 'bwai-status-text';
      fadeIn(regStatus);
      const body = {
        domain,
        contact: { name, email, phone, address },
        nameservers: [ns1, ns2].filter(Boolean)
      };
      try {
        const res = await fetch('/domain/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        });
        const data = await res.json();
        if (data.success) {
          regStatus.textContent = 'Domain registered successfully!';
          regStatus.className = 'bwai-status-text bwai-success-text';
        } else {
          regStatus.textContent = data.message || 'Registration failed.';
          regStatus.className = 'bwai-status-text bwai-error-text';
        }
        fadeIn(regStatus);
      } catch (err) {
        regStatus.textContent = 'Error registering domain. Please try again.';
        regStatus.className = 'bwai-status-text bwai-warning-text';
        fadeIn(regStatus);
      }
      regSubmitBtn.classList.remove('bwai-loading');
      regSubmitBtn.disabled = false;
    });
  }

  // WHOIS lookup
  if (whoisCheckBtn) {
    whoisCheckBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      const domain = whoisDomainInput.value.trim();
      if (!domain) {
        whoisResult.textContent = 'Please enter a domain.';
        whoisResult.className = 'bwai-status-text bwai-warning-text';
        fadeIn(whoisResult);
        return;
      }
      whoisCheckBtn.classList.add('bwai-loading');
      whoisCheckBtn.disabled = true;
      whoisResult.textContent = '';
      whoisResult.className = 'bwai-status-text';
      fadeIn(whoisResult);
      try {
        const res = await fetch('/domain/whois', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ domain })
        });
        const data = await res.json();
        let msg = '';
        if (typeof data.registered !== 'undefined') {
          msg += `Registered: ${data.registered ? 'Yes' : 'No'}\n`;
        }
        if (data.expiry) {
          msg += `Expiry: ${data.expiry}\n`;
        } else {
          msg += 'Expiry: N/A\n';
        }
        if (typeof data.privacy !== 'undefined') {
          msg += `Privacy: ${data.privacy ? 'Enabled' : 'Disabled'}`;
        }
        whoisResult.textContent = msg.trim();
        whoisResult.className = 'bwai-status-text bwai-success-text';
        fadeIn(whoisResult);
      } catch (err) {
        whoisResult.textContent = 'Error checking WHOIS. Please try again.';
        whoisResult.className = 'bwai-status-text bwai-warning-text';
        fadeIn(whoisResult);
      }
      whoisCheckBtn.classList.remove('bwai-loading');
      whoisCheckBtn.disabled = false;
    });
  }

  // DNS provisioning
  if (dnsSubmitBtn) {
    dnsSubmitBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      const ip = dnsARecord.value.trim();
      const domain = domainInput.value.trim();
      if (!domain || !ip) {
        dnsStatus.textContent = 'Please enter both domain and IP.';
        dnsStatus.className = 'bwai-status-text bwai-warning-text';
        fadeIn(dnsStatus);
        return;
      }
      dnsSubmitBtn.classList.add('bwai-loading');
      dnsSubmitBtn.disabled = true;
      dnsStatus.textContent = '';
      dnsStatus.className = 'bwai-status-text';
      fadeIn(dnsStatus);
      const body = {
        domain,
        records: [
          { type: 'A', name: '@', value: ip }
        ]
      };
      try {
        const res = await fetch('/domain/dns', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        });
        const data = await res.json();
        if (data.success) {
          dnsStatus.textContent = 'DNS provisioned successfully!';
          dnsStatus.className = 'bwai-status-text bwai-success-text';
        } else {
          dnsStatus.textContent = data.message || 'DNS provisioning failed.';
          dnsStatus.className = 'bwai-status-text bwai-error-text';
        }
        fadeIn(dnsStatus);
      } catch (err) {
        dnsStatus.textContent = 'Error provisioning DNS. Please try again.';
        dnsStatus.className = 'bwai-status-text bwai-warning-text';
        fadeIn(dnsStatus);
      }
      dnsSubmitBtn.classList.remove('bwai-loading');
      dnsSubmitBtn.disabled = false;
    });
  }
}

function showDomainModalSoftPrompt() {
  let toast = document.createElement('div');
  toast.className = 'bwai-toast bwai-modal-soft-prompt';
  toast.innerHTML = `
    <span>Your site is ready. Secure your domain to publish.</span>
    <button class="bwai-btn bwai-btn--primary" id="soft-prompt-domain-btn">Secure Domain</button>
  `;
  document.body.appendChild(toast);
  const btn = document.getElementById('soft-prompt-domain-btn');
  btn.addEventListener('click', () => {
    initDomainModal();
    document.getElementById('domain-modal').classList.remove('hidden');
    document.body.classList.add('bwai-modal-open');
    toast.remove();
  });
  setTimeout(() => {
    toast.remove();
  }, 10000);
}

/* ---------------------------------------------------------
   7. Global initialization
   --------------------------------------------------------- */

function init() {
  initTemplateSelection();
  initBrowseTemplates();
  initPreviewLink();
  initAIModalTriggers();
  initDashboardNavigation();
  initDomainModal();

  console.log("%cBUILD WITH AI — layout.js initialized", "color:#3b82f6;font-weight:bold;");
}

document.addEventListener("DOMContentLoaded", init);

/* =========================================================
   DOMAIN SEARCH SYSTEM — BUILD WITH AI
   ========================================================= */

function initDomainSearch() {
  const form = $("#domain-form");
  const input = $("#domain-input");
  const button = $("#domain-search-btn");
  const result = $("#domain-result");

  if (!form || !input || !button || !result) return;

  function showResult(type, message) {
    result.textContent = message;
    result.className = "bwai-text-muted";
    removeClass(result, "bwai-text-success");
    removeClass(result, "bwai-text-error");
    removeClass(result, "bwai-text-warning");
    if (type === "success") addClass(result, "bwai-text-success");
    if (type === "error") addClass(result, "bwai-text-error");
    if (type === "warning") addClass(result, "bwai-text-warning");
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const domain = input.value.trim();
    if (!domain) {
      showResult("warning", "Please enter a domain name.");
      return;
    }

    button.textContent = "Checking...";
    button.disabled = true;
    showResult("", "");

    try {
      const res = await fetch("/domain/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain })
      });

      const data = await res.json();

      if (data.available) {
        showResult("success", `Available — ${domain}`);
      } else {
        showResult("error", `Taken — ${domain}`);
      }

    } catch (err) {
      showResult("warning", "Error checking domain. Please try again.");
    }

    button.textContent = "Search";
    button.disabled = false;
  });
}

document.addEventListener("DOMContentLoaded", initDomainSearch);
