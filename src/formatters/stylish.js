import _ from 'lodash';

const INDENT = 4;

const stringify = (value, depth) => {
  if (!_.isPlainObject(value) || value === null) {
    return String(value);
  }

  const indentSize = depth * INDENT;
  const currentIndent = ' '.repeat(indentSize);
  const bracketIndent = ' '.repeat(indentSize - INDENT);

  const lines = Object.entries(value).map(([key, val]) => {
    return `${currentIndent}${key}: ${stringify(val, depth + 1)}`;
  });

  return `{\n${lines.join('\n')}\n${bracketIndent}}`;
};

const stylish = (ast, depth = 1) => {
  const indentSize = depth * INDENT;
  const currentIndent = ' '.repeat(indentSize - 2); // для + / -
  const bracketIndent = ' '.repeat(indentSize - INDENT);

  const lines = ast.map((node) => {
    const { key, type } = node;

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
      throw new Error(`Unknown node type: ${type}`);
    }
  });

  return `{\n${lines.join('\n')}\n${bracketIndent}}`;
};

export default stylish;