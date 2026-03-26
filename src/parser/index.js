import { existsSync } from 'node:fs';
import { resolve, extname } from 'node:path';
import { parseEpub } from './epub-parser.js';
import { parseTxt } from './txt-parser.js';

export async function parseBook(filePath) {
  const absPath = resolve(filePath);

  if (!existsSync(absPath)) {
    throw new Error(`文件不存在: ${absPath}`);
  }

  const ext = extname(absPath).toLowerCase();

  switch (ext) {
    case '.epub':
      return { ...(await parseEpub(absPath)), filePath: absPath };
    case '.txt':
      return { ...parseTxt(absPath), filePath: absPath };
    default:
      throw new Error(`不支持的文件格式: ${ext}（仅支持 .epub 和 .txt）`);
  }
}
