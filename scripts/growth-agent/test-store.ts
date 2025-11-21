import { DataStore } from './data/store.js';

const store = new DataStore();
store.log('Test log entry', 'INFO');
console.log('Store test complete');
