# RICLI

在你的CLI中阅读书籍（epub, txt）

## 安装

```bash
npm install
npm link   # 全局安装 ricli 命令
```

## 使用

```bash
# 直接打开一本书
ricli book.epub
ricli book.txt

# 不带参数启动，进入书架选择界面
ricli
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
| `q` / `Esc` | 返回上级 / 退出 |
| `Ctrl+C` | 强制退出 |

## 功能

1. **文件加载模块** — 用户第一次输入书的路径时会记录到书架，下次启动自动显示书籍列表供选择
2. **快捷键** — 支持上下左右、翻页、vi风格快捷键、目录跳转、退出等
3. **进度记录** — 每次阅读进度自动保存，下次打开同一本书自动恢复

## 额外功能

1. **排版样式调整** — 在用户目录 `~/.ricli/config.json` 中自定义样式配置：

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
  "padding": 2
}
```

## 项目结构

```
src/
  index.js              CLI 入口
  parser/
    index.js            书籍加载分发
    epub-parser.js      EPUB 解析
    txt-parser.js       TXT 解析（自动检测章节）
  store/
    paths.js            存储路径定义
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