import fs from 'fs';
import path from 'path';
import _ from 'lodash';
import yaml from 'js-yaml';
import formatter from './formatters/index.js';

const parseJSON = (data) => JSON.parse(data);
const parseYAML = (data) => yaml.load(data);

const parsers = {
  '.json': parseJSON,
  '.yml': parseYAML,
  '.yaml': parseYAML,
};

const parseFile = (filepath) => {
  const fullPath = path.resolve(filepath);
  const data = fs.readFileSync(fullPath, 'utf-8');
  const ext = path.extname(fullPath).toLowerCase();

  if (!parsers[ext]) {
    throw new Error(`Unsupported file extension: ${ext}`);
  }

  return parsers[ext](data);
};

const buildAST = (obj1, obj2) => {
  const keys = _.union(Object.keys(obj1), Object.keys(obj2)).sort();

  return keys.map((key) => {
    const value1 = obj1[key];
    const value2 = obj2[key];

    if (!Object.hasOwn(obj1, key)) {
      return { key, type: 'added', value: value2 };
    }
    if (!Object.hasOwn(obj2, key)) {
      return { key, type: 'removed', value: value1 };
    }
    if (_.isObject(value1) && _.isObject(value2) && !_.isArray(value1) && !_.isArray(value2)) {
      return { key, type: 'nested', children: buildAST(value1, value2) };
    }
    if (!_.isEqual(value1, value2)) {
      return { key, type: 'changed', oldValue: value1, newValue: value2 };
    }
    return { key, type: 'unchanged', value: value1 };
  });
};

export default (filepath1, filepath2, format = 'stylish') => {
  const data1 = parseFile(filepath1);
  const data2 = parseFile(filepath2);
  const ast = buildAST(data1, data2);
  return formatter(ast, format);
};
