#!/usr/bin/env node
const fs = require('fs').promises;
const path = require('path');
const { spawn } = require('child_process');

const workerRoute = path.join(__dirname, '..', 'worker', 'src', 'routes', 'templates.js');
const sampleTemplates = path.join(__dirname, '..', 'assets', 'sample-data', 'templates.json');
const serverUrl = 'http://127.0.0.1:8787';

function wait(ms){ return new Promise(r=>setTimeout(r, ms)); }

async function fileRead(p){ return fs.readFile(p, 'utf8'); }
async function fileWrite(p, s){ return fs.writeFile(p, s, 'utf8'); }

async function fetchWithTimeout(url, ms=3000){
  const controller = new AbortController();
  const id = setTimeout(()=>controller.abort(), ms);
  try{ const res = await fetch(url, { signal: controller.signal }); clearTimeout(id); return res; }catch(e){ clearTimeout(id); throw e; }
}

async function waitForServerReady(timeout = 20000){
  const start = Date.now();
  while(Date.now() - start < timeout){
    try{ const r = await fetchWithTimeout(serverUrl + '/health', 2000); if(r.ok) return true }catch(e){}
    await wait(500);
  }
  return false;
}

function spawnWranglerDev(){
  const proc = spawn('npx', ['wrangler','dev'], { cwd: path.join(__dirname,'..','worker'), shell: true, stdio: ['ignore','pipe','pipe'] });
  proc.stdout.on('data', d => process.stdout.write(`[wrangler] ${d}`));
  proc.stderr.on('data', d => process.stderr.write(`[wrangler] ${d}`));
  return proc;
}

function killProc(proc){
  if(!proc) return;
  try{ proc.kill(); }catch(e){ }
}

function validateFailure(res){
  return res && res.status >= 500;
}
async function validateFallback(){
  const raw = await fileRead(sampleTemplates);
  const json = JSON.parse(raw);
  return Array.isArray(json) || Array.isArray(json.templates);
}
async function validateRecovery(){
  try{
    const r = await fetchWithTimeout(serverUrl + '/templates', 5000);
    if(!r.ok) return false;
    const ct = r.headers.get('content-type')||''; if(!ct.includes('application/json')) return false;
    const body = await r.json();
    return Array.isArray(body.templates) || Array.isArray(body);
  }catch(e){ return false }
}

async function run(){
  console.log('Chaos test started');

  // read original
  const orig = await fileRead(workerRoute);

  // prepare chaos content
  const chaos = `export async function get(request, env){\n  return Response.json({ error: \"Chaos test failure\" }, { status: 500, headers: { 'Content-Type': 'application/json' } });\n}\n`;

  // write chaos file
  await fileWrite(workerRoute, chaos);
  console.log('Wrote temporary chaos route');

  // ensure worker running
  let startedByScript = false;
  let proc = null;
  try{
    // check if server already up
    try{ const r = await fetchWithTimeout(serverUrl + '/health', 1000); if(r.ok){ console.log('Worker already running'); } else { throw new Error('not ready') } }
    catch(e){
      console.log('Starting wrangler dev...'); proc = spawnWranglerDev(); startedByScript = true; const ok = await waitForServerReady(20000); if(!ok) throw new Error('wrangler dev did not become ready');
    }

    // fetch templates (expect failure)
    console.log('Fetching /templates to validate failure...');
    let res;
    try{ res = await fetchWithTimeout(serverUrl + '/templates', 5000); }catch(e){ console.log('Fetch /templates failed (network)', e.message); }
    if(!res){ console.error('Failed to fetch /templates'); throw new Error('no response'); }
    if(validateFailure(res)) console.log('Endpoint failure detected as expected'); else { const txt = await res.text(); console.error('Unexpected templates response:', res.status, txt); throw new Error('templates did not fail'); }

    // validate fallback
    console.log('Validating fallback sample-data...');
    const fb = await validateFallback(); if(fb) console.log('Fallback succeeded'); else throw new Error('fallback validation failed');

  }catch(err){
    console.error('Chaos phase failed:', err.message);
    // restore original before exiting
    await fileWrite(workerRoute, orig);
    if(proc) killProc(proc);
    console.error('Original route restored');
    process.exit(1);
  }

  // restore original route
  await fileWrite(workerRoute, orig);
  console.log('Original route restored');

  // restart wrangler if we started it
  if(startedByScript && proc){
    console.log('Restarting wrangler dev to pick up restoration...');
    killProc(proc);
    proc = spawnWranglerDev(); const ok = await waitForServerReady(20000); if(!ok){ console.error('wrangler did not restart in time'); killProc(proc); process.exit(1); }
  } else {
    // give time for dev server to reload if running
    console.log('Waiting for worker to pick up restored file...'); await wait(2000);
  }

  // validate recovery
  const recovered = await validateRecovery();
  if(!recovered){ console.error('Recovery validation failed'); if(proc) killProc(proc); process.exit(1); }
  console.log('Recovery succeeded');

  // cleanup
  if(proc) killProc(proc);
  console.log('Chaos test completed successfully');
  process.exit(0);
}

run();
