# create-ts-aoc-starter

## Getting Started

```terminal
npx create-ts-aoc-starter
```

This will create a new workspace in the current directory with the following structure:

```file-tree
ts-aoc-starter
├── day-1
│   ├── a.data.txt
│   ├── a.data.sample.txt
│   ├── a.ts
│   ├── b.data.txt
│   ├── b.data.sample.txt
│   └── b.ts
├── day-2
├── day-3
```

## Running the Puzzles

Provide your solution to the first part of everyday in the `day-X/a.ts` file (where `X` is the day number!):

```ts
import { runSolution } from '../utils.ts';

/** provide your solution as the return of this function */
export async function day1a(data: string[]) {
  console.log(data);
  return 0;
}

await runSolution(day1a);
```

Copy and paste your unique actual data set into the `day-X/a.data.txt` file. To run your solution against this data set, you can run:
- `nx day-X-a`
- or `nx X-a`
- or `nx X`.

You can copy and paste the sample data given in the problem into the `day-X/a.data.sample.txt` file, and run it with the command:
- `nx day-X-a-sample`
- or `nx X-a-sample` 
- or `nx X-sample`.

If you want to provide an additional data set, you can create a file following the format: `day-X/a.data.{DATA_SET_NAME}.txt`. You can then run your solution against this data set with the command:
- `nx day-X-a-{DATA_SET_NAME}`
- or `nx X-a-{DATA_SET_NAME}`
- or `nx X-{DATA_SET_NAME}`.

Usually, each day is split into two parts, in this template, we call it "part A" and "part B". A `day-X/b.ts` file has been provided for you for the second half of each day, as well as a matching set of `data.txt` files for part B. You can run these with the command: `nx day-X-b` or `nx X-b` (note that `nx X` will always only run 'part A'). The same rules apply for providing sample and additional data sets for part B.

Usually part B builds on the solution for part A. Obviously, if it makes sense, you can just continue to create your solution in the 'part A' files and work on from there, ignoring the 'part B' files.

## File Watching

Every command above supports a `watch-` version of the command as well. For example, if you'd like to run your command: `nx day-1-a-sample` and have it re-run whenever a file is saved, you can run the command: `nx watch-day-1-a-sample`.
