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
  addTsConfig(tree);
  addSharedFile(tree);
  addModuleToPackageJson(tree);
  removeNxJson(tree);
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

function addSharedFile(tree: Tree) {
  const content = `import { readFile } from 'fs/promises';

export async function readData(path?: string) {
  const fileName = path || process.argv[2];
  const data = (await readFile(fileName)).toString().split('\\n');
  return data;
}
`;
  tree.write('shared.ts', content);
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

function removeNxJson(tree: Tree) {
  tree.delete('nx.json');
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
