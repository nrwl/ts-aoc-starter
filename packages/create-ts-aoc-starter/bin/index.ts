#!/usr/bin/env node

import { execSync } from 'child_process';
import { createWorkspace } from 'create-nx-workspace';
import * as readline from 'readline';

const prompter = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function main() {
  const location = await promptWithDefault(
    'Where should I create your Typescript Advent of Code Starter Repo?',
    'aoc'
  );
  console.log(
    `🎄🎄🎄 Creating your Typescript Advent of Code Starter Repo... 🎄🎄🎄`
  );

  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const presetVersion = require('../package.json').version;

  const { directory } = await createWorkspace(
    `ts-aoc-starter@${presetVersion}`,
    {
      name: location,
      nxCloud: 'skip',
      packageManager: 'pnpm',
      verbose: true,
    }
  );

  execSync(`pnpm i`, { cwd: directory });
  execSync(`git init`, { cwd: directory });
  execSync(`git add . && git commit -am "initial commit"`, { cwd: directory });

  console.log(`🎄🎄🎄 Success!! Happy Coding! 🎄🎄🎄`);
}

function promptWithDefault(question, defaultValue) {
  return new Promise<string>((resolve) => {
    prompter.question(`${question} (${defaultValue}): `, (answer) => {
      resolve(answer || defaultValue);
    });
  });
}

main();
