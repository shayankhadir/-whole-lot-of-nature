#!/usr/bin/env tsx

/**
 * Quick CLI helper to validate the India shipping rules locally.
 *
 * Usage:
 *   tsx scripts/woocommerce/shipping-fee-simulator.ts --subtotal=1200 --weight=6.5
 */

import { argv } from 'node:process';

interface SimulationInput {
  subtotal: number;
  weightKg: number;
}

const BASE_RATE = 79;
const FREE_THRESHOLD = 999;
const SURCHARGE_THRESHOLD = 5;
const SURCHARGE = 29;

function parseArgs(): SimulationInput {
  const subtotalArg = argv.find((arg) => arg.startsWith('--subtotal='));
  const weightArg = argv.find((arg) => arg.startsWith('--weight='));

  const subtotal = subtotalArg ? Number(subtotalArg.split('=')[1]) : Number(process.env.SUBTOTAL || 0);
  const weightKg = weightArg ? Number(weightArg.split('=')[1]) : Number(process.env.WEIGHT || 0);

  if (!Number.isFinite(subtotal) || !Number.isFinite(weightKg)) {
    throw new Error('Provide numeric --subtotal and --weight arguments.');
  }

  return { subtotal, weightKg };
}

function calculateShipping({ subtotal, weightKg }: SimulationInput) {
  const base = subtotal >= FREE_THRESHOLD ? 0 : BASE_RATE;
  const heavy = weightKg > SURCHARGE_THRESHOLD ? SURCHARGE : 0;
  const total = base + heavy;

  return {
    base,
    heavy,
    total,
    rationale: [
      base === 0 ? 'Free shipping unlocked (>= ₹999)' : 'Flat rate applied (< ₹999)',
      heavy ? 'Heavy order surcharge (+₹29)' : 'No heavy surcharge',
    ],
  };
}

function main() {
  const input = parseArgs();
  const result = calculateShipping(input);

  console.log('🏷️ Shipping simulation');
  console.log(`Subtotal: ₹${input.subtotal.toFixed(2)}`);
  console.log(`Weight: ${input.weightKg.toFixed(1)} kg`);
  console.log('---');
  console.log(`Base fee: ₹${result.base}`);
  console.log(`Heavy surcharge: ₹${result.heavy}`);
  console.log(`Total shipping: ₹${result.total}`);
  console.log('Notes:', result.rationale.join(' · '));
}

main();
