/* Obsidianer 主程式：路由、畫面、進度、圖譜、命令面板 */
(function () {
  'use strict';

  const { CHAPTERS, LESSONS, SAMPLE_VAULT, PLAYGROUND_DEFAULT, SHORTCUTS, BADGES, CARDS } = window.COURSE;
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const esc = window.MD.esc;
  const isMac = /Mac|iPhone|iPad|iPod/.test(navigator.platform || navigator.userAgent);

  /* ---------------- 儲存 ---------------- */
  const KEY = 'obsidianer:v1';
  const defaults = () => ({ done: {}, xp: 0, days: [], played: false, playground: null, practice: {}, saved: [], feedPos: 0, swipedAll: false });
  let state = load();
  function load() {
    try { return Object.assign(defaults(), JSON.parse(localStorage.getItem(KEY) || '{}')); }
    catch (e) { return defaults(); }
  }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* 私密模式等情況 */ } }

  const today = () => { const d = new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); };
  function markActive() {
    const t = today();
    if (!state.days.includes(t)) { state.days.push(t); state.days = state.days.slice(-400); save(); }
  }
  function streak() {
    const set = new Set(state.days);
    let n = 0; const d = new Date();
    if (!set.has(today())) d.setDate(d.getDate() - 1);
    for (;;) {
      const s = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
      if (!set.has(s)) break;
      n++; d.setDate(d.getDate() - 1);
    }
    return n;
  }

  /* ---------------- 進度 ---------------- */
  const idx = (id) => LESSONS.findIndex((l) => l.id === id);
  const isDone = (id) => !!state.done[id];
  // 所有課程都開放：使用者可以從卡片挑有興趣的主題直接學
  const isUnlocked = () => true;
  const doneCount = () => LESSONS.filter((l) => isDone(l.id)).length;
  const nextLesson = () => LESSONS.find((l) => !isDone(l.id)) || null;
  const chLessons = (ch) => LESSONS.filter((l) => l.ch === ch);
  const chDone = (ch) => chLessons(ch).every((l) => isDone(l.id));
  const level = () => Math.floor(state.xp / 50) + 1;
  const profile = () => ({
    done: doneCount(), total: LESSONS.length, chDone, streak: streak(), played: state.played, swipedAll: state.swipedAll,
    perfect: Object.values(state.done).filter((d) => d.perfect).length
  });
  function earnedBadges() { const p = profile(); return BADGES.filter((b) => b.test(p)); }

  function completeLesson(id, perfect, practiced) {
    if (isDone(id)) return false;
    const before = new Set(earnedBadges().map((b) => b.id));
    const gain = 10 + (perfect ? 5 : 0) + (practiced ? 5 : 0);
    state.done[id] = { at: Date.now(), perfect };
    state.xp += gain;
    markActive();
    save();
    toast('✨ 完成課程！獲得 ' + gain + ' XP');
    haptic('success');
    earnedBadges().filter((b) => !before.has(b.id)).forEach((b, i) => setTimeout(() => toast(b.ico + ' 獲得徽章：' + b.name), 700 * (i + 1)));
    confetti();
    updateChrome();
    return gain;
  }

  /* ---------------- 原生 App（Capacitor）---------------- */
  const native = !!(window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform());
  let hapticsPlugin = null;
  function haptic(kind) {
    try {
      if (native && !hapticsPlugin) hapticsPlugin = window.Capacitor.registerPlugin ? window.Capacitor.registerPlugin('Haptics') : (window.Capacitor.Plugins || {}).Haptics;
      const H = hapticsPlugin;
      if (H) { kind === 'success' ? H.notification({ type: 'SUCCESS' }) : H.impact({ style: kind === 'medium' ? 'MEDIUM' : 'LIGHT' }); }
      else if (kind === 'success' && navigator.vibrate) navigator.vibrate(20);
    } catch (e) { /* 不支援就略過 */ }
  }
  if (native) document.documentElement.classList.add('native');

  /* ---------------- 圖示 ---------------- */
  const ICONS = {
    home: '<path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
    path: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.5z"/><path d="M4 19.5A2.5 2.5 0 0 0 6.5 22H20v-5"/>',
    play: '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>',
    graph: '<circle cx="6" cy="6" r="2.5"/><circle cx="18" cy="7" r="2.5"/><circle cx="12" cy="18" r="2.5"/><path d="M8.2 7.2 10.8 16M15.8 8.5 13 15.8M8.5 6.3l7 .5"/>',
    keys: '<rect x="2" y="6" width="20" height="12" rx="2"/><path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M7 14h10"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>',
    back: '<path d="m15 18-6-6 6-6"/>',
    lock: '<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    reset: '<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/>',
    download: '<path d="M12 3v12m0 0-4-4m4 4 4-4M4 21h16"/>',
    cards: '<rect x="5" y="3" width="14" height="18" rx="3"/><path d="M9 8h6M9 12h6M9 16h3"/>',
    up: '<path d="m18 15-6-6-6 6"/>',
    down: '<path d="m6 9 6 6 6-6"/>',
    idcard: '<rect x="2" y="5" width="20" height="14" rx="2"/><circle cx="8.5" cy="11" r="2.2"/><path d="M5 16c.6-1.6 2-2.4 3.5-2.4s2.9.8 3.5 2.4M14.5 10h4M14.5 14h3"/>',
    heart: '<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 1 0-7.8 7.8L12 21.2l8.8-8.8a5.5 5.5 0 0 0 0-7.8z"/>'
  };
  const icon = (n) => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + ICONS[n] + '</svg>';
  let gemN = 0;
  const gem = () => { const n = ++gemN; return '<svg viewBox="0 0 100 100" class="logo-svg"><defs><linearGradient id="g1_' + n + '" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#c4b5fd"/><stop offset=".5" stop-color="#8a5cf5"/><stop offset="1" stop-color="#3b2a85"/></linearGradient><linearGradient id="g2_' + n + '" x1="1" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#a78bfa"/><stop offset="1" stop-color="#2e1f6b"/></linearGradient></defs><path d="M50 4 82 30 72 86 50 96 28 86 18 30z" fill="url(#g1_' + n + ')"/><path d="M50 4 62 46 50 96 38 46z" fill="url(#g2_' + n + ')" opacity=".85"/><path d="M18 30 38 46 28 86z" fill="#5b3fc4" opacity=".7"/><path d="M82 30 62 46 72 86z" fill="#2e1f6b" opacity=".7"/><path d="M18 30 50 4 38 46z" fill="#ddd6fe" opacity=".35"/></svg>'; };

  const NAV = [
    { r: '/', label: '滑卡探索', short: '探索', ico: 'cards' },
    { r: '/home', label: '學習總覽', short: '總覽', ico: 'home' },
    { r: '/path', label: '學習路徑', short: '課程', ico: 'path' },
    { r: '/playground', label: '練習場', short: '練習', ico: 'play' },
    { r: '/graph', label: '關係圖譜', short: '圖譜', ico: 'graph' },
    { r: '/card', label: '名片與人脈', short: '名片', ico: 'idcard' },
    { r: '/shortcuts', label: '快捷鍵', short: '快捷鍵', ico: 'keys' },
    { r: '/profile', label: '我的成就', short: '成就', ico: 'user' }
  ];

  /* ---------------- 外框 ---------------- */
  function shell() {
    document.body.innerHTML = `
<div class="app">
  <aside class="ribbon" aria-label="功能區">
    <div class="logo">${gem()}</div>
    <button class="icon-btn" data-act="palette" title="命令面板 (${isMac ? '⌘' : 'Ctrl'}+K)">${icon('search')}</button>
    ${NAV.map((n) => `<a class="icon-btn" href="#${n.r}" data-route="${n.r}" title="${n.label}">${icon(n.ico)}</a>`).join('')}
  </aside>
  <aside class="sidebar">
    <div class="brand"><div style="width:34px;height:34px">${gem()}</div><div><div class="brand-name">Obsidianer</div><div class="brand-sub">Obsidian 新手學院</div></div></div>
    <nav class="nav">${NAV.map((n) => `<a href="#${n.r}" data-route="${n.r}">${icon(n.ico)}<span>${n.label}</span></a>`).join('')}</nav>
    <div class="sidebar-foot">
      <div class="mini-progress" id="mini-progress"></div>
      <button class="btn ghost" data-act="palette" style="width:100%;margin-top:10px;justify-content:space-between"><span style="display:flex;gap:8px;align-items:center">${icon('search')}快速跳轉</span><kbd>${isMac ? '⌘' : 'Ctrl'} K</kbd></button>
    </div>
  </aside>
  <div class="main">
    <header class="topbar">
      <a class="icon-btn" id="top-back" href="#/" aria-label="返回" hidden>${icon('back')}</a>
      <div style="width:26px;height:26px" id="top-logo">${gem()}</div>
      <div class="title" id="top-title">Obsidianer</div>
      <span class="pill accent" id="top-xp"></span>
      <button class="icon-btn" data-act="palette" aria-label="搜尋">${icon('search')}</button>
    </header>
    <main class="view" id="view"></main>
  </div>
  <nav class="bottom-nav">${NAV.filter((n) => n.r !== '/shortcuts' && n.r !== '/home').map((n) => `<a href="#${n.r}" data-route="${n.r}">${icon(n.ico)}<span>${n.short}</span></a>`).join('')}</nav>
</div>
<div class="toast-wrap" id="toasts"></div>`;
    document.addEventListener('click', (e) => {
      const a = e.target.closest('[data-act="palette"]');
      if (a) { e.preventDefault(); openPalette(); }
    });
  }

  function updateChrome() {
    const n = doneCount();
    const pct = Math.round((n / LESSONS.length) * 100);
    const mp = $('#mini-progress');
    if (mp) mp.innerHTML = `<div style="display:flex;justify-content:space-between;margin-bottom:6px"><span>學習進度</span><span>${n}/${LESSONS.length}</span></div><div class="bar"><span style="width:${pct}%"></span></div><div style="margin-top:8px;display:flex;gap:10px"><span>⚡ ${state.xp} XP</span><span>🔥 ${streak()} 天</span></div>`;
    const tx = $('#top-xp');
    if (tx) tx.textContent = '⚡ ' + state.xp;
  }

  function setActiveNav(route) {
    const base = '/' + (route.split('/')[1] || '');
    const navBase = base === '/lesson' ? '/path' : ['/people', '/network', '/c'].includes(base) ? '/card' : base;
    $$('[data-route]').forEach((a) => a.classList.toggle('active', a.dataset.route === navBase));
  }

  function setTitle(t, back) {
    $('#top-title').textContent = t;
    document.title = t === 'Obsidianer' ? 'Obsidianer · Obsidian 新手學院' : t + ' · Obsidianer';
    const b = $('#top-back');
    b.hidden = !back; $('#top-logo').hidden = !!back;
    if (back) b.setAttribute('href', back);
  }

  /* ---------------- 路由 ---------------- */
  let cleanup = null;
  let lastList = '#/';
  function route() {
    const hash = location.hash.replace(/^#/, '') || '/';
    if (cleanup) { cleanup(); cleanup = null; }
    const view = $('#view');
    view.className = 'view';
    const parts = hash.split('/').filter(Boolean);
    setActiveNav(hash);
    document.body.classList.remove('feed-mode');
    if (parts[0] !== 'lesson') lastList = '#' + (parts.length ? '/' + parts[0] : '/');
    if (!parts.length) feedView(view);
    else if (parts[0] === 'home') homeView(view);
    else if (parts[0] === 'path') pathView(view);
    else if (parts[0] === 'lesson' && parts[1]) lessonView(view, decodeURIComponent(parts[1]));
    else if (parts[0] === 'playground') playgroundView(view);
    else if (parts[0] === 'graph') graphView(view);
    else if (parts[0] === 'shortcuts') shortcutsView(view);
    else if (parts[0] === 'profile') profileView(view);
    else if (parts[0] === 'card') CX.cardView(view);
    else if (parts[0] === 'people' && parts[1]) CX.personView(view, decodeURIComponent(parts[1]), parts[2]);
    else if (parts[0] === 'people') CX.peopleView(view);
    else if (parts[0] === 'network') CX.networkView(view);
    else if (parts[0] === 'c' && parts[1]) CX.receiveView(view, parts[1]);
    else feedView(view);
    window.scrollTo(0, 0);
    updateChrome();
  }

  /* ---------------- 首頁 ---------------- */
  function homeView(v) {
    setTitle('Obsidianer');
    const n = doneCount();
    const next = nextLesson();
    const pct = Math.round((n / LESSONS.length) * 100);
    v.innerHTML = `
<section class="hero">
  <div class="gem">${gem()}</div>
  <div class="pill accent" style="margin-bottom:14px">💜 給完全新手的 Obsidian 課程</div>
  <h1>從零開始，<br>打造你的第二大腦</h1>
  <p>6 個章節、${LESSONS.length} 堂小課，每課 5 分鐘。邊學邊練習，在瀏覽器裡就能體驗 Obsidian 的 Markdown、雙向連結與關係圖譜。</p>
  <div class="hero-actions">
    ${next ? `<a class="btn primary" href="#/lesson/${next.id}">${n ? '繼續學習' : '開始第一課'} ${icon('arrow')}</a>` : `<a class="btn primary" href="#/profile">🎓 查看畢業成就</a>`}
    <a class="btn" href="#/path">查看學習路徑</a>
  </div>
</section>

<div class="grid grid-4" style="margin-bottom:24px">
  <div class="card stat"><span class="num">${pct}%</span><span class="lbl">完成度</span></div>
  <div class="card stat"><span class="num">${n}<small style="font-size:15px;color:var(--text-muted)">/${LESSONS.length}</small></span><span class="lbl">已完成課程</span></div>
  <div class="card stat"><span class="num">Lv.${level()}</span><span class="lbl">${state.xp} XP</span></div>
  <div class="card stat"><span class="num">🔥 ${streak()}</span><span class="lbl">連續學習天數</span></div>
</div>

${next ? `
<h2 style="margin-top:0">${n ? '接下來' : '從這裡開始'}</h2>
<a class="card continue-card" href="#/lesson/${next.id}" style="color:inherit;text-decoration:none">
  <div class="ico">${next.emoji}</div>
  <div class="info"><div class="faint" style="font-size:13px">第 ${next.ch} 章 · ${CHAPTERS[next.ch - 1].title}</div><div style="font-weight:600;font-size:17px">${next.id}　${next.title}</div><div class="muted" style="font-size:14px">${next.desc}</div></div>
  <span class="pill">⏱ ${next.minutes} 分</span>
</a>` : ''}

<h2>探索功能</h2>
<div class="grid grid-3">
  <a class="card feature" href="#/path"><span class="emoji">📚</span><b>循序漸進的課程</b><span>從安裝到工作流，完成一課解鎖下一課。</span></a>
  <a class="card feature" href="#/playground"><span class="emoji">🧪</span><b>Markdown 練習場</b><span>左邊寫、右邊即時預覽，支援 [[連結]] 與 Callout。</span></a>
  <a class="card feature" href="#/graph"><span class="emoji">🕸️</span><b>互動關係圖譜</b><span>親手拖曳節點，感受知識網路的樣子。</span></a>
  <a class="card feature" href="#/shortcuts"><span class="emoji">⌨️</span><b>快捷鍵速查</b><span>Windows / Mac 一鍵切換，常用的都在這。</span></a>
  <a class="card feature" href="#/profile"><span class="emoji">🏆</span><b>徽章與成就</b><span>累積 XP、連續天數，收集 ${BADGES.length} 枚徽章。</span></a>
  <div class="card feature" id="install-card"><span class="emoji">📱</span><b>安裝成 App</b><span id="install-text">可以加到手機主畫面或電腦桌面，離線也能學。</span></div>
</div>
<p class="faint" style="font-size:12.5px;margin-top:30px">本專案為非官方學習資源，與 Obsidian（Dynalist Inc.）無隸屬關係。Obsidian 是其所有者的商標。</p>`;
    $('#install-card').addEventListener('click', promptInstall);
  }

  /* ---------------- 收藏 ---------------- */
  const isSaved = (id) => state.saved.includes(id);
  function toggleSave(id) {
    if (isSaved(id)) state.saved = state.saved.filter((x) => x !== id);
    else { state.saved.push(id); toast('♥ 已加入收藏，可在「課程」頁找到'); }
    save(); haptic('light');
    $$('[data-save="' + id + '"]').forEach((b) => {
      const on = isSaved(id);
      b.classList.toggle('on', on);
      b.innerHTML = b.classList.contains('fc-save') ? icon('heart') + '<span>' + (on ? '已收藏' : '收藏') + '</span>' : (on ? '♥ 已收藏' : '♡ 收藏');
    });
  }
  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-save]');
    if (b) { e.preventDefault(); e.stopPropagation(); toggleSave(b.dataset.save); }
  });
  function savedHTML() {
    const ls = LESSONS.filter((l) => isSaved(l.id));
    if (!ls.length) return '';
    return `<section class="chapter"><div class="chapter-head"><span class="chapter-num">♥</span><h2>我的收藏</h2></div><div class="lesson-list">${ls.map((l) => `<a class="lesson-item ${isDone(l.id) ? 'done' : ''}" href="#/lesson/${l.id}"><div class="state">${isDone(l.id) ? '✓' : '♥'}</div><div class="meta"><div class="t">${l.emoji} ${l.title}</div><div class="d">${esc(CARDS[l.id].hook)}</div></div></a>`).join('')}</div></section>`;
  }

  /* ---------------- 滑卡探索 ---------------- */
  const CH_HUE = [262, 280, 248, 292, 236, 305];
  function cardPreview(c) {
    if (c.render) return `<div class="fc-split"><pre class="fc-src">${esc(c.render)}</pre><div class="md fc-out">${renderMD(c.render)}</div></div>`;
    if (c.code) return `<pre class="fc-src fc-code">${esc(c.code)}</pre>`;
    return `<div class="fc-visual">${c.html}</div>`;
  }

  function feedView(v) {
    setTitle('探索');
    v.className = 'view feed-view';
    document.body.classList.add('feed-mode');
    const N = LESSONS.length;
    const first = `<section class="fcard" data-i="0" style="--h:262"><div class="fcard-inner fc-welcome">
      <div class="fc-gem">${gem()}</div>
      <h2 class="fc-title">滑動探索 Obsidian</h2>
      <p class="fc-hook">每張卡片介紹一個 Obsidian 功能，30 秒看懂。<br>有興趣就點進去，跟著專屬課程一步步學會。</p>
      <div class="cv-chips"><span>🃏 ${N} 張功能卡</span><span>✍️ 動手練習</span><span>📝 小測驗</span></div>
      <div class="swipe-hint"><span class="arrow">${icon('up')}</span><span class="only-touch">向上滑開始</span><span class="only-mouse">滾動滑鼠或按 ↓ 開始</span></div>
    </div></section>`;
    const body = LESSONS.map((l, k) => {
      const c = CARDS[l.id]; const ch = CHAPTERS[l.ch - 1];
      return `<section class="fcard" data-i="${k + 1}" data-id="${l.id}" style="--h:${CH_HUE[l.ch - 1]}"><div class="fcard-inner">
        <div class="fc-top"><span class="pill accent">${ch.emoji} ${ch.title}</span><span class="fc-num">${k + 1} / ${N}</span></div>
        <div class="fc-head"><div class="fc-emoji">${l.emoji}</div><div><h2 class="fc-title">${l.title}</h2>${isDone(l.id) ? '<span class="pill green">✓ 已學會</span>' : ''}</div></div>
        <p class="fc-hook">${esc(c.hook)}</p>
        <div class="fc-preview">${cardPreview(c)}</div>
        <div class="fc-meta">⏱ ${l.minutes} 分鐘${l.practice ? ' · ✍️ 含實作' : ''} · 📝 ${l.quiz.length} 題測驗</div>
        <div class="fc-actions">
          <button class="fc-save ${isSaved(l.id) ? 'on' : ''}" data-save="${l.id}" aria-label="收藏">${icon('heart')}<span>${isSaved(l.id) ? '已收藏' : '收藏'}</span></button>
          <a class="btn primary fc-go" href="#/lesson/${l.id}">${isDone(l.id) ? '再複習一次' : '深入學習'} ${icon('arrow')}</a>
        </div>
      </div></section>`;
    }).join('');
    const n = doneCount();
    const nl = nextLesson();
    const last = `<section class="fcard" data-i="${N + 1}" style="--h:280"><div class="fcard-inner fc-welcome">
      <div style="font-size:64px">🎉</div>
      <h2 class="fc-title">你滑完所有卡片了！</h2>
      <p class="fc-hook">已學會 ${n} / ${N} 個功能，收藏了 ${state.saved.length} 張卡片。<br>${n < N ? '挑一張有興趣的，點進去深入學習吧。' : '你已經是 Obsidian 高手了 💜'}</p>
      <div class="fc-end-actions">
        ${nl ? `<a class="btn primary" href="#/lesson/${nl.id}">繼續學：${nl.title}</a>` : ''}
        <a class="btn" href="#/path">查看完整學習路徑</a>
        <button class="btn ghost" id="fc-restart">${icon('up')} 回到第一張</button>
      </div>
    </div></section>`;
    v.innerHTML = `<div class="feed-wrap">
      <div class="feed-progress"><span id="feed-bar"></span></div>
      <div class="feed" id="feed">${first}${body}${last}</div>
      <div class="feed-side"><button class="icon-btn" id="fc-up" aria-label="上一張">${icon('up')}</button><span id="fc-count"></span><button class="icon-btn" id="fc-down" aria-label="下一張">${icon('down')}</button></div>
    </div>`;

    const feed = $('#feed');
    const total = N + 2;
    let cur = -1; let saveT;
    const go = (i, smooth = true) => {
      i = Math.max(0, Math.min(total - 1, i));
      feed.scrollTo({ top: i * feed.clientHeight, behavior: smooth ? 'smooth' : 'auto' });
    };
    const onScroll = () => {
      const i = Math.round(feed.scrollTop / Math.max(1, feed.clientHeight));
      if (i === cur) return;
      if (cur !== -1) haptic('light');
      cur = i;
      $('#feed-bar').style.width = (i / (total - 1)) * 100 + '%';
      $('#fc-count').textContent = i === 0 || i === total - 1 ? '' : i + '/' + N;
      $('#fc-up').disabled = i === 0; $('#fc-down').disabled = i === total - 1;
      if (i === total - 1 && !state.swipedAll) {
        state.swipedAll = true; save();
        const b = BADGES.find((x) => x.id === 'swipe'); if (b) setTimeout(() => toast(b.ico + ' 獲得徽章：' + b.name), 400);
      }
      clearTimeout(saveT); saveT = setTimeout(() => { state.feedPos = i; save(); }, 250);
    };
    feed.addEventListener('scroll', onScroll, { passive: true });
    // 點卡片任何地方 = 進入該主題的學習頁
    feed.addEventListener('click', (e) => {
      const il = e.target.closest('.internal-link, .tag');
      if (il) { linkClick(e); return; }
      if (e.target.closest('a, button, input')) return;
      const card = e.target.closest('.fcard[data-id]');
      if (card && !(window.getSelection && String(window.getSelection()).length)) location.hash = '#/lesson/' + card.dataset.id;
    });
    $('#fc-up').addEventListener('click', () => go(cur - 1));
    $('#fc-down').addEventListener('click', () => go(cur + 1));
    $('#fc-restart').addEventListener('click', () => go(0));
    const onKey = (e) => {
      if ($('.palette-backdrop') || /INPUT|TEXTAREA/.test(document.activeElement.tagName)) return;
      if (['ArrowDown', 'PageDown', 'j', ' '].includes(e.key)) { e.preventDefault(); go(cur + 1); }
      else if (['ArrowUp', 'PageUp', 'k'].includes(e.key)) { e.preventDefault(); go(cur - 1); }
      else if (e.key === 'Enter') { const c = $('.fcard[data-i="' + cur + '"]'); if (c && c.dataset.id) location.hash = '#/lesson/' + c.dataset.id; }
    };
    document.addEventListener('keydown', onKey);
    const onResize = () => go(cur, false);
    window.addEventListener('resize', onResize);
    requestAnimationFrame(() => { go(state.feedPos || 0, false); onScroll(); });
    cleanup = () => {
      document.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', onResize);
      clearTimeout(saveT);
      state.feedPos = Math.max(0, cur); save();
    };
  }

  /* ---------------- 學習路徑 ---------------- */
  function pathView(v) {
    setTitle('學習路徑');
    const next = nextLesson();
    v.innerHTML = `<h1>學習路徑</h1><p class="muted" style="margin-top:-6px">建議依序學習，也可以直接挑有興趣的主題。目前進度 ${doneCount()} / ${LESSONS.length}。</p>` + savedHTML() +
      CHAPTERS.map((c) => {
        const ls = chLessons(c.id);
        const d = ls.filter((l) => isDone(l.id)).length;
        return `<section class="chapter">
  <div class="chapter-head"><span class="chapter-num">CH ${c.id}</span><h2>${c.emoji} ${c.title}</h2><span class="faint" style="font-size:13px;margin-left:auto">${d}/${ls.length}</span></div>
  <div class="lesson-list">${ls.map((l) => {
    const done = isDone(l.id); const un = isUnlocked(l.id); const cur = next && next.id === l.id;
    const cls = done ? 'done' : cur ? 'current' : un ? '' : 'locked';
    const inner = `<div class="state">${done ? '✓' : un ? l.id.split('-')[1] : icon('lock').replace('<svg', '<svg width="14" height="14"')}</div>
      <div class="meta"><div class="t">${l.emoji} ${l.title}</div><div class="d">${l.desc}</div></div>
      <div class="right">${l.practice ? '<span class="pill">✍️ 實作</span>' : ''}<span class="pill">⏱ ${l.minutes} 分</span>${done ? '<span class="pill green">完成</span>' : ''}</div>`;
    return un ? `<a class="lesson-item ${cls}" href="#/lesson/${l.id}">${inner}</a>` : `<div class="lesson-item ${cls}" title="先完成上一課才能解鎖">${inner}</div>`;
  }).join('')}</div>
</section>`;
      }).join('');
  }

  /* ---------------- 課程頁 ---------------- */
  const mdOpts = {
    resolve: (n) => Object.prototype.hasOwnProperty.call(SAMPLE_VAULT, n),
    embed: (n) => (Object.prototype.hasOwnProperty.call(SAMPLE_VAULT, n) ? SAMPLE_VAULT[n] : null)
  };
  const renderMD = (s) => window.MD.render(s, mdOpts);

  function lessonView(v, id) {
    const i = idx(id);
    const l = LESSONS[i];
    if (!l) { location.hash = '#/path'; return; }
    if (!isUnlocked(id)) { toast('🔒 先完成上一課才能解鎖喔'); location.hash = '#/path'; return; }
    setTitle(l.id + ' ' + l.title, lastList === '#/' ? '#/' : '#/path');
    markActive();
    const ch = CHAPTERS[l.ch - 1];
    const prev = LESSONS[i - 1]; const nxt = LESSONS[i + 1];

    v.innerHTML = `
<div class="lesson-head">
  <div class="crumbs"><a href="#/path">學習路徑</a><span>›</span><span>第 ${ch.id} 章 ${ch.title}</span></div>
  <h1>${l.emoji} ${l.title}</h1>
  <div class="pills"><span class="pill">⏱ 約 ${l.minutes} 分鐘</span><span class="pill">第 ${i + 1} / ${LESSONS.length} 課</span>${isDone(id) ? '<span class="pill green">✓ 已完成</span>' : ''}<button class="pill save-pill ${isSaved(id) ? 'on' : ''}" data-save="${id}">${isSaved(id) ? '♥ 已收藏' : '♡ 收藏'}</button></div>
</div>
<div class="steps">${LESSONS.filter((x) => x.ch === l.ch).map((x) => `<span class="${isDone(x.id) || x.id === id ? 'on' : ''}"></span>`).join('')}</div>
<article class="prose">${l.body}</article>
${l.practice ? practiceHTML(l) : ''}
<section class="quiz card" id="quiz">
  <h2 style="margin-top:0">📝 小測驗</h2>
  <p class="muted" style="margin-top:-8px;font-size:14px">全部答對就能完成這一課${l.practice ? '。先完成上方實作再答題，可額外獲得 5 XP' : ''}。</p>
  ${l.quiz.map((q, qi) => `<div class="q" data-q="${qi}"><div class="q-title">${qi + 1}. ${esc(q.q)}</div><div class="q-opts">${q.opts.map((o, oi) => `<button class="q-opt" data-o="${oi}"><span class="letter">${'ABCD'[oi]}</span><span>${esc(o)}</span></button>`).join('')}</div></div>`).join('')}
  <div id="quiz-result"></div>
</section>
${lastList === '#/' ? `<a class="btn back-to-cards" href="#/">🃏 回到卡片繼續滑</a>` : ''}
<nav class="lesson-nav">
  ${prev ? `<a class="btn" href="#/lesson/${prev.id}">‹ ${prev.title}</a>` : '<span></span>'}
  ${nxt ? `<a class="btn ${isDone(id) ? 'primary' : ''}" id="next-btn" href="#/lesson/${nxt.id}" ${isUnlocked(nxt.id) ? '' : 'aria-disabled="true"'}>${nxt.title} ›</a>` : `<a class="btn" href="#/profile">🎓 查看成就</a>`}
</nav>`;

    if (l.demo) { const t = document.getElementById(l.demo.target); if (t) t.innerHTML = renderMD(l.demo.md); }

    // 實作練習
    let practiced = false;
    if (l.practice) {
      const ta = $('#practice-input'); const pv = $('#practice-preview');
      const saved = state.practice[id];
      ta.value = saved != null ? saved : l.practice.starter;
      let celebrated = false;
      const upd = () => {
        pv.innerHTML = renderMD(ta.value);
        const res = l.practice.goals.map((g) => { try { return !!g.test(ta.value); } catch (e) { return false; } });
        $$('#practice-goals li').forEach((li, k) => li.classList.toggle('ok', res[k]));
        practiced = res.every(Boolean);
        $('#practice-status').innerHTML = practiced ? '<span class="pill green">✓ 全部達成</span>' : `<span class="pill">${res.filter(Boolean).length} / ${res.length}</span>`;
        if (practiced && !celebrated) { celebrated = true; toast('🎉 實作目標全部達成！'); }
        state.practice[id] = ta.value; save();
      };
      ta.addEventListener('input', upd);
      ta.addEventListener('keydown', tabHandler);
      $('#practice-reset').addEventListener('click', () => { ta.value = l.practice.starter; upd(); ta.focus(); });
      upd();
      celebrated = practiced;
      pv.addEventListener('click', linkClick);
    }

    // 測驗
    let wrongs = 0;
    const answered = new Set();
    $$('#quiz .q').forEach((qEl) => {
      const qi = +qEl.dataset.q; const q = l.quiz[qi];
      qEl.addEventListener('click', (e) => {
        const b = e.target.closest('.q-opt');
        if (!b || b.disabled) return;
        const oi = +b.dataset.o;
        const old = qEl.querySelector('.q-explain'); if (old) old.remove();
        if (oi === q.a) {
          b.classList.add('correct');
          $$('.q-opt', qEl).forEach((x) => { x.disabled = true; });
          answered.add(qi);
          qEl.insertAdjacentHTML('beforeend', `<div class="q-explain">✅ 答對了！${esc(q.ex)}</div>`);
        } else {
          wrongs++;
          b.classList.add('wrong'); b.disabled = true;
          qEl.insertAdjacentHTML('beforeend', `<div class="q-explain">再想想看～提示：重新讀一下上面的內容。</div>`);
        }
        if (answered.size === l.quiz.length) finishQuiz();
      });
    });

    function finishQuiz() {
      const perfect = wrongs === 0;
      const already = isDone(id);
      const gain = already ? 0 : completeLesson(id, perfect, practiced);
      $('#quiz-result').innerHTML = `<div class="complete-banner"><div class="big">${perfect ? '🎯' : '🎉'}</div>
        <h3 style="margin:.3em 0">${already ? '複習完成！' : '完成「' + esc(l.title) + '」'}</h3>
        <p class="muted" style="margin:.2em 0 14px">${already ? '溫故知新，做得好。' : (perfect ? '一次全對！' : '全部答對了！') + ' 獲得 ' + gain + ' XP'}</p>
        ${nxt ? `<a class="btn primary" href="#/lesson/${nxt.id}">下一課：${esc(nxt.title)} ${icon('arrow')}</a>` : `<a class="btn primary" href="#/profile">🎓 恭喜畢業！查看成就</a>`}</div>`;
      const nb = $('#next-btn'); if (nb) { nb.classList.add('primary'); nb.removeAttribute('aria-disabled'); }
    }
  }

  function practiceHTML(l) {
    return `<section class="practice card">
  <div style="display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap"><h2 style="margin:0">✍️ 動手練習</h2><span id="practice-status"></span></div>
  <p class="muted" style="margin:.5em 0 0;font-size:15px">${esc(l.practice.intro)}</p>
  <ul class="practice-goal" id="practice-goals">${l.practice.goals.map((g) => `<li><span class="chk">✓</span>${esc(g.label)}</li>`).join('')}</ul>
  <div class="editor-split">
    <div class="pane"><div class="pane-label"><span>編輯（Markdown）</span><button class="btn ghost" id="practice-reset" style="padding:2px 10px;font-size:12px">${icon('reset')}重設</button></div><textarea class="md-input" id="practice-input" spellcheck="false" aria-label="Markdown 編輯區"></textarea></div>
    <div class="pane"><div class="pane-label"><span>預覽</span></div><div class="md-preview md" id="practice-preview"></div></div>
  </div>
</section>`;
  }

  function tabHandler(e) {
    if (e.key !== 'Tab') return;
    e.preventDefault();
    const ta = e.target; const s = ta.selectionStart; const v = ta.value;
    const lineStart = v.lastIndexOf('\n', s - 1) + 1;
    if (e.shiftKey) {
      if (v.slice(lineStart, lineStart + 2) === '  ') { ta.value = v.slice(0, lineStart) + v.slice(lineStart + 2); ta.selectionStart = ta.selectionEnd = Math.max(lineStart, s - 2); }
    } else {
      ta.value = v.slice(0, lineStart) + '  ' + v.slice(lineStart); ta.selectionStart = ta.selectionEnd = s + 2;
    }
    ta.dispatchEvent(new Event('input'));
  }

  function linkClick(e) {
    const a = e.target.closest('.internal-link');
    const t = e.target.closest('.tag');
    if (a) {
      const n = a.dataset.note;
      if (mdOpts.resolve(n)) showNote(n);
      else toast('📄「' + n + '」還不存在——在 Obsidian 中點擊就會建立這篇筆記');
    } else if (t) toast('🏷️ 在 Obsidian 中點擊標籤會搜尋所有 #' + t.dataset.tag + ' 的筆記');
  }

  function showNote(name) {
    const back = document.createElement('div');
    back.className = 'palette-backdrop';
    back.innerHTML = `<div class="palette" role="dialog" aria-label="${esc(name)}" style="max-width:620px"><div style="display:flex;justify-content:space-between;align-items:center;padding:12px 16px;border-bottom:1px solid var(--border)"><b>📄 ${esc(name)}</b><button class="icon-btn" aria-label="關閉">✕</button></div><div class="md" style="padding:6px 18px 16px;max-height:60vh;overflow:auto">${renderMD(SAMPLE_VAULT[name])}</div></div>`;
    document.body.appendChild(back);
    const close = () => back.remove();
    back.addEventListener('click', (e) => {
      if (e.target === back || e.target.closest('.icon-btn')) return close();
      const a = e.target.closest('.internal-link');
      if (a) { close(); linkClick(e); }
    });
    document.addEventListener('keydown', function k(e) { if (e.key === 'Escape') { close(); document.removeEventListener('keydown', k); } });
  }

  /* ---------------- 練習場 ---------------- */
  function playgroundView(v) {
    setTitle('練習場');
    v.className = 'view wide';
    if (!state.played) { state.played = true; save(); }
    markActive();
    v.innerHTML = `
<div style="display:flex;justify-content:space-between;align-items:flex-end;gap:12px;flex-wrap:wrap;margin-bottom:14px">
  <div><h1 style="margin-bottom:4px">🧪 Markdown 練習場</h1><p class="muted" style="margin:0">自由練習 Obsidian 語法。內容會自動存在這個瀏覽器。範例筆記：${Object.keys(SAMPLE_VAULT).map((k) => `<code>[[${esc(k)}]]</code>`).join(' ')}</p></div>
  <div style="display:flex;gap:8px"><button class="btn" id="pg-reset">${icon('reset')}還原範例</button><button class="btn" id="pg-dl">${icon('download')}下載 .md</button></div>
</div>
<div class="editor-split" style="min-height:65vh">
  <div class="pane"><div class="pane-label"><span>編輯</span><span id="pg-count"></span></div><textarea class="md-input" id="pg-input" spellcheck="false" aria-label="Markdown 編輯區" style="min-height:60vh"></textarea></div>
  <div class="pane"><div class="pane-label"><span>閱讀模式預覽</span></div><div class="md-preview md" id="pg-preview"></div></div>
</div>`;
    const ta = $('#pg-input'); const pv = $('#pg-preview');
    ta.value = state.playground != null ? state.playground : PLAYGROUND_DEFAULT;
    let timer;
    const upd = () => {
      pv.innerHTML = renderMD(ta.value);
      $('#pg-count').textContent = ta.value.replace(/\s/g, '').length + ' 字';
      clearTimeout(timer); timer = setTimeout(() => { state.playground = ta.value; save(); }, 300);
    };
    ta.addEventListener('input', upd);
    ta.addEventListener('keydown', tabHandler);
    pv.addEventListener('click', linkClick);
    $('#pg-reset').addEventListener('click', () => { if (confirm('要還原成範例內容嗎？目前的內容會被覆蓋。')) { ta.value = PLAYGROUND_DEFAULT; upd(); } });
    $('#pg-dl').addEventListener('click', () => {
      const blob = new Blob([ta.value], { type: 'text/markdown;charset=utf-8' });
      const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = '練習筆記.md'; a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 1000);
      toast('📥 已下載，可以直接放進你的 Obsidian Vault！');
    });
    upd();
    cleanup = () => { clearTimeout(timer); state.playground = ta.value; save(); };
  }

  /* ---------------- 關係圖譜 ---------------- */
  function graphView(v) {
    setTitle('關係圖譜');
    v.className = 'view wide';
    v.innerHTML = `
<div style="display:flex;justify-content:space-between;align-items:flex-end;gap:12px;flex-wrap:wrap;margin-bottom:14px">
  <div><h1 style="margin-bottom:4px">🕸️ 關係圖譜</h1><p class="muted" style="margin:0">每個點是一篇筆記，每條線是一個連結。拖曳節點、滾輪縮放、點擊開啟。</p></div>
  <div class="segmented" role="tablist"><button class="on" data-mode="course">課程圖譜</button><button data-mode="vault">範例筆記庫</button></div>
</div>
<div class="graph-wrap"><canvas id="graph"></canvas>
  <div class="graph-legend" id="graph-legend"></div>
  <div class="graph-tip" id="graph-hover"></div>
</div>
<div class="tip" style="margin-top:16px"><span class="tip-title">💡 觀察看看</span>章節是「樞紐」，像 Obsidian 裡的 MOC（內容地圖）。課程之間的虛線是概念上的關聯——就像你未來筆記之間的連結。</div>`;
    const g = makeGraph($('#graph'));
    const setMode = (m) => {
      $$('.segmented button').forEach((b) => b.classList.toggle('on', b.dataset.mode === m));
      g.load(m === 'course' ? courseGraph() : vaultGraph());
      $('#graph-legend').innerHTML = m === 'course'
        ? '<span><i style="background:#c4b5fd"></i>章節</span><span><i style="background:#8a5cf5;box-shadow:0 0 6px #8a5cf5"></i>已完成</span><span><i style="background:#7a7a7a"></i>未完成</span>'
        : '<span><i style="background:#8a5cf5"></i>筆記</span><span><i style="background:#555;border:1px dashed #888"></i>尚未建立</span><span><i style="background:#4ade80"></i>標籤</span>';
    };
    $$('.segmented button').forEach((b) => b.addEventListener('click', () => setMode(b.dataset.mode)));
    setMode('course');
    cleanup = g.destroy;
  }

  function courseGraph() {
    const nodes = []; const links = [];
    CHAPTERS.forEach((c) => nodes.push({ id: 'ch' + c.id, label: c.emoji + ' ' + c.title, kind: 'hub', r: 11 }));
    LESSONS.forEach((l) => {
      nodes.push({ id: l.id, label: l.title, kind: isDone(l.id) ? 'done' : 'todo', r: 7, href: isUnlocked(l.id) ? '#/lesson/' + l.id : null });
      links.push({ s: 'ch' + l.ch, t: l.id });
    });
    for (let i = 1; i < CHAPTERS.length; i++) links.push({ s: 'ch' + i, t: 'ch' + (i + 1) });
    [['2-1', '4-1'], ['2-3', '5-3'], ['3-1', '3-2'], ['3-1', '5-1'], ['3-3', '2-4'], ['4-2', '6-1'], ['4-3', '4-2'], ['5-3', '6-3'], ['3-1', '6-3'], ['1-2', '6-2'], ['1-3', '4-3'], ['5-2', '5-1']]
      .forEach(([s, t]) => links.push({ s, t, dashed: true }));
    return { nodes, links };
  }

  function vaultGraph() {
    const extra = {
      '刻意練習': '跟 [[原子習慣]] 的概念很像。#讀書',
      '每日筆記 2026-11-24': '今天用了 [[番茄鐘工作法]]，讀了 [[原子習慣]]。準備寫 [[深度工作]] 心得。#日記',
      '生產力 MOC': '- [[番茄鐘工作法]]\n- [[原子習慣]]\n- [[刻意練習]]\n- [[深度工作]]\n- [[GTD]]'
    };
    const vault = Object.assign({}, SAMPLE_VAULT, extra);
    const nodes = new Map(); const links = [];
    const add = (id, kind) => { if (!nodes.has(id)) nodes.set(id, { id, label: id, kind, r: kind === 'tag' ? 5 : 7 }); };
    Object.keys(vault).forEach((k) => add(k, 'note'));
    Object.entries(vault).forEach(([k, txt]) => {
      (txt.match(/\[\[([^\]|#]+)/g) || []).forEach((m) => { const t = m.slice(2).trim(); add(t, vault[t] != null ? 'note' : 'ghost'); links.push({ s: k, t }); });
      (txt.match(/#[\p{L}\p{N}_/-]+/gu) || []).forEach((tag) => { if (/^#\d+$/.test(tag)) return; add(tag, 'tag'); links.push({ s: k, t: tag, dashed: true }); });
    });
    const deg = {}; links.forEach((l) => { deg[l.s] = (deg[l.s] || 0) + 1; deg[l.t] = (deg[l.t] || 0) + 1; });
    nodes.forEach((n) => { if (n.kind === 'note') n.r = 6 + Math.min(6, (deg[n.id] || 0)); });
    return { nodes: Array.from(nodes.values()), links };
  }

  function makeGraph(canvas) {
    const ctx = canvas.getContext('2d');
    let W = 0, H = 0, dpr = 1;
    let nodes = [], links = [], byId = {};
    let cam = { x: 0, y: 0, k: 1 };
    let drag = null, hover = null, raf = 0, alpha = 1, running = true;
    let down = null;
    const pointers = new Map(); let pinch = null;

    function resize() {
      const r = canvas.getBoundingClientRect();
      dpr = window.devicePixelRatio || 1;
      W = r.width; H = r.height;
      canvas.width = W * dpr; canvas.height = H * dpr;
    }
    function load(data) {
      nodes = data.nodes.map((n, i) => {
        const a = (i / data.nodes.length) * Math.PI * 2;
        return Object.assign({}, n, { x: Math.cos(a) * 160 + (Math.random() - .5) * 40, y: Math.sin(a) * 160 + (Math.random() - .5) * 40, vx: 0, vy: 0 });
      });
      byId = {}; nodes.forEach((n) => { byId[n.id] = n; });
      links = data.links.filter((l) => byId[l.s] && byId[l.t]).map((l) => Object.assign({}, l, { a: byId[l.s], b: byId[l.t] }));
      cam = { x: 0, y: 0, k: Math.min(1.1, Math.max(.5, Math.min(W, H) / 640)) };
      alpha = 1;
    }
    function tick() {
      if (alpha > 0.005) {
        for (let i = 0; i < nodes.length; i++) {
          const a = nodes[i];
          for (let j = i + 1; j < nodes.length; j++) {
            const b = nodes[j];
            let dx = b.x - a.x, dy = b.y - a.y; let d2 = dx * dx + dy * dy || 1;
            if (d2 > 250000) continue;
            const f = 2600 / d2; const d = Math.sqrt(d2);
            dx /= d; dy /= d;
            a.vx -= dx * f * alpha; a.vy -= dy * f * alpha; b.vx += dx * f * alpha; b.vy += dy * f * alpha;
          }
        }
        links.forEach((l) => {
          const dx = l.b.x - l.a.x, dy = l.b.y - l.a.y; const d = Math.sqrt(dx * dx + dy * dy) || 1;
          const target = l.dashed ? 150 : 85;
          const f = (d - target) * (l.dashed ? 0.006 : 0.025) * alpha;
          const fx = dx / d * f, fy = dy / d * f;
          l.a.vx += fx; l.a.vy += fy; l.b.vx -= fx; l.b.vy -= fy;
        });
        nodes.forEach((n) => {
          n.vx -= n.x * 0.0025 * alpha; n.vy -= n.y * 0.0025 * alpha;
          if (n === drag) { n.vx = n.vy = 0; return; }
          n.vx *= 0.82; n.vy *= 0.82; n.x += n.vx; n.y += n.vy;
        });
        alpha *= 0.992;
      }
      draw();
      if (running) raf = requestAnimationFrame(tick);
    }
    const toScreen = (n) => [W / 2 + (n.x + cam.x) * cam.k, H / 2 + (n.y + cam.y) * cam.k];
    const toWorld = (sx, sy) => [(sx - W / 2) / cam.k - cam.x, (sy - H / 2) / cam.k - cam.y];
    function neighbors(n) {
      const s = new Set([n]);
      links.forEach((l) => { if (l.a === n) s.add(l.b); if (l.b === n) s.add(l.a); });
      return s;
    }
    function draw() {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      const focus = hover || drag; const nb = focus ? neighbors(focus) : null;
      links.forEach((l) => {
        const [x1, y1] = toScreen(l.a); const [x2, y2] = toScreen(l.b);
        const hl = focus && (l.a === focus || l.b === focus);
        ctx.strokeStyle = hl ? 'rgba(168,139,250,.9)' : focus ? 'rgba(120,120,120,.12)' : 'rgba(140,140,140,.35)';
        ctx.lineWidth = hl ? 1.8 : 1;
        ctx.setLineDash(l.dashed ? [4, 4] : []);
        ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
      });
      ctx.setLineDash([]);
      nodes.forEach((n) => {
        const [x, y] = toScreen(n); const r = n.r * Math.max(.7, cam.k);
        const dim = nb && !nb.has(n);
        let fill = '#8a5cf5';
        if (n.kind === 'hub') fill = '#c4b5fd';
        else if (n.kind === 'todo') fill = '#7a7a7a';
        else if (n.kind === 'ghost') fill = '#4a4a4a';
        else if (n.kind === 'tag') fill = '#4ade80';
        else if (n.kind === 'event') fill = '#facc15';
        ctx.globalAlpha = dim ? 0.2 : 1;
        if ((n.kind === 'done' || n.kind === 'hub' || n === focus) && !dim) { ctx.shadowColor = '#8a5cf5'; ctx.shadowBlur = n === focus ? 22 : 12; }
        ctx.fillStyle = n === focus ? '#d8ccff' : fill;
        ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
        ctx.shadowBlur = 0;
        if (n.kind === 'ghost') { ctx.strokeStyle = '#888'; ctx.setLineDash([2, 2]); ctx.stroke(); ctx.setLineDash([]); }
        if (cam.k > 0.6 || n === focus || n.kind === 'hub') {
          ctx.fillStyle = dim ? '#666' : n.kind === 'hub' ? '#e9e3ff' : '#cfcfcf';
          ctx.font = (n.kind === 'hub' ? '600 13px ' : '12px ') + getComputedStyle(document.body).fontFamily;
          ctx.textAlign = 'center';
          ctx.fillText(n.label, x, y + r + 14);
        }
        ctx.globalAlpha = 1;
      });
    }
    function pick(sx, sy) {
      const [wx, wy] = toWorld(sx, sy);
      let best = null, bd = Infinity;
      nodes.forEach((n) => { const d = Math.hypot(n.x - wx, n.y - wy); if (d < n.r + 10 / cam.k && d < bd) { bd = d; best = n; } });
      return best;
    }
    const pos = (e) => { const r = canvas.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
    function onDown(e) {
      canvas.setPointerCapture(e.pointerId);
      pointers.set(e.pointerId, pos(e));
      if (pointers.size === 2) {
        const [a, b] = Array.from(pointers.values());
        pinch = { d: Math.hypot(a[0] - b[0], a[1] - b[1]), k: cam.k }; drag = null; down = null; return;
      }
      const [sx, sy] = pos(e);
      const n = pick(sx, sy);
      down = { sx, sy, n, cx: cam.x, cy: cam.y, moved: false };
      if (n) { drag = n; alpha = Math.max(alpha, .3); }
      canvas.style.cursor = 'grabbing';
    }
    function onMove(e) {
      const [sx, sy] = pos(e);
      if (pointers.has(e.pointerId)) pointers.set(e.pointerId, [sx, sy]);
      if (pinch && pointers.size === 2) {
        const [a, b] = Array.from(pointers.values());
        cam.k = Math.min(3, Math.max(.3, pinch.k * Math.hypot(a[0] - b[0], a[1] - b[1]) / pinch.d)); return;
      }
      if (down) {
        if (Math.hypot(sx - down.sx, sy - down.sy) > 4) down.moved = true;
        if (drag) { const [wx, wy] = toWorld(sx, sy); drag.x = wx; drag.y = wy; alpha = Math.max(alpha, .3); }
        else { cam.x = down.cx + (sx - down.sx) / cam.k; cam.y = down.cy + (sy - down.sy) / cam.k; }
      } else {
        const n = pick(sx, sy);
        if (n !== hover) {
          hover = n;
          canvas.style.cursor = n ? (n.href ? 'pointer' : 'default') : 'grab';
          $('#graph-hover').textContent = n ? n.label + (n.kind === 'ghost' ? '（尚未建立）' : n.kind === 'todo' && !n.href ? '（未解鎖）' : '') : '';
        }
      }
    }
    function onUp(e) {
      pointers.delete(e.pointerId);
      if (pointers.size < 2) pinch = null;
      if (down && !down.moved && down.n) {
        const n = down.n;
        if (n.href) location.hash = n.href;
        else if (SAMPLE_VAULT[n.id] != null) showNote(n.id);
        else if (n.kind === 'todo') toast('🔒 先完成前面的課程才能解鎖');
        else if (n.kind === 'ghost') toast('📄「' + n.label + '」還沒建立——就像 Obsidian 中未建立的連結');
      }
      drag = null; down = null; canvas.style.cursor = 'grab';
    }
    function onWheel(e) {
      e.preventDefault();
      const [sx, sy] = pos(e); const [wx, wy] = toWorld(sx, sy);
      cam.k = Math.min(3, Math.max(.3, cam.k * Math.exp(-e.deltaY * 0.0015)));
      const [nx, ny] = toWorld(sx, sy); cam.x += nx - wx; cam.y += ny - wy;
    }
    canvas.addEventListener('pointerdown', onDown);
    canvas.addEventListener('pointermove', onMove);
    canvas.addEventListener('pointerup', onUp);
    canvas.addEventListener('pointercancel', onUp);
    canvas.addEventListener('pointerleave', () => { if (!down) { hover = null; $('#graph-hover').textContent = ''; } });
    canvas.addEventListener('wheel', onWheel, { passive: false });
    const ro = new ResizeObserver(resize); ro.observe(canvas);
    resize();
    raf = requestAnimationFrame(tick);
    return { load, destroy: () => { running = false; cancelAnimationFrame(raf); ro.disconnect(); } };
  }

  /* ---------------- 快捷鍵 ---------------- */
  function shortcutsView(v) {
    setTitle('快捷鍵');
    let mac = isMac;
    v.innerHTML = `
<div style="display:flex;justify-content:space-between;align-items:flex-end;gap:12px;flex-wrap:wrap"><h1 style="margin-bottom:0">⌨️ 快捷鍵速查</h1>
<div class="segmented"><button data-os="win">Windows / Linux</button><button data-os="mac">macOS</button></div></div>
<p class="muted">Obsidian 的預設快捷鍵。所有快捷鍵都能在 <b>設定 → 快捷鍵</b> 中自訂。</p>
<input class="search-input" id="sc-q" placeholder="搜尋功能，例如「連結」「粗體」…" style="margin-bottom:20px">
<div class="grid grid-2" id="sc-list"></div>`;
    const keyHTML = (k) => k.split(' / ').map((combo) => combo.split('+').map((x) => {
      if (x === 'Mod') x = mac ? '⌘' : 'Ctrl';
      else if (x === 'Alt') x = mac ? '⌥' : 'Alt';
      else if (x === 'Shift') x = mac ? '⇧' : 'Shift';
      return x.startsWith('[') || x.startsWith('!') ? '<code>' + esc(x) + '</code>' : '<kbd>' + esc(x) + '</kbd>';
    }).join('<span class="faint">+</span>')).join('<span class="faint" style="margin:0 4px">/</span>');
    const draw = () => {
      const q = $('#sc-q').value.trim().toLowerCase();
      $$('.segmented button').forEach((b) => b.classList.toggle('on', (b.dataset.os === 'mac') === mac));
      $('#sc-list').innerHTML = SHORTCUTS.map((g) => {
        const items = g.items.filter(([n, k]) => !q || n.toLowerCase().includes(q) || k.toLowerCase().includes(q));
        if (!items.length) return '';
        return `<div class="card sc-group"><h3>${g.group}</h3>${items.map(([n, k]) => `<div class="sc-row"><span>${esc(n)}</span><span class="sc-keys">${keyHTML(k)}</span></div>`).join('')}</div>`;
      }).join('') || '<p class="muted">找不到符合的快捷鍵。</p>';
    };
    $$('.segmented button').forEach((b) => b.addEventListener('click', () => { mac = b.dataset.os === 'mac'; draw(); }));
    $('#sc-q').addEventListener('input', draw);
    draw();
  }

  /* ---------------- 成就 ---------------- */
  function profileView(v) {
    setTitle('我的成就');
    const n = doneCount(); const lv = level(); const inLv = state.xp % 50;
    const got = new Set(earnedBadges().map((b) => b.id));
    const C = 2 * Math.PI * 52;
    v.innerHTML = `
<h1>🏆 我的成就</h1>
<div class="card profile-top">
  <svg class="level-ring" viewBox="0 0 120 120"><circle cx="60" cy="60" r="52" fill="none" stroke="#2f2f2f" stroke-width="10"/><circle cx="60" cy="60" r="52" fill="none" stroke="url(#lg)" stroke-width="10" stroke-linecap="round" stroke-dasharray="${C}" stroke-dashoffset="${C * (1 - inLv / 50)}" transform="rotate(-90 60 60)"/><defs><linearGradient id="lg"><stop offset="0" stop-color="#483699"/><stop offset="1" stop-color="#a88bfa"/></linearGradient></defs><text x="60" y="58" text-anchor="middle" fill="#dcddde" font-size="26" font-weight="700">Lv.${lv}</text><text x="60" y="80" text-anchor="middle" fill="#a3a3a3" font-size="12">${inLv}/50 XP</text></svg>
  <div style="flex:1;min-width:200px">
    <div style="font-size:20px;font-weight:700">${n >= LESSONS.length ? '🎓 Obsidian 畢業生' : n >= 9 ? '🔗 連結探索者' : n >= 4 ? '✍️ Markdown 學徒' : '🌱 新手筆記家'}</div>
    <div class="muted" style="margin:4px 0 12px">總共 ${state.xp} XP · 連續 ${streak()} 天 · 學習 ${state.days.length} 天</div>
    <div class="bar"><span style="width:${(n / LESSONS.length) * 100}%"></span></div>
    <div class="faint" style="font-size:13px;margin-top:6px">課程完成 ${n} / ${LESSONS.length}</div>
  </div>
</div>
<h2>徽章 <span class="faint" style="font-size:15px">${got.size}/${BADGES.length}</span></h2>
<div class="badges">${BADGES.map((b) => `<div class="card badge ${got.has(b.id) ? 'got' : ''}"><div class="b-ico">${b.ico}</div><div class="b-name">${b.name}</div><div class="b-desc">${b.desc}</div></div>`).join('')}</div>
<h2>各章進度</h2>
<div class="grid grid-2">${CHAPTERS.map((c) => { const ls = chLessons(c.id); const d = ls.filter((l) => isDone(l.id)).length; return `<div class="card"><div style="display:flex;justify-content:space-between;margin-bottom:8px"><b>${c.emoji} ${c.title}</b><span class="faint">${d}/${ls.length}</span></div><div class="bar"><span style="width:${(d / ls.length) * 100}%"></span></div></div>`; }).join('')}</div>
<h2>資料</h2>
<p class="muted" style="font-size:14px">進度只儲存在這個裝置的瀏覽器中，不會上傳到任何地方。</p>
<div style="display:flex;gap:10px;flex-wrap:wrap">
  <button class="btn" id="exp">${icon('download')}匯出進度</button>
  <label class="btn" style="cursor:pointer">📤 匯入進度<input type="file" id="imp" accept="application/json" hidden></label>
  <button class="btn" id="rst" style="color:var(--red)">${icon('reset')}重設所有進度</button>
</div>`;
    $('#exp').addEventListener('click', () => {
      const a = document.createElement('a');
      a.href = URL.createObjectURL(new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' }));
      a.download = 'obsidianer-progress.json'; a.click();
    });
    $('#imp').addEventListener('change', (e) => {
      const f = e.target.files[0]; if (!f) return;
      f.text().then((t) => { state = Object.assign(defaults(), JSON.parse(t)); save(); toast('✅ 已匯入進度'); route(); }).catch(() => toast('❌ 檔案格式不正確'));
    });
    $('#rst').addEventListener('click', () => { if (confirm('確定要重設所有學習進度嗎？此動作無法復原。')) { state = defaults(); save(); toast('已重設進度'); route(); } });
  }

  /* ---------------- 命令面板 ---------------- */
  function openPalette() {
    if ($('.palette-backdrop')) return;
    const items = [
      ...NAV.map((n) => ({ t: n.label, s: '頁面', h: '#' + n.r })),
      ...LESSONS.map((l) => ({ t: l.id + ' ' + l.title, s: isUnlocked(l.id) ? (isDone(l.id) ? '✓ 已完成' : '課程') : '🔒 未解鎖', h: '#/lesson/' + l.id, k: l.desc, lock: !isUnlocked(l.id) }))
    ];
    const back = document.createElement('div');
    back.className = 'palette-backdrop';
    back.innerHTML = '<div class="palette" role="dialog" aria-label="命令面板"><input placeholder="輸入課程或頁面名稱…" aria-label="搜尋"><ul></ul></div>';
    document.body.appendChild(back);
    const inp = $('input', back); const ul = $('ul', back);
    let sel = 0; let list = items;
    const draw = () => {
      const q = inp.value.trim().toLowerCase();
      list = items.filter((i) => !q || (i.t + ' ' + (i.k || '')).toLowerCase().includes(q));
      sel = Math.min(sel, Math.max(0, list.length - 1));
      ul.innerHTML = list.map((i, k) => `<li class="${k === sel ? 'sel' : ''}" data-k="${k}"><span>${esc(i.t)}</span><small>${i.s}</small></li>`).join('') || '<li><span class="faint">沒有符合的結果</span></li>';
      const s = $('li.sel', ul); if (s) s.scrollIntoView({ block: 'nearest' });
    };
    const go = (i) => { if (!i) return; close(); if (i.lock) toast('🔒 先完成上一課才能解鎖'); else location.hash = i.h; };
    const close = () => back.remove();
    inp.addEventListener('input', () => { sel = 0; draw(); });
    inp.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown') { sel = Math.min(list.length - 1, sel + 1); draw(); e.preventDefault(); }
      else if (e.key === 'ArrowUp') { sel = Math.max(0, sel - 1); draw(); e.preventDefault(); }
      else if (e.key === 'Enter') go(list[sel]);
      else if (e.key === 'Escape') close();
    });
    ul.addEventListener('click', (e) => { const li = e.target.closest('li[data-k]'); if (li) go(list[+li.dataset.k]); });
    back.addEventListener('click', (e) => { if (e.target === back) close(); });
    draw(); inp.focus();
  }

  /* ---------------- 小工具 ---------------- */
  function toast(msg) {
    const w = $('#toasts'); if (!w) return;
    const t = document.createElement('div'); t.className = 'toast'; t.textContent = msg;
    w.appendChild(t); setTimeout(() => t.remove(), 2800);
    while (w.children.length > 3) w.firstChild.remove();
  }

  function confetti() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const c = document.createElement('canvas'); c.className = 'confetti';
    document.body.appendChild(c);
    const x = c.getContext('2d'); const d = window.devicePixelRatio || 1;
    c.width = innerWidth * d; c.height = innerHeight * d; x.scale(d, d);
    const colors = ['#8a5cf5', '#a88bfa', '#c4b5fd', '#483699', '#facc15', '#ffffff'];
    const ps = Array.from({ length: 120 }, () => ({ x: innerWidth / 2, y: innerHeight * 0.6, vx: (Math.random() - .5) * 14, vy: -Math.random() * 14 - 4, r: Math.random() * 6 + 3, c: colors[Math.floor(Math.random() * colors.length)], a: Math.random() * 6, life: 0 }));
    let f = 0;
    (function loop() {
      x.clearRect(0, 0, innerWidth, innerHeight);
      ps.forEach((p) => { p.vy += .35; p.vx *= .99; p.x += p.vx; p.y += p.vy; p.a += .15; x.save(); x.translate(p.x, p.y); x.rotate(p.a); x.fillStyle = p.c; x.globalAlpha = Math.max(0, 1 - f / 110); x.fillRect(-p.r / 2, -p.r / 4, p.r, p.r / 2); x.restore(); });
      if (++f < 110) requestAnimationFrame(loop); else c.remove();
    })();
  }

  /* ---------------- PWA ---------------- */
  let deferredPrompt = null;
  window.addEventListener('beforeinstallprompt', (e) => { e.preventDefault(); deferredPrompt = e; const t = $('#install-text'); if (t) t.textContent = '點這裡安裝到桌面或主畫面，離線也能學！'; });
  function promptInstall() {
    if (deferredPrompt) { deferredPrompt.prompt(); deferredPrompt.userChoice.finally(() => { deferredPrompt = null; }); return; }
    if (window.matchMedia('(display-mode: standalone)').matches) return toast('✅ 你已經在使用 App 版了');
    if (/iPhone|iPad|iPod/.test(navigator.userAgent)) return toast('📱 Safari：點「分享」→「加入主畫面」');
    toast('💡 用瀏覽器選單中的「安裝應用程式 / 加到主畫面」即可安裝');
  }
  if ('serviceWorker' in navigator && !native && /^https?:$/.test(location.protocol)) {
    window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
  }

  /* ---------------- 名片與人脈（js/connect.js）---------------- */
  const CX = window.Connect({ $, $$, esc, icon, toast, haptic, setTitle, makeGraph, native, setCleanup: (fn) => { cleanup = fn; } });

  /* ---------------- 啟動 ---------------- */
  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')) { e.preventDefault(); openPalette(); }
  });
  shell();
  window.addEventListener('hashchange', route);
  route();
})();
