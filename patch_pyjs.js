#!/usr/bin/node
import fs from 'fs';
import os from 'os';

const path = "./src/pyjs/pyjs_runtime_browser.js";
fs.readFile(path, { encoding: 'utf-8'}, (err, data) => {
  const str = 'package'
  const regexs = [
    '(\\${)'+str+'(\\.filename})', 
    '(\\${)'+str+'(\\.name})', 
    '(,)'+str+'(\\))', 
    '(\\()'+str+'(=>)'
  ]
  const toReplace = '$1pkg$2'
  let patched = data
  regexs.forEach(reg => {
    patched = patched.replace(new RegExp(reg, 'g'), toReplace)
  })
  patched = patched.replace("import(import_str)", ";");
  patched += os.EOL
  patched += "export default createModule"
  fs.writeFileSync(path, patched, {encoding: 'utf-8'})
  console.log("patched");
});