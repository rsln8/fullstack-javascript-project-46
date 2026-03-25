import _ from 'lodash';

const indent = (depth, spaces = 4) => ' '.repeat(depth * spaces);

const stringify = (value, depth = 1) => {
  if (!_.isObject(value) || value === null) {
    return String(value); // null → 'null', true/false/number/string как есть
  }

  const lines = Object.entries(value).map(([key, val]) => {
    const valStr = _.isObject(val) && val !== null
      ? stringify(val, depth + 1)
      : String(val);

    return `${indent(depth + 1)}${key}: ${valStr}`;
  });

  return `{\n${lines.join('\n')}\n${indent(depth)}}`;
};

const stylish = (ast, depth = 1) => {
  const lines = ast.map((node) => {
    const { key, type } = node;
    const currentIndent = indent(depth - 1); // важный момент для корневого уровня

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

  return `{\n${lines.join('\n')}\n${indent(depth - 1)}}`;
};

export default stylish;