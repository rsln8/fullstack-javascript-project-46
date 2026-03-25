import { test, expect, describe } from '@jest/globals'
import path from 'path'
import { fileURLToPath } from 'url'
import genDiff from '../src/index.js'

// ЭТО НУЖНО ОСТАВИТЬ — это аналог __dirname в ES модулях
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// ЭТО НУЖНО ДОБАВИТЬ, если ещё нет
const getFixturePath = (filename) => path.join(__dirname, '__fixtures__', filename)

describe('gendiff', () => {
  test('should compare flat JSON files', () => {
    const filepath1 = getFixturePath('file1.json')
    const filepath2 = getFixturePath('file2.json')

    const result = genDiff(filepath1, filepath2)

    const expected = `{
  - follow: false
    host: hexlet.io
  - proxy: 123.234.53.22
  - timeout: 50
  + timeout: 20
  + verbose: true
}`

    expect(result).toBe(expected)
  })

  test('should compare flat YAML files', () => {
    const filepath1 = getFixturePath('file1.yml')
    const filepath2 = getFixturePath('file2.yml')

    const result = genDiff(filepath1, filepath2)

    expect(result).toContain('- follow: false')
    expect(result).toContain('host: hexlet.io')
    expect(result).toContain('- proxy: 123.234.53.22')
    expect(result).toContain('- timeout: 50')
    expect(result).toContain('+ timeout: 20')
    expect(result).toContain('+ verbose: true')
  })
})
