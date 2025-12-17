import fs from 'fs';
import path from 'path';
import { cwd } from 'process';

const getAbsolutePath = (filepath) => {
  if (path.isAbsolute(filepath)) {
    return filepath;
  }
  return path.resolve(cwd(), filepath);
};

const readFile = (filepath) => {
  try {
    const absolutePath = getAbsolutePath(filepath);
    return fs.readFileSync(absolutePath, 'utf-8');
  } catch (error) {
    if (error.code === 'ENOENT') {
      throw new Error(`File not found: ${filepath}`);
    }
    throw error;
  }
};

export default readFile;
