#!/usr/bin/env node

import { execSync } from 'child_process';
import { createWorkspace } from 'create-nx-workspace';

async function main() {
  console.log(
    `🎄🎄🎄 Creating your Typescript Advent of Code Starter Repo... 🎄🎄🎄`
  );

  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const presetVersion = require('../package.json').version;

  const { directory } = await createWorkspace(
    `ts-aoc-starter@${presetVersion}`,
    {
      name: 'ts-aoc-starter',
      nxCloud: false,
      packageManager: 'npm',
    }
  );

  execSync(`npm i`, { cwd: directory });
  execSync(`git init`, { cwd: directory });
  execSync(`git add . && git commit -am "initial commit"`, { cwd: directory });

  console.log(`🎄🎄🎄 Success!! Happy Coding! 🎄🎄🎄`);
}

main();
