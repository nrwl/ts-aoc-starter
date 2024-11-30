# ts-aoc-starter

This package is an Nx Plugin, designed to enhance your Typescript experience with [Advent of Code](https://adventofcode.com)!

## Workspace Graph Plugin

The packaged `dynamic-tasks` workspace graph plugin is provided in this package. By adding this to your `nx.json` in the `plugins` array to enable it (this is already done for you!), you are informing nx about tasks for your workspace. This is how Nx knows what to run for example when you run the command: `nx day-1-a` or `nx watch-day-1-a`.

## Generators

### preset

The `preset` generator is the generator used to create a new workspace when running the command: `npx create-ts-aoc-starter`. You should never run this generator manually!
