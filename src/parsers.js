import { readFileSync } from 'fs'
import { extname } from 'path'
import yaml from 'js-yaml'

const parseJSON = (content) => JSON.parse(content)
const parseYAML = (content) => yaml.load(content)

const parsers = {
  '.json': parseJSON,
  '.yml': parseYAML,
  '.yaml': parseYAML,
}

const parseFile = (filepath) => {
  const content = readFileSync(filepath, 'utf-8')
  const extension = extname(filepath).toLowerCase()
  const parse = parsers[extension]

  if (!parse) {
    throw new Error(`Unsupported file format: ${extension}. Supported: .json, .yml, .yaml`)
  }

  return parse(content)
}

export default parseFile
