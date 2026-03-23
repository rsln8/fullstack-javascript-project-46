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
  // Отступ для уровня
  const indent = '  '.repeat(depth);
  // Отступ для свойств (на 2 пробела больше)
  const propIndent = '  '.repeat(depth + 1);
  // Отступ для плюсов/минусов (на 4 пробела больше)
  const signIndent = '  '.repeat(depth + 2);
  
  for (const node of diffTree) {
    const key = node.key;
    
    switch (node.type) {
      case 'added':
        result.push(`${signIndent}+ ${key}: ${formatValue(node.value, depth + 1)}`);
        break;
      case 'removed':
        result.push(`${signIndent}- ${key}: ${formatValue(node.value, depth + 1)}`);
        break;
      case 'unchanged':
        // Важно: 6 пробелов на первом уровне, а не 4
        result.push(`${propIndent}  ${key}: ${formatValue(node.value, depth + 1)}`);
        break;
      case 'changed':
        result.push(`${signIndent}- ${key}: ${formatValue(node.oldValue, depth + 1)}`);
        result.push(`${signIndent}+ ${key}: ${formatValue(node.newValue, depth + 1)}`);
        break;
      case 'nested':
        result.push(`${propIndent}  ${key}: {`);
        result.push(stylish(node.children, depth + 1));
        result.push(`${propIndent}  }`);
        break;
    }
  }
  
  return result.join('\n');
}

module.exports = function formatStylish(diffTree) {
  return `{\n${stylish(diffTree)}\n}`;
};
