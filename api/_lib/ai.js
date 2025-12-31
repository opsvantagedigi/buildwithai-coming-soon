export function makeDeterministicId(prompt){
  // simple deterministic hashing for test purposes
  let h = 2166136261 >>> 0;
  for (let i = 0; i < prompt.length; i++) {
    h ^= prompt.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return 'gen-' + (h.toString(16));
}

export async function generateTemplate(prompt){
  const id = makeDeterministicId(prompt + String(Date.now()).slice(-1));
  const name = (prompt.split(' ')[0] || 'Generated') + ' Template';
  const description = `Auto-generated template for: ${prompt}`;
  const sections = [
    { id: 'hero', type: 'hero' },
    { id: 'features', type: 'features' },
    { id: 'cta', type: 'cta' }
  ];
  const html = `<section class="template-hero"><h1>${name}</h1></section>`;
  const css = `.template-hero{padding:24px}`;
  return { id, name, description, sections, html, css };
}

export default { generateTemplate };
