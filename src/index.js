import fs from 'fs'
import path from 'path'
import parse from './parsers.js'
import buildDiff from './buildDiff.js'
import getFormatter from './formatters/index.js'

const genDiff = (filepath1, filepath2, formatName = 'stylish') => {
  const fullPath1 = path.resolve(process.cwd(), filepath1)
  const fullPath2 = path.resolve(process.cwd(), filepath2)

  const data1 = fs.readFileSync(fullPath1, 'utf-8')
  const data2 = fs.readFileSync(fullPath2, 'utf-8')

  const ext1 = path.extname(filepath1).slice(1)
  const ext2 = path.extname(filepath2).slice(1)

  const obj1 = parse(data1, ext1)
  const obj2 = parse(data2, ext2)

  const diffTree = buildDiff(obj1, obj2)
  const formatter = getFormatter(formatName)
  return formatter(diffTree)
}

export default genDiff