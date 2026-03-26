# RICLI

在命令行中阅读书籍（epub, txt）

## 安装

```bash
npm install -g @alfxjx/ricli
```

## 使用

```bash
# 直接打开一本书
ricli book.epub
ricli book.txt

# 不带参数启动，进入书架选择界面
ricli

# 查看 / 修改配置
ricli config
ricli config --set theme.fg=cyan
ricli config --set padding=4
ricli config --reset
```

## 快捷键

| 快捷键 | 功能 |
|--------|------|
| `↑` / `k` | 向上滚动 |
| `↓` / `j` | 向下滚动 |
| `←` / `h` | 上一章 |
| `→` / `l` | 下一章 |
| `PgUp` / `b` | 向上翻页 |
| `PgDn` / `Space` | 向下翻页 |
| `Home` / `g` | 跳到章节开头 |
| `End` / `G` | 跳到章节末尾 |
| `t` | 打开目录 |
| `o` | 在书架界面输入文件路径 |
| `d` | 在书架界面删除书籍记录 |
| `q` / `Esc` | 返回上级 / 退出 |
| `Ctrl+C` | 强制退出 |

## 功能

1. **书架管理** — 打开过的书自动记录，下次启动直接选择，支持删除记录
2. **快捷键** — 支持方向键、vi 风格（hjkl）、翻页、目录跳转等
3. **进度记录** — 阅读位置自动保存，下次打开同一本书自动恢复
4. **配置管理** — 通过 `ricli config` 命令查看或修改主题、边距等配置

## 配置项

配置文件位于 `~/.ricli/config.json`，可直接编辑或通过命令修改：

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

| 配置项 | 说明 | 默认值 |
|--------|------|--------|
| `theme.fg` | 正文文字颜色 | `grey` |
| `theme.bg` | 背景颜色 | `black` |
| `theme.headerFg` | 标题栏文字颜色 | `yellow` |
| `theme.headerBg` | 标题栏背景颜色 | `blue` |
| `theme.tocSelectedFg` | 目录选中项文字颜色 | `black` |
| `theme.tocSelectedBg` | 目录选中项背景颜色 | `green` |
| `padding` | 正文左右内边距（字符数） | `2` |
| `linesPerPage` | 每页行数，`0` 为自动 | `0` |

颜色值支持：`black` `red` `green` `yellow` `blue` `magenta` `cyan` `white` `grey` 及 `#rrggbb` 十六进制。

## 项目结构

```
src/
  index.js              CLI 入口 & 子命令
  parser/
    index.js            书籍加载分发
    epub-parser.js      EPUB 解析
    txt-parser.js       TXT 解析（自动检测章节）
  store/
    paths.js            存储路径（dev/prod 隔离）
    config.js           用户配置管理
    library.js          书架管理
    progress.js         阅读进度管理
  ui/
    screen.js           终端屏幕初始化
    book-select.js      书架选择界面
    reader-view.js      阅读界面
    toc-view.js         目录界面
    input-prompt.js     输入提示框
```

## 开发

```bash
git clone https://github.com/Alfxjx/read-in-cli.git
cd read-in-cli
npm install
npm start          # 开发模式，数据存储在 ~/.ricli-dev
```

### 发布新版本

```bash
npm run release:patch   # 1.0.x
npm run release:minor   # 1.x.0
npm run release:major   # x.0.0
npm run release:dry     # 预演，不实际发布
```

Commit 遵循 [Conventional Commits](https://conventionalcommits.org) 规范，每次发布自动生成 CHANGELOG。

## License

ISC