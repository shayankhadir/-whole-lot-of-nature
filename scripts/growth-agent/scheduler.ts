import { spawn } from 'child_process';
import * as path from 'path';

const INTERVAL_MINUTES = 60; // Run every hour
const SCRIPT_PATH = path.join(process.cwd(), 'scripts', 'growth-agent', 'main.ts');

console.log(`⏰ GROWTH AGENT SCHEDULER STARTED`);
console.log(`   Running every ${INTERVAL_MINUTES} minutes.`);

function runAgent() {
  console.log(`\n[${new Date().toISOString()}] Triggering Growth Agent...`);
  
  const child = spawn('npx', ['tsx', `"${SCRIPT_PATH}"`], {
    stdio: 'inherit',
    shell: true
  });

  child.on('close', (code) => {
    console.log(`[${new Date().toISOString()}] Agent finished with code ${code}`);
    console.log(`   Next run in ${INTERVAL_MINUTES} minutes.`);
  });
}

// Run immediately on start
runAgent();

// Schedule loop
setInterval(runAgent, INTERVAL_MINUTES * 60 * 1000);
