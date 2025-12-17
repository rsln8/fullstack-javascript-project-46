const { join } = require('path');
const genDiff = require('../src/index.js');

const getFixturePath = (filename) => join(__dirname, '__fixtures__', filename);

describe('gendiff', () => {
  // Ожидаемый результат из файла
  const expected = `{
  - follow: false
    host: hexlet.io
  - proxy: 123.234.53.22
  - timeout: 50
  + timeout: 20
  + verbose: true
}`;

  test('compares flat JSON files', () => {
    const filepath1 = getFixturePath('file1.json');
    const filepath2 = getFixturePath('file2.json');
    expect(genDiff(filepath1, filepath2)).toBe(expected);
  });

  test('compares flat YAML files', () => {
    const filepath1 = getFixturePath('file1.yml');
    const filepath2 = getFixturePath('file2.yml');
    expect(genDiff(filepath1, filepath2)).toBe(expected);
  });

  test('compares flat YAML with .yaml extension', () => {
    const filepath1 = getFixturePath('file1.yaml');
    const filepath2 = getFixturePath('file2.yaml');
    expect(genDiff(filepath1, filepath2)).toBe(expected);
  });

  test('throws error for unsupported format', () => {
    const unsupportedFile = getFixturePath('unsupported.txt');
    expect(() => genDiff(unsupportedFile, unsupportedFile))
      .toThrow('Unsupported file format: .txt');
  });

  test('works with format option', () => {
    const filepath1 = getFixturePath('file1.json');
    const filepath2 = getFixturePath('file2.json');
    const result = genDiff(filepath1, filepath2, 'stylish');
    expect(result).toBe(expected);
  });
});
