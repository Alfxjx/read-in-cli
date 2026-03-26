import { EPub } from 'epub2';
import { convert } from 'html-to-text';

export async function parseEpub(filePath) {
  const epub = await EPub.createAsync(filePath);

  const title = epub.metadata?.title || filePath.split(/[\\/]/).pop();
  const toc = epub.flow || [];

  const chapters = [];

  for (const item of toc) {
    try {
      const html = await new Promise((resolve, reject) => {
        epub.getChapter(item.id, (err, text) => {
          if (err) reject(err);
          else resolve(text);
        });
      });

      const text = convert(html, {
        wordwrap: false,
        selectors: [
          { selector: 'img', format: 'skip' },
          { selector: 'a', options: { ignoreHref: true } },
        ],
      });

      // Use TOC title if available, otherwise try to extract from content
      const chapterTitle =
        item.title ||
        findTocTitle(epub.toc, item.id) ||
        text.split('\n').find((l) => l.trim())?.trim().slice(0, 60) ||
        item.id;

      chapters.push({
        id: item.id,
        title: chapterTitle,
        content: text,
      });
    } catch {
      // Skip chapters that fail to parse
    }
  }

  return { title, chapters };
}

function findTocTitle(toc, id) {
  if (!toc) return null;
  for (const entry of toc) {
    if (entry.id === id) return entry.title;
    if (entry.subItems) {
      const found = findTocTitle(entry.subItems, id);
      if (found) return found;
    }
  }
  return null;
}
