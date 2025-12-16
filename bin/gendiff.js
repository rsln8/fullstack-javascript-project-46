#!/usr/bin/env node

import { Command } from 'commander';
import genDiff from '../src/index.js';

const program = new Command();

program
  .name('gendiff')
  .usage('[options] <filepath1> <filepath2>')
  .description('Compares two configuration files and shows a difference.')
  .version('1.0.0')
  .option('-f, --format [type]', 'output format')
  .allowExcessArguments(true) 
  .parse(process.argv);

const options = program.opts();
const args = program.args;

if (args.length !== 2) {
  console.error('Error: Expected 2 file paths');
  program.help();
}

const [filepath1, filepath2] = args;
const format = options.format || 'stylish';

try {
  const diff = genDiff(filepath1, filepath2, format);
  console.log(diff);
} catch (error) {
  console.error('Error:', error.message);
  process.exit(1);
}
