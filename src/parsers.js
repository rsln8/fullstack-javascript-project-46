import path from 'path';
import yaml from 'js-yaml';

const parseJSON = (content) => {
  // Удаляем BOM и лишние пробелы
  const cleanedContent = content.replace(/^\uFEFF/, '').trim();
  return JSON.parse(cleanedContent);
};

const parseYAML = (content) => yaml.load(content);

const parsers = {
  'json': parseJSON,
  'yml': parseYAML,
  'yaml': parseYAML,
};

const parse = (data, format) => {
  const parser = parsers[format];

  if (!parser) {
    throw new Error(`Unsupported file format: ${format}. Supported: json, yml, yaml`);     
  }

  try {
    return parser(data);
  } catch (error) {
    if (error instanceof SyntaxError && format === 'json') {
      throw new Error(`Invalid JSON format in file`);
    }
    throw new Error(`Error parsing ${format} file: ${error.message}`);
  }
};

const getFormat = (filepath) => {
  const ext = path.extname(filepath).toLowerCase();
  if (!ext) {
    throw new Error(`File has no extension: ${filepath}`);
  }
  return ext.slice(1); // убираем точку
};

export { parse, getFormat };
