# Obsidianer · Obsidian 新手學院 💎

🌐 網頁版：https://obsidianer.onepointzeroone.org/

給**完全初學者**用「滑卡片」的方式學習 [Obsidian](https://obsidian.md) 的 App + 網頁，採用 Obsidian 風格的紫黑色深色主題。

每張卡片用 30 秒介紹一個 Obsidian 功能，有興趣就點進去，進入專屬的學習頁面（教學、動手練習、小測驗）。

同一份程式碼可以：
- 🌐 當網頁使用（也能安裝成 PWA，離線可用）
- 📱 透過 Capacitor 打包成 **iOS App（App Store）** 與 **Android App（Google Play）**，詳見 [上架指南](docs/APP_STORE.md)

## 功能

| 功能 | 說明 |
| --- | --- |
| 🃏 滑卡探索 | 首頁是全螢幕卡片，上下滑動瀏覽 19 個功能；點卡片進入該功能的學習頁，返回時停在同一張卡片 |
| ♥ 收藏 | 把有興趣的卡片收藏起來，在「課程」頁集中查看 |
| 📚 學習路徑 | 6 章 19 課，從安裝到工作流；建議依序學習，也可以自由挑選 |
| ✍️ 動手練習 | 課程內建 Markdown 編輯器 + 即時預覽，自動檢查練習目標 |
| 📝 小測驗 | 每課 2–3 題，附詳解；一次全對有額外 XP |
| 🧪 練習場 | 自由練習 Obsidian 語法：`[[連結]]`、`![[嵌入]]`、`#標籤`、Callout、屬性、表格、待辦，可下載成 `.md` |
| 🕸️ 關係圖譜 | 可拖曳、縮放的力導向圖，展示課程與範例筆記庫的連結關係 |
| ⌨️ 快捷鍵速查 | Windows / macOS 切換、可搜尋 |
| 🏆 成就系統 | XP、等級、連續學習天數、11 枚徽章；進度可匯出 / 匯入 |
| 🪪 名片與人脈 | 做一張 Obsidian 風格的名片，用 QR / 連結交換；收到的名片存成「人脈筆記」，用 `[[名字]]`、`#標籤` 串起來，有反向連結與人脈圖譜，可整包匯出成 Obsidian Vault |
| 🔍 命令面板 | `Ctrl/⌘ + K` 快速跳到任何一課 |
| 📱 原生 App | iOS / Android 專案已建立，含 App 圖示、啟動畫面、觸覺回饋 |

### 名片與人脈（`#/card`）

不需要帳號、也沒有後端：

- **我的名片** `#/card`：填資料 → 自動產生分享連結與 QR Code。名片資料以 JSON → deflate → base64url 編碼在網址 `#/c/<資料>` 裡，伺服器看不到。
- **收到名片** `#/c/<資料>`：對方打開連結就看到你的名片，可「存進我的人脈」（記下在哪裡、哪天認識）、下載 vCard 或 `.md`，再一鍵回傳自己的名片完成交換。
- **人脈** `#/people`：每個人是一則 Markdown 筆記，可寫 `[[其他人]]`、`#標籤`；顯示反向連結與「同場認識」的人；改名會自動更新其他筆記裡的連結。
- **人脈圖譜** `#/network`：我 → 人脈 → 活動 / 標籤，像 Obsidian Graph View。
- **匯出 Obsidian Vault**：下載 `.zip`（`人脈/*.md`、`活動/*.md`、`人脈 MOC.md`、自己的名片），解壓後用 Obsidian 開啟即可。
- 支援 `BarcodeDetector` 的瀏覽器（例如 Android Chrome）可直接在網頁內掃描 QR；其他裝置用系統相機掃描即可開啟網頁版。

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

## 打包成 App

```bash
npm install
npm run ios       # 需要 Mac + Xcode
npm run android   # 需要 Android Studio
```

沒有 Xcode 也可以：用 GitHub 雲端 Mac 一鍵打包上傳 TestFlight，見 [docs/IOS_CLOUD_BUILD.md](docs/IOS_CLOUD_BUILD.md)。

上架 App Store / Google Play 的完整步驟（含商標、隱私權、審核注意事項）請看 **[docs/APP_STORE.md](docs/APP_STORE.md)**。

## 網頁版

🌐 **https://obsidianer.onepointzeroone.org/**

用 GitHub Pages 自動部署：推送到 `main` 後就會更新。第一次設定（DNS、自訂網域、HTTPS）請看 [docs/DEPLOY.md](docs/DEPLOY.md)。

## 專案結構

```
index.html             入口
privacy.html           隱私權政策（上架必填）
manifest.webmanifest   PWA 設定
sw.js                  離線快取
css/style.css          紫黑色主題與響應式版面
js/markdown.js         支援 Obsidian 語法的輕量 Markdown 轉換器
js/lessons.js          課程內容、卡片文案、測驗、練習目標、快捷鍵、徽章（要新增課程改這裡）
js/app.js              路由、滑卡、各頁面、進度儲存、關係圖譜、命令面板
js/connect.js          名片與人脈：名片編碼 / QR、人脈筆記、人脈圖譜、Vault 匯出
js/vendor/qrcode.js    QR Code 產生器（Kazuhiko Arase，MIT）
icons/                 網頁 / PWA 圖示
assets/                商店用 1024px 圖示
capacitor.config.json  App 設定（App ID、名稱）
scripts/build-www.mjs  把網頁複製到 www/ 給 App 打包
ios/  android/         原生 App 專案（Capacitor 產生）
docs/APP_STORE.md      上架指南
```

學習進度、名片與人脈只儲存在瀏覽器的 `localStorage`，不會上傳到任何地方。

---

本專案為非官方學習資源，與 Obsidian（Dynalist Inc.）無隸屬關係。
