import blessed from 'blessed';
import { getConfig } from '../store/config.js';
import { saveProgress, getProgress } from '../store/progress.js';
import { showToc } from './toc-view.js';

export function showReader(screen, book, onExit) {
  const config = getConfig();
  const theme = config.theme;
  const padding = config.padding || 2;

  const { chapters, filePath, title } = book;
  const saved = getProgress(filePath);
  let chapterIndex = Math.min(saved.chapterIndex, chapters.length - 1);
  let tocVisible = false;

  // Clear screen
  screen.children.forEach((c) => c.detach());

  // Header
  const header = blessed.box({
    top: 0,
    left: 0,
    width: '100%',
    height: 1,
    tags: true,
    style: { fg: theme.headerFg, bg: theme.headerBg, bold: true },
  });

  // Content area
  const content = blessed.box({
    top: 1,
    left: padding,
    right: padding,
    bottom: 2,
    scrollable: true,
    alwaysScroll: true,
    mouse: true,
    keys: false,
    vi: false,
    scrollbar: { ch: '│', style: { fg: 'gray' } },
    style: { fg: theme.fg, bg: theme.bg },
    tags: false,
  });

  // Footer
  const footer = blessed.box({
    bottom: 0,
    left: 0,
    width: '100%',
    height: 2,
    tags: true,
    style: { fg: 'gray', bg: theme.bg },
  });

  function updateHeader() {
    const ch = chapters[chapterIndex];
    const chTitle = ch ? ch.title : '';
    header.setContent(
      ` ${title} │ ${chTitle} [${chapterIndex + 1}/${chapters.length}]`
    );
  }

  function updateFooter() {
    const scrollPercent = content.getScrollPerc();
    const pct = isNaN(scrollPercent) ? 0 : Math.round(scrollPercent);
    footer.setContent(
      ` ↑↓/jk: 滚动  ←→/hl: 章节  PgUp/PgDn: 翻页  t: 目录  q: 返回\n 进度: ${pct}%`
    );
  }

  function loadChapter(index, scrollPos) {
    if (index < 0 || index >= chapters.length) return;
    chapterIndex = index;
    const ch = chapters[chapterIndex];

    // Word-wrap content to fit the available width
    const text = ch.content || '（本章无内容）';
    content.setContent(text);
    content.scrollTo(scrollPos || 0);
    updateHeader();
    updateFooter();
    persistProgress();
    screen.render();
  }

  function persistProgress() {
    const pos = content.childBase || 0;
    saveProgress(filePath, chapterIndex, pos);
  }

  function nextChapter() {
    if (chapterIndex < chapters.length - 1) {
      loadChapter(chapterIndex + 1, 0);
    }
  }

  function prevChapter() {
    if (chapterIndex > 0) {
      loadChapter(chapterIndex - 1, 0);
    }
  }

  function scrollDown(lines) {
    content.scroll(lines || 1);
    updateFooter();
    persistProgress();
    screen.render();
  }

  function scrollUp(lines) {
    content.scroll(-(lines || 1));
    updateFooter();
    persistProgress();
    screen.render();
  }

  function pageDown() {
    const h = content.height - 2;
    scrollDown(h > 1 ? h : 10);
  }

  function pageUp() {
    const h = content.height - 2;
    scrollUp(h > 1 ? h : 10);
  }

  // Key bindings
  screen.key(['down', 'j'], () => scrollDown(1));
  screen.key(['up', 'k'], () => scrollUp(1));
  screen.key(['right', 'l'], () => nextChapter());
  screen.key(['left', 'h'], () => prevChapter());
  screen.key(['pagedown', 'space'], () => pageDown());
  screen.key(['pageup', 'b'], () => pageUp());
  screen.key(['home', 'g'], () => {
    content.scrollTo(0);
    updateFooter();
    persistProgress();
    screen.render();
  });
  screen.key(['end', 'S-g'], () => {
    content.scrollTo(content.getScrollHeight());
    updateFooter();
    persistProgress();
    screen.render();
  });

  screen.key(['t'], () => {
    if (tocVisible) return;
    tocVisible = true;
    showToc(
      screen,
      chapters,
      chapterIndex,
      (idx) => {
        tocVisible = false;
        content.focus();
        loadChapter(idx, 0);
      },
      () => {
        tocVisible = false;
        content.focus();
        screen.render();
      }
    );
  });

  screen.key(['q', 'escape'], () => {
    if (tocVisible) return;
    persistProgress();
    // Remove all key listeners to avoid leaking into next screen
    screen.unkey(['down', 'j']);
    screen.unkey(['up', 'k']);
    screen.unkey(['right', 'l']);
    screen.unkey(['left', 'h']);
    screen.unkey(['pagedown', 'space']);
    screen.unkey(['pageup', 'b']);
    screen.unkey(['home', 'g']);
    screen.unkey(['end', 'S-g']);
    screen.unkey(['t']);
    screen.unkey(['q', 'escape']);
    onExit();
  });

  screen.append(header);
  screen.append(content);
  screen.append(footer);
  content.focus();

  // Load saved chapter/position
  loadChapter(chapterIndex, saved.scrollPos || 0);
}
