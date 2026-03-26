import { readFileSync } from 'node:fs';

export function parseTxt(filePath) {
  const raw = readFileSync(filePath, 'utf-8');
  const lines = raw.split(/\r?\n/);

  // Try to detect chapters by common patterns
  const chapterPatterns = [
    /^第[一二三四五六七八九十百千\d]+[章节回卷篇]/,
    /^Chapter\s+\d+/i,
    /^CHAPTER\s+[IVXLCDM\d]+/,
    /^Part\s+\d+/i,
    /^卷[一二三四五六七八九十百千\d]+/,
  ];

  const chapters = [];
  let currentChapter = { title: '开头', lines: [] };

  for (const line of lines) {
    const trimmed = line.trim();
    const isChapterHeading = chapterPatterns.some((p) => p.test(trimmed));

    if (isChapterHeading && trimmed.length > 0 && trimmed.length < 80) {
      if (currentChapter.lines.length > 0) {
        chapters.push(currentChapter);
      }
      currentChapter = { title: trimmed, lines: [] };
    } else {
      currentChapter.lines.push(line);
    }
  }

  if (currentChapter.lines.length > 0) {
    chapters.push(currentChapter);
  }

  // If no chapters detected, split by fixed size
  if (chapters.length <= 1 && lines.length > 200) {
    const CHUNK = 200;
    const result = [];
    for (let i = 0; i < lines.length; i += CHUNK) {
      const chunk = lines.slice(i, i + CHUNK);
      result.push({
        title: `第 ${result.length + 1} 节 (行 ${i + 1}-${Math.min(i + CHUNK, lines.length)})`,
        lines: chunk,
      });
    }
    return {
      title: filePath.split(/[\\/]/).pop().replace(/\.txt$/i, ''),
      chapters: result.map((c) => ({ title: c.title, content: c.lines.join('\n') })),
    };
  }

  return {
    title: filePath.split(/[\\/]/).pop().replace(/\.txt$/i, ''),
    chapters: chapters.map((c) => ({ title: c.title, content: c.lines.join('\n') })),
  };
}
