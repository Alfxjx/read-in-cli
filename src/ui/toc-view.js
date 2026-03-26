import blessed from 'blessed';
import { getConfig } from '../store/config.js';

export function showToc(screen, chapters, currentIndex, onSelect, onClose) {
  const config = getConfig();
  const theme = config.theme;

  const tocBox = blessed.list({
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    label: ' 目录 (Enter 选择, q/Esc 返回) ',
    border: { type: 'line' },
    items: chapters.map((c, i) => {
      const marker = i === currentIndex ? ' ▶ ' : '   ';
      return `${marker}${i + 1}. ${c.title}`;
    }),
    mouse: true,
    keys: true,
    vi: true,
    interactive: true,
    scrollbar: { ch: '│', style: { fg: 'gray' } },
    style: {
      fg: theme.fg,
      bg: theme.bg,
      border: { fg: 'gray' },
      label: { fg: theme.headerFg, bold: true },
      selected: { fg: theme.tocSelectedFg, bg: theme.tocSelectedBg, bold: true },
      item: { fg: theme.fg, bg: theme.bg },
    },
  });

  tocBox.select(currentIndex);

  tocBox.on('select', (_item, index) => {
    tocBox.detach();
    screen.render();
    onSelect(index);
  });

  tocBox.key(['q', 'escape'], () => {
    tocBox.detach();
    screen.render();
    onClose();
  });

  screen.append(tocBox);
  tocBox.focus();
  screen.render();
}
