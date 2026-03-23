const fs = require('fs');
const path = require('path');
const _ = require('lodash');

// Парсер файлов
function readFile(filepath) {
  const absolutePath = path.resolve(process.cwd(), filepath);
  const content = fs.readFileSync(absolutePath, 'utf-8');
  const extension = path.extname(filepath).toLowerCase();
  
  if (extension === '.json') {
    return JSON.parse(content);
  }
  if (extension === '.yml' || extension === '.yaml') {
    // Пока заглушка для YAML
    throw new Error(`YAML support coming soon: ${extension}`);
  }
  throw new Error(`Unsupported file format: ${extension}`);
}

// Форматирование значения для отображения
function formatValue(value, depth = 0) {
  if (_.isPlainObject(value)) {
    // Для вложенных объектов возвращаем строковое представление
    const indent = '  '.repeat(depth + 2);
    const entries = Object.entries(value).map(([k, v]) => {
      return `${indent}  ${k}: ${formatValue(v, depth + 1)}`;
    });
    return `{\n${entries.join('\n')}\n${indent}}`;
  }
  if (_.isArray(value)) {
    return '[array]';
  }
  if (_.isBoolean(value)) return value.toString();
  if (_.isNull(value)) return 'null';
  if (_.isNumber(value)) return value.toString();
  if (_.isString(value)) return value;
  return value;
}

// Рекурсивное построение дерева различий
function buildDiff(obj1, obj2, depth = 0) {
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
      // Ключ добавлен во втором файле
      result.push({
        key,
        type: 'added',
        value: value2,
      });
    } else if (!hasKey2) {
      // Ключ удалён из второго файла
      result.push({
        key,
        type: 'removed',
        value: value1,
      });
    } else if (_.isEqual(value1, value2)) {
      // Ключ не изменился
      result.push({
        key,
        type: 'unchanged',
        value: value1,
      });
    } else if (_.isPlainObject(value1) && _.isPlainObject(value2)) {
      // Рекурсивный вызов для вложенных объектов
      result.push({
        key,
        type: 'nested',
        children: buildDiff(value1, value2, depth + 1),
      });
    } else {
      // Ключ изменился
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

// Форматтер stylish
function stylish(diffTree, depth = 0) {
  const indent = '  '.repeat(depth);
  const result = [];
  
  for (const node of diffTree) {
    const key = node.key;
    const indentSpaces = '  '.repeat(depth + 1);
    
    switch (node.type) {
      case 'added':
        result.push(`${indentSpaces}+ ${key}: ${formatValue(node.value, depth)}`);
        break;
      case 'removed':
        result.push(`${indentSpaces}- ${key}: ${formatValue(node.value, depth)}`);
        break;
      case 'unchanged':
        result.push(`${indentSpaces}  ${key}: ${formatValue(node.value, depth)}`);
        break;
      case 'changed':
        result.push(`${indentSpaces}- ${key}: ${formatValue(node.oldValue, depth)}`);
        result.push(`${indentSpaces}+ ${key}: ${formatValue(node.newValue, depth)}`);
        break;
      case 'nested':
        result.push(`${indentSpaces}  ${key}: {`);
        result.push(stylish(node.children, depth + 2));
        result.push(`${indentSpaces}  }`);
        break;
    }
  }
  
  return result.join('\n');
}

// Основная функция
function genDiff(filepath1, filepath2, format = 'stylish') {
  const data1 = readFile(filepath1);
  const data2 = readFile(filepath2);
  const diffTree = buildDiff(data1, data2);
  
  if (format === 'stylish') {
    return `{\n${stylish(diffTree)}\n}`;
  }
  
  return JSON.stringify(diffTree, null, 2);
}

module.exports = genDiff;
