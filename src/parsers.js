import fs from 'fs';
import path from 'path';
import yaml from 'yaml';

export function readFile(filepath) {
  const absolutePath = path.resolve(process.cwd(), filepath);
  const content = fs.readFileSync(absolutePath, 'utf-8');
  const extension = path.extname(filepath).toLowerCase();
  
  if (extension === '.json') {
    return JSON.parse(content);
  }
  
  if (extension === '.yml' || extension === '.yaml') {
    return yaml.parse(content);
  }
  
  throw new Error(`Unsupported file format: ${extension}. Only .json, .yml, .yaml are supported`);
}
