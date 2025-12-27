// Local runner to invoke the generate-template route handler directly and print result.
import fs from 'fs';
import path from 'path';
const Request = globalThis.Request || globalThis.fetch && globalThis.Request;

async function run(){
  try{
    const { pathToFileURL } = await import('node:url');
    const modPath = path.resolve('worker','src','routes','generate-template.js');
    const mod = await import(pathToFileURL(modPath).href);
    const handler = mod.default && (mod.default.POST || mod.default.post) || mod.post || mod.POST;
    if(!handler) throw new Error('handler not found');

    const req = new Request('http://127.0.0.1:8787/generate-template', { method:'POST', headers:{ 'Content-Type':'application/json' }, body: JSON.stringify({ prompt: 'test prompt' }) });
    const res = await handler({ request: req, env: {} });
    const text = await res.text();
    console.log('Response status:', res.status);
    console.log('Body:', text);
  }catch(e){
    console.error('Error running route handler locally:', e && e.stack || e);
    process.exit(1);
  }
}

run();
