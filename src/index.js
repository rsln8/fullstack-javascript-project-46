import path from "path";
import fs from "fs";
import _ from "lodash";

const genDiff = (path1, path2) => {
  const fullPath1 = path.resolve(process.cwd(), path1);
  const fullPath2 = path.resolve(process.cwd(), path2);
  const data1 = fs.readFileSync(fullPath1, "utf-8");
  const data2 = fs.readFileSync(fullPath2, "utf-8");
  const obj1 = JSON.parse(data1);
  const obj2 = JSON.parse(data2);

  const keys = _.sortBy(_.union(_.keys(obj1), _.keys(obj2)));

  const diff = keys.map((key) => {
    if (!_.has(obj1, key)) {
      return `  + ${key}: ${obj2[key]}`;
    }
    if (!_.has(obj2, key)) {
      return `  - ${key}: ${obj1[key]}`;
    }
    if (obj1[key] !== obj2[key]) {
      return `  - ${key}: ${obj1[key]}\n  + ${key}: ${obj2[key]}`;
    }
    return `    ${key}: ${obj1[key]}`;
  });

  return `{\n${diff.join("\n")}\n}`;
};

export default genDiff;
