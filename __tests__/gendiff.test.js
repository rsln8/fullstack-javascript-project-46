import { describe, test, expect } from '@jest/globals';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import genDiff from '../src/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);
const readFile = (filename) => fs.readFileSync(getFixturePath(filename), 'utf-8');

describe('gendiff', () => {
  const testCases = [
    {
      file1: 'file1.json',
      file2: 'file2.json',
      format: 'stylish',
      expected: 'expected_stylish.txt',
    },
    {
      file1: 'file1.yml',
      file2: 'file2.yml',
      format: 'stylish',
      expected: 'expected_stylish.txt',
    },
    {
      file1: 'nested_file1.json',
      file2: 'nested_file2.json',
      format: 'stylish',
      expected: 'expected_nested_stylish.txt',
    },
    {
      file1: 'nested_file1.yml',
      file2: 'nested_file2.yml',
      format: 'stylish',
      expected: 'expected_nested_stylish.txt',
    },
    {
      file1: 'nested_file1.json',
      file2: 'nested_file2.json',
      format: 'plain',
      expected: 'expected_plain.txt',
    },
    {
      file1: 'nested_file1.yml',
      file2: 'nested_file2.yml',
      format: 'plain',
      expected: 'expected_plain.txt',
    },
    {
      file1: 'nested_file1.json',
      file2: 'nested_file2.json',
      format: 'json',
      expected: 'expected_json.txt',
    },
  ];

  test.each(testCases)('$file1 $file2 $format', ({
    file1, file2, format, expected,
  }) => {
    const result = genDiff(getFixturePath(file1), getFixturePath(file2), format);
    expect(result).toEqual(readFile(expected).trim());
  });
});
