/* Snake Game — Proprietary License. See LICENSE for full terms. */
const CACHE='snake-v2';
const FILES=['/','/index.html','/css/style.css','/manifest.json',
  '/js/Config.js','/js/Database.js','/js/Input.js','/js/Snake.js','/js/Food.js',
  '/js/Audio.js','/js/ParticleSystem.js','/js/ThemeManager.js','/js/Renderer.js',
  '/js/LevelManager.js','/js/Economy.js','/js/Social.js','/js/Tutorial.js',
  '/js/Splash.js','/js/Game.js','/js/UI.js','/js/main.js'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==CACHE).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;e.respondWith(caches.match(e.request).then(c=>c||fetch(e.request).catch(()=>c)))});
