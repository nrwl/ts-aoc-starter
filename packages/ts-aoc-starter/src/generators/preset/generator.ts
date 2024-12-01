import {
  addDependenciesToPackageJson,
  formatFiles,
  installPackagesTask,
  Tree,
} from '@nx/devkit';
import * as path from 'path';

export async function presetGenerator(tree: Tree) {
  await addDependenciesToPackageJson(
    tree,
    {
      chalk: 'latest',
    },
    {
      '@types/node': 'latest',
      typescript: 'latest',
      tsx: 'latest',
      '@eslint/js': '^9.16.0',
      eslint: '^9.16.0',
      'eslint-config-prettier': '^9.1.0',
      'eslint-plugin-prettier': '^5.2.1',
      prettier: '^3.4.1',
      globals: '^15.12.0',
      'typescript-eslint': '^8.16.0',
    }
  );
  await installPackagesTask(tree, true, undefined, 'pnpm');
  const days = [] as string[];
  for (let i = 1; i <= 25; i++) {
    days.push(`day-${i}`);
  }
  for (const dayName of days) {
    createPuzzlePart(tree, `a`, dayName);
    createPuzzlePart(tree, `b`, dayName);
  }
  makeChangesToNxJson(tree);
  addTsConfig(tree);
  addUtilsFile(tree);
  addModuleToPackageJson(tree);
  addPrettierConfig(tree);
  addEslintConfig(tree);
  updateReadme(tree);
  await formatFiles(tree);
}

function createPuzzlePart(tree: Tree, part: 'a' | 'b', dayName: string): void {
  createPuzzleTsFile(tree, part, dayName);
  createSampleDataFile(tree, part, dayName);
  createActualDataFile(tree, part, dayName);
}

function createPuzzleTsFile(tree: Tree, part: 'a' | 'b', dayName: string) {
  const filePath = path.join(dayName, `${part}.ts`);
  const functionName = `${rmDashes(dayName)}${part}`;
  const content = `import { runSolution } from '../utils.ts';

/** provide your solution as the return of this function */
export async function ${functionName}(data: string[]) {
  console.log(data);
  return 0;
}

await runSolution(${functionName});
`;
  tree.write(filePath, content);
}

function createSampleDataFile(tree: Tree, part: 'a' | 'b', dayName: string) {
  const filePath = path.join(dayName, `${part}.data.sample.txt`);
  const content = '';
  tree.write(filePath, content);
}

function createActualDataFile(tree: Tree, part: 'a' | 'b', dayName: string) {
  const filePath = path.join(dayName, `${part}.data.txt`);
  const content = '';
  tree.write(filePath, content);
}

function addUtilsFile(tree: Tree) {
  const content = `import chalk from 'chalk';
import { readFile } from 'fs/promises';
import { join } from 'path';

export async function runSolution(solution: (data: string[]) => any) {
  const data = await readData();
  const answer = await solution(data);
  console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
}

export async function readData() {
  const [_, fullPath, dataSet] = process.argv as
    | [string, string, string]
    | [string, string];
  const puzzle = fullPath.split('/').slice(-2).join('/');
  const [day, part] = puzzle
    .split('/')
    .map((x, i) => (i === 0 ? +x.split('-')[1] : x)) as [number, 'a' | 'b'];
  const fileName = createFileName(day, part, dataSet);
  const data = (await readFile(fileName)).toString().split('\\n');
  return data;
}

function createFileName(day: number, part: 'a' | 'b', dataSet?: string) {
  return join(\`day-\${day}\`, \`\${part}.data\${dataSet ? \`.\${dataSet}\` : ''}.txt\`);
}

`;
  tree.write('utils.ts', content);
}

