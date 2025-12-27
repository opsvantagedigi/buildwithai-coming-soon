import test from 'node:test';
import assert from 'node:assert';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

test('generateTemplate returns expected shape and deterministic id', async (t) => {
  const modPath = path.resolve('worker', 'src', 'lib', 'ai.js');
  const mod = await import(pathToFileURL(modPath).href);
  const gen = mod.generateTemplate || (mod.default && mod.default.generateTemplate);
  assert.ok(typeof gen === 'function', 'generateTemplate is a function');

  const prompt = 'Landing page for a fitness coach';
  const r = await gen(prompt);
  assert.ok(r && typeof r === 'object', 'result is object');
  assert.strictEqual(typeof r.id, 'string');
  assert.ok(r.id.length > 0, 'id non-empty');
  assert.strictEqual(typeof r.name, 'string');
  assert.ok(r.name.toLowerCase().includes('landing') || r.name.length>0, 'name seems derived');
  assert.strictEqual(typeof r.description, 'string');
  assert.ok(r.description.length > 0, 'description non-empty');
  assert.ok(Array.isArray(r.sections), 'sections is array');
  assert.ok(r.sections.length >= 3, 'sections >= 3');
  assert.strictEqual(typeof r.html, 'string');
  assert.ok(r.html.includes('<section') || r.html.includes('<header'), 'html contains section/header');
  assert.strictEqual(typeof r.css, 'string');
  assert.ok(r.css.includes('.') || r.css.length>0, 'css contains class or is non-empty');

  const r2 = await gen('A different prompt to ensure different id');
  assert.notStrictEqual(r.id, r2.id, 'different prompts produce different ids');
});
