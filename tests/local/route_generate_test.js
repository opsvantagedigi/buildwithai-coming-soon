// Local runner to invoke the generate-template route handler directly and print result.
import fs from 'fs';
import path from 'path';
const Request = globalThis.Request || globalThis.fetch && globalThis.Request;

async function run(){
  try{
    const { pathToFileURL } = await import('node:url');
    const modPath = path.resolve('api','generate-template.js');
    const mod = await import(pathToFileURL(modPath).href);
    const handler = mod.default;
    if(!handler) throw new Error('handler not found');
    const fakeReq = { method: 'POST', body: { prompt: 'test prompt' }, headers: { 'content-type': 'application/json' }, on(){} };
    const fakeRes = { status(s){ this._s = s; return this; }, json(obj){ console.log('Body:', JSON.stringify(obj)); }, end(){ } };
    await handler(fakeReq, fakeRes);
  }catch(e){
    console.error('Error running route handler locally:', e && e.stack || e);
    process.exit(1);
  }
}

run();
