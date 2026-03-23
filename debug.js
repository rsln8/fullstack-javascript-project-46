const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const yaml = require('js-yaml');

function readFile(filepath) {
  const absolutePath = path.resolve(process.cwd(), filepath);
  const content = fs.readFileSync(absolutePath, 'utf-8');
  const extension = path.extname(filepath).toLowerCase();
  
  if (extension === '.json') {
    return JSON.parse(content);
  }
  if (extension === '.yml' || extension === '.yaml') {
    return yaml.load(content);
  }
  throw new Error(`Unsupported file format: ${extension}`);
}

const data1 = readFile('__tests__/__fixtures__/nested1.json');
console.log('data1.common.setting3:', data1.common.setting3);
