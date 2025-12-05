
import { spawn } from 'child_process';
import path from 'path';

const agents = [
  { name: 'SEO Agent', script: 'scripts/seo-agent.ts', args: [] },
  { name: 'Content Agent', script: 'scripts/content-agent.ts', args: ['blog', '"Top 10 Indoor Plants for Beginners"'] },
  { name: 'Growth Agent', script: 'scripts/growth-agent/main.ts', args: [] }
];

async function runAgent(agent: { name: string, script: string, args: string[] }) {
  return new Promise<void>((resolve, reject) => {
    console.log(`\n🚀 Starting ${agent.name}...`);
    const commandArgs = ['tsx', agent.script, ...agent.args];
    const child = spawn('npx', commandArgs, {
      stdio: 'inherit',
      shell: true,
      cwd: process.cwd()
    });

    child.on('close', (code) => {
      if (code === 0) {
        console.log(`✅ ${agent.name} completed successfully.`);
        resolve();
      } else {
        console.error(`❌ ${agent.name} failed with code ${code}.`);
        // We resolve anyway to continue to the next agent
        resolve();
      }
    });

    child.on('error', (err) => {
      console.error(`❌ ${agent.name} error:`, err);
      resolve();
    });
  });
}

async function main() {
  console.log('🤖 Initializing All Agents...');
  
  for (const agent of agents) {
    await runAgent(agent);
  }

  console.log('\n✨ All agents have finished their run cycles.');
}

main().catch(console.error);
