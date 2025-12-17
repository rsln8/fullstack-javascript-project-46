import _ from 'lodash';

// Функция для форматирования значений
const formatValue = (value) => {
  if (_.isObject(value) && !Array.isArray(value)) {
    return '[complex value]';
  }
  
  if (typeof value === 'string') {
    return `'${value}'`;
  }
  
  return String(value);
};

// Функция для построения пути к свойству
const buildPath = (path, key) => {
  return path ? `${path}.${key}` : key;
};

// Рекурсивная функция форматирования
const formatDiff = (diff, path = '') => {
  const lines = diff.flatMap((item) => {
    const currentPath = buildPath(path, item.key);
    
    switch (item.type) {
      case 'added':
        return `Property '${currentPath}' was added with value: ${formatValue(item.value)}`;
      
      case 'removed':
        return `Property '${currentPath}' was removed`;
      
      case 'changed':
        return `Property '${currentPath}' was updated. From ${formatValue(item.oldValue)} to ${formatValue(item.newValue)}`;
      
      case 'nested':
        return formatDiff(item.children, currentPath);
      
      case 'unchanged':
        return [];
      
      default:
        throw new Error(`Unknown type: ${item.type}`);
    }
  });
  
  return lines.filter(Boolean).join('\n');
};

export default formatDiff;
