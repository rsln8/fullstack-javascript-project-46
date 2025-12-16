import { readFile } from './parsers.js';
import _ from 'lodash';

const INDENT = '    ';

function formatValue(value, depth) {
  if (_.isObject(value) && !_.isArray(value)) {
    const entries = Object.entries(value);
    const indent = INDENT.repeat(depth + 1);
    const closingIndent = INDENT.repeat(depth);
    const formattedEntries = entries.map(
      ([key, val]) => `${indent}${key}: ${formatValue(val, depth + 1)}`
    );
    return `{\n${formattedEntries.join('\n')}\n${closingIndent}}`;
  }
  if (_.isBoolean(value) || _.isNumber(value)) {
    return value.toString();
  }
  if (_.isNull(value)) {
    return 'null';
  }
  return value;
}

function buildDiff(obj1, obj2, depth = 0) {
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);
  const allKeys = _.sortBy(_.union(keys1, keys2));
  const indent = INDENT.repeat(depth);

  const lines = allKeys.flatMap((key) => {
    const hasKey1 = _.has(obj1, key);
    const hasKey2 = _.has(obj2, key);
    const value1 = obj1[key];
    const value2 = obj2[key];

    if (!hasKey1) {
      return `${indent}  + ${key}: ${formatValue(value2, depth + 1)}`;
    }

    if (!hasKey2) {
      return `${indent}  - ${key}: ${formatValue(value1, depth + 1)}`;
    }

    if (_.isEqual(value1, value2)) {
      return `${indent}    ${key}: ${formatValue(value1, depth + 1)}`;
    }

    if (_.isObject(value1) && _.isObject(value2)) {
      const nested = buildDiff(value1, value2, depth + 1);
      return `${indent}    ${key}: {\n${nested.join('\n')}\n${indent}    }`;
    }

    return [
      `${indent}  - ${key}: ${formatValue(value1, depth + 1)}`,
      `${indent}  + ${key}: ${formatValue(value2, depth + 1)}`,
    ];
  });

  return lines.flat();
}

export default function genDiff(filepath1, filepath2, format = 'stylish') {
  const data1 = readFile(filepath1);
  const data2 = readFile(filepath2);

  const diffLines = buildDiff(data1, data2);

  if (format === 'stylish') {
    return `{\n${diffLines.join('\n')}\n}`;
  }

  return JSON.stringify({ data1, data2 }, null, 2);
}
