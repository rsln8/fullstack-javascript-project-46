import { readFile } from './parsers.js';
import _ from 'lodash';

function stringify(value, depth = 0) {
  const indent = '    '.repeat(depth);
  const bracketIndent = '    '.repeat(depth - 1);
  
  if (_.isObject(value) && !_.isArray(value)) {
    const entries = Object.entries(value);
    if (entries.length === 0) return '{}';
    
    const lines = entries.map(([key, val]) => {
      return `${indent}    ${key}: ${stringify(val, depth + 1)}`;
    });
    return `{\n${lines.join('\n')}\n${bracketIndent}}`;
  }
  
  if (_.isBoolean(value)) return value.toString();
  if (_.isNull(value)) return 'null';
  if (_.isNumber(value)) return value.toString();
  if (_.isString(value)) return value;
  return JSON.stringify(value);
}

function buildDiff(obj1, obj2, depth = 1) {
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);
  const allKeys = _.sortBy(_.union(keys1, keys2));
  
  const indent = '    '.repeat(depth);
  const result = [];
  
  allKeys.forEach((key) => {
    const hasKey1 = _.has(obj1, key);
    const hasKey2 = _.has(obj2, key);
    const value1 = obj1[key];
    const value2 = obj2[key];
    
    if (!hasKey1) {
      // Added
      result.push(`${indent}+ ${key}: ${stringify(value2, depth + 1)}`);
    } else if (!hasKey2) {
      // Removed
      result.push(`${indent}- ${key}: ${stringify(value1, depth + 1)}`);
    } else if (_.isObject(value1) && _.isObject(value2) && !_.isArray(value1) && !_.isArray(value2)) {
      // Both are objects
      if (_.isEqual(value1, value2)) {
        result.push(`${indent}  ${key}: ${stringify(value1, depth + 1)}`);
      } else {
        const nested = buildDiff(value1, value2, depth + 1);
        result.push(`${indent}  ${key}: {\n${nested.join('\n')}\n${indent}  }`);
      }
    } else if (_.isEqual(value1, value2)) {
      // Same value
      result.push(`${indent}  ${key}: ${stringify(value1, depth + 1)}`);
    } else {
      // Changed
      result.push(`${indent}- ${key}: ${stringify(value1, depth + 1)}`);
      result.push(`${indent}+ ${key}: ${stringify(value2, depth + 1)}`);
    }
  });
  
  return result;
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