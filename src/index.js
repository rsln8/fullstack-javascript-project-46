import { readFile } from './parsers.js';
import _ from 'lodash';

function formatValue(value) {
  if (_.isBoolean(value)) {
    return value.toString();
  }
  if (_.isNull(value)) {
    return 'null';
  }
  if (_.isNumber(value)) {
    return value.toString();
  }
  if (_.isObject(value) && !_.isArray(value)) {
    return '[complex value]';
  }
  return value;
}

function buildDiff(obj1, obj2) {
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);
  const allKeys = _.sortBy(_.union(keys1, keys2));
  
  return allKeys.map((key) => {
    const hasKey1 = _.has(obj1, key);
    const hasKey2 = _.has(obj2, key);
    const value1 = obj1[key];
    const value2 = obj2[key];
    
    if (!hasKey1) {
      return `  + ${key}: ${formatValue(value2)}`;
    }
    
    if (!hasKey2) {
      return `  - ${key}: ${formatValue(value1)}`;
    }
    
    if (_.isEqual(value1, value2)) {
      return `    ${key}: ${formatValue(value1)}`;
    }
    
    return `  - ${key}: ${formatValue(value1)}\n  + ${key}: ${formatValue(value2)}`;
  });
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
