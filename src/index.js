import _ from 'lodash';
import { readFile } from './parsers.js';

function formatValue(value, depth = 1) {
  if (_.isObject(value) && !_.isArray(value)) {
    const indent = '    '.repeat(depth);
    const lines = Object.entries(value).map(
      ([k, v]) => `${indent}    ${k}: ${formatValue(v, depth + 1)}`
    );
    return `{\n${lines.join('\n')}\n${indent}}`;
  }
  if (_.isBoolean(value) || _.isNumber(value)) {
    return value.toString();
  }
  if (_.isNull(value)) {
    return 'null';
  }
  return value;
}

function buildDiff(obj1, obj2, depth = 1) {
  const keys = _.sortBy(_.union(Object.keys(obj1), Object.keys(obj2)));
  const indent = '    '.repeat(depth - 1);

  return keys.map((key) => {
    const has1 = _.has(obj1, key);
    const has2 = _.has(obj2, key);
    const val1 = obj1[key];
    const val2 = obj2[key];

    if (!has1) return `${indent}  + ${key}: ${formatValue(val2, depth)}`;
    if (!has2) return `${indent}  - ${key}: ${formatValue(val1, depth)}`;
    if (_.isEqual(val1, val2)) return `${indent}    ${key}: ${formatValue(val1, depth)}`;

    return `${indent}  - ${key}: ${formatValue(val1, depth)}\n${indent}  + ${key}: ${formatValue(val2, depth)}`;
  }).join('\n');
}

export default function genDiff(filepath1, filepath2, format = 'stylish') {
  const data1 = readFile(filepath1);
  const data2 = readFile(filepath2);

  const diff = buildDiff(data1, data2);

  if (format === 'stylish') {
    return `{\n${diff}\n}`;
  }

  return JSON.stringify({ data1, data2 }, null, 2);
}
