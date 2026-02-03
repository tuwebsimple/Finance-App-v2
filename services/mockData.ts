import { Transaction } from '../types';

export const transactions: Transaction[] = [
  // Keeping this empty or compatible as existing data in LocalStorage might not have these fields yet,
  // but code should handle undefined gracefully.
];

export const netWorthData = [
  { name: 'M', value: 124000 },
  { name: 'T', value: 124200 },
  { name: 'W', value: 124100 },
  { name: 'T', value: 124400 },
  { name: 'F', value: 124300 },
  { name: 'S', value: 124500 },
  { name: 'S', value: 124592 },
];

export const monthlyData = [
  { name: 'Sem 1', hogar: 300, ocio: 150 },
  { name: 'Sem 2', hogar: 450, ocio: 200 },
  { name: 'Sem 3', hogar: 320, ocio: 180 },
  { name: 'Sem 4', hogar: 500, ocio: 250 },
];