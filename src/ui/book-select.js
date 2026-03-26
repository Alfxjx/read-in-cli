import blessed from 'blessed';
import { getBooks, removeBook } from '../store/library.js';
import { getConfig } from '../store/config.js';

export function showBookSelect(screen, onSelect, onOpenFile) {
  const config = getConfig();
  const theme = config.theme;
  const books = getBooks();

  // Clear screen
  screen.children.forEach((c) => c.detach());

  const header = blessed.box({
    top: 0,
    left: 0,
    width: '100%',
    height: 3,
    content: '{center}RICLI - 命令行阅读器{/center}',
    tags: true,
    style: { fg: theme.headerFg, bg: theme.headerBg, bold: true },
  });

  const helpText = blessed.box({
    bottom: 0,
    left: 0,
    width: '100%',
    height: 3,
    content:
      ' {bold}Enter{/bold}: 打开  {bold}o{/bold}: 打开文件  {bold}d{/bold}: 删除  {bold}q{/bold}: 退出',
    tags: true,
    style: { fg: 'gray', bg: theme.bg },
  });

  if (books.length === 0) {
    const emptyMsg = blessed.box({
      top: 'center',
      left: 'center',
      width: 50,
      height: 5,
      content: '{center}书架为空\n\n使用 ricli <文件路径> 打开书籍\n或按 o 输入文件路径{/center}',
      tags: true,
      border: { type: 'line' },
      style: { fg: theme.fg, bg: theme.bg, border: { fg: 'gray' } },
    });

    screen.append(header);
    screen.append(emptyMsg);
    screen.append(helpText);

    screen.key(['o'], () => onOpenFile());
    screen.key(['q', 'escape'], () => process.exit(0));
    screen.render();
    return;
  }

  const listItems = books
    .sort((a, b) => (b.lastOpened || 0) - (a.lastOpened || 0))
    .map((b) => {
      const name = b.title || b.filePath;
      return ` ${name}`;
    });

  const list = blessed.list({
    top: 3,
    left: 0,
    width: '100%',
    bottom: 3,
    items: listItems,
    mouse: true,
    keys: true,
    vi: true,
    interactive: true,
    style: {
      fg: theme.fg,
      bg: theme.bg,
      selected: { fg: theme.tocSelectedFg, bg: theme.tocSelectedBg, bold: true },
      item: { fg: theme.fg, bg: theme.bg },
    },
    scrollbar: { ch: '│', style: { fg: 'gray' } },
  });

  list.on('select', (_item, index) => {
    const sortedBooks = books.sort((a, b) => (b.lastOpened || 0) - (a.lastOpened || 0));
    onSelect(sortedBooks[index].filePath);
  });

  list.key(['d'], () => {
    const sortedBooks = books.sort((a, b) => (b.lastOpened || 0) - (a.lastOpened || 0));
    const idx = list.selected;
    const book = sortedBooks[idx];
    if (book) {
      removeBook(book.filePath);
      showBookSelect(screen, onSelect, onOpenFile);
    }
  });

  list.key(['o'], () => onOpenFile());
  list.key(['q', 'escape'], () => process.exit(0));

  screen.append(header);
  screen.append(list);
  screen.append(helpText);
  list.focus();
  screen.render();
}
