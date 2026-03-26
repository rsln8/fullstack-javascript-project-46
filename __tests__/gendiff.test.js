import { describe, test, expect } from '@jest/globals'
import fs from 'fs'
import path from 'path'
import genDiff from '../src/index.js'

const getFixturePath = filename => path.join(process.cwd(), '__tests__', '__fixtures__', filename)
const readFile = filename => fs.readFileSync(getFixturePath(filename), 'utf-8')

describe('gendiff', () => {
  const formats = ['json', 'yml', 'yaml']

  test.each(formats)('flat %s', (format) => {
    const file1 = `file1.${format}`
    const file2 = `file2.${format}`
    const result = readFile('result_stylish.txt')
    expect(genDiff(getFixturePath(file1), getFixturePath(file2), 'stylish')).toBe(result)
  })

  test.each(formats)('nested %s', (format) => {
    const file1 = `nested1.${format}`
    const file2 = `nested2.${format}`
    const result = readFile('result_nested_stylish.txt')
    expect(genDiff(getFixturePath(file1), getFixturePath(file2), 'stylish')).toBe(result)
  })

  test('plain format', () => {
    const file1 = getFixturePath('nested1.json')
    const file2 = getFixturePath('nested2.json')
    const result = readFile('result_nested_plain.txt')
    expect(genDiff(file1, file2, 'plain')).toBe(result)
  })

  test('json format', () => {
    const file1 = getFixturePath('nested1.json')
    const file2 = getFixturePath('nested2.json')
    const result = readFile('result_nested_json.txt')
    expect(genDiff(file1, file2, 'json')).toBe(result)
  })
})
