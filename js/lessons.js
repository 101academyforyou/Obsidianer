/* 課程內容：6 章 18 課，從零開始循序漸進 */
(function (global) {
  'use strict';

  const CHAPTERS = [
    { id: 1, title: '認識 Obsidian', emoji: '💎', desc: '它是什麼、怎麼安裝、介面長怎樣' },
    { id: 2, title: 'Markdown 基本功', emoji: '✍️', desc: '用純文字寫出漂亮的筆記' },
    { id: 3, title: '連結的力量', emoji: '🔗', desc: 'Obsidian 最核心的魔法：雙向連結' },
    { id: 4, title: '整理你的知識', emoji: '🗂️', desc: '資料夾、標籤、屬性與搜尋' },
    { id: 5, title: '視覺化與效率', emoji: '🕸️', desc: '關係圖譜、白板、每日筆記與範本' },
    { id: 6, title: '進階與工作流', emoji: '🚀', desc: '外掛、同步，打造你的第二大腦' }
  ];

  const has = (re) => (s) => re.test(s);

  const LESSONS = [
    /* ===================== 第 1 章 ===================== */
    {
      id: '1-1', ch: 1, emoji: '💎', minutes: 4,
      title: 'Obsidian 是什麼？',
      desc: '本地優先的 Markdown 筆記軟體，打造你的第二大腦',
      body: `
<p><b>Obsidian</b> 是一款免費的筆記軟體。它和一般筆記 App 最大的不同有三點：</p>
<div class="grid grid-3" style="margin:1em 0">
  <div class="card"><div style="font-size:26px">📁</div><b>本地優先</b><div class="muted" style="font-size:14px">筆記就是你電腦裡的 <code>.md</code> 檔案，不怕公司倒閉、不怕被鎖住。</div></div>
  <div class="card"><div style="font-size:26px">✍️</div><b>純文字 Markdown</b><div class="muted" style="font-size:14px">用簡單符號排版，任何文字編輯器都打得開，十年後也讀得到。</div></div>
  <div class="card"><div style="font-size:26px">🔗</div><b>雙向連結</b><div class="muted" style="font-size:14px">筆記之間可以互相連結，慢慢長成一張屬於你的知識網路。</div></div>
</div>
<h3>什麼是「第二大腦」？</h3>
<p>我們的大腦擅長<b>思考</b>，不擅長<b>記憶</b>。把讀到的、想到的東西記進 Obsidian，並用連結把它們串起來，就像替自己建立一個可以搜尋、可以回顧、會越長越大的外接大腦。</p>
<div class="tip"><span class="tip-title">💡 給新手的心法</span>不需要一開始就設計完美的系統。先「開始寫」，結構會在你寫的過程中自然長出來。這套課程也會帶你一步步來。</div>
<h3>它適合誰？</h3>
<ul>
  <li>學生：整理課堂筆記、準備考試、寫報告</li>
  <li>上班族：會議紀錄、專案管理、工作日誌</li>
  <li>創作者與研究者：蒐集靈感、寫作、做文獻筆記</li>
  <li>任何想要「把想法留下來」的人</li>
</ul>`,
      quiz: [
        { q: 'Obsidian 的筆記檔案預設存放在哪裡？', opts: ['官方的雲端伺服器', '你自己電腦裡的資料夾', '瀏覽器的快取裡', '只存在手機 App 裡'], a: 1, ex: 'Obsidian 是「本地優先」：筆記是存在你裝置上的 .md 純文字檔，完全由你掌控。' },
        { q: 'Obsidian 筆記使用哪一種格式？', opts: ['Word (.docx)', 'PDF', 'Markdown (.md)', '專有加密格式'], a: 2, ex: 'Markdown 是一種純文字格式，簡單、通用、可長久保存。' }
      ]
    },
    {
      id: '1-2', ch: 1, emoji: '📦', minutes: 5,
      title: '安裝與建立第一個 Vault',
      desc: '下載 Obsidian，建立你的筆記庫（Vault）',
      body: `
<h3>Step 1：下載安裝</h3>
<p>前往官方網站 <a href="https://obsidian.md" target="_blank" rel="noopener">obsidian.md</a> 下載。Obsidian 支援 <b>Windows、macOS、Linux、iOS、Android</b>，手機版可在 App Store / Google Play 搜尋「Obsidian」。</p>
<h3>Step 2：認識 Vault（筆記庫）</h3>
<p><b>Vault</b> 就是一個資料夾，裡面放著你所有的筆記。Obsidian 打開的就是這個資料夾。</p>
<pre><code>📁 我的知識庫/          ← 這就是一個 Vault
 ├─ 📁 .obsidian/        ← Obsidian 的設定（自動產生）
 ├─ 📄 歡迎.md
 ├─ 📁 讀書筆記/
 │   └─ 📄 原子習慣.md
 └─ 📁 每日筆記/
     └─ 📄 2026-11-24.md</code></pre>
<h3>Step 3：建立 Vault</h3>
<ol class="step-list">
  <li>打開 Obsidian，點選 <b>「建立新的儲存庫」（Create new vault）</b></li>
  <li>替它取個名字，例如「我的知識庫」</li>
  <li>選擇要存放的位置（建議放在好找的地方，例如「文件」）</li>
  <li>按下 <b>建立</b>，完成！🎉</li>
</ol>
<div class="tip"><span class="tip-title">💡 建議</span>新手<b>只建一個 Vault</b>就好。所有東西放在一起，連結才能發揮威力。之後要分類，用資料夾或標籤就可以。</div>
<div class="tip warn"><span class="tip-title">⚠️ 介面語言</span>Obsidian 支援繁體中文介面：進入 <b>設定 → 一般（General）→ 語言（Language）</b>，選擇「繁體中文」後重新啟動即可。</div>`,
      quiz: [
        { q: '在 Obsidian 中，「Vault」指的是什麼？', opts: ['一篇特別重要的筆記', '存放所有筆記的資料夾', '付費加密功能', '一種外掛'], a: 1, ex: 'Vault（儲存庫）就是一個普通資料夾，Obsidian 會把裡面的 .md 檔當成筆記。' },
        { q: 'Vault 裡的 .obsidian 資料夾是用來做什麼的？', opts: ['存放刪除的筆記', '存放 Obsidian 的設定、外掛與佈景主題', '存放圖片', '存放備份'], a: 1, ex: '.obsidian 是自動產生的設定資料夾，記錄你的偏好、外掛與主題。' },
        { q: '對新手來說，比較建議的做法是？', opts: ['每個主題建立一個 Vault', '只用一個 Vault，再用資料夾或標籤分類', '不要建立 Vault', '每天建立一個新 Vault'], a: 1, ex: '筆記之間只能在同一個 Vault 內互相連結，所以一個 Vault 最能發揮連結的威力。' }
      ]
    },
    {
      id: '1-3', ch: 1, emoji: '🧭', minutes: 5,
      title: '認識介面與命令面板',
      desc: '側邊欄、編輯區、閱讀模式與萬用的 Ctrl+P',
      body: `
<p>把滑鼠移到下面的示意圖上，看看每個區域的名稱：</p>
<div class="ui-mock">
  <div class="m-ribbon" title="功能區 Ribbon">功能區</div>
  <div class="m-left" title="左側邊欄：檔案總管、搜尋、書籤">左側邊欄<br>📁 檔案總管</div>
  <div class="m-editor" title="編輯區：寫筆記的地方">編輯區<br>✍️ 在這裡寫筆記</div>
  <div class="m-right" title="右側邊欄：反向連結、大綱、標籤">右側邊欄<br>🔗 反向連結</div>
  <div class="m-status" title="狀態列：字數、同步狀態">狀態列 · 128 字</div>
</div>
<table>
  <tr><th>區域</th><th>用途</th></tr>
  <tr><td><b>功能區 Ribbon</b></td><td>最左邊的一排小圖示：開啟關係圖譜、白板、每日筆記等</td></tr>
  <tr><td><b>左側邊欄</b></td><td>檔案總管、搜尋、書籤</td></tr>
  <tr><td><b>編輯區</b></td><td>寫筆記的地方，可以開多個分頁、左右分割</td></tr>
  <tr><td><b>右側邊欄</b></td><td>反向連結、大綱、標籤面板</td></tr>
  <tr><td><b>狀態列</b></td><td>字數統計、同步狀態等資訊</td></tr>
</table>
<h3>兩種模式：編輯 vs 閱讀</h3>
<p>Obsidian 的編輯模式預設是<b>即時預覽（Live Preview）</b>：你打 Markdown 符號，它會立刻變成排版好的樣子。按 <kbd>Ctrl</kbd> + <kbd>E</kbd>（Mac：<kbd>⌘</kbd> + <kbd>E</kbd>）可切換到<b>閱讀模式</b>。</p>
<h3>⭐ 最重要的快捷鍵：命令面板</h3>
<p>按 <kbd>Ctrl</kbd> + <kbd>P</kbd>（Mac：<kbd>⌘</kbd> + <kbd>P</kbd>）打開<b>命令面板</b>。忘記某個功能在哪？打幾個字搜尋就找得到。</p>
<p>另一個好用的是 <kbd>Ctrl</kbd> + <kbd>O</kbd> <b>快速切換器</b>：輸入筆記名稱，直接跳過去。</p>
<div class="tip good"><span class="tip-title">🎮 現在就試試</span>在這個學習 App 裡，按 <kbd>Ctrl</kbd>/<kbd>⌘</kbd> + <kbd>K</kbd> 也能打開「命令面板」，快速跳到任何一課！</div>`,
      quiz: [
        { q: '想找某個功能卻忘了它在哪裡，最快的方法是？', opts: ['重新安裝 Obsidian', '按 Ctrl/⌘ + P 打開命令面板搜尋', '去論壇發問', '一個一個選單找'], a: 1, ex: '命令面板可以搜尋 Obsidian 幾乎所有的功能，是最值得記住的快捷鍵。' },
        { q: 'Ctrl/⌘ + E 的作用是？', opts: ['匯出 PDF', '切換編輯模式與閱讀模式', '刪除筆記', '開啟設定'], a: 1, ex: 'Ctrl/⌘ + E 可以在編輯（即時預覽）與閱讀模式之間切換。' },
        { q: '想快速打開某一篇筆記，應該用？', opts: ['Ctrl/⌘ + O 快速切換器', 'Ctrl/⌘ + Q', 'Ctrl/⌘ + W', 'Alt + F4'], a: 0, ex: '快速切換器讓你輸入筆記名稱直接開啟，還可以順便建立新筆記。' }
      ]
    },

    /* ===================== 第 2 章 ===================== */
    {
      id: '2-1', ch: 2, emoji: '🔠', minutes: 4,
      title: '標題與段落',
      desc: '用 # 建立標題層級，讓筆記結構清楚',
      body: `
<p>在 Markdown 裡，用 <code>#</code> 加上<b>一個空格</b>就能建立標題。<code>#</code> 越多，標題越小：</p>
<div class="compare">
  <div><div class="lbl">你輸入</div><pre># 大標題
## 第二層
### 第三層
#### 第四層</pre></div>
  <div><div class="lbl">顯示效果</div><div class="md"><h1 style="margin:0">大標題</h1><h2 style="margin:0">第二層</h2><h3 style="margin:0">第三層</h3><h4 style="margin:0">第四層</h4></div></div>
</div>
<div class="tip warn"><span class="tip-title">⚠️ 常見錯誤</span><code>#標題</code> 不會變成標題（少了空格），在 Obsidian 裡它反而會變成「標籤」！一定要寫成 <code># 標題</code>。</div>
<h3>段落與換行</h3>
<p>直接打字就是段落。<b>空一行</b>會開始新的段落。</p>
<h3>好的標題結構</h3>
<ul>
  <li>一篇筆記通常只用一個 <code>#</code> 大標（或直接用檔名當標題）</li>
  <li>用 <code>##</code>、<code>###</code> 分出段落，右側的「大綱」面板會自動產生目錄</li>
  <li>不要跳級（從 <code>#</code> 直接跳到 <code>####</code>）</li>
</ul>`,
      practice: {
        intro: '在左邊寫一篇「我的學習計畫」筆記，完成下面的目標：',
        starter: '我想學會 Obsidian\n',
        goals: [
          { label: '有一個一級標題（# 標題）', test: has(/^# \S/m) },
          { label: '有至少一個二級標題（## 標題）', test: has(/^## \S/m) },
          { label: '有一個三級標題（### 標題）', test: has(/^### \S/m) }
        ]
      },
      quiz: [
        { q: '下列哪一個會在 Obsidian 中顯示為「二級標題」？', opts: ['##標題', '## 標題', '# # 標題', '**標題**'], a: 1, ex: '井號後面一定要有空格。「##標題」沒有空格，會被當成標籤。' },
        { q: '在 Obsidian 中輸入「#讀書」（沒有空格）會變成？', opts: ['一級標題', '標籤', '連結', '錯誤訊息'], a: 1, ex: '# 後面直接接文字會變成標籤（tag），之後的課程會教你怎麼用。' }
      ]
    },
    {
      id: '2-2', ch: 2, emoji: '🎨', minutes: 5,
      title: '文字格式',
      desc: '粗體、斜體、刪除線、螢光筆與程式碼',
      body: `
<table>
  <tr><th>效果</th><th>語法</th><th>快捷鍵</th></tr>
  <tr><td><b>粗體</b></td><td><code>**粗體**</code></td><td><kbd>Ctrl/⌘</kbd>+<kbd>B</kbd></td></tr>
  <tr><td><em>斜體</em></td><td><code>*斜體*</code> 或 <code>_斜體_</code></td><td><kbd>Ctrl/⌘</kbd>+<kbd>I</kbd></td></tr>
  <tr><td><del>刪除線</del></td><td><code>~~刪除線~~</code></td><td>—</td></tr>
  <tr><td><span class="md"><mark>螢光標記</mark></span></td><td><code>==螢光標記==</code></td><td>—</td></tr>
  <tr><td><code>行內程式碼</code></td><td><code>\`程式碼\`</code></td><td>—</td></tr>
  <tr><td><a>網址連結</a></td><td><code>[文字](https://網址)</code></td><td><kbd>Ctrl/⌘</kbd>+<kbd>K</kbd></td></tr>
</table>
<div class="tip"><span class="tip-title">💡 小技巧</span>先選取文字再按 <kbd>Ctrl/⌘</kbd>+<kbd>B</kbd>，就會自動在前後加上 <code>**</code>。</div>
<p><code>==螢光標記==</code> 是 Obsidian 特有的語法，很適合用來標出讀書時的重點。</p>`,
      practice: {
        intro: '試著寫一句讀書心得，用上這些格式：',
        starter: '今天讀到一句話：習慣是複利的力量。\n',
        goals: [
          { label: '使用 **粗體**', test: has(/\*\*[^*\n]+\*\*/) },
          { label: '使用 *斜體*', test: (s) => /(^|[^*])\*[^*\s][^*\n]*\*(?!\*)/.test(s) || /(^|\W)_[^_\s][^_\n]*_/.test(s) },
          { label: '使用 ==螢光標記==', test: has(/==[^=\n]+==/) },
          { label: '使用 ~~刪除線~~', test: has(/~~[^~\n]+~~/) }
        ]
      },
      quiz: [
        { q: '哪一個是 Obsidian 的「螢光標記」語法？', opts: ['**文字**', '==文字==', '~~文字~~', '__文字__'], a: 1, ex: '==文字== 會產生黃色螢光底色，是 Obsidian 支援的擴充語法。' },
        { q: '~~文字~~ 會產生什麼效果？', opts: ['斜體', '刪除線', '底線', '程式碼'], a: 1, ex: '兩個波浪號包起來就是刪除線。' }
      ]
    },
    {
      id: '2-3', ch: 2, emoji: '✅', minutes: 5,
      title: '清單與待辦事項',
      desc: '項目清單、編號清單、巢狀清單與 Todo',
      body: `
<div class="compare">
  <div><div class="lbl">你輸入</div><pre>- 蘋果
- 香蕉
  - 芭樂（按 Tab 縮排）

1. 第一步
2. 第二步

- [ ] 還沒做的事
- [x] 已完成的事</pre></div>
  <div><div class="lbl">顯示效果</div><div class="md" id="demo-list"></div></div>
</div>
<ul>
  <li><b>項目清單</b>：<code>-</code>、<code>*</code> 或 <code>+</code> 加空格</li>
  <li><b>編號清單</b>：<code>1.</code> 加空格，Obsidian 會自動接續編號</li>
  <li><b>巢狀清單</b>：按 <kbd>Tab</kbd> 縮排、<kbd>Shift</kbd>+<kbd>Tab</kbd> 取消縮排</li>
  <li><b>待辦清單</b>：<code>- [ ]</code>，完成後變成 <code>- [x]</code>，在 Obsidian 中直接點方框就能打勾</li>
</ul>
<div class="tip"><span class="tip-title">💡 快捷鍵</span><kbd>Ctrl/⌘</kbd>+<kbd>L</kbd> 可以把目前這行切換成待辦事項。</div>`,
      demo: { target: 'demo-list', md: '- 蘋果\n- 香蕉\n  - 芭樂（按 Tab 縮排）\n\n1. 第一步\n2. 第二步\n\n- [ ] 還沒做的事\n- [x] 已完成的事' },
      practice: {
        intro: '列出你這週想完成的事：',
        starter: '## 本週目標\n',
        goals: [
          { label: '有一個項目清單（- 開頭）', test: has(/^\s*[-*+] (?!\[[ xX]\])\S/m) },
          { label: '有一個巢狀（縮排）的項目', test: has(/^(\t| {2,})[-*+] /m) },
          { label: '有一個未完成的待辦 - [ ]', test: has(/^\s*[-*+] \[ \] \S/m) },
          { label: '有一個已完成的待辦 - [x]', test: has(/^\s*[-*+] \[[xX]\] \S/m) }
        ]
      },
      quiz: [
        { q: '要建立一個「未完成」的待辦事項，該怎麼寫？', opts: ['- ( )', '- [ ]', '[todo]', '- <>'], a: 1, ex: '「- [ ] 」是標準的待辦語法，中括號中間要有一個空格。' },
        { q: '要讓清單項目往內縮一層，最方便的做法是？', opts: ['按 Tab', '按 Enter 兩次', '加上 >', '加上 #'], a: 0, ex: '在清單項目上按 Tab 縮排，Shift + Tab 取消縮排。' }
      ]
    },
    {
      id: '2-4', ch: 2, emoji: '📦', minutes: 6,
      title: '引用、程式碼、表格與 Callout',
      desc: '讓筆記更豐富的進階排版元素',
      body: `
<h3>引用 Blockquote</h3>
<p>在行首加 <code>&gt;</code>，適合摘錄書中的句子。</p>
<h3>程式碼區塊</h3>
<p>用三個反引號 <code>\`\`\`</code> 包住多行程式碼，後面可以寫語言名稱：</p>
<pre><code>\`\`\`python
print("Hello Obsidian")
\`\`\`</code></pre>
<h3>表格</h3>
<pre><code>| 書名 | 作者 | 評分 |
| --- | --- | --- |
| 原子習慣 | James Clear | ⭐⭐⭐⭐⭐ |</code></pre>
<p>手打表格有點麻煩？可以用命令面板搜尋「插入表格」（Insert table）。</p>
<h3>⭐ Callout 提示框（Obsidian 特色）</h3>
<div class="compare">
  <div><div class="lbl">你輸入</div><pre>&gt; [!tip] 小提醒
&gt; 每天寫一點就好！

&gt; [!warning] 注意
&gt; 這裡要小心。</pre></div>
  <div><div class="lbl">顯示效果</div><div class="md" id="demo-callout"></div></div>
</div>
<p>常見類型：<code>note</code>、<code>tip</code>、<code>info</code>、<code>warning</code>、<code>danger</code>、<code>question</code>、<code>example</code>、<code>quote</code>。</p>
<h3>分隔線</h3>
<p>單獨一行輸入 <code>---</code> 就會變成一條水平分隔線。</p>`,
      demo: { target: 'demo-callout', md: '> [!tip] 小提醒\n> 每天寫一點就好！\n\n> [!warning] 注意\n> 這裡要小心。' },
      practice: {
        intro: '寫一篇讀書摘要，加入這些元素：',
        starter: '# 原子習慣\n\n',
        goals: [
          { label: '一段引用（> 開頭）', test: has(/^> (?!\[!)\S/m) },
          { label: '一個 Callout（> [!類型]）', test: has(/^> ?\[!\w+\]/m) },
          { label: '一個表格（含 | --- | 分隔列）', test: has(/^\|?.*\|.*\n\|?\s*:?-{2,}/m) },
          { label: '一條分隔線 ---', test: (s) => s.split('\n').some((l, i) => i > 0 && /^\s*---\s*$/.test(l)) }
        ]
      },
      quiz: [
        { q: '下列哪個是 Callout 的正確寫法？', opts: ['[tip] 小提醒', '> [!tip] 小提醒', '!!tip 小提醒', '<tip>小提醒</tip>'], a: 1, ex: 'Callout 是在引用區塊的第一行加上 [!類型]。' },
        { q: '程式碼區塊要用什麼符號包起來？', opts: ['三個反引號 ```', '三個井號 ###', '三個等號 ===', '兩個斜線 //'], a: 0, ex: '用三個反引號開始和結束，中間就是程式碼區塊。' }
      ]
    },

    /* ===================== 第 3 章 ===================== */
    {
      id: '3-1', ch: 3, emoji: '🔗', minutes: 6,
      title: '雙向連結 [[ ]]',
      desc: '用兩個中括號連結筆記，這是 Obsidian 的靈魂',
      body: `
<p>這是 Obsidian 最重要的功能。輸入兩個中括號 <code>[[</code>，Obsidian 會跳出筆記清單讓你選擇：</p>
<pre><code>今天讀了 [[原子習慣]]，覺得跟 [[刻意練習]] 的概念很像。</code></pre>
<div class="md card" style="margin:1em 0">今天讀了 <a class="internal-link">原子習慣</a>，覺得跟 <a class="internal-link">刻意練習</a> 的概念很像。</div>
<h3>連結到「還不存在」的筆記</h3>
<p>如果 <code>[[刻意練習]]</code> 這篇筆記還沒建立，連結會顯示成淡一點的顏色。<b>點下去 Obsidian 就會幫你建立它</b>。這讓你可以「先連結、後補充」，寫作不中斷。</p>
<h3>為什麼叫「雙向」？</h3>
<p>當 A 筆記連到 B 筆記時，打開 B 筆記，你也能在<b>反向連結</b>面板看到「A 提到了我」。一條連結，兩邊都知道——這就是雙向。</p>
<h3>用別名改變顯示文字</h3>
<pre><code>[[原子習慣|這本書]]  → 顯示為「這本書」，但連到「原子習慣」</code></pre>
<div class="tip"><span class="tip-title">💡 什麼時候該加連結？</span>問自己：「以後讀到這裡時，我會想跳去看那篇嗎？」如果會，就連起來。人名、書名、概念、專案都很適合當連結。</div>`,
      practice: {
        intro: '在預覽區點擊連結看看會發生什麼。完成目標：',
        starter: '# 讀書會心得\n\n今天的主題是習慣養成。\n',
        goals: [
          { label: '建立一個連結 [[筆記名稱]]', test: has(/(?<!!)\[\[[^\]|]+\]\]/) },
          { label: '建立一個帶別名的連結 [[筆記|別名]]', test: has(/\[\[[^\]|]+\|[^\]]+\]\]/) },
          { label: '總共至少有 3 個連結', test: (s) => (s.match(/(?<!!)\[\[[^\]]+\]\]/g) || []).length >= 3 }
        ]
      },
      quiz: [
        { q: '在 Obsidian 中要連結到「專案計畫」這篇筆記，應該寫？', opts: ['(專案計畫)', '[[專案計畫]]', '{專案計畫}', '<專案計畫>'], a: 1, ex: '兩個中括號包住筆記名稱就是內部連結。' },
        { q: '連結到一篇「還不存在」的筆記會怎樣？', opts: ['出現錯誤無法儲存', '連結會被自動刪除', '連結顏色較淡，點擊即可建立該筆記', 'Obsidian 會當機'], a: 2, ex: '這是 Obsidian 很棒的設計：先連結、之後再寫內容。' },
        { q: '[[原子習慣|這本書]] 在畫面上會顯示什麼文字？', opts: ['原子習慣|這本書', '原子習慣', '這本書', '[[這本書]]'], a: 2, ex: '| 後面的文字是別名（顯示文字），連結目標仍然是「原子習慣」。' }
      ]
    },
    {
      id: '3-2', ch: 3, emoji: '↩️', minutes: 4,
      title: '反向連結與未連結提及',
      desc: '看見「誰提到了這篇筆記」，發現意想不到的關聯',
      body: `
<p>打開任何一篇筆記，在<b>右側邊欄</b>可以找到「反向連結」（Backlinks）面板。它分成兩區：</p>
<div class="grid grid-2" style="margin:1em 0">
  <div class="card"><b>🔗 已連結提及（Linked mentions）</b><p class="muted" style="font-size:14px;margin:.4em 0 0">其他筆記中已經用 <code>[[ ]]</code> 連到這篇的地方。</p></div>
  <div class="card"><b>👀 未連結提及（Unlinked mentions）</b><p class="muted" style="font-size:14px;margin:.4em 0 0">其他筆記有出現這篇的名稱，但還沒加上連結。點「連結」按鈕就能一鍵補上！</p></div>
</div>
<h3>情境範例</h3>
<p>你有一篇叫 <b>「番茄鐘工作法」</b> 的筆記。三個月後打開它，反向連結告訴你：</p>
<ul>
  <li>📄 <b>2026-08-03 日記</b>：「今天試了 [[番茄鐘工作法]]，專注力變好」</li>
  <li>📄 <b>期末考準備</b>：「用 [[番茄鐘工作法]] 安排複習時間」</li>
  <li>📄 <b>深度工作（讀書筆記）</b>：未連結提及「…類似番茄鐘工作法…」</li>
</ul>
<p>你不需要刻意整理，<b>筆記之間的關係就自己浮現了</b>。這就是 Obsidian 被稱為「第二大腦」的原因。</p>
<div class="tip good"><span class="tip-title">✅ 好習慣</span>每隔一陣子看看重要筆記的「未連結提及」，把該連的連起來，你的知識網路會越來越緊密。</div>`,
      quiz: [
        { q: '反向連結面板會顯示什麼？', opts: ['這篇筆記連出去的所有網址', '其他有連結到這篇筆記的筆記', '最近刪除的筆記', '筆記的修改歷史'], a: 1, ex: '反向連結 = 誰連到了我。' },
        { q: '「未連結提及」指的是？', opts: ['連結壞掉的筆記', '提到這篇筆記名稱但還沒加上 [[ ]] 的地方', '沒有任何內容的筆記', '被隱藏的筆記'], a: 1, ex: '它會找出文字中有提到、但還沒連結的地方，方便你一鍵補上連結。' }
      ]
    },
    {
      id: '3-3', ch: 3, emoji: '🧩', minutes: 6,
      title: '嵌入、標題連結與區塊連結',
      desc: '![[ ]] 嵌入內容、連到特定段落',
      body: `
<h3>連到某個標題</h3>
<pre><code>[[原子習慣#四大法則]]</code></pre>
<p>在 <code>[[筆記名稱</code> 後面輸入 <code>#</code>，Obsidian 會列出該筆記所有的標題讓你選。</p>
<h3>連到某個段落（區塊）</h3>
<pre><code>[[原子習慣#^abc123]]</code></pre>
<p>輸入 <code>[[筆記名稱#^</code> 可以搜尋段落，Obsidian 會自動在那個段落結尾加上像 <code>^abc123</code> 的區塊 ID。</p>
<h3>⭐ 嵌入：在一篇筆記裡「顯示」另一篇</h3>
<p>在連結前面加上驚嘆號 <code>!</code>，就會把內容直接顯示出來：</p>
<div class="compare">
  <div><div class="lbl">你輸入</div><pre>今天複習重點：

![[四大法則]]</pre></div>
  <div><div class="lbl">顯示效果</div><div class="md" id="demo-embed"></div></div>
</div>
<p>嵌入的內容會<b>跟著原筆記同步更新</b>——改一次，所有嵌入的地方都會變。圖片、PDF 也能這樣嵌入：<code>![[照片.png]]</code>。</p>
<table>
  <tr><th>語法</th><th>功能</th></tr>
  <tr><td><code>[[筆記]]</code></td><td>連結到筆記</td></tr>
  <tr><td><code>[[筆記|別名]]</code></td><td>用別的文字顯示連結</td></tr>
  <tr><td><code>[[筆記#標題]]</code></td><td>連結到某個標題</td></tr>
  <tr><td><code>[[筆記#^區塊id]]</code></td><td>連結到某個段落</td></tr>
  <tr><td><code>![[筆記]]</code></td><td>嵌入整篇筆記</td></tr>
  <tr><td><code>![[圖片.png]]</code></td><td>嵌入圖片</td></tr>
</table>`,
      demo: { target: 'demo-embed', md: '今天複習重點：\n\n![[四大法則]]' },
      practice: {
        intro: '練習用「範例筆記庫」裡的筆記。可用的筆記有：四大法則、原子習慣、番茄鐘工作法、Obsidian 入門。',
        starter: '# 今日複習\n\n',
        goals: [
          { label: '嵌入一篇筆記 ![[筆記]]', test: has(/!\[\[[^\]]+\]\]/) },
          { label: '連結到某個標題 [[筆記#標題]]', test: has(/(?<!!)\[\[[^\]#]+#[^\^\]][^\]]*\]\]/) },
          { label: '連結到某個區塊 [[筆記#^id]]', test: has(/\[\[[^\]#]+#\^[^\]]+\]\]/) }
        ]
      },
      quiz: [
        { q: '想把「會議紀錄」這篇筆記的內容直接顯示在目前的筆記中，要寫？', opts: ['[[會議紀錄]]', '![[會議紀錄]]', '#[[會議紀錄]]', '>[[會議紀錄]]'], a: 1, ex: '前面加 ! 就是嵌入，會直接顯示內容。' },
        { q: '[[讀書筆記#心得]] 會連到哪裡？', opts: ['名為「心得」的筆記', '「讀書筆記」裡的「心得」標題', '標籤 #心得', '所有含「心得」的筆記'], a: 1, ex: '# 後面接的是筆記內的標題。' },
        { q: '修改被嵌入的原始筆記後，嵌入的地方會？', opts: ['不會變', '自動同步更新', '出現錯誤', '需要手動重新嵌入'], a: 1, ex: '嵌入只是「顯示」原筆記，所以內容永遠同步。' }
      ]
    },

    /* ===================== 第 4 章 ===================== */
    {
      id: '4-1', ch: 4, emoji: '🗂️', minutes: 5,
      title: '資料夾、標籤與連結',
      desc: '三種整理方式各有什麼用？什麼時候用哪一個？',
      body: `
<table>
  <tr><th></th><th>📁 資料夾</th><th>🏷️ 標籤</th><th>🔗 連結</th></tr>
  <tr><td><b>概念</b></td><td>筆記「放在哪裡」</td><td>筆記「是什麼類型 / 狀態」</td><td>筆記「和誰有關」</td></tr>
  <tr><td><b>數量</b></td><td>一篇只能在一個資料夾</td><td>一篇可以有很多標籤</td><td>一篇可以有無數連結</td></tr>
  <tr><td><b>適合</b></td><td>大分類：工作、生活、讀書</td><td>狀態、類型：#待讀、#靈感</td><td>具體的概念、人、書、專案</td></tr>
</table>
<h3>使用標籤</h3>
<pre><code>這是一個好點子 #靈感 #專案/網站改版</code></pre>
<ul>
  <li>在文字中直接寫 <code>#標籤</code>（<code>#</code> 後面<b>不要空格</b>）</li>
  <li>可以用 <code>/</code> 做出階層標籤：<code>#讀書/小說</code>、<code>#讀書/商業</code></li>
  <li>標籤不能只有數字（<code>#2026</code> 不行，<code>#y2026</code> 可以），也不能有空格</li>
  <li>點擊標籤，會搜尋所有帶有該標籤的筆記；右側「標籤」面板可以看到全部標籤</li>
</ul>
<div class="tip"><span class="tip-title">💡 新手建議的資料夾結構</span>
<pre style="margin:.5em 0 0"><code>📁 00 收件匣      ← 還沒整理的筆記先丟這
📁 10 每日筆記
📁 20 專案
📁 30 知識筆記
📁 90 附件        ← 圖片、PDF
📁 99 範本</code></pre>
資料夾<b>少而大</b>就好，細的分類交給標籤和連結。</div>`,
      practice: {
        intro: '幫這則靈感筆記加上標籤：',
        starter: '# 網站改版點子\n\n首頁可以改成深色主題。\n',
        goals: [
          { label: '加上至少一個標籤 #標籤', test: has(/(^|\s)#[^\s#\d][^\s#]*/m) },
          { label: '加上一個階層標籤 #父/子', test: has(/(^|\s)#[^\s#/]+\/[^\s#]+/m) },
          { label: '總共至少 3 個標籤', test: (s) => (s.match(/(^|\s)#[^\s#][^\s#]*/gm) || []).filter((t) => !/^\s*#\d+$/.test(t)).length >= 3 }
        ]
      },
      quiz: [
        { q: '一篇筆記可以同時放在幾個資料夾裡？', opts: ['一個', '兩個', '無限多個', '要看設定'], a: 0, ex: '筆記就是檔案，一個檔案只能在一個資料夾。想要多重分類，請用標籤或連結。' },
        { q: '下列哪個是合法的 Obsidian 標籤？', opts: ['# 讀書', '#2026', '#讀書/小說', '#讀 書'], a: 2, ex: '「# 讀書」是標題；純數字和含空格的都不是有效標籤。' }
      ]
    },
    {
      id: '4-2', ch: 4, emoji: '🏷️', minutes: 6,
      title: '屬性 Properties',
      desc: '在筆記最上方加入結構化資料：日期、作者、狀態…',
      body: `
<p><b>屬性（Properties）</b>是放在筆記最開頭、用兩條 <code>---</code> 包起來的資料，格式叫做 YAML：</p>
<div class="compare">
  <div><div class="lbl">你輸入</div><pre>---
作者: James Clear
評分: 5
狀態: 已讀完
tags:
  - 讀書
  - 習慣
---
# 原子習慣</pre></div>
  <div><div class="lbl">顯示效果</div><div class="md" id="demo-props"></div></div>
</div>
<h3>怎麼新增？</h3>
<ul>
  <li>在筆記<b>第一行</b>輸入 <code>---</code> 再按 Enter</li>
  <li>或用命令面板搜尋「新增檔案屬性」（Add file property）</li>
  <li>快捷鍵：<kbd>Ctrl/⌘</kbd>+<kbd>;</kbd></li>
</ul>
<h3>屬性的類型</h3>
<p>文字、清單、數字、核取方塊、日期、日期與時間。Obsidian 會記住每個屬性的類型，下次自動套用。</p>
<h3>內建的特殊屬性</h3>
<table>
  <tr><th>屬性</th><th>用途</th></tr>
  <tr><td><code>tags</code></td><td>標籤（不用加 #）</td></tr>
  <tr><td><code>aliases</code></td><td>筆記的別名，用別名也能 <code>[[ ]]</code> 連到這篇</td></tr>
  <tr><td><code>cssclasses</code></td><td>替這篇筆記套用特別的樣式</td></tr>
</table>
<div class="tip"><span class="tip-title">💡 為什麼要用屬性？</span>屬性讓筆記變成「資料」。之後搭配搜尋、Bases 或 Dataview 外掛，就能做出「所有評分 5 分的書」這種清單。</div>`,
      demo: { target: 'demo-props', md: '---\n作者: James Clear\n評分: 5\n狀態: 已讀完\ntags:\n  - 讀書\n  - 習慣\n---\n# 原子習慣' },
      practice: {
        intro: '替一本你喜歡的書（或電影）建立帶屬性的筆記：',
        starter: '',
        goals: [
          { label: '第一行是 ---，並且有結尾的 ---', test: (s) => { const l = s.split('\n'); return l[0].trim() === '---' && l.slice(1).some((x) => x.trim() === '---'); } },
          { label: '至少 2 個屬性（名稱: 值）', test: (s) => { const m = s.match(/^---\n([\s\S]*?)\n---/); return !!m && (m[1].match(/^[^\s:][^:]*:/gm) || []).length >= 2; } },
          { label: '有 tags 屬性', test: has(/^---\n[\s\S]*?^tags:/m) },
          { label: '屬性下方有內容', test: (s) => { const m = s.match(/^---\n[\s\S]*?\n---\n([\s\S]*)$/); return !!m && m[1].trim().length > 0; } }
        ]
      },
      quiz: [
        { q: '屬性（Properties）要放在筆記的哪裡？', opts: ['筆記的最後面', '筆記的最開頭，用 --- 包起來', '任何地方都可以', '只能在設定裡編輯'], a: 1, ex: '屬性必須是檔案的最開頭，前後各一條 ---。' },
        { q: '哪個內建屬性可以讓你用其他名字連結到同一篇筆記？', opts: ['tags', 'aliases', 'cssclasses', 'title'], a: 1, ex: 'aliases（別名）讓你用不同的名字連到同一篇筆記，例如「AI」和「人工智慧」。' }
      ]
    },
    {
      id: '4-3', ch: 4, emoji: '🔍', minutes: 5,
      title: '搜尋的進階技巧',
      desc: '筆記多了也找得到：搜尋運算子',
      body: `
<p>按 <kbd>Ctrl/⌘</kbd>+<kbd>Shift</kbd>+<kbd>F</kbd> 開啟搜尋。除了直接打關鍵字，還能用這些<b>運算子</b>精準搜尋：</p>
<table>
  <tr><th>搜尋語法</th><th>意思</th></tr>
  <tr><td><code>習慣 閱讀</code></td><td>同時包含「習慣」和「閱讀」</td></tr>
  <tr><td><code>習慣 OR 閱讀</code></td><td>包含其中一個即可</td></tr>
  <tr><td><code>"原子習慣"</code></td><td>完全符合這個詞組</td></tr>
  <tr><td><code>習慣 -運動</code></td><td>包含「習慣」但<b>排除</b>「運動」</td></tr>
  <tr><td><code>tag:#讀書</code></td><td>有這個標籤的筆記</td></tr>
  <tr><td><code>file:會議</code></td><td>檔名包含「會議」</td></tr>
  <tr><td><code>path:專案</code></td><td>在「專案」資料夾裡</td></tr>
  <tr><td><code>line:(咖啡 早餐)</code></td><td>同一行同時出現這兩個詞</td></tr>
  <tr><td><code>task-todo:報告</code></td><td>未完成且含「報告」的待辦</td></tr>
  <tr><td><code>[狀態:已讀完]</code></td><td>屬性「狀態」等於「已讀完」</td></tr>
</table>
<h3>組合範例</h3>
<pre><code>path:讀書筆記 tag:#商業 -file:草稿</code></pre>
<p>→ 「讀書筆記」資料夾中、有 #商業 標籤、但檔名不含「草稿」的筆記。</p>
<div class="tip"><span class="tip-title">💡 把搜尋結果嵌入筆記</span>在筆記中寫一個語言為 <code>query</code> 的程式碼區塊，裡面放搜尋語法，結果會即時顯示在筆記裡！</div>
<pre><code>\`\`\`query
task-todo: tag:#工作
\`\`\`</code></pre>`,
      quiz: [
        { q: '想搜尋「在 專案 資料夾中」的筆記，要用？', opts: ['file:專案', 'path:專案', 'tag:專案', 'folder=專案'], a: 1, ex: 'path: 搜尋檔案路徑（資料夾），file: 搜尋檔名。' },
        { q: '「咖啡 -拿鐵」的意思是？', opts: ['包含咖啡或拿鐵', '包含咖啡但排除拿鐵', '咖啡減去拿鐵的字數', '只搜尋拿鐵'], a: 1, ex: '減號 - 代表排除。' },
        { q: '要找出所有「尚未完成」的待辦，可以用？', opts: ['task-todo:', 'task-done:', 'todo=true', '#todo'], a: 0, ex: 'task-todo: 搜尋未完成的待辦；task-done: 搜尋已完成的。' }
      ]
    },

    /* ===================== 第 5 章 ===================== */
    {
      id: '5-1', ch: 5, emoji: '🕸️', minutes: 4,
      title: '關係圖譜 Graph View',
      desc: '把你的知識網路視覺化',
      body: `
<p>點選功能區上的圖譜圖示，或按 <kbd>Ctrl/⌘</kbd>+<kbd>G</kbd>，就能看到所有筆記組成的<b>關係圖譜</b>：每個點是一篇筆記，每條線是一個連結。</p>
<div class="grid grid-2" style="margin:1em 0">
  <div class="card"><b>🌐 全域圖譜</b><p class="muted" style="font-size:14px;margin:.4em 0 0">顯示整個 Vault 所有筆記的關係，看出知識的全貌與「孤島」。</p></div>
  <div class="card"><b>📍 局部圖譜</b><p class="muted" style="font-size:14px;margin:.4em 0 0">只顯示目前這篇筆記周圍的關係，可以調整「深度」看更遠的連結。</p></div>
</div>
<h3>圖譜可以怎麼調整？</h3>
<ul>
  <li><b>篩選</b>：用搜尋語法只顯示部分筆記，例如 <code>path:讀書筆記</code></li>
  <li><b>群組</b>：替不同標籤或資料夾上色，例如 #讀書 = 紫色、#工作 = 藍色</li>
  <li><b>顯示</b>：切換是否顯示標籤、附件、孤立的筆記</li>
  <li><b>力度</b>：調整節點之間的吸引力與排斥力</li>
</ul>
<div class="tip good"><span class="tip-title">🎮 動手玩</span>這個 App 的 <a href="#/graph">「圖譜」頁面</a> 用課程本身做了一張關係圖——你完成的課程會亮起紫光，試著拖曳節點看看！</div>
<div class="tip warn"><span class="tip-title">⚠️ 別被圖譜綁架</span>圖譜很美，但它是「結果」不是「目標」。專心寫好筆記、自然地加連結，圖譜自己會長出來。</div>`,
      quiz: [
        { q: '在關係圖譜中，一條「線」代表什麼？', opts: ['一個資料夾', '兩篇筆記之間的連結', '一個標籤', '修改時間'], a: 1, ex: '點是筆記，線是連結。' },
        { q: '只想看「目前這篇筆記」周圍的關係，應該使用？', opts: ['全域圖譜', '局部圖譜', '白板', '搜尋'], a: 1, ex: '局部圖譜（Local graph）只顯示與目前筆記相關的節點。' }
      ]
    },
    {
      id: '5-2', ch: 5, emoji: '🎨', minutes: 4,
      title: 'Canvas 白板',
      desc: '在無限畫布上自由排列筆記、圖片與想法',
      body: `
<p><b>Canvas（白板）</b>是 Obsidian 內建的無限畫布，適合用來<b>腦力激盪、規劃專案、畫心智圖、整理論文架構</b>。</p>
<h3>建立白板</h3>
<ol class="step-list">
  <li>點功能區的白板圖示，或在檔案總管按右鍵 → 新增白板</li>
  <li>在畫布上<b>雙擊</b>建立一張文字卡片（裡面一樣可以寫 Markdown）</li>
  <li>把左側的筆記<b>直接拖曳</b>進畫布，就會變成筆記卡片</li>
  <li>從卡片邊緣拉出線條，把卡片連起來</li>
</ol>
<h3>白板裡可以放什麼？</h3>
<div class="grid grid-4" style="margin:1em 0">
  <div class="card" style="text-align:center"><div style="font-size:24px">📝</div>文字卡片</div>
  <div class="card" style="text-align:center"><div style="font-size:24px">📄</div>現有筆記</div>
  <div class="card" style="text-align:center"><div style="font-size:24px">🖼️</div>圖片 / PDF</div>
  <div class="card" style="text-align:center"><div style="font-size:24px">🌐</div>網頁</div>
</div>
<p>你也可以用<b>群組</b>把卡片框在一起、替卡片和線條<b>上色</b>。</p>
<div class="tip"><span class="tip-title">💡 開放格式</span>白板存成 <code>.canvas</code> 檔，採用開放的 JSON Canvas 格式，一樣是你擁有的純文字檔。</div>`,
      quiz: [
        { q: '在 Canvas 白板上要建立一張新卡片，最快的方式是？', opts: ['在空白處雙擊', '按 Delete', '重新開啟 Obsidian', '只能從選單匯入'], a: 0, ex: '在畫布空白處雙擊就能新增文字卡片。' },
        { q: 'Canvas 白板檔案的副檔名是？', opts: ['.md', '.canvas', '.board', '.obs'], a: 1, ex: '白板存成 .canvas 檔，是開放的 JSON Canvas 格式。' }
      ]
    },
    {
      id: '5-3', ch: 5, emoji: '📅', minutes: 6,
      title: '每日筆記與範本',
      desc: '養成每天記錄的習慣，用範本省下重複工作',
      body: `
<h3>📅 每日筆記（Daily notes）</h3>
<p>這是一個內建的核心外掛。開啟後，點功能區的日曆圖示，就會自動建立（或打開）<b>今天日期</b>的筆記，例如 <code>2026-11-24.md</code>。</p>
<p>每日筆記是最好的「入口」：所有想法、待辦、會議都可以先記在今天的筆記裡，再用 <code>[[ ]]</code> 連到相關主題。</p>
<h3>📋 範本（Templates）</h3>
<ol class="step-list">
  <li>到 <b>設定 → 核心外掛</b>，確認「範本」已開啟</li>
  <li>建立一個資料夾（例如 <code>99 範本</code>），並在範本設定中指定它</li>
  <li>在資料夾內建立範本筆記，例如「每日範本」</li>
  <li>在 <b>設定 → 每日筆記</b> 中，把「範本檔案位置」設為這篇範本</li>
</ol>
<h3>範本變數</h3>
<table>
  <tr><th>變數</th><th>會被替換成</th></tr>
  <tr><td><code>{{date}}</code></td><td>今天的日期</td></tr>
  <tr><td><code>{{time}}</code></td><td>現在的時間</td></tr>
  <tr><td><code>{{title}}</code></td><td>筆記標題</td></tr>
  <tr><td><code>{{date:YYYY年MM月DD日}}</code></td><td>自訂日期格式</td></tr>
</table>
<h3>每日範本範例</h3>
<pre><code>---
日期: {{date}}
心情:
---
## ✅ 今日待辦
- [ ]

## 📝 筆記


## 🌙 今日回顧
- 今天學到：
- 感謝的事：</code></pre>`,
      practice: {
        intro: '設計你自己的每日筆記範本：',
        starter: '---\n日期: {{date}}\n---\n',
        goals: [
          { label: '使用 {{date}} 或 {{title}} 變數', test: has(/\{\{(date|title)(:[^}]*)?\}\}/) },
          { label: '至少 2 個 ## 段落標題', test: (s) => (s.match(/^## \S/gm) || []).length >= 2 },
          { label: '包含一個待辦 - [ ]', test: has(/^\s*- \[ \]/m) }
        ]
      },
      quiz: [
        { q: '範本中的 {{date}} 在套用時會變成？', opts: ['文字「{{date}}」', '今天的日期', '檔案建立者名稱', '隨機數字'], a: 1, ex: '{{date}} 會在插入範本時被替換成當天日期。' },
        { q: '每日筆記的檔名預設是？', opts: ['當天日期，例如 2026-11-24', '「未命名」', '隨機編號', '星期幾'], a: 0, ex: '預設格式是 YYYY-MM-DD，也可以在設定中修改。' }
      ]
    },

    /* ===================== 第 6 章 ===================== */
    {
      id: '6-1', ch: 6, emoji: '🧩', minutes: 6,
      title: '核心外掛與社群外掛',
      desc: '擴充 Obsidian 的能力，但別裝太多',
      body: `
<h3>核心外掛（Core plugins）</h3>
<p>官方內建、可以在 <b>設定 → 核心外掛</b> 開關。值得認識的有：</p>
<ul>
  <li><b>每日筆記、範本</b>：上一課學過</li>
  <li><b>書籤</b>：收藏常用的筆記與搜尋</li>
  <li><b>大綱</b>：顯示目前筆記的標題目錄</li>
  <li><b>Bases（資料庫）</b>：用屬性把筆記變成表格或卡片檢視，像是「書單」「專案清單」</li>
  <li><b>頁面預覽</b>：按住 <kbd>Ctrl/⌘</kbd> 把滑鼠移到連結上，預覽內容</li>
</ul>
<h3>社群外掛（Community plugins）</h3>
<p>由全世界的使用者開發，目前已有數千個。安裝方式：</p>
<ol class="step-list">
  <li>進入 <b>設定 → 社群外掛</b></li>
  <li>點「開啟社群外掛」（關閉限制模式）</li>
  <li>點「瀏覽」，搜尋外掛名稱，按「安裝」再按「啟用」</li>
</ol>
<h3>新手推薦外掛</h3>
<table>
  <tr><th>外掛</th><th>用途</th></tr>
  <tr><td><b>Calendar</b></td><td>側邊欄日曆，點日期就打開那天的每日筆記</td></tr>
  <tr><td><b>Dataview</b></td><td>用查詢語法把筆記做成清單、表格</td></tr>
  <tr><td><b>Tasks</b></td><td>強化待辦：到期日、重複任務、跨筆記彙整</td></tr>
  <tr><td><b>Excalidraw</b></td><td>手繪風格的繪圖白板</td></tr>
  <tr><td><b>Templater</b></td><td>更強大的範本（可用程式邏輯）</td></tr>
</table>
<div class="tip warn"><span class="tip-title">⚠️ 安全與節制</span>社群外掛可以存取你的檔案，請只安裝<b>下載量高、持續維護</b>的外掛。外掛越多，Obsidian 越慢、越難維護——「遇到需求再裝」是最好的原則。</div>`,
      quiz: [
        { q: '要安裝社群外掛之前，需要先做什麼？', opts: ['付費升級', '在設定中開啟社群外掛（關閉限制模式）', '重新安裝 Obsidian', '註冊開發者帳號'], a: 1, ex: '基於安全考量，社群外掛預設是關閉的，需要手動開啟。' },
        { q: '對新手來說，安裝外掛最好的原則是？', opts: ['越多越好', '遇到實際需求再安裝', '只裝最新上架的', '全部都不要裝'], a: 1, ex: '先熟悉基本功能，遇到需求再找外掛，系統才不會變得臃腫。' }
      ]
    },
    {
      id: '6-2', ch: 6, emoji: '☁️', minutes: 5,
      title: '同步與備份',
      desc: '讓電腦和手機的筆記保持一致，並且永遠不遺失',
      body: `
<p>因為 Obsidian 是本地檔案，<b>同步和備份要由你自己決定</b>。常見方案：</p>
<table>
  <tr><th>方案</th><th>優點</th><th>注意事項</th></tr>
  <tr><td><b>Obsidian Sync</b>（官方付費）</td><td>端對端加密、跨所有平台、有版本紀錄、最穩定</td><td>需要訂閱</td></tr>
  <tr><td><b>iCloud Drive</b></td><td>蘋果裝置之間免費同步</td><td>Windows / Android 支援度較差</td></tr>
  <tr><td><b>Google Drive / OneDrive / Dropbox</b></td><td>電腦之間同步方便</td><td>手機端通常需要額外 App 或外掛</td></tr>
  <tr><td><b>Git</b>（社群外掛）</td><td>免費、完整版本紀錄</td><td>需要一點技術背景</td></tr>
</table>
<div class="tip warn"><span class="tip-title">⚠️ 同步 ≠ 備份</span>同步會把「誤刪」也同步到所有裝置。請另外定期備份，例如每週把 Vault 資料夾壓縮複製到外接硬碟，或使用有版本紀錄的方案。</div>
<h3>內建的保命功能：檔案還原</h3>
<p>核心外掛「<b>檔案還原</b>」（File recovery）會定期自動快照你的筆記。不小心刪掉內容時，可以到 <b>設定 → 檔案還原</b> 找回來。</p>
<div class="tip"><span class="tip-title">💡 避免同步衝突</span>不要同時使用兩種同步方案同步同一個 Vault，很容易產生重複或衝突的檔案。</div>`,
      quiz: [
        { q: '為什麼說「同步不等於備份」？', opts: ['同步比較貴', '誤刪的檔案也會被同步刪除', '同步會壓縮檔案', '兩者其實一樣'], a: 1, ex: '同步會讓所有裝置一致——包括錯誤。備份則是保留過去的版本。' },
        { q: '不小心刪掉了筆記中的一大段內容，可以用哪個核心外掛找回？', opts: ['每日筆記', '檔案還原（File recovery）', '關係圖譜', '白板'], a: 1, ex: '檔案還原會定期保存快照，可以找回舊版本。' }
      ]
    },
    {
      id: '6-3', ch: 6, emoji: '🧠', minutes: 7,
      title: '打造你的工作流',
      desc: 'PARA、Zettelkasten、MOC：三種熱門的知識管理方法',
      body: `
<p>恭喜你走到最後一課！現在你已經會用 Obsidian 的所有核心功能了。最後介紹三種常見的方法，挑一個開始，再慢慢改成適合你的樣子。</p>
<h3>📂 PARA 方法：依「行動性」分類</h3>
<table>
  <tr><th>分類</th><th>放什麼</th><th>範例</th></tr>
  <tr><td><b>P</b>rojects 專案</td><td>有明確目標與期限的事</td><td>畢業專題、網站改版</td></tr>
  <tr><td><b>A</b>reas 領域</td><td>需要長期維護的責任</td><td>健康、財務、團隊管理</td></tr>
  <tr><td><b>R</b>esources 資源</td><td>有興趣的主題與參考資料</td><td>攝影、程式設計</td></tr>
  <tr><td><b>A</b>rchives 封存</td><td>已完成或暫停的東西</td><td>去年的專案</td></tr>
</table>
<h3>🗃️ Zettelkasten 卡片盒筆記法</h3>
<ul>
  <li>每篇筆記只寫<b>一個概念</b>（原子化）</li>
  <li>用<b>自己的話</b>寫，而不是複製貼上</li>
  <li>寫完後思考：它和哪些既有筆記有關？<b>把它們連起來</b></li>
</ul>
<h3>🗺️ MOC（Map of Content 內容地圖）</h3>
<p>當某個主題的筆記變多，建立一篇「索引筆記」把它們連在一起：</p>
<pre><code># 🗺️ 生產力 MOC

## 方法
- [[番茄鐘工作法]]
- [[GTD]]
- [[深度工作]]

## 書籍
- [[原子習慣]]
- [[刻意練習]]</code></pre>
<div class="tip good"><span class="tip-title">🎓 畢業建議</span>
<b>1.</b> 每天打開每日筆記，寫下任何東西。<br>
<b>2.</b> 讀到有感覺的內容，用自己的話寫成一篇筆記。<br>
<b>3.</b> 寫完就問：「這跟什麼有關？」然後加上 <code>[[連結]]</code>。<br>
<b>4.</b> 每週花 15 分鐘整理收件匣、看看反向連結。<br>
只要持續做，三個月後你會擁有一個真正屬於自己的第二大腦。🧠💜</div>`,
      practice: {
        intro: '畢業作業：建立一篇你自己的 MOC（內容地圖）！',
        starter: '# 🗺️ 我的 MOC\n\n',
        goals: [
          { label: '有一個 # 標題', test: has(/^# \S/m) },
          { label: '至少 2 個 ## 分類', test: (s) => (s.match(/^## \S/gm) || []).length >= 2 },
          { label: '至少 5 個 [[連結]]', test: (s) => (s.match(/\[\[[^\]]+\]\]/g) || []).length >= 5 },
          { label: '加上一個 #標籤', test: has(/(^|\s)#[^\s#\d][^\s#]*/m) }
        ]
      },
      quiz: [
        { q: 'PARA 方法中的「P」代表什麼？', opts: ['People 人物', 'Projects 專案', 'Pages 頁面', 'Plans 計畫'], a: 1, ex: 'PARA = Projects、Areas、Resources、Archives。' },
        { q: 'Zettelkasten（卡片盒筆記法）最重要的原則之一是？', opts: ['每篇筆記越長越好', '每篇筆記只寫一個概念，並與其他筆記連結', '只用資料夾分類', '每天刪除舊筆記'], a: 1, ex: '原子化的筆記 + 連結，是卡片盒筆記法的核心。' },
        { q: 'MOC（內容地圖）是什麼？', opts: ['一種付費外掛', '把同主題筆記連在一起的索引筆記', '地圖圖片', '同步工具'], a: 1, ex: 'MOC 是一篇「目錄型」筆記，用連結把相關筆記組織起來。' }
      ]
    }
  ];

  // 範例筆記庫（給練習場、嵌入示範使用）
  const SAMPLE_VAULT = {
    '四大法則': '**讓習慣養成的四大法則**\n1. 讓提示顯而易見\n2. 讓習慣有吸引力\n3. 讓行動輕而易舉\n4. 讓獎賞令人滿足',
    '原子習慣': '---\n作者: James Clear\n評分: 5\n---\n## 核心觀念\n每天進步 1%，一年後會進步 37 倍。 ^abc123\n\n## 四大法則\n![[四大法則]]\n\n相關：[[番茄鐘工作法]] #讀書',
    '番茄鐘工作法': '專注 **25 分鐘**、休息 5 分鐘，每四輪休息長一點。\n\n> [!tip] 小技巧\n> 開始前先寫下這一輪要完成什麼。',
    'Obsidian 入門': '歡迎來到 Obsidian！試試 [[原子習慣]] 這篇範例筆記。'
  };

  const PLAYGROUND_DEFAULT = `---
主題: Obsidian 練習場
狀態: 學習中
---
# 歡迎來到練習場 💜

這裡可以**自由練習** Obsidian 的 Markdown 語法，右邊會即時預覽。

## 文字格式
**粗體**、*斜體*、~~刪除線~~、==螢光標記==、\`行內程式碼\`

## 連結與標籤
- 連到 [[原子習慣]]（點點看！）
- 連到 [[還沒寫的筆記]]
- 用別名：[[番茄鐘工作法|番茄鐘]]
- 標籤：#學習 #obsidian/新手

## 待辦
- [x] 安裝 Obsidian
- [ ] 完成所有課程
  - [ ] 寫下第一篇每日筆記

> [!tip] 小提醒
> 你的內容會自動儲存在這個瀏覽器裡。

## 嵌入
![[四大法則]]

| 快捷鍵 | 功能 |
| --- | --- |
| Ctrl/⌘ + P | 命令面板 |
| Ctrl/⌘ + O | 快速切換 |
`;

  const SHORTCUTS = [
    { group: '必學', items: [
      ['開啟命令面板', 'Mod+P'], ['快速切換 / 開啟筆記', 'Mod+O'], ['新增筆記', 'Mod+N'],
      ['切換編輯 / 閱讀模式', 'Mod+E'], ['開啟設定', 'Mod+,']
    ] },
    { group: '編輯', items: [
      ['粗體', 'Mod+B'], ['斜體', 'Mod+I'], ['插入 Markdown 連結', 'Mod+K'],
      ['切換待辦事項', 'Mod+L'], ['新增檔案屬性', 'Mod+;'], ['縮排 / 取消縮排', 'Tab / Shift+Tab'],
      ['復原 / 重做', 'Mod+Z / Mod+Shift+Z'], ['在筆記中尋找', 'Mod+F'], ['尋找並取代', 'Mod+H']
    ] },
    { group: '導覽', items: [
      ['在所有筆記中搜尋', 'Mod+Shift+F'], ['開啟關係圖譜', 'Mod+G'],
      ['在新分頁開啟連結', 'Mod+Click'], ['關閉目前分頁', 'Mod+W'],
      ['上一頁 / 下一頁', 'Mod+Alt+← / Mod+Alt+→'], ['重新開啟關閉的分頁', 'Mod+Shift+T']
    ] },
    { group: '連結語法速查', items: [
      ['連結筆記', '[[ ]]'], ['嵌入筆記 / 圖片', '![[ ]]'], ['連到標題', '[[筆記#標題]]'],
      ['連到區塊', '[[筆記#^id]]'], ['別名顯示', '[[筆記|別名]]']
    ] }
  ];

  const BADGES = [
    { id: 'first', ico: '🌱', name: '踏出第一步', desc: '完成第 1 課', test: (p) => p.done >= 1 },
    { id: 'ch1', ico: '💎', name: '初識黑曜石', desc: '完成第 1 章', test: (p) => p.chDone(1) },
    { id: 'ch2', ico: '✍️', name: 'Markdown 達人', desc: '完成第 2 章', test: (p) => p.chDone(2) },
    { id: 'ch3', ico: '🔗', name: '連結大師', desc: '完成第 3 章', test: (p) => p.chDone(3) },
    { id: 'ch4', ico: '🗂️', name: '整理專家', desc: '完成第 4 章', test: (p) => p.chDone(4) },
    { id: 'ch5', ico: '🕸️', name: '視覺化玩家', desc: '完成第 5 章', test: (p) => p.chDone(5) },
    { id: 'grad', ico: '🎓', name: 'Obsidian 畢業生', desc: '完成全部課程', test: (p) => p.done >= p.total },
    { id: 'perfect', ico: '🎯', name: '神準', desc: '5 課測驗一次全對', test: (p) => p.perfect >= 5 },
    { id: 'streak3', ico: '🔥', name: '三日不輟', desc: '連續學習 3 天', test: (p) => p.streak >= 3 },
    { id: 'play', ico: '🧪', name: '實驗家', desc: '使用過練習場', test: (p) => p.played }
  ];

  global.COURSE = { CHAPTERS, LESSONS, SAMPLE_VAULT, PLAYGROUND_DEFAULT, SHORTCUTS, BADGES };
})(window);
