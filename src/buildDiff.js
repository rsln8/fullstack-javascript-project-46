import _ from 'lodash';

const buildDiff = (obj1, obj2) => {
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);
  const allKeys = _.sortBy(_.union(keys1, keys2));
  
  return allKeys.map((key) => {
    const value1 = obj1[key];
    const value2 = obj2[key];
    
    if (!_.has(obj1, key)) {
      return {
        key,
        value: value2,
        type: 'added',
      };
    }
    
    if (!_.has(obj2, key)) {
      return {
        key,
        value: value1,
        type: 'removed',
      };
    }
    
    if (_.isEqual(value1, value2)) {
      return {
        key,
        value: value1,
        type: 'unchanged',
      };
    }
    
    return {
      key,
      oldValue: value1,
      newValue: value2,
      type: 'changed',
    };
  });
};

export default buildDiff;