const _ = require('lodash');

const stringify = (value, depth) => {
  if (!_.isObject(value)) {
    return value;
  }
  const indent = '  '.repeat(depth + 1);
  const bracketIndent = '  '.repeat(depth);
  const lines = Object.entries(value).map(([key, val]) => `${indent}  ${key}: ${stringify(val, depth + 1)}`);
  return `{\n${lines.join('\n')}\n${bracketIndent}}`;
};

const stylish = (diffTree, depth = 0) => {
  const indent = '  '.repeat(depth);
  const result = diffTree.map((node) => {
    const key = node.key;
    const value = node.value;
    // Для depth = 0 (плоские файлы) используем 2 пробела
    const signIndent = depth === 0 ? '  ' : '  '.repeat(depth + 2);
    
    switch (node.type) {
      case 'added':
        return `${signIndent}+ ${key}: ${stringify(value, depth + 1)}`;
      case 'removed':
        return `${signIndent}- ${key}: ${stringify(value, depth + 1)}`;
      case 'unchanged':
        return `${indent}    ${key}: ${stringify(value, depth + 1)}`;
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
