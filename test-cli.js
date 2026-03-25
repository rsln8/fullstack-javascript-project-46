import { execSync } from 'child_process';

console.log('=== Testing gendiff ===');

try {
  const result = execSync('node bin/gendiff.js __fixtures__/file1.json __fixtures__/file2.json', { encoding: 'utf8' });
  console.log('Output:');
  console.log(result);
} catch (error) {
  console.log('Error:');
  console.log(error.stdout);
  console.log(error.stderr);
}
