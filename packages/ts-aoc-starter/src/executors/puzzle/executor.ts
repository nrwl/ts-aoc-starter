import { execSync } from 'child_process';
import { PuzzleExecutorSchema } from './schema';
import * as path from 'path';

export default async function runExecutor(options: PuzzleExecutorSchema) {
  const tsFile = path.join(
    'puzzles',
    getDayFromTarget(options.target),
    `${options.target}.ts`
  );
  const dataFile = path.join(
    'puzzles',
    getDayFromTarget(options.target),
    `${options.target}.${options.data === 'sample' ? 'sample-' : ''}data.txt`
  );
  execSync(`npx ts-node --esm ${tsFile} ${dataFile}`, { stdio: 'inherit' });
  return { success: true };
}

function getDayFromTarget(target: string) {
  const tokens = target.split('-');
  return `${tokens[0]}-${tokens[1]}`;
}
