// use core
export * from './atomic-core.js';
// use dynamic industry: Atoms are loaded on demand
export * from './Industry/dynamic-industry.js';
// use vanilla isolation: Atoms utilize global scope
import './Isolation/vanilla.js';
