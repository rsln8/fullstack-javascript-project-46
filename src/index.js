import parser from './parsers.js';

const genDiff = (filepath1, filepath2) => {
  try {
    const data1 = parser(filepath1);
    const data2 = parser(filepath2);

    const keys1 = Object.keys(data1);
    const keys2 = Object.keys(data2);
    const allKeys = Array.from(new Set([...keys1, ...keys2])).sort();

    const lines = [];

    allKeys.forEach((key) => {
      if (!Object.hasOwn(data2, key)) {
        lines.push(`  - ${key}: ${data1[key]}`);
      } else if (!Object.hasOwn(data1, key)) {
        lines.push(`  + ${key}: ${data2[key]}`);
      } else if (data1[key] !== data2[key]) {
        lines.push(`  - ${key}: ${data1[key]}`);
        lines.push(`  + ${key}: ${data2[key]}`);
      } else {
        lines.push(`    ${key}: ${data1[key]}`);
      }
    });

    return `{\n${lines.join('\n')}\n}`;
  } catch (error) {
    console.error('Error:', error.message);
    throw error;
  }
};

export default genDiff;
