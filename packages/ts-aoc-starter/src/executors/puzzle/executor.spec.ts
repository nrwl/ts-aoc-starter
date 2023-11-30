import { PuzzleExecutorSchema } from './schema';
import executor from './executor';

const options: PuzzleExecutorSchema = {};

describe('Puzzle Executor', () => {
  it('can run', async () => {
    const output = await executor(options);
    expect(output.success).toBe(true);
  });
});
