import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

const parsers = {
  '.json': (content) => JSON.parse(content),
  '.yml': (content) => yaml.load(content),
  '.yaml': (content) => yaml.load(content),
};

export default (filepath) => {
  const content = fs.readFileSync(filepath, 'utf8');
  const extension = path.extname(filepath).toLowerCase();
  
  if (!parsers[extension]) {
    throw new Error(`Unsupported file format: ${extension}`);
  }
  
  return parsers[extension](content);
};
