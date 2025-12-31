const fsPromises = require('fs').promises;
const fs = require('fs');
const path = require('path');
const { spawn, execSync } = require('child_process');

// Windows-friendly chaos test script
const templatesPath = path.join(__dirname, '..', 'api', 'templates.js');
const sampleTemplates = path.join(__dirname, '..', 'assets', 'sample-data', 'templates.json');
const healthUrl = 'http://127.0.0.1:3000/api/templates';

function startServer(){
  console.log('Starting local dev-server...');
  const p = spawn('node', ['dev-server.mjs'], { cwd: path.join(__dirname,'..'), shell:true, stdio:['ignore','pipe','pipe'] });
  p.stdout.on('data', d => process.stdout.write(`[dev] ${d}`));
  p.stderr.on('data', d => process.stderr.write(`[dev] ${d}`));
  return p;
}

async function waitForServer(timeout = 20000){
  const start = Date.now();
  while(Date.now()-start < timeout){
    try{ const r = await fetch(healthUrl); if(r && r.ok) return true }catch(e){}
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

  // write chaos content (force 500)
  fs.writeFileSync(templatesPath, `export default async function handler(req,res){ res.status(500).json({ error: 'Chaos' }); }`,'utf8');
  console.log('Wrote temporary chaos route');

  const proc = startServer();
  const ready = await waitForServer();
  if(!ready){ console.error('Dev server did not become ready'); process.exit(1) }

  // validate failure
  const failRes = await fetch('http://127.0.0.1:3000/api/templates').catch(()=>null);
  if(!failRes || failRes.status < 500){ console.error('Templates did not fail as expected'); fs.writeFileSync(templatesPath, original,'utf8'); process.exit(1) }
  console.log('Endpoint failure detected as expected');

  // validate fallback
  if(!validateFallback()){ console.error('Fallback validation failed'); fs.writeFileSync(templatesPath, original,'utf8'); killWorker(); startWorker(); process.exit(1) }
  console.log('Fallback validated');

  // restore
  fs.writeFileSync(templatesPath, original,'utf8');
  console.log('Original route restored');
  try{ proc.kill(); }catch(e){}
  const proc2 = startServer(); const ready2 = await waitForServer(); if(!ready2){ console.error('Dev server did not restart'); process.exit(1) }

  const recoverRes = await fetch('http://127.0.0.1:3000/api/templates').catch(()=>null);
  if(!recoverRes || !recoverRes.ok){ console.error('Recovery failed'); process.exit(1) }
  console.log('Recovery succeeded');
  console.log('Chaos test complete');
  process.exit(0);
}

run();

