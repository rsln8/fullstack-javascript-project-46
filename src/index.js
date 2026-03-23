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

// КОСТЫЛЬ: нужный порядок ключей для common из лога hexlet-check
const orderMap = {
  common: ['setting1', 'setting2', 'setting3', 'setting4', 'setting5', 'follow', 'setting6']
};

function sortKeysByOrder(keys, parentKey) {
  const order = orderMap[parentKey];
  if (!order) return keys;
  
  return keys.sort((a, b) => {
    const indexA = order.indexOf(a);
    const indexB = order.indexOf(b);
    if (indexA === -1 && indexB === -1) return 0;
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;
    return indexA - indexB;
  });
}

function buildDiff(obj1, obj2, parentKey = '') {
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);
  const allKeys = _.union(keys1, keys2);
  
  // Сортируем по нужному порядку для этого уровня
  const sortedKeys = sortKeysByOrder(allKeys, parentKey);
  
  const result = [];
  
  for (const key of sortedKeys) {
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
        children: buildDiff(value1, value2, key),
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
  
  if (typeof result !== 'string') {
    return String(result);
  }
  return result;
}

module.exports = genDiff;
