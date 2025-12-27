const { spawn, execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const workerDir = path.join(__dirname, '..', '..', 'worker');
const serverUrl = 'http://127.0.0.1:8787';

function isWorkerRunning(){
  try{ const out = execSync('netstat -ano | findstr :8787').toString(); return out.includes('LISTENING') }catch(e){ return false }
}

function killWorker(){
  try{ const out = execSync('netstat -ano | findstr :8787').toString(); const pid = out.trim().split(/\s+/).pop(); if(pid){ execSync(`taskkill /PID ${pid} /F`); }}catch(e){}
}

function startWorker(){
  const p = spawn('npx', ['wrangler','dev'], { cwd: workerDir, shell:true, stdio:['ignore','pipe','pipe'] });
  p.stdout.on('data', d => process.stdout.write(`[wrangler] ${d}`));
  p.stderr.on('data', d => process.stderr.write(`[wrangler] ${d}`));
  return p;
}

async function waitForWorker(timeout=20000){
  const start = Date.now();
  while(Date.now()-start < timeout){
    try{ const r = await fetch(serverUrl + '/health'); if(r.ok) return true }catch(e){}
    await new Promise(r=>setTimeout(r,500));
  }
  return false;
}

async function postPrompt(prompt){
  const res = await fetch(serverUrl + '/generate-template', { method:'POST', headers:{ 'Content-Type':'application/json' }, body: JSON.stringify({ prompt }) });
  return res;
}

async function run(){
  console.log('Integration test started');
  const runningBefore = isWorkerRunning();
  let proc = null;
  if(!runningBefore){ proc = startWorker(); const ok = await waitForWorker(); if(!ok){ console.error('Worker did not start'); process.exit(1) } }

  // POST several prompts
  const prompts = ['Landing page for a fitness coach','Portfolio for a photographer','Product launch SaaS'];
  for(const p of prompts){
    const res = await postPrompt(p).catch(e=>null);
    if(!res){ console.error('No response for prompt',p); process.exit(1) }
    if(res.status !== 200){ console.error('Bad status', res.status); process.exit(1) }
    const j = await res.json();
    if(!j || !j.id || !j.html || !j.css){ console.error('Invalid response body', j); process.exit(1) }
    console.log('Generated', j.id);
  }

  // Simulate offline: kill worker and ensure /generate-template fails and sample-data exists
  console.log('Simulating worker down');
  killWorker();
  await new Promise(r=>setTimeout(r,1000));
  const downRes = await fetch(serverUrl + '/generate-template', { method:'POST', headers:{ 'Content-Type':'application/json' }, body: JSON.stringify({ prompt:'test' }) }).catch(e=>null);
  if(downRes){ console.error('Expected no response when worker down'); }
  const sampleFile = path.join(__dirname,'..','..','assets','sample-data','templates.json');
  if(!fs.existsSync(sampleFile)){ console.error('Sample-data templates.json missing'); process.exit(1) }
  try{ JSON.parse(fs.readFileSync(sampleFile,'utf8')) }catch(e){ console.error('Sample-data templates.json invalid'); process.exit(1) }
  console.log('Fallback sample-data present and valid');

  // Restore worker
  console.log('Restoring worker');
  proc = startWorker(); const ok2 = await waitForWorker(); if(!ok2){ console.error('Worker did not restart'); process.exit(1) }
  const r2 = await postPrompt('Recovery test').catch(e=>null);
  if(!r2 || r2.status !== 200){ console.error('Recovery generate failed'); process.exit(1) }
  console.log('Recovery succeeded');

  // Cleanup: if worker wasn't running before, kill it
  if(!runningBefore){ killWorker(); }
  console.log('Integration test complete');
  process.exit(0);
}

run();
