import { join } from 'path';
import { readFileSync } from 'fs';
import genDiff from '../src/index.js';

const getFixturePath = (filename) => {
  return join(process.cwd(), '__tests__', '__fixtures__', filename);
};

// Функция для нормализации концов строк
const normalizeLineEndings = (str) => str.replace(/\r\n/g, '\n').trim();

describe('gendiff', () => {
  // Прочитаем ожидаемый результат из файла
  const expectedPath = getFixturePath('expected_flat.txt');
  const expected = normalizeLineEndings(readFileSync(expectedPath, 'utf-8'));

  test('compares flat JSON files', () => {
    const filepath1 = getFixturePath('file1.json');
    const filepath2 = getFixturePath('file2.json');
    const result = normalizeLineEndings(genDiff(filepath1, filepath2));
    expect(result).toBe(expected);
  });

  test('compares flat YAML files', () => {
    const filepath1 = getFixturePath('file1.yml');
    const filepath2 = getFixturePath('file2.yml');
    const result = normalizeLineEndings(genDiff(filepath1, filepath2));
    expect(result).toBe(expected);
  });

  test('compares flat YAML with .yaml extension', () => {
    const filepath1 = getFixturePath('file1.yaml');
    const filepath2 = getFixturePath('file2.yaml');
    const result = normalizeLineEndings(genDiff(filepath1, filepath2));
    expect(result).toBe(expected);
  });

  test('throws error for unsupported format', () => {
    const unsupportedFile = getFixturePath('unsupported.txt');
    expect(() => genDiff(unsupportedFile, unsupportedFile))
      .toThrow('Unsupported file format: txt');
  });

  test('works with format option', () => {
    const filepath1 = getFixturePath('file1.json');
    const filepath2 = getFixturePath('file2.json');
    const result = normalizeLineEndings(genDiff(filepath1, filepath2, 'stylish'));
    expect(result).toBe(expected);
  });
});
