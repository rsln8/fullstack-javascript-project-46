import { test, expect, describe } from '@jest/globals'
import path from 'path'
import { fileURLToPath } from 'url'
import genDiff from '../src/index.js'

// ЭТО НУЖНО ОСТАВИТЬ — это аналог __dirname в ES модулях
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// ЭТО НУЖНО ДОБАВИТЬ, если ещё нет
const getFixturePath = (filename) => path.join(__dirname, '__fixtures__', filename)

describe('JSON format', () => {
  test('should output json format for flat JSON files', () => {
    const filepath1 = getFixturePath('file1.json')
    const filepath2 = getFixturePath('file2.json')

    const result = genDiff(filepath1, filepath2, 'json')
    const parsed = JSON.parse(result)

    expect(Array.isArray(parsed)).toBe(true)
    expect(parsed).toHaveLength(5)

    const keys = parsed.map((item) => item.key)
    expect(keys).toContain('follow')
    expect(keys).toContain('host')
    expect(keys).toContain('proxy')
    expect(keys).toContain('timeout')
    expect(keys).toContain('verbose')
  })

  test('should output json format for nested JSON files', () => {
    const filepath1 = getFixturePath('nested1.json')
    const filepath2 = getFixturePath('nested2.json')

    const result = genDiff(filepath1, filepath2, 'json')
    const parsed = JSON.parse(result)

    expect(Array.isArray(parsed)).toBe(true)

    // Ищем вложенную структуру
    const commonNode = parsed.find((item) => item.key === 'common')
    expect(commonNode.type).toBe('nested')
    expect(commonNode.children).toBeDefined()
    expect(commonNode.children.length).toBeGreaterThan(0)
  })

  test('should output json format for YAML files', () => {
    const filepath1 = getFixturePath('nested1.yml')
    const filepath2 = getFixturePath('nested2.yml')

    const result = genDiff(filepath1, filepath2, 'json')
    const parsed = JSON.parse(result)

    expect(Array.isArray(parsed)).toBe(true)

    const group1Node = parsed.find((item) => item.key === 'group1')
    expect(group1Node).toBeDefined()
    expect(group1Node.type).toBe('nested')
  })
})
