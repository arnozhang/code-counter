import * as fs from "fs";
import * as path from "path";
import { FileAnalytics } from "../common/Declares";

/**
 * @author Arno Zhang
 * @date 2020/08/20
 */

export default class Utils {

  static count(filePath: string): FileAnalytics {
    const rep = fs.readFileSync(filePath).toString()
    const lines = rep.split('\n')

    const commentLines = lines
      .filter(line => new RegExp('^(//|/\\*|\\*|\\*/)', 'g')
      .test(line.trimStart()))
      .length;

    const whiteLines = lines.filter(line => line.trim() === '').length;

    return {
      filePath: Utils.shrinkFilePath(filePath),
      fileLines: lines.length,
      whiteLines,
      whiteRatio: Utils.ratioString(whiteLines / lines.length),
      commentLines,
      commentRatio: Utils.ratioString(commentLines / lines.length),
    };
  }

  static ratioString(ratio: number) {
    return (Math.round(ratio * 10000) / 100) + '%';
  }

  private static shrinkFilePath(filePath: string): string {
    if (filePath.length <= 40) {
      return filePath;
    }

    const start = Utils.indexOf(filePath, path.sep, 3);
    const end = Utils.indexOf(filePath, path.sep, 2, true);

    if (start > 0 && end > 0 && end > start) {
      return filePath.substring(0, start + 1)
        + ' ... '
        + filePath.substring(end, filePath.length);
    }

    return filePath;
  }

  private static indexOf(
    str: string,
    searchString: string,
    duplicate: number,
    reverse?: boolean): number {

    let index = reverse ? str.length - 1 : 0;
    let count = 0;

    while (true) {
      if (index >= str.length) {
        return index;
      }

      const next = reverse
        ? str.lastIndexOf(searchString, index)
        : str.indexOf(searchString, index);

      if (next >= 0) {
        ++count;

        if (count >= duplicate) {
          return next;
        } else {
          index = reverse ? next - 1 : next + 1;
        }
      } else {
        return index;
      }
    }
  }
}
