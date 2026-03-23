const _ = require('lodash');

function formatValue(value, depth = 0) {
  if (_.isPlainObject(value)) {
    const indent = '  '.repeat(depth + 2);
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

module.exports = function formatStylish(diffTree) {
  return `{\n${stylish(diffTree)}\n}`;
};