function makeChangesToNxJson(tree: Tree) {
  // read in current nx.json
  const currentContent = JSON.parse(tree.read('nx.json').toString());
  // add the plugin to the plugins array
  currentContent.plugins = currentContent.plugins
    ? [...currentContent.plugins, `ts-aoc-starter/src/plugins/dynamic-tasks.js`]
    : [`ts-aoc-starter/src/plugins/dynamic-tasks.js`];
  // add defaultProject settings:
  currentContent.defaultProject = 'aoc';
  // write the nx.json back to the tree
  tree.write('nx.json', JSON.stringify(currentContent, null, 2));
}

function addTsConfig(tree: Tree) {
  const filePath = 'tsconfig.json';
  const content = `{
  "compilerOptions": {
    "module": "nodenext",
    "target": "ESNext",
    "types": ["node"],
    "allowImportingTsExtensions": true,
    "noEmit": true
  }
}
`;
  tree.write(filePath, content);
}

function addModuleToPackageJson(tree: Tree) {
  const packageJson = JSON.parse(tree.read('package.json').toString());
  packageJson.type = 'module';
  tree.write('package.json', JSON.stringify(packageJson, null, 2));
}

function addPrettierConfig(tree: Tree) {
  const content = `/**
 * @see https://prettier.io/docs/en/configuration.html
 * @type {import("prettier").Config}
 */
export default {
  singleQuote: true,
};
`;
  tree.write('prettier.config.js', content);
}

function addEslintConfig(tree: Tree) {
  const content = `import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettierRecommended from 'eslint-plugin-prettier/recommended';
import eslintConfigPrettier from 'eslint-config-prettier';


/** @type {import('eslint').Linter.Config[]} */
export default [
  {files: ['**/*.{js,mjs,cjs,ts}']},
  {languageOptions: { globals: globals.node }},
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  prettierRecommended,
  eslintConfigPrettier,
];
`;
  tree.write('eslint.config.js', content);
}

function updateReadme(tree: Tree) {
  const content = `# ts-aoc-starter

## Video On How To Use This Starter

[Watch the video](https://www.youtube.com/watch?v=st6Yq-19bW8)

## Running the Puzzles

Provide your solution to the first part of everyday in the \`day-X/a.ts\` file (where \`X\` is the day number!):

\`ts
import { runSolution } from '../utils.ts';

/** provide your solution as the return of this function */
export async function day1a(data: string[]) {
  console.log(data);
  return 0;
}

await runSolution(day1a);
\`

Copy and paste your unique actual data set into the \`day-X/a.data.txt\` file. To run your solution against this data set, you can run:
- \`nx day-X-a\`
- or \`nx X-a\`
- or \`nx X\`.

You can copy and paste the sample data given in the problem into the \`day-X/a.data.sample.txt\` file, and run it with the command:
- \`nx day-X-a-sample\`
- or \`nx X-a-sample\`
- or \`nx X-sample\`.

If you want to provide an additional data set, you can create a file following the format: \`day-X/a.data.{DATA_SET_NAME}.txt\`. You can then run your solution against this data set with the command:
- \`nx day-X-a-{DATA_SET_NAME}\`
- or \`nx X-a-{DATA_SET_NAME}\`
- or \`nx X-{DATA_SET_NAME}\`.

Usually, each day is split into two parts, in this template, we call it "part A" and "part B". A \`day-X/b.ts\` file has been provided for you for the second half of each day, as well as a matching set of \`data.txt\` files for part B. You can run these with the command: \`nx day-X-b\` or \`nx X-b\` (note that \`nx X\` will always only run 'part A'). The same rules apply for providing sample and additional data sets for part B.

Usually part B builds on the solution for part A. Obviously, if it makes sense, you can just continue to create your solution in the 'part A' files and work on from there, ignoring the 'part B' files.

## File Watching

Every command above supports a \`watch-\` version of the command as well. For example, if you'd like to run your command: \`nx day-1-a-sample\` and have it re-run whenever a file is saved, you can run the command: \`nx watch-day-1-a-sample\`.

`;
  tree.write('README.md', content);
}

function rmDashes(name: string): string {
  let answer = name;
  while (answer.includes('-')) {
    answer = answer.replace('-', '');
  }
  return answer;
}

export default presetGenerator;
