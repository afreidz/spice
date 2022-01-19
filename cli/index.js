#!/usr/bin/env zx
const IPCClient = require('@no.de/ipc');
const configure = require('../configure.js');

process.env.FORCE_COLOR=3
process.env.XDG_CURRENT_DESKTOP="no.de"

const ns = 'no.de';
const cmd = argv._[1] || null;
const base = path.join(__dirname, '../');
cd(base);

switch (cmd) {
  case 'flush': flush(); break;
  case 'init': init(); break; 
  case 'kill': kill(); break; 
  case 'logs': logs(); break; 
  case 'wm': wmcmd(); break; 
  case 'ls': ls(); break; 
}

function argsToArr(args) {
  return Object.entries(args).map(e => {
    return `--${e[0]}=${e[1]}`;
  });
}

async function flush() {
  await $`npx pm2 flush -n ${ns}`;
}

async function logs() {
  const args = { ...argv };
  delete args._;

  await $`npx pm2 logs ${argsToArr(args)}`;
}

async function kill() {
  await $`npx pm2 kill -n ${ns}`;
}

async function init() {
  await kill();
  await flush();
  await configure();

  await $`npm run generate-tokens`;
  await $`npx tsc`;
  await $`npx pm2 start ${path.join(base, 'cli/ecosystem.config.js')}`;
  await $`npx pm2 restart cursor`;
}

async function ls() {
  await $`npx pm2 ls -n ${ns}`;
}

async function wmcmd() {
  const client = new IPCClient(['wm']);
  const command = argv.c;
  const args = Array.isArray(argv.a) ? argv.a : [argv.a];

  await client.send('wm', { msg: 'command', command, args });
  client.close();
}
