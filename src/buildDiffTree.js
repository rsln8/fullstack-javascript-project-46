import _ from 'lodash';

const buildDiffTree = (beforeConfig, afterConfig) => {
  const fileKeys = _.union(_.keys(beforeConfig), _.keys(afterConfig)).sort();
  const result = fileKeys.map((key) => {
    if (!_.has(afterConfig, key)) {
      return { key, status: 'deleted', value: beforeConfig[key] };
    }
    if (!_.has(beforeConfig, key)) {
      return { key, status: 'added', value: afterConfig[key] };
    }
    const oldValue = beforeConfig[key];
    const newValue = afterConfig[key];
    if (oldValue === newValue) {
      return { key, status: 'unmodified', value: oldValue };
    }
    if (_.isObject(oldValue) && _.isObject(newValue)) {
      return {
        key,
        status: 'merged',
        children: buildDiffTree(oldValue, newValue),
      };
    }
    return {
      key,
      status: 'modified',
      oldValue,
      newValue,
    };
  });
  return result;
};

export default buildDiffTree;
