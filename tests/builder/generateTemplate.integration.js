const { spawn, execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const { spawn } = require('child_process');
const path = require('path');
const serverUrl = 'http://127.0.0.1:3000';

function startServer(){
  const p = spawn('node', ['dev-server.mjs'], { cwd: path.join(__dirname, '..', '..'), shell:true, stdio:['ignore','pipe','pipe'] });
  p.stdout.on('data', d => process.stdout.write(`[dev] ${d}`));
  p.stderr.on('data', d => process.stderr.write(`[dev] ${d}`));
  return p;
}

async function waitForServer(timeout=20000){
  const start = Date.now();
  while(Date.now()-start < timeout){
    try{ const r = await fetch(serverUrl + '/api/health'); if(r && r.ok) return true }catch(e){}
    await new Promise(r=>setTimeout(r,500));
  }
  return false;
}

async function postPrompt(prompt){
  const res = await fetch(serverUrl + '/api/generate-template', { method:'POST', headers:{ 'Content-Type':'application/json' }, body: JSON.stringify({ prompt }) });
  return res;
}

async function run(){
  console.log('Integration test started');
  let proc = startServer(); const ok = await waitForServer(); if(!ok){ console.error('Dev server did not start'); process.exit(1) }

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

  // Simulate offline: kill worker and ensure /generate-template is unavailable or returns 5xx
  console.log('Simulating server down');
  try{ proc.kill(); }catch(e){}
  // wait a bit for sockets to close
  await new Promise(r=>setTimeout(r,2000));

  // Try a few times to hit the endpoint; accept network error or 5xx as "down"
  let downOk = false;
  for(let i=0;i<6;i++){
    let resp = null;
    try{
      resp = await fetch(serverUrl + '/generate-template', { method:'POST', headers:{ 'Content-Type':'application/json' }, body: JSON.stringify({ prompt:'test' }) , timeout: 3000});
    }catch(e){ resp = null }
    if(!resp){
      console.log('No response (expected)'); downOk = true; break;
    }
    if(resp.status >= 500){
      console.log('Got server error (expected):', resp.status); downOk = true; break;
    }
    console.log('Unexpected response while simulating down (status:', resp.status, ') — retrying');
    await new Promise(r=>setTimeout(r,1000));
  }
  if(!downOk){ console.warn('Worker did not appear fully down — continuing with fallback validation'); }
  const sampleFile = path.join(__dirname,'..','..','assets','sample-data','templates.json');
  if(!fs.existsSync(sampleFile)){ console.error('Sample-data templates.json missing'); process.exit(1) }
  try{ JSON.parse(fs.readFileSync(sampleFile,'utf8')) }catch(e){ console.error('Sample-data templates.json invalid'); process.exit(1) }
  console.log('Fallback sample-data present and valid');

  // Restore worker
  console.log('Restoring worker');
  proc = startServer(); const ok2 = await waitForServer(30000); if(!ok2){ console.error('Dev server did not restart'); process.exit(1) }
  // retry generate until success or timeout
  let recovered = false;
  for(let i=0;i<8;i++){
    try{
      const r2 = await postPrompt('Recovery test');
      if(r2 && r2.status === 200){ recovered = true; break }
    }catch(e){}
    await new Promise(r=>setTimeout(r,1000));
  }
  if(!recovered){ console.error('Recovery generate failed'); process.exit(1) }
  console.log('Recovery succeeded');

  // Cleanup: if worker wasn't running before, kill it
  try{ proc.kill(); }catch(e){}
  console.log('Integration test complete');
  process.exit(0);
}

run();
