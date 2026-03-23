#!/usr/bin/env node

const { Command } = require('commander');
const genDiff = require('../src/index.js');

const program = new Command();

program
  .name('gendiff')
  .description('Compares two configuration files and shows a difference.')
  .version('1.0.0')
  .option('-f, --format [type]', 'output format', 'stylish')
  .argument('<filepath1>')
  .argument('<filepath2>')
  .action((filepath1, filepath2, options) => {
    const format = options.format || 'stylish';
    try {
      const diff = genDiff(filepath1, filepath2, format);
      console.log(diff);
    } catch (error) {
      console.error('Error:', error.message);
      process.exit(1);
    }
  });

program.parse();
