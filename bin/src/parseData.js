import fs from 'fs'
import path from 'node:path'
import { cwd } from 'node:process'

export default (filepath) => {
  const fullPath = path.resolve(cwd(),filepath)
  const fileExt = path.extname(fullPath)
  const fileContent = fs.readFileSync(fullPath, 'utf8')

  switch (fileExt) {
    case '.json':
      return JSON.parse(fileContent)
    case '.txt':
      return fileContent
    default:
      return fileContent
  }
}