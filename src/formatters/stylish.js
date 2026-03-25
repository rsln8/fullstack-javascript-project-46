import _ from 'lodash';

function stringify(value, depth) {
  if (!_.isObject(value)) {
    return value;
  }
  const indent = '  '.repeat(depth + 1);
  const bracketIndent = '  '.repeat(depth);
  const lines = Object.entries(value).map(([key, val]) => `${indent}  ${key}: ${stringify(val, depth + 1)}`);
  return `{\n${lines.join('\n')}\n${bracketIndent}}`;
}

function stylish(diffTree, depth = 0) {
  const indent = '  '.repeat(depth);
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
}

export default (diffTree) => `{\n${stylish(diffTree)}\n}`;
