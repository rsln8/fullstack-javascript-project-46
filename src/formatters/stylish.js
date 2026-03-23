const _ = require('lodash');

const stringify = (value, depth) => {
  if (!_.isObject(value)) {
    return value;
  }
  // Увеличиваем отступ для вложенных объектов внутри changed
  const indent = '  '.repeat(depth + 2);
  const bracketIndent = '  '.repeat(depth + 1);
  const lines = Object.entries(value).map(([key, val]) => `${indent}  ${key}: ${stringify(val, depth + 1)}`);
  return `{\n${lines.join('\n')}\n${bracketIndent}}`;
};

const stylish = (diffTree, depth = 0) => {
  const result = diffTree.map((node) => {
    const key = node.key;
    const value = node.value;
    const indent = '  '.repeat(depth);
    const signIndent = depth === 0 ? '  ' : '  '.repeat(depth + 2);
    const unchangedIndent = depth === 0 ? '    ' : '  '.repeat(depth + 3);
    
    switch (node.type) {
      case 'added':
        return `${signIndent}+ ${key}: ${stringify(value, depth + 1)}`;
      case 'removed':
        return `${signIndent}- ${key}: ${stringify(value, depth + 1)}`;
      case 'unchanged':
        return `${unchangedIndent}${key}: ${stringify(value, depth + 1)}`;
      case 'changed':
        return [
          `${signIndent}- ${key}: ${stringify(node.oldValue, depth + 1)}`,
          `${signIndent}+ ${key}: ${stringify(node.newValue, depth + 1)}`,
        ].join('\n');
      case 'nested':
        return `${indent}    ${key}: {\n${stylish(node.children, depth + 1)}\n${indent}    }`;
      default:
        return '';
    }
  });
  return result.join('\n');
};

module.exports = (diffTree) => `{\n${stylish(diffTree)}\n}`;
