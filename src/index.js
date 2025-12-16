import _ from 'lodash';

function stringifyValue(value, depth = 0) {
  const indent = '    '.repeat(depth);
  const innerIndent = '    '.repeat(depth + 1);

  if (_.isObject(value) && !_.isArray(value)) {
    const entries = Object.entries(value);
    if (entries.length === 0) return '{}';

    const lines = entries.map(([key, val]) => {
      return `${innerIndent}${key}: ${stringifyValue(val, depth + 1)}`;
    });
    return `{\n${lines.join('\n')}\n${indent}}`;
  }

  if (_.isBoolean(value) || _.isNumber(value)) return value.toString();
  if (_.isNull(value)) return 'null';
  if (_.isString(value)) return value;
  return value;
}

function buildDiff(obj1, obj2) {
  const keys = _.sortBy(_.union(Object.keys(obj1), Object.keys(obj2)));
  const result = [];

  keys.forEach((key) => {
    const has1 = _.has(obj1, key);
    const has2 = _.has(obj2, key);
    const val1 = obj1[key];
    const val2 = obj2[key];

    if (!has1) {
      result.push(`  + ${key}: ${stringifyValue(val2, 1)}`);
    } else if (!has2) {
      result.push(`  - ${key}: ${stringifyValue(val1, 1)}`);
    } else if (_.isObject(val1) && _.isObject(val2) && !_.isArray(val1) && !_.isArray(val2)) {
      result.push(`    ${key}: ${stringifyValue(buildDiff(val1, val2), 1)}`);
    } else if (_.isEqual(val1, val2)) {
      result.push(`    ${key}: ${stringifyValue(val1, 1)}`);
    } else {
      result.push(`  - ${key}: ${stringifyValue(val1, 1)}`);
      result.push(`  + ${key}: ${stringifyValue(val2, 1)}`);
    }
  });

  return result;
}

export default function genDiff(filepath1, filepath2, format = 'stylish') {
  const data1 = readFile(filepath1);
  const data2 = readFile(filepath2);

  const diffLines = buildDiff(data1, data2);

  if (format === 'stylish') {
    return `{\n${diffLines.join('\n')}\n}`;
  }

  return JSON.stringify({ data1, data2 }, null, 2);
}
