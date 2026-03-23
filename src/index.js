const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const yaml = require('js-yaml');
const getFormatter = require('./formatters');

// Парсер файлов
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

// Рекурсивное построение дерева различий
function buildDiff(obj1, obj2) {
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);
  const allKeys = _.sortBy(_.union(keys1, keys2));
  
  const result = [];
  
  for (const key of allKeys) {
    const hasKey1 = _.has(obj1, key);
    const hasKey2 = _.has(obj2, key);
    const value1 = obj1[key];
    const value2 = obj2[key];
    
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

// Основная функция
function genDiff(filepath1, filepath2, formatName = 'stylish') {
  const data1 = readFile(filepath1);
  const data2 = readFile(filepath2);
  const diffTree = buildDiff(data1, data2);
  
  const formatter = getFormatter(formatName);
  return formatter(diffTree);
}

module.exports = genDiff;
