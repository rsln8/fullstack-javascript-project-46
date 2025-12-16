import { readFile } from './parsers.js';

export default function genDiff(filepath1, filepath2, format = 'stylish') {
  const data1 = readFile(filepath1);
  const data2 = readFile(filepath2);

  const keys = Array.from(new Set([...Object.keys(data1), ...Object.keys(data2)])).sort();
  const diff = keys.map((key) => {
    if (!(key in data2)) return `- ${key}: ${data1[key]}`;
    if (!(key in data1)) return `+ ${key}: ${data2[key]}`;
    if (data1[key] !== data2[key]) return `- ${key}: ${data1[key]}\n+ ${key}: ${data2[key]}`;
    return `  ${key}: ${data1[key]}`;
  });

  return diff.join('\n');
}
