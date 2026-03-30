# RICLI

Read books (epub, txt) in your terminal. / 在命令行中阅读书籍（epub, txt）

## Installation / 安装

```bash
npm install -g @alfxjx/ricli
```

## Usage / 使用

```bash
# Open a book directly / 直接打开一本书
ricli book.epub
ricli book.txt

# Launch without arguments to open the bookshelf / 不带参数启动，进入书架选择界面
ricli

# View / modify config / 查看 / 修改配置
ricli config
ricli config --set theme.fg=cyan
ricli config --set padding=4
ricli config --reset
```

## Keybindings / 快捷键

| Key / 按键 | Action / 功能 |
|------------|---------------|
| `↑` / `k` | Scroll up / 向上滚动 |
| `↓` / `j` | Scroll down / 向下滚动 |
| `←` / `h` | Previous chapter / 上一章 |
| `→` / `l` | Next chapter / 下一章 |
| `PgUp` / `b` | Page up / 向上翻页 |
| `PgDn` / `Space` | Page down / 向下翻页 |
| `Home` / `g` | Jump to chapter start / 跳到章节开头 |
| `End` / `G` | Jump to chapter end / 跳到章节末尾 |
| `t` | Open table of contents / 打开目录 |
| `o` | Enter file path in bookshelf / 在书架界面输入文件路径 |
| `d` | Remove book record in bookshelf / 在书架界面删除书籍记录 |
| `q` / `Esc` | Go back / quit / 返回上级 / 退出 |
| `Ctrl+C` | Force quit / 强制退出 |

## Features / 功能

1. **Bookshelf** — Books you open are recorded automatically; select them on next launch or remove records. / **书架管理** — 打开过的书自动记录，下次启动直接选择，支持删除记录
2. **Keybindings** — Arrow keys, vi-style (hjkl), paging, TOC navigation, and more. / **快捷键** — 支持方向键、vi 风格（hjkl）、翻页、目录跳转等
3. **Progress** — Reading position is saved automatically and restored when you reopen the same book. / **进度记录** — 阅读位置自动保存，下次打开同一本书自动恢复
4. **Config** — View or change theme, padding and more via `ricli config`. / **配置管理** — 通过 `ricli config` 命令查看或修改主题、边距等配置

## Configuration / 配置项

The config file lives at `~/.ricli/config.json` and can be edited directly or via the command. / 配置文件位于 `~/.ricli/config.json`，可直接编辑或通过命令修改：

```json
{
  "theme": {
    "fg": "white",
    "bg": "black",
    "headerFg": "yellow",
    "headerBg": "blue",
    "tocSelectedFg": "black",
    "tocSelectedBg": "green"
  },
  "padding": 2,
  "linesPerPage": 0
}
```

| Key / 配置项 | Description / 说明 | Default / 默认值 |
|---|---|---|
| `theme.fg` | Body text color / 正文文字颜色 | `grey` |
| `theme.bg` | Background color / 背景颜色 | `black` |
| `theme.headerFg` | Header text color / 标题栏文字颜色 | `yellow` |
| `theme.headerBg` | Header background color / 标题栏背景颜色 | `blue` |
| `theme.tocSelectedFg` | TOC selected item text color / 目录选中项文字颜色 | `black` |
| `theme.tocSelectedBg` | TOC selected item background color / 目录选中项背景颜色 | `green` |
| `padding` | Left/right text padding (chars) / 正文左右内边距（字符数） | `2` |
| `linesPerPage` | Lines per page, `0` = auto / 每页行数，`0` 为自动 | `0` |

Supported color values / 颜色值支持：`black` `red` `green` `yellow` `blue` `magenta` `cyan` `white` `grey` and/及 `#rrggbb` hex.

## Project Structure / 项目结构

```
src/
  index.js              CLI entry & subcommands / CLI 入口 & 子命令
  parser/
    index.js            Book loading dispatcher / 书籍加载分发
    epub-parser.js      EPUB parser / EPUB 解析
    txt-parser.js       TXT parser (auto chapter detection) / TXT 解析（自动检测章节）
  store/
    paths.js            Storage paths (dev/prod isolation) / 存储路径（dev/prod 隔离）
    config.js           User config management / 用户配置管理
    library.js          Bookshelf management / 书架管理
    progress.js         Reading progress management / 阅读进度管理
  ui/
    screen.js           Terminal screen init / 终端屏幕初始化
    book-select.js      Bookshelf selection UI / 书架选择界面
    reader-view.js      Reader UI / 阅读界面
    toc-view.js         Table of contents UI / 目录界面
    input-prompt.js     Input prompt dialog / 输入提示框
```

## Development / 开发

```bash
git clone https://github.com/Alfxjx/read-in-cli.git
cd read-in-cli
npm install
npm start          # Dev mode, data stored in ~/.ricli-dev / 开发模式，数据存储在 ~/.ricli-dev
```

### Releasing / 发布新版本

```bash
npm run release:patch   # 1.0.x
npm run release:minor   # 1.x.0
npm run release:major   # x.0.0
npm run release:dry     # Dry run, no actual publish / 预演，不实际发布
```

Commits follow the [Conventional Commits](https://conventionalcommits.org) spec; CHANGELOG is generated automatically on each release. / Commit 遵循 [Conventional Commits](https://conventionalcommits.org) 规范，每次发布自动生成 CHANGELOG。

## License

ISC