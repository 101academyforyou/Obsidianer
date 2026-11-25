/* 舊版網站曾在根目錄註冊離線快取（Service Worker）。
   網站改版後首頁變成介紹網頁、學習 App 移到 /app/，
   這個檔案會清掉舊快取並自我移除，避免舊訪客一直看到舊首頁。 */
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.map((k) => caches.delete(k)));
    await self.registration.unregister();
    const clients = await self.clients.matchAll({ type: 'window' });
    clients.forEach((c) => c.navigate(c.url));
  })());
});
