const _ = require('lodash');

function formatValue(value, depth = 0) {
  if (_.isPlainObject(value)) {
    const indent = '  '.repeat(depth + 1);
    const entries = Object.entries(value).map(([k, v]) => {
      return `${indent}  ${k}: ${formatValue(v, depth + 1)}`;
    });
    return `{\n${entries.join('\n')}\n${indent}}`;
  }
  if (_.isArray(value)) return '[array]';
  if (_.isBoolean(value)) return value.toString();
  if (_.isNull(value)) return 'null';
  if (_.isNumber(value)) return value.toString();
  if (_.isString(value)) return value;
  return value;
}

function stylish(diffTree, depth = 0) {
  const result = [];
  
  for (const node of diffTree) {
    const key = node.key;
    
    switch (node.type) {
      case 'added':
        result.push(`${'  '.repeat(depth + 2)}+ ${key}: ${formatValue(node.value, depth + 1)}`);
        break;
      case 'removed':
        result.push(`${'  '.repeat(depth + 2)}- ${key}: ${formatValue(node.value, depth + 1)}`);
        break;
      case 'unchanged':
        // Для неизменённых свойств: на 2 пробела больше чем для плюсов/минусов
        result.push(`${'  '.repeat(depth + 2)}  ${key}: ${formatValue(node.value, depth + 1)}`);
        break;
      case 'changed':
        result.push(`${'  '.repeat(depth + 2)}- ${key}: ${formatValue(node.oldValue, depth + 1)}`);
        result.push(`${'  '.repeat(depth + 2)}+ ${key}: ${formatValue(node.newValue, depth + 1)}`);
        break;
      case 'nested':
        result.push(`${'  '.repeat(depth + 2)}  ${key}: {`);
        result.push(stylish(node.children, depth + 1));
        result.push(`${'  '.repeat(depth + 2)}  }`);
        break;
    }
  }
  
  return result.join('\n');
}

module.exports = function formatStylish(diffTree) {
  return `{\n${stylish(diffTree)}\n}`;
};
