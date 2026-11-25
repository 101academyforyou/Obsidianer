# 網頁版部署：obsidianer.onepointzeroone.org

## 網站結構

| 網址 | 內容 | 原始檔 |
| --- | --- | --- |
| `/` | 介紹網頁（含 App Store 下載人數） | `landing/` |
| `/app/` | 學習網頁 App（與 iOS / Android App 相同） | 專案根目錄的 `index.html`、`css/`、`js/` |
| `/privacy.html` | 隱私權政策（App Store 使用，路徑不可改） | `privacy.html` |
| `/stats.json` | 累計下載數，每天自動更新 | `scripts/fetch_downloads.py` 產生 |

`scripts/build-site.mjs` 會把以上組合到 `site/` 再發布。部署流程在推送到 `main` 時執行，**另外每天台灣時間 10:17 自動重新部署一次**，以更新下載數。

### 下載人數需要的 Secret

除了上架用的 `ASC_KEY_ID`、`ASC_ISSUER_ID`、`ASC_KEY_P8`，還需要新增：

| Name | 值 | 在哪裡找 |
| --- | --- | --- |
| `ASC_VENDOR_NUMBER` | 廠商編號（8 碼左右的數字） | App Store Connect →「**報告**」（付款與財務報告）頁面，左上角帳號名稱下方的數字 |

沒有設定、或 App 還沒有任何下載時，介紹網頁會顯示「19 堂課程 · 6 個章節 · App Store 即將上架」。
只計算**首次下載**（不含更新與重新下載），資料來自 App Store Connect 銷售報告，通常有 1 天延遲。

---

網頁版用 **GitHub Pages** 發布到 **https://obsidianer.onepointzeroone.org/**。
程式碼這邊已經設定好，只差下面三個一次性的設定，需要由你操作。

---

## 步驟 1：設定 DNS（在管理 onepointzeroone.org 的地方）

到你的網域 DNS 管理後台（例如 Cloudflare、GoDaddy、Gandi、Namecheap），新增一筆紀錄：

| 類型 | 名稱 / 主機 | 值 / 目標 | TTL |
| --- | --- | --- | --- |
| `CNAME` | `obsidianer` | `101academyforyou.github.io` | 自動 |

> **使用 Cloudflare 的話**：先把這筆紀錄設成「**僅限 DNS**」（灰色雲朵），等 GitHub 簽好 HTTPS 憑證後再決定要不要開啟 Proxy。如果開啟 Proxy，SSL/TLS 模式請設為「**完整（Full）**」，否則可能出現無限重新導向。

DNS 生效通常需要幾分鐘，最久可能 24 小時。可以用這個指令確認：

```bash
nslookup obsidianer.onepointzeroone.org
```

看到 `101academyforyou.github.io` 就代表設定成功。

---

## 步驟 2：開啟 GitHub Pages

到 GitHub repo **101academyforyou/Obsidianer** → **Settings → Pages**：

1. **Build and deployment → Source**：選 **GitHub Actions**
2. **Custom domain**：填 `obsidianer.onepointzeroone.org` → **Save**
3. 等 DNS 檢查通過後，勾選 **Enforce HTTPS**（憑證簽發可能要等幾分鐘到一小時）

> **建議**：到 GitHub **組織（101academyforyou）→ Settings → Pages → Verified domains** 驗證 `onepointzeroone.org`。這樣可以防止別人拿你的子網域去掛他們的 GitHub Pages（子網域接管）。

---

## 步驟 3：合併到 main 觸發部署

部署工作流程 `.github/workflows/pages.yml` 會在推送到 `main` 時自動執行：

1. 執行 `node scripts/build-www.mjs`，只把網頁檔案複製到 `www/`（不會發布 `ios/`、`android/` 等原生專案）
2. 把 `www/` 發布到 GitHub Pages

把目前的開發分支合併到 `main` 之後，到 repo 的 **Actions** 分頁就能看到部署進度，完成後打開 https://obsidianer.onepointzeroone.org/ 確認。

之後要再手動部署一次，可以在 **Actions → Deploy to GitHub Pages → Run workflow** 執行。

---

## 常見問題

| 狀況 | 原因與解法 |
| --- | --- |
| 打開是 404 | 還沒合併到 `main`，或 Pages 的 Source 沒有選 GitHub Actions |
| 「DNS check unsuccessful」 | DNS 還沒生效，或 CNAME 值打錯（結尾不需要加 repo 名稱） |
| 不能勾 Enforce HTTPS | 憑證還在簽發，等一下再試；Cloudflare 使用者先關閉 Proxy |
| 更新後看到舊版 | 網站有離線快取，重新整理兩次即可；每次大改版可把 `sw.js` 裡的 `CACHE` 版本號 +1 |

---

## 網址用在哪裡

- App Store / Google Play 的**隱私權政策網址**：`https://obsidianer.onepointzeroone.org/privacy.html`
- App Store 的**支援網址**、**行銷網址**：`https://obsidianer.onepointzeroone.org/`
- 分享到社群時會顯示 `index.html` 中設定的標題、描述與圖示（Open Graph）
