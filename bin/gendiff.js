#!/usr/bin/env node

import { Command } from "commander";

const program = new Command();

program
  .name("gendiff")
  .description("Compares two configuration files and shows a difference.")
  .version("0.0.1", "-V, --version", "output the version number")
  .arguments("<filepath1> <filepath2>")
  .option("-f, --format [type]", "output format")
  .helpOption("-h, --help", "display help for command");

program.parse(process.argv);
