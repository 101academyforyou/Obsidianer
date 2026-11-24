# 上架指南：App Store、Google Play 與網頁版

## ✅ 已決定的設定

| 項目 | 設定 |
| --- | --- |
| App Store 名稱 | **Obsidianer 筆記學院**（在 App Store Connect 填寫；主畫面圖示下方顯示 `Obsidianer`） |
| 副標題 | 非官方 Obsidian 新手教學 |
| Bundle ID | `app.obsidianer.learn` |
| 裝置 | **只支援 iPhone**（`TARGETED_DEVICE_FAMILY = 1`），只能直向 |
| 截圖 | `assets/appstore/iphone-6.9/`：6 張 1320 × 2868，可直接上傳到 6.9 吋 iPhone 欄位 |
| 隱私權政策 | https://obsidianer.onepointzeroone.org/privacy.html |
| 支援網址 | https://obsidianer.onepointzeroone.org/ |

Obsidianer 用同一份網頁程式碼，透過 [Capacitor](https://capacitorjs.com) 包成 iOS 與 Android App。
`ios/` 和 `android/` 兩個原生專案已經建立好，App 圖示與啟動畫面也已放進去。

```
網頁原始碼（index.html / css / js）
        │  npm run build（複製到 www/）
        ▼
      www/ ──npx cap sync──▶ ios/（Xcode）  ──▶ App Store
                        └──▶ android/（Android Studio）──▶ Google Play
```

---

## 0. 上架前一定要先決定的兩件事

### ⚠️ App 名稱與商標
「Obsidian」是 Dynalist Inc. 的商標。Apple 審核準則 **5.2.1（智慧財產權）** 和 Google Play 政策都可能拒絕名稱或圖示容易讓人誤會是官方 App 的作品。建議：

- App 名稱**不要以 Obsidian 開頭**。比較安全的寫法是把它放在副標題，並清楚標示非官方，例如：
  - 名稱：`筆記星圖：第二大腦入門`
  - 副標題：`非官方 Obsidian 新手教學`
- 圖示不要使用 Obsidian 官方 Logo（目前的紫色寶石是本專案自己畫的）。
- 描述第一段就寫上：「本 App 為非官方學習資源，與 Obsidian（Dynalist Inc.）無隸屬關係。」
- 最保險的做法是寫信詢問 Obsidian 團隊能否在名稱中使用 Obsidian。

想改 App 名稱：修改 `capacitor.config.json` 的 `appName`、`ios/App/App/Info.plist` 的 `CFBundleDisplayName`，以及 `android/app/src/main/res/values/strings.xml` 的 `app_name`。

### 🆔 Bundle ID / Package Name
目前是 `app.obsidianer.learn`，**上架後就不能再改**。建議換成你自己的網域反寫，例如 `com.你的名字.obsidianer`：

- `capacitor.config.json` → `appId`
- Xcode → App target → Signing & Capabilities → Bundle Identifier
- `android/app/build.gradle` → `applicationId` 與 `namespace`

---

## 1. 準備環境

| 項目 | iOS | Android |
| --- | --- | --- |
| 電腦 | **必須是 Mac** | Mac / Windows / Linux 皆可 |
| 開發工具 | 最新版 Xcode（App Store 免費下載） | Android Studio |
| 開發者帳號 | [Apple Developer Program](https://developer.apple.com/programs/)，年費 US$99 | [Google Play Console](https://play.google.com/console)，一次性 US$25 |
| 其他 | Node.js 22 以上 | Node.js 22 以上、JDK 21 |

```bash
npm install
```

---

## 2. 在手機上測試

```bash
npm run ios       # 建置網頁 → 同步 → 開啟 Xcode
```

在 Xcode 上方選擇模擬器或接上的 iPhone，按 ▶ 執行。第一次用實機需要在 **Signing & Capabilities** 選擇你的 Team。

```bash
npm run android   # 建置網頁 → 同步 → 開啟 Android Studio
```

**每次修改網頁內容後**（例如在 `js/lessons.js` 新增課程），都要再執行一次 `npm run sync`，App 才會更新。

---

## 3. 上架 App Store（iOS）

1. **App Store Connect 建立 App**：到 [App Store Connect](https://appstoreconnect.apple.com) → 我的 App → ＋ → 新增 App，填入名稱、主要語言（繁體中文）、Bundle ID、SKU。
2. **設定版本號**：Xcode → App target → General → Version（例如 1.0.0）與 Build（每次上傳都要加 1）。
3. **封存並上傳**：Xcode 上方裝置選 *Any iOS Device (arm64)* → 選單 **Product → Archive** → 完成後在 Organizer 按 **Distribute App → App Store Connect → Upload**。
4. **填寫商店資訊**：
   - 類別：**教育**（次要類別：生產力工具）
   - 截圖：依 App Store Connect 要求的 iPhone 尺寸上傳（可以用模擬器 ⌘S 截圖）；如果要支援 iPad，也要上傳 iPad 截圖
   - 描述、關鍵字、支援網址
   - **隱私權政策網址**：`https://obsidianer.onepointzeroone.org/privacy.html`
5. **App 隱私（營養標籤）**：選擇 **「不蒐集資料」（Data Not Collected）**。本 App 沒有帳號、廣告、分析工具，進度只存在裝置上。
6. **年齡分級**：所有問題選「無」，結果是 4+。
7. **出口合規**：`Info.plist` 已設定 `ITSAppUsesNonExemptEncryption = false`，上傳後不會再被詢問加密問題。
8. 選擇剛上傳的 Build → **提交審核**。審核通常需要 1～3 天。

### 關於審核準則 4.2（最低功能要求）
Apple 可能拒絕「只是把網站包起來」的 App。Obsidianer 的內容全部打包在 App 內、可離線使用，並且有原生觸覺回饋、練習與測驗、進度與徽章等互動功能，通常符合要求。如果仍被以 4.2 退件，可以考慮：

- 加入每日學習提醒（`@capacitor/local-notifications`）
- 增加更多課程與互動練習
- 在審核備註中說明 App 的離線學習與互動功能

---

## 4. 上架 Google Play（Android）

1. Android Studio → **Build → Generate Signed App Bundle / APK → Android App Bundle**，建立一把上傳金鑰（keystore）。**請妥善備份這把金鑰與密碼，遺失會無法更新 App。**
2. 到 [Play Console](https://play.google.com/console) 建立應用程式 → 上傳 `.aab`。
3. 填寫商店資訊、內容分級問卷、**資料安全性表單（選擇不蒐集、不分享任何資料）**、隱私權政策網址。
4. 新的個人開發者帳號需要先完成「封閉測試」（目前規定是至少 12 位測試人員、持續 14 天）才能申請正式發布。

---

## 5. 網頁版

網頁版網址：**https://obsidianer.onepointzeroone.org/**，用 GitHub Pages 發布。詳細設定步驟見 [DEPLOY.md](DEPLOY.md)。

- 推送到 `main` 後，`.github/workflows/pages.yml` 會執行 `scripts/build-www.mjs`，只把網頁檔案發布出去（不含 `ios/`、`android/`）。
- 其他平台（Netlify、Vercel、Cloudflare Pages）：建置指令填 `node scripts/build-www.mjs`，發布目錄填 `www`。

網頁版也是 PWA：使用者可以從瀏覽器「加到主畫面」，離線也能使用。

---

## 6. 更新 App 的流程

```bash
# 1. 修改內容（例如 js/lessons.js）
# 2. 同步到原生專案
npm run sync
# 3. 在 Xcode / Android Studio 把 Build 號碼 +1
# 4. 重新 Archive / 產生 App Bundle，上傳並提交審核
```

網頁版只要推送到 `main` 就會自動更新。
