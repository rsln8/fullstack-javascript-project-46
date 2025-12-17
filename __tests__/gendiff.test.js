import { join } from 'path';
import { readFileSync } from 'fs';
import genDiff from '../src/index.js';

const getFixturePath = (filename) => {
  return join(process.cwd(), '__tests__', '__fixtures__', filename);
};

const getNestedFixturePath = (filename) => {
  return join(process.cwd(), '__tests__', '__fixtures__', 'nested', filename);
};

// Функция для нормализации концов строк
const normalizeLineEndings = (str) => str.replace(/\r\n/g, '\n').trim();

// Функция для чтения файлов
const readFile = (filepath) => normalizeLineEndings(readFileSync(filepath, 'utf-8'));

describe('gendiff', () => {
  describe('flat files', () => {
    test('compares flat JSON files', () => {
      const filepath1 = getFixturePath('file1.json');
      const filepath2 = getFixturePath('file2.json');
      const expected = readFile(getFixturePath('expected_flat.txt'));
      expect(genDiff(filepath1, filepath2)).toBe(expected);
    });

    test('compares flat YAML files', () => {
      const filepath1 = getFixturePath('file1.yml');
      const filepath2 = getFixturePath('file2.yml');
      const expected = readFile(getFixturePath('expected_flat.txt'));
      expect(genDiff(filepath1, filepath2)).toBe(expected);
    });

    test('compares flat YAML with .yaml extension', () => {
      const filepath1 = getFixturePath('file1.yaml');
      const filepath2 = getFixturePath('file2.yaml');
      const expected = readFile(getFixturePath('expected_flat.txt'));
      expect(genDiff(filepath1, filepath2)).toBe(expected);
    });

    test('throws error for unsupported format', () => {
      const unsupportedFile = getFixturePath('unsupported.txt');
      expect(() => genDiff(unsupportedFile, unsupportedFile))
        .toThrow('Unsupported file format: txt');
    });

    test('works without format option', () => {
      const filepath1 = getFixturePath('file1.json');
      const filepath2 = getFixturePath('file2.json');
      const expected = readFile(getFixturePath('expected_flat.txt'));
      expect(genDiff(filepath1, filepath2)).toBe(expected);
    });
  });

  describe('nested files', () => {
    test('compares nested JSON files', () => {
      const filepath1 = getNestedFixturePath('file1.json');
      const filepath2 = getNestedFixturePath('file2.json');
      const expected = readFile(getNestedFixturePath('expected_stylish.txt'));
      expect(genDiff(filepath1, filepath2)).toBe(expected);
    });

    test('compares nested YAML files', () => {
      const filepath1 = getNestedFixturePath('file1.yaml');
      const filepath2 = getNestedFixturePath('file2.yaml');
      const expected = readFile(getNestedFixturePath('expected_stylish.txt'));
      expect(genDiff(filepath1, filepath2)).toBe(expected);
    });
  });

  describe('formatters', () => {
    test('compares nested JSON files with plain format', () => {
      const file1 = getNestedFixturePath('file1.json');
      const file2 = getNestedFixturePath('file2.json');
      const expected = readFile(getNestedFixturePath('expected_plain.txt'));
      expect(genDiff(file1, file2, 'plain')).toBe(expected);
    });

    test('compares nested YAML files with plain format', () => {
      const file1 = getNestedFixturePath('file1.yaml');
      const file2 = getNestedFixturePath('file2.yaml');
      const expected = readFile(getNestedFixturePath('expected_plain.txt'));
      expect(genDiff(file1, file2, 'plain')).toBe(expected);
    });

    test('uses stylish format by default', () => {
      const file1 = getNestedFixturePath('file1.json');
      const file2 = getNestedFixturePath('file2.json');
      const expected = readFile(getNestedFixturePath('expected_stylish.txt'));
      expect(genDiff(file1, file2)).toBe(expected);
      expect(genDiff(file1, file2, 'stylish')).toBe(expected);
    });

    test('throws error for unknown format', () => {
      const file1 = getFixturePath('file1.json');
      const file2 = getFixturePath('file2.json');
      expect(() => genDiff(file1, file2, 'unknown')).toThrow('Unknown format: unknown');
    });
  });
});

    test('compares nested JSON files with json format', () => {
      const file1 = getNestedFixturePath('file1.json');
      const file2 = getNestedFixturePath('file2.json');
      const result = genDiff(file1, file2, 'json');
      // JSON формат должен возвращать валидный JSON
      expect(() => JSON.parse(result)).not.toThrow();
      const parsed = JSON.parse(result);
      expect(Array.isArray(parsed)).toBe(true);
      // Проверим что есть ожидаемые свойства
      expect(parsed.some(item => item.key === 'common')).toBe(true);
    });

    test('compares nested YAML files with json format', () => {
      const file1 = getNestedFixturePath('file1.yaml');
      const file2 = getNestedFixturePath('file2.yaml');
      const result = genDiff(file1, file2, 'json');
      expect(() => JSON.parse(result)).not.toThrow();
      const parsed = JSON.parse(result);
      expect(Array.isArray(parsed)).toBe(true);
    });
