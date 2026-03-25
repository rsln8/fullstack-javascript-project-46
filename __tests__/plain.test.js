import { test, expect, describe } from '@jest/globals';
import path from 'path';
import { fileURLToPath } from 'url';
import genDiff from '../src/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getFixturePath = (filename) => path.join(__dirname, '__fixtures__', filename);

describe('Plain format', () => {
  test('should output plain format for flat JSON files', () => {
    const filepath1 = getFixturePath('file1.json');
    const filepath2 = getFixturePath('file2.json');
    
    const result = genDiff(filepath1, filepath2, 'plain');
    
    const expected = [
      "Property 'follow' was removed",
      "Property 'proxy' was removed",
      "Property 'timeout' was updated. From 50 to 20",
      "Property 'verbose' was added with value: true",
    ].join('\n');
    
    expect(result).toBe(expected);
  });
  
  test('should output plain format for nested JSON files', () => {
    const filepath1 = getFixturePath('nested1.json');
    const filepath2 = getFixturePath('nested2.json');
    
    const result = genDiff(filepath1, filepath2, 'plain');
    
    // Проверяем ключевые элементы
    expect(result).toContain("Property 'common.follow' was added with value: false");
    expect(result).toContain("Property 'common.setting2' was removed");
    expect(result).toContain("Property 'common.setting3' was updated. From [complex value] to null");
    expect(result).toContain("Property 'common.setting4' was added with value: 'blah blah'");
    expect(result).toContain("Property 'common.setting5' was added with value: [complex value]");
    expect(result).toContain("Property 'common.setting6.doge.wow' was updated. From '' to 'so much'");
    expect(result).toContain("Property 'common.setting6.ops' was added with value: 'vops'");
    expect(result).toContain("Property 'group1.baz' was updated. From 'bas' to 'bars'");
    expect(result).toContain("Property 'group1.nest' was updated. From [complex value] to 'str'");
    expect(result).toContain("Property 'group2' was removed");
    expect(result).toContain("Property 'group3' was added with value: [complex value]");
  });
});
