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

describe('gendiff', () => {
  describe('flat files', () => {
    // Прочитаем ожидаемый результат для плоских файлов
    const expectedFlatPath = getFixturePath('expected_flat.txt');
    const expectedFlat = normalizeLineEndings(readFileSync(expectedFlatPath, 'utf-8'));

    test('compares flat JSON files', () => {
      const filepath1 = getFixturePath('file1.json');
      const filepath2 = getFixturePath('file2.json');
      const result = normalizeLineEndings(genDiff(filepath1, filepath2));
      expect(result).toBe(expectedFlat);
    });

    test('compares flat YAML files', () => {
      const filepath1 = getFixturePath('file1.yml');
      const filepath2 = getFixturePath('file2.yml');
      const result = normalizeLineEndings(genDiff(filepath1, filepath2));
      expect(result).toBe(expectedFlat);
    });

    test('compares flat YAML with .yaml extension', () => {
      const filepath1 = getFixturePath('file1.yaml');
      const filepath2 = getFixturePath('file2.yaml');
      const result = normalizeLineEndings(genDiff(filepath1, filepath2));
      expect(result).toBe(expectedFlat);
    });

    test('throws error for unsupported format', () => {
      const unsupportedFile = getFixturePath('unsupported.txt');
      expect(() => genDiff(unsupportedFile, unsupportedFile))
        .toThrow('Unsupported file format: txt');
    });

    test('works without format option', () => {
      const filepath1 = getFixturePath('file1.json');
      const filepath2 = getFixturePath('file2.json');
      const result = normalizeLineEndings(genDiff(filepath1, filepath2));
      expect(result).toBe(expectedFlat);
    });
  });

  describe('nested files', () => {
    // Прочитаем ожидаемый результат для вложенных файлов
    const expectedNestedPath = getNestedFixturePath('expected_stylish.txt');
    const expectedNested = normalizeLineEndings(readFileSync(expectedNestedPath, 'utf-8'));

    test('compares nested JSON files', () => {
      const filepath1 = getNestedFixturePath('file1.json');
      const filepath2 = getNestedFixturePath('file2.json');
      const result = normalizeLineEndings(genDiff(filepath1, filepath2));
      expect(result).toBe(expectedNested);
    });

    test('compares nested YAML files', () => {
      const filepath1 = getNestedFixturePath('file1.yaml');
      const filepath2 = getNestedFixturePath('file2.yaml');
      const result = normalizeLineEndings(genDiff(filepath1, filepath2));
      expect(result).toBe(expectedNested);
    });
  });
});
