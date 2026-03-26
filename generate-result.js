import genDiff from './src/index.js';
import fs from 'fs';

const result = genDiff('__tests__/__fixtures__/nested1.json', '__tests__/__fixtures__/nested2.json', 'json');
fs.writeFileSync('__tests__/__fixtures__/result_nested_json.txt', result, 'utf8');