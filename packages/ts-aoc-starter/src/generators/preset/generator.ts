import {
  addDependenciesToPackageJson,
  formatFiles,
  installPackagesTask,
  readJsonFile,
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
    }
  );
  await installPackagesTask(tree);
  const days = [] as string[];
  for (let i = 1; i <= 25; i++) {
    days.push(`day-${i}`);
  }
  for (const dayName of days) {
    createPuzzlePart(tree, `a`, dayName);
    createPuzzlePart(tree, `b`, dayName);
  }
  addDynamicTasksPlugin(tree);
  addTsConfig(tree);
  addUtilsFile(tree);
  addModuleToPackageJson(tree);
  addPrettierRc(tree);
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

/** provide your solution as the return of this function *
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
  const data = (await readFile(fileName)).toString().split('\n');
  return data;
}

function createFileName(day: number, part: 'a' | 'b', dataSet?: string) {
  return join(\`day-\${day}\`, \`\${part}.data\${dataSet ? \`.\${dataSet}\` : ''}.txt\`);
}

`;
  tree.write('utils.ts', content);
}

function addDynamicTasksPlugin(tree: Tree) {
  // read in current nx.json
  const currentContent = JSON.parse(tree.read('nx.json').toString());
  // add the plugin to the plugins array
  currentContent.plugins = currentContent.plugins
    ? [...currentContent.plugins, `ts-aoc-starter/src/plugins/dynamic-tasks.js`]
    : [`ts-aoc-starter/src/plugins/dynamic-tasks.js`];
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

function addPrettierRc(tree: Tree) {
  const content = `{
  "singleQuote": true,
}
`;
  tree.write('.prettierrc', content);
}

function updateReadme(tree: Tree) {
  const content = `# ts-aoc-starter

## Getting Started

\`\`\`terminal
npx create-ts-aoc-starter
\`\`\`

This will create a new workspace in the current directory with the following structure:

\`\`\`file-tree
ts-aoc-starter
├── puzzles
│   ├── day-1
│   │   ├── day-1-a.data.txt
│   │   ├── day-1-a.sample-data.txt
│   │   ├── day-1-a.ts
│   │   ├── day-1-b.data.txt
│   │   ├── day-1-b.sample-data.txt
│   │   └── day-1-b.ts
│   ├── day-2
│   ├── day-3
\`\`\`

## Running the Puzzles

Copy and paste the sample data given in the problem into the \`day-X-a.sample-data.txt\` file.

Copy and paste your larger unique actual data set into the \`day-X-a.data.txt\` file.

Add your solution to the \`day-X-a.ts\` file.

To run your solution against your sample data set, run the following command:

\`\`\`terminal
nx day-1-a --data=sample
\`\`\`

or

\`\`\`terminal
npm run day-1-a:sample
\`\`\`

To run your solution against your actual data set, run the following command:

\`\`\`terminal
nx day-1-a
\`\`\`

or

\`\`\`terminal
npm run day-1-a
\`\`\`
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
