/**
 * @author Arno Zhang
 * @date 2020/08/20
 */

import * as fs from 'fs';
import * as path from 'path';
import { ArrayUtils, JsUtils } from 'js-utils-lite';
import { FileAnalytics } from "../common/Declares";
import Utils from "../utils/Utils";


const filterDirs = [
  'node_modules',
  '.git',
  '.tscache',
  '.node',
  '.idea',
  '.vscode',
  '.m2',
  '.gradle',
];


function logHelp() {
  console.log('');
  console.log('clc usage:');
  console.log('');
  console.log('clc .');
  console.log('clc . java');
  console.log('clc ./src java');
  console.log('clc ./src java xml');
  console.log('');
}


function run() {
  const params = process.argv.splice(2);
  const rootPath = params[0];
  if (JsUtils.isEmpty(rootPath)) {
    logHelp();
    return;
  }

  const extensions = params.splice(1);

  const allFiles: FileAnalytics = {
    filePath: 'All Files',
    fileLines: 0,

    whiteLines: 0,
    whiteRatio: Utils.ratioString(0),

    commentLines: 0,
    commentRatio: Utils.ratioString(0),
  };

  const results: FileAnalytics[] = [allFiles,];

  const analytics = (filePath: string, extensions: string[] | undefined) => {
    fs.readdirSync(filePath)
      .map(file => path.join(filePath, file))
      .forEach(file => {
        const stat = fs.statSync(file);
        if (stat.isDirectory()) {
          if (ArrayUtils.arrayContains(filterDirs, path.basename(file))) {
            // filter ignore path
            return;
          }

          analytics(file, extensions);
        } else {
          // extension matched
          let extName = path.extname(file);
          extName = extName.length > 0 ? extName.substr(1) : extName;

          if (JsUtils.isEmpty(extensions)
            || ArrayUtils.arrayContains(extensions, extName)) {

            const result = Utils.count(file);
            results.push(result);

            allFiles.fileLines += result.fileLines;
            allFiles.whiteLines += result.whiteLines;
            allFiles.commentLines += result.commentLines;
          }
        }
      });

    allFiles.whiteRatio = Utils.ratioString(allFiles.whiteLines / allFiles.fileLines);
    allFiles.commentRatio = Utils.ratioString(allFiles.commentLines / allFiles.fileLines);
  };

  analytics(rootPath, extensions);

  console.table(results);
}


run();
