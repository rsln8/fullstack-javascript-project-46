const _ = require('lodash');

const getIndent = (depth) => '  '.repeat(depth);

const stringify = (data, depth) => {
  if (!_.isObject(data)) return data;
  const indent = getIndent(depth + 1);
  const bracketIndent = getIndent(depth);
  const lines = Object.entries(data).map(([key, val]) => {
    const formattedVal = _.isObject(val) ? stringify(val, depth + 1) : val;
    return `${indent}${key}: ${formattedVal}`;
  });
  return `{\n${lines.join('\n')}\n${bracketIndent}}`;
};

const stylish = (diffTree, depth = 0) => {
  const indent = getIndent(depth);
  const result = diffTree.map((node) => {
    const key = node.key;
    const value = node.value;

    switch (node.type) {
      case 'added':
        return `${indent}  + ${key}: ${stringify(value, depth + 1)}`;
      case 'removed':
        return `${indent}  - ${key}: ${stringify(value, depth + 1)}`;
      case 'unchanged':
        return `${indent}    ${key}: ${stringify(value, depth + 1)}`;
      case 'changed':
        return [
          `${indent}  - ${key}: ${stringify(node.oldValue, depth + 1)}`,
          `${indent}  + ${key}: ${stringify(node.newValue, depth + 1)}`,
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
