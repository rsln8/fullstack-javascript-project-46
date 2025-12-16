import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

export const parseFile = (filepath) => {
  const extension = path.extname(filepath);
  const content = fs.readFileSync(filepath, 'utf-8');

  if (extension === '.json') {
    return JSON.parse(content);
  }

  if (extension === '.yml' || extension === '.yaml') {
    return yaml.load(content);
  }

  throw new Error(`Unsupported file format: ${extension}. Only .json and .yml are supported`);
};
