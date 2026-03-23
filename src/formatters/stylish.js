const _ = require('lodash');

const stringify = (value, depth) => {
  if (!_.isObject(value)) {
    return value;
  }
  const indent = '  '.repeat(depth);
  const currentIndent = '  '.repeat(depth + 1);
  const bracketIndent = '  '.repeat(depth);
  const lines = Object.entries(value).map(([key, val]) => `${currentIndent}${key}: ${stringify(val, depth + 1)}`);
  return `{\n${lines.join('\n')}\n${bracketIndent}}`;
};

const stylish = (diffTree, depth = 0) => {
  const indent = '  '.repeat(depth);
  const result = diffTree.map((node) => {
    const key = node.key;
    const value = node.value;
    const currentIndent = '  '.repeat(depth + 1);
    
    switch (node.type) {
      case 'added':
        return `${currentIndent}+ ${key}: ${stringify(value, depth + 1)}`;
      case 'removed':
        return `${currentIndent}- ${key}: ${stringify(value, depth + 1)}`;
      case 'unchanged':
        return `${currentIndent}  ${key}: ${stringify(value, depth + 1)}`;
      case 'changed':
        return [
          `${currentIndent}- ${key}: ${stringify(node.oldValue, depth + 1)}`,
          `${currentIndent}+ ${key}: ${stringify(node.newValue, depth + 1)}`,
        ].join('\n');
      case 'nested':
        return `${currentIndent}  ${key}: {\n${stylish(node.children, depth + 1)}\n${currentIndent}  }`;
      default:
        return '';
    }
  });
  return result.join('\n');
};

module.exports = (diffTree) => `{\n${stylish(diffTree)}\n}`;
