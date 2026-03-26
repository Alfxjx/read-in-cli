#!/usr/bin/env node

import { Command } from 'commander';
import { resolve } from 'node:path';
import blessed from 'blessed';
import { createScreen } from './ui/screen.js';
import { showBookSelect } from './ui/book-select.js';
import { showReader } from './ui/reader-view.js';
import { showInputPrompt } from './ui/input-prompt.js';
import { parseBook } from './parser/index.js';
import { addBook } from './store/library.js';
import { getConfig } from './store/config.js';

const program = new Command();

program
  .name('ricli')
  .description('RICLI - 在命令行中阅读书籍 (epub, txt)')
  .version('1.0.0')
  .argument('[file]', '要打开的书籍文件路径 (.epub 或 .txt)')
  .action(async (file) => {
    const config = getConfig();
    const screen = createScreen(config);

    if (file) {
      await openBook(screen, resolve(file));
    } else {
      showLibrary(screen);
    }
  });

program.parse();

function showLibrary(screen) {
  showBookSelect(
    screen,
    async (filePath) => {
      await openBook(screen, filePath);
    },
    () => {
      promptOpenFile(screen);
    }
  );
}

function promptOpenFile(screen) {
  showInputPrompt(
    screen,
    '请输入书籍文件路径 (.epub 或 .txt):',
    async (value) => {
      if (value && value.trim()) {
        await openBook(screen, resolve(value.trim()));
      } else {
        showLibrary(screen);
      }
    },
    () => {
      showLibrary(screen);
    }
  );
}

async function openBook(screen, filePath) {
  // Show loading message
  screen.children.forEach((c) => c.detach());
  const loading = blessed.box({
    top: 'center',
    left: 'center',
    width: 30,
    height: 3,
    content: '{center}正在加载书籍...{/center}',
    tags: true,
    border: { type: 'line' },
    style: { fg: 'white', bg: 'black', border: { fg: 'gray' } },
  });
  screen.append(loading);
  screen.render();

  try {
    const book = await parseBook(filePath);
    addBook(filePath, book.title);

    loading.detach();
    screen.render();

    if (!book.chapters || book.chapters.length === 0) {
      showError(screen, '书籍内容为空或无法解析', () => showLibrary(screen));
      return;
    }

    showReader(screen, book, () => {
      showLibrary(screen);
    });
  } catch (err) {
    loading.detach();
    showError(screen, `打开书籍失败:\n${err.message}`, () => showLibrary(screen));
  }
}

function showError(screen, message, onClose) {
  const errorBox = blessed.message({
    top: 'center',
    left: 'center',
    width: '60%',
    height: 'shrink',
    label: ' 错误 ',
    border: { type: 'line' },
    style: { fg: 'red', bg: 'black', border: { fg: 'red' }, label: { fg: 'red', bold: true } },
  });

  screen.append(errorBox);
  errorBox.display(message, 0, () => {
    errorBox.detach();
    screen.render();
    onClose();
  });
  screen.render();
}
