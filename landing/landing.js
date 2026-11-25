// 讀取每天自動更新的 stats.json，顯示 App Store 下載人數
(function () {
  'use strict';
  var text = document.getElementById('stat-text');
  if (!text) return;

  function fmt(n) { return Number(n).toLocaleString('zh-TW'); }

  fetch('stats.json', { cache: 'no-store' })
    .then(function (r) { return r.ok ? r.json() : null; })
    .then(function (s) {
      if (!s || typeof s.downloads !== 'number' || s.downloads <= 0) return; // 還沒有下載數：維持預設文字
      text.innerHTML = '<b>' + fmt(s.downloads) + '</b> 位學習者已下載 · <b>19</b> 堂課程';
      if (s.updated) text.parentNode.title = '資料來源：App Store，更新於 ' + s.updated;
    })
    .catch(function () { /* 讀不到就顯示預設文字 */ });
})();
