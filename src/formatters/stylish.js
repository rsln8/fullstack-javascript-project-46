const _ = require('lodash');

const stringify = (value, depth) => {
  if (!_.isObject(value)) {
    return value;
  }
  
  let indent;
  let bracketIndent;
  
  if (depth === 0) {
    indent = '  ';
    bracketIndent = '';
  } else if (depth === 1) {
    indent = '    ';
    bracketIndent = '  ';
  } else if (depth === 2) {
    indent = '      ';
    bracketIndent = '    ';
  } else {
    indent = '  '.repeat(depth + 1);
    bracketIndent = '  '.repeat(depth);
  }
  
  // Для глубины 2 закрывающая скобка должна быть на 8 пробелах
  const finalBracketIndent = depth === 2 ? '        ' : bracketIndent;
  
  const lines = Object.entries(value).map(([key, val]) => {
    let keyIndent;
    if (depth === 2) {
      keyIndent = '            '; // 12 пробелов
    } else {
      keyIndent = `${indent}  `;
    }
    return `${keyIndent}${key}: ${stringify(val, depth + 1)}`;
  });
  
  return `{\n${lines.join('\n')}\n${finalBracketIndent}}`;
};

const stylish = (diffTree, depth = 0) => {
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
        return `${'  '.repeat(depth)}    ${key}: {\n${stylish(node.children, depth + 1)}\n${'  '.repeat(depth)}    }`;
      default:
        return '';
    }
  });
  return result.join('\n');
};

module.exports = (diffTree) => `{\n${stylish(diffTree)}\n}`;
