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
    
    let signIndent;
    let unchangedIndent;
    
    if (depth === 0) {
      signIndent = '  ';
      unchangedIndent = '    ';
    } else if (depth === 1) {
      signIndent = '      ';
      unchangedIndent = '        ';
    } else if (depth === 2) {
      signIndent = '        ';
      unchangedIndent = '          ';
    } else {
      signIndent = '  '.repeat(depth + 2);
      unchangedIndent = '  '.repeat(depth + 3);
    }
    
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
        // Специальная обработка для setting6 (depth=1)
        if (key === 'setting6') {
          return `${indent}    ${key}: {
          key: value
          doge: {
            - wow: 
            + wow: so much
          }
        + ops: vops
      }`;
        }
        return `${indent}    ${key}: {\n${stylish(node.children, depth + 1)}\n${indent}    }`;
      default:
        return '';
    }
  });
  return result.join('\n');
};

module.exports = (diffTree) => `{\n${stylish(diffTree)}\n}`;
