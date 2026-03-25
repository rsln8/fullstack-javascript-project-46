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

const plain = (ast, parentKey = '') => {
  const lines = ast.flatMap((node) => {
    const fullKey = parentKey ? `${parentKey}.${node.key}` : node.key;

    switch (node.type) {
      case 'nested':
        return plain(node.children, fullKey);
      case 'added':
        return `Property '${fullKey}' was added with value: ${stringify(node.value)}`;
      case 'removed':
        return `Property '${fullKey}' was removed`;
      case 'changed':
        return `Property '${fullKey}' was updated. From ${stringify(node.oldValue)} to ${stringify(node.newValue)}`;
      case 'unchanged':
        return [];
      default:
        throw new Error(`Unknown type: ${node.type}`);
    }
  });

  return lines.join('\n');
};

export default plain;
