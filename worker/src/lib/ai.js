// Deterministic, rule-based template generator (placeholder for real AI)
async function sha256hex(input){
  if(typeof input === 'string') input = new TextEncoder().encode(input);
  const hash = await crypto.subtle.digest('SHA-256', input);
  const arr = Array.from(new Uint8Array(hash));
  return arr.map(b=>b.toString(16).padStart(2,'0')).join('');
}

function titleFromPrompt(prompt){
  // Pick first up to 6 words, capitalize
  const words = prompt.replace(/[^a-zA-Z0-9\s]/g,'').split(/\s+/).filter(Boolean).slice(0,6);
  if(words.length===0) return 'Generated Template';
  return words.map(w=>w[0]?.toUpperCase()+w.slice(1)).join(' ');
}

export async function generateTemplate(prompt){
  const normalized = String(prompt || '').trim();
  const hash = await sha256hex(normalized || Date.now().toString());
  const id = `generated-${hash.slice(0,10)}`;
  const name = titleFromPrompt(normalized);
  const description = `${name} — a simple landing layout generated from your prompt.`;

  const sections = [
    { type: 'hero', title: name, subtitle: `Built for: ${normalized}` },
    { type: 'features', items: [
      { title: 'Modern Design', desc: 'Clean responsive layout' },
      { title: 'Fast', desc: 'Minimal, performant markup' },
      { title: 'SEO Ready', desc: 'Simple semantic structure' }
    ]},
    { type: 'cta', text: 'Get Started', href: '#' },
    { type: 'footer', text: '© BUILD WITH AI — Generated' }
  ];

  // Build a compact HTML preview
  const html = `
<div class="bw-generated" data-id="${id}">
  <header class="bw-hero">
    <div class="container"><h1>${escapeHtml(name)}</h1><p class="muted">${escapeHtml(description)}</p></div>
  </header>
  <main class="container bw-main">
    <section class="bw-features">
      ${sections[1].items.map(it=>`<article class="feature"><h3>${escapeHtml(it.title)}</h3><p>${escapeHtml(it.desc)}</p></article>`).join('')}
    </section>
    <section class="bw-cta"><a class="cta" href="#">${escapeHtml(sections[2].text)}</a></section>
  </main>
  <footer class="bw-footer"><div class="container muted">${escapeHtml(sections[3].text)}</div></footer>
</div>
`.trim();

  const css = `
.bw-generated { font-family: system-ui, sans-serif; color: #021025; }
.bw-hero { background: linear-gradient(90deg,#89f7fe,#66a6ff); padding:40px 0; color:#021025 }
.bw-hero h1{ margin:0 0 8px; font-size:28px }
.bw-main{ padding:24px 0 }
.bw-features{ display:flex; gap:12px }
.feature{ background:#fff;border-radius:8px;padding:12px;flex:1;box-shadow:var(--elevation,0 1px 4px rgba(2,16,37,0.06)) }
.bw-cta{ padding:20px 0;text-align:center }
.bw-footer{ padding:16px 0;border-top:1px solid rgba(2,16,37,0.06); font-size:13px }
`.trim();

  return { id, name, description, sections, html, css };
}

function escapeHtml(s){ return String(s).replace(/[&<>"']/g, c=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;" })[c]); }

export default { generateTemplate };
