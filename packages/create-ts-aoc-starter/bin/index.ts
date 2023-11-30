#!/usr/bin/env node

import { createWorkspace } from 'create-nx-workspace';

async function main() {
  console.log(
    `🎄🎄🎄 Creating your Typescript Advent of Code Starter Repo... 🎄🎄🎄`
  );

  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const presetVersion = require('../package.json').version;

  await createWorkspace(`ts-aoc-starter@${presetVersion}`, {
    name: 'ts-aoc-starter',
    nxCloud: false,
    packageManager: 'npm',
  });

  console.log(`🎄🎄🎄 Success!! Happy Coding! 🎄🎄🎄`);
}

main();
