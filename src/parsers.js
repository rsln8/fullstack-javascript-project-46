import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

const parseJSON = (data) => JSON.parse(data);
const parseYAML = (data) => yaml.load(data);

const parsers = {
  '.json': parseJSON,
  '.yml': parseYAML,
  '.yaml': parseYAML,
};

export default (filepath) => {
  const fullPath = path.resolve(filepath);
  const data = fs.readFileSync(fullPath, 'utf-8');
  const ext = path.extname(fullPath).toLowerCase();

  if (!parsers[ext]) {
    throw new Error(`Unsupported file extension: ${ext}`);
  }

  return parsers[ext](data);
};
