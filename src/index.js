// src/index.js
import fs from 'fs';
import path from 'path';
import process from 'process';
import parse from './parsers.js';

const getFilePath = (filepath) => path.resolve(process.cwd(), filepath);
const readFile = (filepath) => fs.readFileSync(getFilePath(filepath), 'utf-8');
const getFormat = (filepath) => path.extname(filepath).slice(1);

const buildDiffTree = (data1, data2) => {
  const keys = Array.from(new Set([...Object.keys(data1), ...Object.keys(data2)]))
    .sort();

  return keys.map((key) => {
    const hasKey1 = Object.hasOwn(data1, key);
    const hasKey2 = Object.hasOwn(data2, key);
    const value1 = data1[key];
    const value2 = data2[key];

    if (!hasKey1 && hasKey2) {
      return { key, type: 'added', value: value2 };
    }

    if (hasKey1 && !hasKey2) {
      return { key, type: 'removed', value: value1 };
    }

    if (typeof value1 === 'object' && value1 !== null
      && typeof value2 === 'object' && value2 !== null) {
      return { key, type: 'nested', children: buildDiffTree(value1, value2) };
    }

    if (value1 !== value2) {
      return {
        key,
        type: 'changed',
        value1,
        value2,
      };
    }

    return { key, type: 'unchanged', value: value1 };
  });
};


const getIndent = (depth, spacesCount = 4) => ' '.repeat(depth * spacesCount - 2);
const getBracketIndent = (depth, spacesCount = 4) => ' '.repeat((depth - 1) * spacesCount);

const stringify = (value, depth) => {
  if (value === null || typeof value !== 'object') {
    return String(value);
  }

  const entries = Object.entries(value);
  const lines = entries.map(([key, val]) => {
    const indent = getIndent(depth + 1);
    return `${indent}  ${key}: ${stringify(val, depth + 1)}`;
  });

  return `{\n${lines.join('\n')}\n${getBracketIndent(depth + 1)}}`;
};

const formatStylish = (tree) => {
  const iter = (nodes, depth) => {
    const lines = nodes.map((node) => {
      const indent = getIndent(depth);

      switch (node.type) {
        case 'added':
          return `${indent}+ ${node.key}: ${stringify(node.value, depth)}`;
        case 'removed':
          return `${indent}- ${node.key}: ${stringify(node.value, depth)}`;
        case 'unchanged':
          return `${indent}  ${node.key}: ${stringify(node.value, depth)}`;
        case 'changed':
          return [
            `${indent}- ${node.key}: ${stringify(node.value1, depth)}`,
            `${indent}+ ${node.key}: ${stringify(node.value2, depth)}`,
          ].join('\n');
        case 'nested':
          return `${indent}  ${node.key}: {\n${iter(node.children, depth + 1)}\n${getBracketIndent(depth + 1)}}`;
        default:
          throw new Error(`Unknown node type: ${node.type}`);
      }
    });

    return lines.join('\n');
  };

  return `{\n${iter(tree, 1)}\n}`;
};

const format = (tree, formatName = 'stylish') => {
  if (formatName === 'stylish') {
    return formatStylish(tree);
  }
  if (formatName === 'json') {
    return JSON.stringify(tree, null, 2);
  }
  throw new Error(`Unknown format: ${formatName}`);
};


const genDiff = (filepath1, filepath2, formatName = 'stylish') => {
  const data1 = parse(readFile(filepath1), getFormat(filepath1));
  const data2 = parse(readFile(filepath2), getFormat(filepath2));

  const diffTree = buildDiffTree(data1, data2);
  return format(diffTree, formatName);
};

export default genDiff;
