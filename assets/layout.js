// Shared layout helpers and UI behaviors
(function(){
  const API = {
    templates: '/templates',
    uiConfig: '/ui-config',
    announcements: '/announcements',
    samples: '/assets/sample-data'
  };

  function qs(sel, ctx=document){return ctx.querySelector(sel)}
  function qsa(sel, ctx=document){return Array.from(ctx.querySelectorAll(sel))}

  async function fetchJson(path){try{const r=await fetch(path); if(!r.ok) return null; return await r.json()}catch(e){console.warn('fetch',path,e);return null}}

  // Try primary then fallback, returning parsed JSON or throwing
  async function fetchWithFallback(primaryUrl, fallbackUrl){
    if(!navigator.onLine){ console.warn('Offline — using fallback', fallbackUrl); return fetchJson(fallbackUrl) }
    try{
      const r = await fetch(primaryUrl);
      if(r.ok) return await r.json();
      console.warn('Primary fetch failed', primaryUrl, r.status);
    }catch(e){ console.warn('Primary fetch error', primaryUrl, e) }
    // fallback
    try{ return await fetchJson(fallbackUrl) }catch(e){ console.warn('Fallback fetch failed', fallbackUrl, e); return null }
  }

  function renderHeader(root){
    const header = document.createElement('header'); header.className='container header';
    header.innerHTML = `
      <div class="brand">
        <div class="logo">BW</div>
        <div>
          <div style="font-weight:700">BUILD WITH AI</div>
          <div style="font-size:12px;color:var(--muted)">AI website builder</div>
        </div>
      </div>
      <nav class="nav">
        <a href="/" data-link>Home</a>
        <a href="/dashboard" data-link>Dashboard</a>
        <a href="/builder" data-link>Builder</a>
        <a href="/docs" data-link>Docs</a>
        <a href="/api" data-link>API</a>
        <button class="mobile-toggle">☰</button>
        <a href="#" class="cta login-btn">Log in</a>
        <div class="avatar" style="width:38px;height:38px;border-radius:999px;background:linear-gradient(90deg,var(--accent-start),var(--accent-end));display:inline-flex;align-items:center;justify-content:center;color:#021025;margin-left:8px;cursor:pointer">U</div>
      </nav>`;
    root.prepend(header);
    // active link
    const links = header.querySelectorAll('[data-link]');
    links.forEach(a=>{ if(location.pathname === new URL(a.href,location).pathname) a.classList.add('active') });
    // avatar click—placeholder dropdown
    header.querySelector('.avatar').addEventListener('click',()=>{
      let dd = document.getElementById('avatar-dd');
      if(dd){ dd.remove(); return }
      dd = document.createElement('div'); dd.id='avatar-dd'; dd.className='card'; dd.style.position='absolute'; dd.style.right='24px'; dd.style.top='72px'; dd.style.width='220px'; dd.innerHTML=`<div style="padding:8px"><strong>Account</strong><div class="muted">(placeholder)</div><hr style="margin:8px 0"/><a href="#" class="muted">Profile</a><br/><a href="#" class="muted">Settings</a><br/><a href="#" class="muted">Logout</a></div>`;
      document.body.appendChild(dd);
      setTimeout(()=>document.addEventListener('click', function _h(e){ if(!dd.contains(e.target) && e.target !== header.querySelector('.avatar')){ dd.remove(); document.removeEventListener('click',_h) } }, {capture:false}),10);
    });

    // offline badge
    if(!navigator.onLine){
      const badge = document.createElement('span'); badge.className='offline-badge'; badge.textContent='Offline Mode — Using Local Data'; header.querySelector('.nav').appendChild(badge);
    }
  }

  function renderFooter(root){
    const f = document.createElement('footer'); f.className='container footer';
    f.innerHTML = `<div style="display:flex;justify-content:space-between;align-items:center"><div>© ${new Date().getFullYear()} BUILD WITH AI</div><div style="display:flex;gap:12px"><a href="/docs" class="muted">Docs</a><a href="/api" class="muted">API</a><a href="#" class="muted">Terms</a></div></div>`;
    root.appendChild(f);
  }

  // Dashboard specific renderers
  async function renderDashboard(root){
    const main = document.createElement('main'); main.className='container main';
    main.innerHTML = `
      <div class="left">
        <div class="hero card" id="dashHero"><h2 class="fade">Loading…</h2><p class="muted" id="dashHeroSub"></p></div>
        <h3 style="margin-top:18px">Templates</h3>
        <div id="templatesGrid" class="grid"></div>
        <h3 style="margin-top:18px">Feature Toggles</h3>
        <div id="featureToggles" class="toggles"></div>
        <h3 style="margin-top:18px">Announcements</h3>
        <div id="announcementsList"></div>
      </div>
      <aside class="right">
        <div class="card" id="previewPanel"><h4>Preview</h4><div id="previewArea" style="margin-top:12px">Select a template to preview</div></div>
      </aside>`;
    root.appendChild(main);

    // show skeletons
    const templatesGrid = qs('#templatesGrid'); templatesGrid.innerHTML = '<div class="template-card skeleton" style="height:140px"></div><div class="template-card skeleton" style="height:140px"></div>';
    qs('#featureToggles').innerHTML = '<div class="toggle-row skeleton" style="height:48px"></div><div class="toggle-row skeleton" style="height:48px"></div>';
    qs('#announcementsList').innerHTML = '<div class="announcement skeleton" style="height:64px"></div>';
    qs('#previewArea').innerHTML = '<div class="skeleton" style="height:140px"></div>';

    // fetch with fallback
    const [ui, templates, announcements] = await Promise.all([
      fetchWithFallback(API.uiConfig, `${API.samples}/ui-config.json`),
      fetchWithFallback(API.templates, `${API.samples}/templates.json`),
      fetchWithFallback(API.announcements, `${API.samples}/announcements.json`)
    ]);

    if(!ui && !templates && !announcements){
      showError(main, async ()=>{ await renderDashboard(root) });
      return;
    }

    updateHeroFromFallback(ui);
    renderTemplatesGridFromFallback(templates);
    renderFeatureTogglesFromFallback(ui);
    renderAnnouncementsFromFallback(announcements);
  }

  function showError(root, retry){
    root.innerHTML = `<div class="card" style="text-align:center"><h3>Unable to load data</h3><p class="muted">Please check your connection or try again.</p><div style="margin-top:12px"><button class="cta retry-btn">Retry Loading</button></div></div>`;
    const btn = qs('.retry-btn', root); if(btn) btn.addEventListener('click', ()=> retry());
  }

  function updateHeroFromFallback(ui){
    const h = qs('#dashHero'); if(!h) return;
    const title = (ui && (ui.hero && ui.hero.title || ui.heroText)) ? (ui.hero && ui.hero.title || ui.heroText) : 'Builder Dashboard';
    const sub = (ui && ui.hero && ui.hero.subtitle) ? ui.hero.subtitle : 'Manage templates and builds';
    qs('#dashHero h2', h).textContent = title; qs('#dashHeroSub').textContent = sub; h.classList.add('fade');
  }

  function renderTemplatesGridFromFallback(data){
    const root = qs('#templatesGrid'); if(!root) return; root.innerHTML='';
    const list = (data && data.templates) || data || [];
    if(list.length === 0){ root.innerHTML = '<div class="card muted">No templates available.</div>'; return }
    list.forEach(t=>{
      const div = document.createElement('div'); div.className='template-card card';
      const img = t.preview || t.image || t.previewUrl || '';
      div.innerHTML = `<div style="display:flex;flex-direction:column;gap:8px"><div class="template-preview">${img?`<img src="${img}" alt="${t.name||t.title}" style="max-width:100%;max-height:100%;border-radius:6px">`:'Preview'}</div><div><strong>${t.name||t.title}</strong><div class="muted">${t.description||t.desc||''}</div></div><div style="margin-top:8px"><button class="cta use-template">Use Template</button></div></div>`;
      div.addEventListener('click', (e)=>{ if(e.target && e.target.classList && e.target.classList.contains('use-template')){ alert('Use Template — placeholder') } selectTemplate(t); });
      root.appendChild(div);
    });
  }

  function renderFeatureTogglesFromFallback(ui){
    const root = qs('#featureToggles'); if(!root) return; root.innerHTML='';
    const flags = (ui && (ui.features || ui.featureFlags)) || ui && ui.features || ui && ui.featureFlags || [];
    if(!flags || flags.length===0){ root.innerHTML='<div class="muted card">No feature toggles</div>'; return }
    flags.forEach(f=>{ const row = document.createElement('div'); row.className='toggle-row'; row.innerHTML = `<div><strong>${typeof f === 'string' ? f : f.name}</strong><div class="muted" style="font-size:12px">${typeof f === 'string' ? '' : f.desc||f.description||''}</div></div><div><label style="display:inline-flex;align-items:center;gap:8px"><input type="checkbox" disabled>${''}<span class="muted">Off</span></label></div>`; root.appendChild(row); });
  }

  function renderAnnouncementsFromFallback(data){
    const root = qs('#announcementsList'); if(!root) return; root.innerHTML='';
    const items = data || [];
    if(items.length===0){ root.innerHTML='<div class="muted card">No announcements</div>'; return }
    items.forEach(a=>{ const d = document.createElement('div'); d.className='announcement'; d.innerHTML = `<div style="display:flex;justify-content:space-between"><div><strong>${a.title||a.category||'Notice'}</strong><div class="muted" style="font-size:13px">${a.message||a.text||a.body||''}</div></div><div style="font-size:12px;color:var(--muted)">${a.timestamp||a.time||''}</div></div>`; root.appendChild(d); });
  }

  function updateHero(ui){
    return updateHeroFromFallback(ui);
  }

  function renderTemplatesGrid(data){ return renderTemplatesGridFromFallback(data) }

  function renderFeatureToggles(ui){ return renderFeatureTogglesFromFallback(ui) }

  function renderAnnouncements(data){ return renderAnnouncementsFromFallback(data) }

  function selectTemplate(t){
    const area = qs('#previewArea'); if(!area) return; area.innerHTML = `<div><strong>${t.title||t.name}</strong><div class="muted">${t.category||t.type||''}</div><p style="margin-top:8px">${t.desc||t.description||''}</p></div>`;
  }

  // Builder page renderer
  async function renderBuilder(root){
    const container = document.createElement('main'); container.className='container main';
    container.innerHTML = `
      <div style="width:100%">
        <div class="hero card"><h2>Builder</h2><p class="muted">Select a template to get started</p></div>
        <div style="margin-top:18px"><h3>Templates</h3><div id="builderTemplates" class="grid"></div></div>
        <div style="margin-top:18px"><button class="cta">Start Building</button></div>
      </div>
    `;
    root.appendChild(container);

    // skeleton
    const grid = qs('#builderTemplates'); grid.innerHTML = '<div class="template-card skeleton" style="height:140px"></div><div class="template-card skeleton" style="height:140px"></div>';

    const templates = await fetchWithFallback(API.templates, `${API.samples}/templates.json`);
    if(!templates){ showError(container, async ()=>{ await renderBuilder(root) }); return }
    const list = (templates && templates.templates) || templates || [];
    if(list.length===0) grid.innerHTML = '<div class="muted card">No templates</div>';
    grid.innerHTML = '';
    list.forEach(t=>{ const div = document.createElement('div'); div.className='template-card card'; const img = t.preview || t.image || ''; div.innerHTML = `<div class="template-preview">${img?`<img src="${img}" style="max-width:100%;max-height:100%;border-radius:6px">`:'Preview'}</div><div style="margin-top:8px"><strong>${t.name||t.title}</strong><div class="muted">${t.description||t.desc||''}</div></div>`; div.addEventListener('click',()=>alert('Start Building — placeholder')); grid.appendChild(div); });
  }

  // Expose API
  window.BWLayout = {
    renderHeader, renderFooter, renderDashboard, renderBuilder, fetchJson
  };
})();
