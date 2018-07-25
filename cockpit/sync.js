/**
 * Sync hosting folder via GoodSync batch
 */
const { execSync } = require('child_process');

console.log('Starting deploy via GoodSync...')
let stdout = execSync('"C:/Program Files/Siber Systems/GoodSync/gsync" sync nw_blog');
console.log(stdout.toString('ascii'));