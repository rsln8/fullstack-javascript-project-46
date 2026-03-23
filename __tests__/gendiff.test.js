const path = require('path');
const genDiff = require('../src/index.js');

const getFixturePath = (filename) => path.join(__dirname, '__fixtures__', filename);

describe('gendiff', () => {
  test('should compare two flat JSON files correctly', () => {
    const filepath1 = getFixturePath('file1.json');
    const filepath2 = getFixturePath('file2.json');
    
    const expected = `{
  - follow: false
    host: hexlet.io
  - proxy: 123.234.53.22
  - timeout: 50
  + timeout: 20
  + verbose: true
}`;
    
    const result = genDiff(filepath1, filepath2);
    expect(result).toBe(expected);
  });

  // Временно пропускаем YAML тесты
  test.skip('compares flat YAML files', () => {
    // Будет реализовано в следующем шаге
  });

  test.skip('compares flat YAML with .yaml extension', () => {
    // Будет реализовано в следующем шаге
  });
});
