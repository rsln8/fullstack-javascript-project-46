import _ from 'lodash';

const stringify = (value) => {
  if (_.isObject(value) && value !== null) {
    return '[complex value]';
  }
  if (typeof value === 'string') {
    return `'${value}'`;
  }
  return String(value);
};

const plain = (diffTree, parentPath = '') => {
  const lines = diffTree
    .filter((node) => node.type !== 'unchanged')
    .map((node) => {
      const { key, type, value, oldValue, newValue, children } = node;
      const fullPath = parentPath ? `${parentPath}.${key}` : key;

      switch (type) {
      case 'nested':
        return plain(children, fullPath);
      case 'added':
        return `Property '${fullPath}' was added with value: ${stringify(value)}`;
      case 'removed':
        return `Property '${fullPath}' was removed`;
      case 'changed':
        return `Property '${fullPath}' was updated. From ${stringify(oldValue)} to ${stringify(newValue)}`;
      default:
        return '';
      }
    });

  return lines.flat().join('\n');
};

export default plain;