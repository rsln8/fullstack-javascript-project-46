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

  test('should compare flat YAML files', () => {
    const filepath1 = getFixturePath('file1.yml');
    const filepath2 = getFixturePath('file2.yml');
    
    const result = genDiff(filepath1, filepath2);
    
    expect(result).toContain('- follow: false');
    expect(result).toContain('host: hexlet.io');
    expect(result).toContain('- proxy: 123.234.53.22');
    expect(result).toContain('- timeout: 50');
    expect(result).toContain('+ timeout: 20');
    expect(result).toContain('+ verbose: true');
  });

  test('should compare nested YAML files', () => {
    const filepath1 = getFixturePath('nested1.yml');
    const filepath2 = getFixturePath('nested2.yml');
    
    const expected = `{
    common: {
      + follow: false
        setting1: Value 1
      - setting2: 200
      - setting3: true
      + setting3: null
      + setting4: blah blah
      + setting5: {
            key5: value5
        }
      setting6: {
          key: value
          doge: {
            - wow: 
            + wow: so much
          }
        + ops: vops
      }
    }
    group1: {
      - baz: bas
      + baz: bars
        foo: bar
      - nest: {
            key: value
        }
      + nest: str
    }
  - group2: {
      abc: 12345
      deep: {
        id: 45
      }
    }
  + group3: {
      deep: {
        id: {
          number: 45
        }
      }
      fee: 100500
    }
}`;
    
    const result = genDiff(filepath1, filepath2);
    expect(result).toBe(expected);
  });
});
