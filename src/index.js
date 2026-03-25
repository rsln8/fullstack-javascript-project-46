import _ from 'lodash';
import parseFile from './parsers.js';
import getFormatter from './formatters/index.js';

function buildDiff(obj1, obj2) {
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);
  const allKeys = _.sortBy(_.union(keys1, keys2));

  return allKeys.map((key) => {
    const hasKey1 = _.has(obj1, key);
    const hasKey2 = _.has(obj2, key);
    const value1 = obj1[key];
    const value2 = obj2[key];

    if (!hasKey1) {
      return { key, type: 'added', value: value2 };
    }
    if (!hasKey2) {
      return { key, type: 'removed', value: value1 };
    }
    if (_.isEqual(value1, value2)) {
      return { key, type: 'unchanged', value: value1 };
    }
    if (_.isPlainObject(value1) && _.isPlainObject(value2)) {
      return {
        key,
        type: 'nested',
        children: buildDiff(value1, value2),
      };
    }
    return {
      key,
      type: 'changed',
      oldValue: value1,
      newValue: value2,
    };
  });
}

function genDiff(filepath1, filepath2, formatName = 'stylish') {
  const data1 = parseFile(filepath1);
  const data2 = parseFile(filepath2);
  const diffTree = buildDiff(data1, data2);

  const formatter = getFormatter(formatName);
  return formatter(diffTree);
}

export default genDiff;
