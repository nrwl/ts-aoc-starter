import type {
  CreateNodesResult,
  CreateNodesResultV2,
  CreateNodesV2,
} from '@nx/devkit';

export const createNodesV2: CreateNodesV2 = [
  'day-*/*.data*.txt',
  async (files, _options): Promise<CreateNodesResultV2> => {
    const result = [];
    for (const file of files) {
      result.push(createTargetForFile(file));
    }
    return result;
  },
];

function createTargetForFile(file: string): [string, CreateNodesResult] {
  const [day, part, dataSetName] = deriveFromFileName(file);
  const aliases = [
    `day-${day}-${part}${dataSetName ? `-${dataSetName}` : ''}`,
    `${day}-${part}${dataSetName ? `-${dataSetName}` : ''}`,
  ];
  if (part === 'a') {
    aliases.push(`day-${day}${dataSetName ? `-${dataSetName}` : ''}`);
    aliases.push(`${day}${dataSetName ? `-${dataSetName}` : ''}`);
  }
  const task = {
    command: `tsx day-${day}/${part}${dataSetName ? ` ${dataSetName}` : ''}`,
  };
  const result: [string, CreateNodesResult] = [
    file,
    {
      projects: {
        '.': {
          name: 'aoc',
          root: '.',
          sourceRoot: '.',
          targets: {},
        },
      },
    },
  ];
  for (const alias of aliases) {
    result[1].projects['.'].targets[alias] = task;
  }
  return result;
}

function deriveFromFileName(file) {
  const [directory, fileName] = file.split('/');
  const day = directory.split('-')[1];
  const part = fileName.split('.')[0];
  // 'day-1/a.data.txt' => dataSetName should be undefined
  // 'day-1/a.data.sample.txt' => dataSetName should be 'sample'
  // 'day-1/a.data.foo.txt' => dataSetName should be 'foo'
  const dataSetName =
    file.split('.').length === 3 ? undefined : file.split('.')[2];
  return dataSetName ? [day, part, dataSetName] : [day, part];
}
