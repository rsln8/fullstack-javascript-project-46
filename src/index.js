const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const yaml = require('js-yaml');
const getFormatter = require('./formatters');

function readFile(filepath) {
  const absolutePath = path.resolve(process.cwd(), filepath);
  const content = fs.readFileSync(absolutePath, 'utf-8');
  const extension = path.extname(filepath).toLowerCase();
  
  if (extension === '.json') {
    return JSON.parse(content);
  }
  if (extension === '.yml' || extension === '.yaml') {
    return yaml.load(content);
  }
  throw new Error(`Unsupported file format: ${extension}`);
}

function buildDiff(obj1, obj2) {
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);
  const allKeys = _.sortBy(_.union(keys1, keys2));
  
  const result = [];
  
  for (const key of allKeys) {
    const hasKey1 = Object.hasOwn(obj1, key);
    const hasKey2 = Object.hasOwn(obj2, key);
    const value1 = obj1[key];
    const value2 = obj2[key];
    
    if (!hasKey1 && !hasKey2) {
      continue;
    }
    
    if (!hasKey1) {
      result.push({
        key,
        type: 'added',
        value: value2,
      });
    } else if (!hasKey2) {
      result.push({
        key,
        type: 'removed',
        value: value1,
      });
    } else if (_.isEqual(value1, value2)) {
      result.push({
        key,
        type: 'unchanged',
        value: value1,
      });
    } else if (_.isPlainObject(value1) && _.isPlainObject(value2)) {
      result.push({
        key,
        type: 'nested',
        children: buildDiff(value1, value2),
      });
    } else {
      result.push({
        key,
        type: 'changed',
        oldValue: value1,
        newValue: value2,
      });
    }
  }
  
  return result;
}

function genDiff(filepath1, filepath2, formatName = 'stylish') {
  const data1 = readFile(filepath1);
  const data2 = readFile(filepath2);
  const diffTree = buildDiff(data1, data2);
  
  const formatter = getFormatter(formatName);
  const result = formatter(diffTree);
  
  // Гарантируем, что всегда возвращаем строку
  if (typeof result !== 'string') {
    return String(result);
  }
  return result;
}

module.exports = genDiff;
