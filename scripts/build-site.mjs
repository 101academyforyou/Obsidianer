// 組合 GitHub Pages 要發布的網站到 site/：
//   /           介紹網頁（landing/）
//   /app/       學習網頁 App（與 iOS / Android App 相同的檔案）
//   /privacy.html  隱私權政策（App Store 使用此網址，路徑不可變）
//   /stats.json    App Store 下載數（由 scripts/fetch_downloads.py 產生，可不存在）
import { cpSync, mkdirSync, rmSync, existsSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const out = join(root, 'site');
const appFiles = ['index.html', 'privacy.html', 'manifest.webmanifest', 'sw.js', 'css', 'js', 'icons'];

if (existsSync(out)) rmSync(out, { recursive: true, force: true });
mkdirSync(join(out, 'app'), { recursive: true });

cpSync(join(root, 'landing'), out, { recursive: true });
for (const f of appFiles) cpSync(join(root, f), join(out, 'app', f), { recursive: true });
cpSync(join(root, 'privacy.html'), join(out, 'privacy.html'));
cpSync(join(root, 'CNAME'), join(out, 'CNAME'));
writeFileSync(join(out, '.nojekyll'), '');

const stats = join(root, 'stats.json');
if (existsSync(stats)) cpSync(stats, join(out, 'stats.json'));

console.log('✔ 已輸出到 site/：介紹網頁 /、學習 App /app/、隱私權政策 /privacy.html' + (existsSync(stats) ? '、stats.json' : ''));
