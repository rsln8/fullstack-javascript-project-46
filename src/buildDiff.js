import _ from 'lodash';

const buildDiff = (obj1, obj2) => {
  const keys = _.sortBy(_.union(Object.keys(obj1), Object.keys(obj2)));

  return keys.map((key) => {
    const value1 = obj1[key];
    const value2 = obj2[key];

    if (!_.has(obj1, key)) {
      return { key, type: 'added', value: value2 };
    }
    if (!_.has(obj2, key)) {
      return { key, type: 'removed', value: value1 };
    }
    if (_.isObject(value1) && _.isObject(value2) && value1 !== null && value2 !== null) {
      return { key, type: 'nested', children: buildDiff(value1, value2) };
    }
    if (!_.isEqual(value1, value2)) {
      return { key, type: 'changed', oldValue: value1, newValue: value2 };
    }
    return { key, type: 'unchanged', value: value1 };
  });
};

export default buildDiff;