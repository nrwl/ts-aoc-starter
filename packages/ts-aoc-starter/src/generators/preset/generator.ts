import {
  addProjectConfiguration,
  formatFiles,
  ProjectConfiguration,
  TargetConfiguration,
  Tree,
  installPackagesTask,
  addDependenciesToPackageJson,
} from '@nx/devkit';
import * as path from 'path';

export async function presetGenerator(tree: Tree) {
  await addDependenciesToPackageJson(
    tree,
    {
      chalk: 'latest',
      '@nx/node': '17.3.1',
    },
    {}
  );
  await installPackagesTask(tree);
  const days = [] as string[];
  for (let i = 1; i <= 25; i++) {
    days.push(`day-${i}`);
  }
  const projectConfiguration: ProjectConfiguration = {
    root: '.',
    targets: {},
  };
  for (const dayName of days) {
    const targetConfigA = createPuzzlePart(tree, `${dayName}-a`);
    projectConfiguration.targets[`${dayName}-a`] = targetConfigA;
    const targetConfigB = createPuzzlePart(tree, `${dayName}-b`);
    projectConfiguration.targets[`${dayName}-b`] = targetConfigB;
  }
  addProjectConfiguration(tree, 'ts-aoc-starter', projectConfiguration);
  await formatFiles(tree);
}

function createPuzzlePart(tree: Tree, name: string): TargetConfiguration {
  const targetConfig = createPuzzleTarget(tree, name);
  createPuzzleTsFile(tree, name);
  createSampleDataFile(tree, name);
  createActualDataFile(tree, name);
  return targetConfig;
}

function createPuzzleTarget(tree: Tree, name: string): TargetConfiguration {
  const targetConfig: TargetConfiguration = {
    executor: 'ts-aoc-starter:puzzle',
    options: {
      target: name,
    },
  };
  return targetConfig;
}

function createPuzzleTsFile(tree: Tree, dayName: string) {
  const filePath = path.join('puzzles', `${dayName}.ts`);
  const content = `import { readData } from '../utils';
  import chalk from 'chalk';
  
  export async function ${rmDashes(dayName)}(dataPath?: string) {
    const data = await readData(dataPath);
    return 0;
  }
  
  const answer = await day23a();
  console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
`;
  tree.write(filePath, content);
}

function createSampleDataFile(tree: Tree, dayName: string) {
  const filePath = path.join('puzzles', `${dayName}.sample-data.txt`);
  const content = '';
  tree.write(filePath, content);
}

function createActualDataFile(tree: Tree, dayName: string) {
  const filePath = path.join('puzzles', `${dayName}.data.txt`);
  const content = '';
  tree.write(filePath, content);
}

function rmDashes(name: string): string {
  return name.replace('-', '');
}

export default presetGenerator;
