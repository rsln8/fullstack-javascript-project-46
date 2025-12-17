import _ from 'lodash';

// Вспомогательная функция для создания отступов
const makeIndent = (depth, spacesCount = 4) => ' '.repeat(depth * spacesCount);

// Функция для преобразования значений в строку
const stringify = (value, depth) => {
  if (!_.isObject(value) || value === null) {
    return String(value);
  }

  const indent = makeIndent(depth + 1);
  const bracketIndent = makeIndent(depth);
  const entries = Object.entries(value);
  
  const lines = entries.map(([key, val]) => {
    const formattedValue = stringify(val, depth + 1);
    return `${indent}${key}: ${formattedValue}`;
  });

  return `{\n${lines.join('\n')}\n${bracketIndent}}`;
};

const formatDiff = (diff, depth = 1) => {
  const indent = makeIndent(depth);
  const bracketIndent = makeIndent(depth - 1);
  
  const lines = diff.map((item) => {
    const currentIndent = indent.slice(0, -2); 
    
    switch (item.type) {
      case 'added':
        return `${currentIndent}+ ${item.key}: ${stringify(item.value, depth)}`;
      case 'removed':
        return `${currentIndent}- ${item.key}: ${stringify(item.value, depth)}`;
      case 'unchanged':
        return `${indent}${item.key}: ${stringify(item.value, depth)}`;
      case 'changed':
        return [
          `${currentIndent}- ${item.key}: ${stringify(item.oldValue, depth)}`,
          `${currentIndent}+ ${item.key}: ${stringify(item.newValue, depth)}`
        ].join('\n');
      case 'nested':
        return `${indent}${item.key}: ${formatDiff(item.children, depth + 1)}`;
      default:
        throw new Error(`Unknown type: ${item.type}`);
    }
  });

  return `{\n${lines.join('\n')}\n${bracketIndent}}`;
};

export default formatDiff;
