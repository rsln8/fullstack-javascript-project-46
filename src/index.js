import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
// __dirname ???? ?? ????????????, ?? ????? ???????????? ?????
// eslint-disable-next-line no-unused-vars
const __dirname = path.dirname(__filename);

const parseJson = (filepath) => {
  console.log('Reading file:', filepath);
  const content = fs.readFileSync(filepath, 'utf8');
  console.log('Content:', JSON.stringify(content));
  console.log('First char code:', content.charCodeAt(0));

  try {
    return JSON.parse(content);
  } catch (e) {
    console.error('Parse error:', e.message);
    throw e;
  }
};

const genDiff = (filepath1, filepath2) => {
  try {
    const data1 = parseJson(filepath1);
    const data2 = parseJson(filepath2);

    const keys1 = Object.keys(data1);
    const keys2 = Object.keys(data2);
    const allKeys = Array.from(new Set([...keys1, ...keys2])).sort();

    const lines = [];

    allKeys.forEach((key) => {
      if (!Object.hasOwn(data2, key)) {
        lines.push(`  - ${key}: ${data1[key]}`);
      } else if (!Object.hasOwn(data1, key)) {
        lines.push(`  + ${key}: ${data2[key]}`);
      } else if (data1[key] !== data2[key]) {
        lines.push(`  - ${key}: ${data1[key]}`);
        lines.push(`  + ${key}: ${data2[key]}`);
      } else {
        lines.push(`    ${key}: ${data1[key]}`);
      }
    });

    return `{\n${lines.join('\n')}\n}`;
  } catch (error) {
    console.error('Error:', error.message);
    throw error;
  }
};

export default genDiff;
