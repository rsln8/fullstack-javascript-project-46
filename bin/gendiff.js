#!/usr/bin/env node
import { Command } from 'commander'
// import _ from 'lodash'
// import fs from 'fs'
// import path from 'node:path'
// import { cwd } from 'node:process'
// import { readFileSync } from 'node:fs'
import parseData from './src/parseData.js'

const program = new Command()

program
  .name('gendiff')
  .version('1.0.0')
  .description('Compares two configuration files and shows a difference.')
  .option('-f, --format  [type]', 'output format')
  .arguments('<filepath1> <filepath2>')
  .action((filepath1, filepath2) => {
    const parsedFile1 = parseData(filepath1)
    const parsedFile2 = parseData(filepath2)
    const keys1 = Object.keys(parsedFile1)
    const keys2 = Object.keys(parsedFile2)

    const filteredKeysFile1 = keys1.sort().filter((key) => !keys2.includes(key) || parsedFile1[key] === parsedFile2[key])
    const filteredKeysEqual = keys1.sort().filter((key) => keys2.includes(key) && parsedFile1[key] !== parsedFile2[key])
    const filteredKeysFile2 = keys2.sort().filter((key) => !keys1.includes(key))

    console.log('{')
    filteredKeysFile1.forEach((key) => {
      let stringStatus = '-'
      if (keys2.includes(key)) {
        stringStatus = ' '
      }
      console.log(`  ${stringStatus} ${key}: ${parsedFile1[key]}`)
    })
    filteredKeysEqual.forEach((key) => {
      console.log(`  - ${key}: ${parsedFile1[key]}`)
      console.log(`  + ${key}: ${parsedFile2[key]}`)
    })
    filteredKeysFile2.forEach((key) => {
      console.log(`  + ${key}: ${parsedFile2[key]}`)
    })
    console.log('}')

    // console.log(filteredKeysFile1)
    // console.log(filteredKeysEqual)
    // console.log(filteredKeysFile2)
    // console.log('-------------------')
    // console.log(parseData(filepath1))
    // console.log('-------------------')
    // console.log(parseData(filepath2))
    // console.log('-------------------')
  })
  .parse(process.argv)

const options = program.opts();
