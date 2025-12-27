#!/usr/bin/env node
const fs = require('fs').promises;
const path = require('path');

const ALLOW_OFFLINE = !!process.env.ALLOW_OFFLINE;

const endpoints = [
  { url: 'http://127.0.0.1:8787/ui-config', name: 'ui-config', required: ['hero', 'theme'] },
  { url: 'http://127.0.0.1:8787/templates', name: 'templates', required: ['templates'] },
  { url: 'http://127.0.0.1:8787/announcements', name: 'announcements', required: ['announcements'] },
  { url: 'http://127.0.0.1:8787/version', name: 'version', required: ['version', 'timestamp'] },
  { url: 'http://127.0.0.1:8787/health', name: 'health', required: ['status'] }
];

const sampleBase = path.join(__dirname, '..', 'assets', 'sample-data');

function exit(code){ process.exit(code); }

function log(...args){ console.log(...args); }
function failMsg(endpoint, reason, details){
  console.error('\nFAIL:', endpoint, '-', reason);
  if(details) console.error('  ', details);
}

async function fetchWithTimeout(url, ms = 3000){
  const controller = new AbortController();
  const id = setTimeout(()=>controller.abort(), ms);
  try{
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(id);
    return res;
  }catch(e){
    clearTimeout(id);
    throw e;
  }
}

function validateField(obj, fieldName){
  return obj && Object.prototype.hasOwnProperty.call(obj, fieldName);
}
function validateArray(obj, fieldName){
  return Array.isArray(obj && obj[fieldName]);
}
function validateString(obj, fieldName){
  return typeof (obj && obj[fieldName]) === 'string';
}

async function testEndpoint(ep){
  const { url, name, required } = ep;
  try{
    const res = await fetchWithTimeout(url, 5000);
    if(res.status !== 200){
      throw new Error(`status ${res.status}`);
    }
    const ct = res.headers.get('content-type') || '';
    if(!ct.includes('application/json')){
      throw new Error(`content-type: ${ct}`);
    }
    const body = await res.json();
    // validate required fields
    for(const f of required){
      if(f === 'templates'){
        if(!Array.isArray(body.templates) && !Array.isArray(body)){
          throw new Error('missing templates array');
        }
      } else if(!validateField(body, f)){
        throw new Error(`missing field: ${f}`);
      }
    }
    log('OK:', name);
    return { ok: true };
  }catch(err){
    if(ALLOW_OFFLINE){
      console.warn('WARN:', name, 'endpoint failed but ALLOW_OFFLINE is set:', err.message);
      return { ok: false, skipped: true, error: err };
    }
    failMsg(name, 'endpoint validation failed', err.message);
    return { ok: false, error: err };
  }
}

async function testFallback(){
  const files = [
    { file: 'ui-config.json', required: ['hero'] },
    { file: 'templates.json', required: ['0'] },
    { file: 'announcements.json', required: ['0'] }
  ];
  let allOk = true;
  for(const f of files){
    const p = path.join(sampleBase, f.file);
    try{
      const raw = await fs.readFile(p, 'utf8');
      const json = JSON.parse(raw);
      // basic structure checks
      if(f.file === 'ui-config.json'){
        if(!validateField(json, 'hero') && !validateField(json, 'heroText')){
          failMsg('fallback:'+f.file, 'missing hero or heroText'); allOk = false; continue;
        }
      }else{
        if(!json || (Array.isArray(json) && json.length === 0)){
          failMsg('fallback:'+f.file, 'empty array'); allOk = false; continue;
        }
      }
      log('OK: fallback', f.file);
    }catch(err){
      failMsg('fallback:'+f.file, 'failed to read/parse', err.message); allOk = false;
    }
  }
  return allOk;
}

(async function main(){
  log('Running BUILD WITH AI smoke tests');
  let total = 0, passed = 0, failed = 0, skipped = 0;

  // Endpoint tests
  for(const ep of endpoints){
    total++;
    const r = await testEndpoint(ep);
    if(r.ok) passed++;
    else if(r.skipped) { skipped++; }
    else failed++;
  }

  // Fallback tests (always run)
  log('\nRunning fallback sample-data validation');
  const fbOk = await testFallback();
  total += 3;
  if(fbOk){ passed += 3; } else { failed += 3; }

  // Summary
  log('\nSummary:');
  log('Total tests:', total);
  log('Passed:', passed);
  log('Failed:', failed);
  if(skipped) log('Skipped:', skipped);

  if(failed > 0){
    console.error('Smoke tests failed');
    exit(1);
  }
  console.log('All smoke tests passed');
  exit(0);
})();
