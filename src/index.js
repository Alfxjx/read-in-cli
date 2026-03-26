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
import { getConfig, updateConfig, resetConfig } from './store/config.js';
import { APP_DIR, CONFIG_FILE } from './store/paths.js';

const program = new Command();

program
  .name('ricli')
  .description('RICLI - 在命令行中阅读书籍 (epub, txt)')
  .version('1.0.0')
  .argument('[path]', '要打开的书籍文件路径 (.epub 或 .txt)')
  .action(async (path) => {
    const config = getConfig();
    const screen = createScreen(config);

    if (path) {
      await openBook(screen, resolve(path));
    } else {
      showLibrary(screen);
    }
  });

program
  .command('config')
  .description('查看或修改配置')
  .option('--reset', '重置为默认配置')
  .option('--set <key=value>', '设置单个配置项，支持 theme.fg=cyan 格式')
  .action((opts) => {
    if (opts.reset) {
      resetConfig();
      console.log('已重置为默认配置。');
      return;
    }
    if (opts.set) {
      const eqIdx = opts.set.indexOf('=');
      if (eqIdx === -1) {
        console.error('格式错误，请使用 key=value 格式，例如: --set theme.fg=cyan');
        process.exit(1);
      }
      const key = opts.set.slice(0, eqIdx).trim();
      const value = opts.set.slice(eqIdx + 1).trim();

      // Build nested object from dot-notation key
      const parts = key.split('.');
      const partial = {};
      let cursor = partial;
      for (let i = 0; i < parts.length - 1; i++) {
        cursor[parts[i]] = {};
        cursor = cursor[parts[i]];
      }
      cursor[parts[parts.length - 1]] = isNaN(value) ? value : Number(value);

      const updated = updateConfig(partial);
      console.log(`已更新: ${key} = ${value}`);
      console.log('\n当前配置:');
      console.log(JSON.stringify(updated, null, 2));
      return;
    }

    // Default: print current config
    const config = getConfig();
    console.log(`配置文件路径: ${CONFIG_FILE}\n`);
    console.log(JSON.stringify(config, null, 2));
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
