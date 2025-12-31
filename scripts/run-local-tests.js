const { spawn } = require('child_process');
const path = require('path');

function startServer(){
  return spawn('node', ['dev-server.mjs'], { cwd: path.join(__dirname, '..'), shell:true, stdio:['pipe','pipe','pipe'] });
}

function runTests(){
  return spawn('node', ['tests/smoke.js'], { cwd: path.join(__dirname, '..'), shell:true, stdio:'inherit' });
}

(async function main(){
  const srv = startServer();
  srv.stdout.on('data', d => process.stdout.write(`[dev] ${d}`));
  srv.stderr.on('data', d => process.stderr.write(`[dev-err] ${d}`));

  // wait a short while for server to start
  await new Promise(r=>setTimeout(r, 1000));

  const tests = runTests();
  tests.on('close', (code) => {
    try{ srv.kill(); }catch(e){}
    process.exit(code);
  });
})();
