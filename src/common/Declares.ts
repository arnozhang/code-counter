/**
 * @author Arno Zhang
 * @date 2020/08/20
 */

export interface MapT<T> {

  [key: string]: T;
}

export interface Map {

  [key: string]: any;
}

export type VoidFunction = () => void;
export type OneArgFunction = (result?: any) => void;
export type OneArgFunctionT<T> = (result?: T) => void;


export interface FileAnalytics {

  filePath: string,
  fileLines: number,

  whiteLines: number;
  whiteRatio: string;

  commentLines: number,
  commentRatio: string;
}
