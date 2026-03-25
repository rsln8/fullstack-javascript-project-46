import _ from 'lodash';

const indent = (depth, spaces = 4) => ' '.repeat(depth * spaces - 2);
const closeIndent = (depth, spaces = 4) => ' '.repeat(depth * spaces);

const stringify = (value, depth) => {
  if (!_.isObject(value) || value === null) {
    return String(value);
  }
  const lines = Object.entries(value).map(([key, val]) => {
    const nestedValue = _.isObject(val) ? stringify(val, depth + 1) : val;
    return `${indent(depth + 1)}  ${key}: ${nestedValue}`;
  });
  return `{\n${lines.join('\n')}\n${closeIndent(depth + 1)}}`;
};

const stylish = (ast, depth = 1) => {
  const lines = ast.map((node) => {
    const { key, type } = node;
    const currentIndent = indent(depth);

    switch (type) {
      case 'nested':
        return `${currentIndent}  ${key}: ${stylish(node.children, depth + 1)}`;
      case 'added':
        return `${currentIndent}+ ${key}: ${stringify(node.value, depth)}`;
      case 'removed':
        return `${currentIndent}- ${key}: ${stringify(node.value, depth)}`;
      case 'changed':
        return [
          `${currentIndent}- ${key}: ${stringify(node.oldValue, depth)}`,
          `${currentIndent}+ ${key}: ${stringify(node.newValue, depth)}`,
        ].join('\n');
      case 'unchanged':
        return `${currentIndent}  ${key}: ${stringify(node.value, depth)}`;
      default:
        throw new Error(`Unknown type: ${type}`);
    }
  });

  return `{\n${lines.join('\n')}\n${closeIndent(depth - 1)}}`;
};

export default stylish;
