const stylish = require('./stylish');
const plain = require('./plain');
const json = require('./json');

const formatters = {
  stylish,
  plain,
  json,
};

module.exports = function getFormatter(formatName) {
  const formatter = formatters[formatName];
  if (!formatter) {
    throw new Error(`Unknown format: ${formatName}. Supported: stylish, plain, json`);
  }
  return formatter;
};
