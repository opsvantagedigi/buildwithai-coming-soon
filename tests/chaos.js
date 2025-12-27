const fsPromises = require('fs').promises;
const fs = require('fs');
const path = require('path');
const { spawn, execSync } = require('child_process');

// Windows-friendly chaos test script
const templatesPath = path.join(__dirname, '..', 'worker', 'src', 'routes', 'templates.js');
const sampleTemplates = path.join(__dirname, '..', 'assets', 'sample-data', 'templates.json');
const healthUrl = 'http://127.0.0.1:8787/health';

function isWorkerRunning(){
  try{ const out = execSync('netstat -ano | findstr :8787').toString(); return out.includes('LISTENING') }catch(e){ return false }
}

function killWorker(){
  try{ const out = execSync('netstat -ano | findstr :8787').toString(); const pid = out.trim().split(/\s+/).pop(); if(pid){ console.log('Killing existing wrangler dev (PID', pid, ')'); execSync(`taskkill /PID ${pid} /F`); }}catch(e){ console.log('No existing wrangler dev to kill') }
}

function startWorker(){
  console.log('Starting wrangler dev...');
  const p = spawn('npx', ['wrangler','dev'], { cwd: path.join(__dirname,'..','worker'), shell:true, stdio:'inherit' });
  return p;
}

async function waitForWorker(timeout = 20000){
  const start = Date.now();
  while(Date.now()-start < timeout){
    try{ const r = await fetch(healthUrl); if(r.ok) return true }catch(e){}
    await new Promise(r=>setTimeout(r,500));
  }
  return false;
}

function validateFallback(){
  try{ const raw = fs.readFileSync(sampleTemplates,'utf8'); const j = JSON.parse(raw); return Array.isArray(j) || Array.isArray(j.templates) }catch(e){ return false }
}

async function run(){
  console.log('Chaos test started');
  const original = fs.readFileSync(templatesPath,'utf8');

  // write chaos content
  fs.writeFileSync(templatesPath, `export async function get(request, env){ return new Response(JSON.stringify({ error: 'Chaos test failure' }), { status: 500, headers:{ 'Content-Type':'application/json' } }); }`,'utf8');
  console.log('Wrote temporary chaos route');

  if(isWorkerRunning()){ console.log('Worker running — restarting'); killWorker(); }
  const proc = startWorker();
  const ready = await waitForWorker();
  if(!ready){ console.error('Worker did not become ready'); process.exit(1) }

  // validate failure
  const failRes = await fetch('http://127.0.0.1:8787/templates').catch(()=>null);
  if(!failRes || failRes.status < 500){ console.error('Templates did not fail as expected'); fs.writeFileSync(templatesPath, original,'utf8'); killWorker(); startWorker(); process.exit(1) }
  console.log('Endpoint failure detected as expected');

  // validate fallback
  if(!validateFallback()){ console.error('Fallback validation failed'); fs.writeFileSync(templatesPath, original,'utf8'); killWorker(); startWorker(); process.exit(1) }
  console.log('Fallback validated');

  // restore
  fs.writeFileSync(templatesPath, original,'utf8');
  console.log('Original route restored');
  killWorker(); const proc2 = startWorker(); const ready2 = await waitForWorker(); if(!ready2){ console.error('Worker did not restart'); process.exit(1) }

  const recoverRes = await fetch('http://127.0.0.1:8787/templates').catch(()=>null);
  if(!recoverRes || !recoverRes.ok){ console.error('Recovery failed'); killWorker(); process.exit(1) }
  console.log('Recovery succeeded');
  killWorker();
  console.log('Chaos test complete');
  process.exit(0);
}

run();

