const _ = require('lodash');

function formatValue(value) {
  if (_.isPlainObject(value)) {
    return '[complex value]';
  }
  if (_.isString(value)) {
    return `'${value}'`;
  }
  if (_.isBoolean(value)) {
    return value.toString();
  }
  if (_.isNull(value)) {
    return 'null';
  }
  if (_.isNumber(value)) {
    return value;
  }
  return value;
}

function buildPath(path, key) {
  return path ? `${path}.${key}` : key;
}

function plain(diffTree, path = '') {
  const result = [];
  
  for (const node of diffTree) {
    const fullPath = buildPath(path, node.key);
    
    switch (node.type) {
      case 'added':
        result.push(`Property '${fullPath}' was added with value: ${formatValue(node.value)}`);
        break;
      case 'removed':
        result.push(`Property '${fullPath}' was removed`);
        break;
      case 'changed':
        result.push(`Property '${fullPath}' was updated. From ${formatValue(node.oldValue)} to ${formatValue(node.newValue)}`);
        break;
      case 'nested':
        result.push(plain(node.children, fullPath));
        break;
      case 'unchanged':
        // ничего не выводим
        break;
    }
  }
  
  return result.filter(Boolean).join('\n');
}

module.exports = function formatPlain(diffTree) {
  return plain(diffTree);
};
