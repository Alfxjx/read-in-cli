import blessed from 'blessed';

export function createScreen(config) {
  const screen = blessed.screen({
    smartCSR: true,
    title: 'RICLI - 命令行阅读器',
    fullUnicode: true,
  });

  // Global quit
  screen.key(['C-c'], () => {
    process.exit(0);
  });

  return screen;
}
