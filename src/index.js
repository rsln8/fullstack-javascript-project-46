import readFile from './readFile.js';
import { parse, getFormat } from './parsers.js';
import buildDiff from './buildDiff.js';
import format from './formatters/index.js';

const genDiff = (filepath1, filepath2, formatName = 'stylish') => {
  const data1 = readFile(filepath1);
  const data2 = readFile(filepath2);

  const format1 = getFormat(filepath1);
  const format2 = getFormat(filepath2);

  const obj1 = parse(data1, format1);
  const obj2 = parse(data2, format2);

  const diff = buildDiff(obj1, obj2);

  return format(diff, formatName);
};

export default genDiff;
