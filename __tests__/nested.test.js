import { test, expect, describe } from '@jest/globals';
import path from 'path';
import { fileURLToPath } from 'url';
import genDiff from '../src/index.js';

// ЭТО НУЖНО ОСТАВИТЬ — это аналог __dirname в ES модулях
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ЭТО НУЖНО ДОБАВИТЬ, если ещё нет
const getFixturePath = filename => path.join(__dirname, '__fixtures__', filename);

describe('Nested structures comparison', () => {
  test('should compare nested JSON files correctly', () => {
    const filepath1 = getFixturePath('nested1.json');
    const filepath2 = getFixturePath('nested2.json');

    const result = genDiff(filepath1, filepath2);

    // Проверяем ключевые элементы вывода
    expect(result).toContain('+ follow: false');
    expect(result).toContain('- setting2: 200');
    expect(result).toContain('+ setting3: null');
    expect(result).toContain('+ setting4: blah blah');
    expect(result).toContain('setting5: {');
    expect(result).toContain('key5: value5');
    expect(result).toContain('doge: {');
    expect(result).toContain('+ wow: so much');
    expect(result).toContain('+ ops: vops');
    expect(result).toContain('- baz: bas');
    expect(result).toContain('+ baz: bars');
    expect(result).toContain('- nest: {');
    expect(result).toContain('+ nest: str');
    expect(result).toContain('- group2: {');
    expect(result).toContain('+ group3: {');
  });
});
