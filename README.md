# Obsidianer · Obsidian 新手學院 💎

給**完全初學者**循序漸進學習 [Obsidian](https://obsidian.md) 的互動式 App + 網頁，採用 Obsidian 風格的紫黑色深色主題。

同一份程式碼就是網頁，也是可安裝的 App（PWA）：可以加到手機主畫面或電腦桌面，離線也能使用。

## 功能

| 功能 | 說明 |
| --- | --- |
| 📚 學習路徑 | 6 章 19 課，從安裝到工作流；完成一課的測驗才會解鎖下一課 |
| ✍️ 動手練習 | 課程內建 Markdown 編輯器 + 即時預覽，自動檢查練習目標 |
| 📝 小測驗 | 每課 2–3 題，附詳解；一次全對有額外 XP |
| 🧪 練習場 | 自由練習 Obsidian 語法：`[[連結]]`、`![[嵌入]]`、`#標籤`、Callout、屬性、表格、待辦，可下載成 `.md` |
| 🕸️ 關係圖譜 | 可拖曳、縮放的力導向圖，展示課程與範例筆記庫的連結關係 |
| ⌨️ 快捷鍵速查 | Windows / macOS 切換、可搜尋 |
| 🏆 成就系統 | XP、等級、連續學習天數、10 枚徽章；進度可匯出 / 匯入 |
| 🔍 命令面板 | `Ctrl/⌘ + K` 快速跳到任何一課 |
| 📱 PWA | 可安裝、離線快取、手機底部導覽列 |

### 課程大綱

1. **認識 Obsidian**：Obsidian 是什麼、安裝與建立 Vault、介面與命令面板
2. **Markdown 基本功**：標題、文字格式、清單與待辦、引用 / 程式碼 / 表格 / Callout
3. **連結的力量**：雙向連結、反向連結、嵌入與區塊連結
4. **整理你的知識**：資料夾 vs 標籤 vs 連結、屬性 Properties、搜尋運算子
5. **視覺化與效率**：關係圖譜、Canvas 白板、每日筆記與範本
6. **進階與工作流**：核心 / 社群外掛、同步與備份、PARA / Zettelkasten / MOC

## 本機執行

純 HTML / CSS / JavaScript，不需要安裝任何套件或建置步驟：

```bash
python3 -m http.server 8000
```

然後打開 <http://localhost:8000>。（直接雙擊 `index.html` 也能用，但 Service Worker / 安裝 App 需要透過 http(s)。）

## 部署

已附上 GitHub Pages 工作流程 `.github/workflows/pages.yml`：
到 repo 的 **Settings → Pages → Source** 選擇 **GitHub Actions**，推送到 `main` 後就會自動部署。

## 專案結構

```
index.html             入口
manifest.webmanifest   PWA 設定
sw.js                  離線快取
css/style.css          紫黑色主題與響應式版面
js/markdown.js         支援 Obsidian 語法的輕量 Markdown 轉換器
js/lessons.js          課程內容、測驗、練習目標、快捷鍵、徽章（要新增課程改這裡）
js/app.js              路由、各頁面、進度儲存、關係圖譜、命令面板
icons/                 App 圖示
```

學習進度只儲存在瀏覽器的 `localStorage`，不會上傳到任何地方。

---

本專案為非官方學習資源，與 Obsidian（Dynalist Inc.）無隸屬關係。
