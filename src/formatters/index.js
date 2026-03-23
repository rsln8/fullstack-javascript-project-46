const stylish = require('./stylish');
const plain = require('./plain');

const formatters = {
  stylish,
  plain,
};

module.exports = function getFormatter(formatName) {
  const formatter = formatters[formatName];
  if (!formatter) {
    throw new Error(`Unknown format: ${formatName}. Supported: stylish, plain`);
  }
  return formatter;
};
