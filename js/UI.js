/**
 * ═══════════════════════════════════════════════════════════════════════════
 *  VIPER: THE SNAKE GAME & FRAMEWORK
 * ═══════════════════════════════════════════════════════════════════════════
 *  Copyright (C) 2026 Joel Jais. All rights reserved.
 *
 *  LICENSING TERMS:
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU Affero General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 *  GNU Affero General Public License for more details.
 *
 *  DUAL-LICENSE NOTICE:
 *  The copyright holder (Joel Jais) reserves the right to distribute this
 *  software under alternative commercial, proprietary, or closed-source
 *  licenses for deployment in centralized applications, app stores, or
 *  commercial platforms.
 *
 *  Full License Text: <https://www.gnu.org/licenses/agpl-3.0.txt>
 * ═══════════════════════════════════════════════════════════════════════════
 */
class UI {
  constructor(game) {
    this.game = game;
    this.audio = game.audio;
    this.input = game.input;
    this.themeMgr = game.themeMgr;
    this.levelMgr = game.levelMgr;

    this.screens = {
      splash: document.getElementById('splashScreen'),
      login: document.getElementById('loginScreen'),
      main: document.getElementById('mainMenu'),
      levels: document.getElementById('levelSelect'),
      store: document.getElementById('storeScreen'),
      social: document.getElementById('socialScreen'),
      settings: document.getElementById('settingsScreen'),
      priv: document.getElementById('privacyScreen'),
      release: document.getElementById('releaseScreen')
    };
    this.overlays = {
      pause: document.getElementById('pauseOverlay'),
      gameover: document.getElementById('gameOverOverlay'),
      levelComplete: document.getElementById('levelCompleteOverlay'),
      tutorial: document.getElementById('tutorialOverlay'),
      chat: document.getElementById('chatOverlay'),
      devwall: document.getElementById('devWallOverlay')
    };
    this.hud = document.getElementById('hud');
    this.touchCtrl = document.getElementById('touchControls');

    this.bindAll();
    this.applySettings();
    this.populateThemes();
  }

  bindAll() {
    document.querySelectorAll('[data-action]').forEach(el => {
      el.addEventListener('click', (e) => {
        const action = e.currentTarget.dataset.action;
        const param = e.currentTarget.dataset.param;
        this.audio.click();
        this.handleAction(action, param, e.currentTarget);
      });
    });

    this.input.onPause = () => {
      if (this.game.state === 'playing') { this.audio.click(); this.game.pause(); this.showOverlay('pause'); }
      else if (this.game.state === 'paused') { this.hideOverlay('pause'); this.game.resume(); }
    };

    this.game.onStateChange = (state, data) => this.onGameState(state, data);
  }

  handleAction(action, param, el) {
    switch (action) {
      case 'showLogin': this.showScreen('login'); break;
      case 'doLogin': this.doLogin(); break;
      case 'doRegister': this.doRegister(); break;
      case 'showMain': this.showScreen('main'); break;
      case 'showLevels': this.populateLevels(); this.showScreen('levels'); break;
      case 'showStore': this.populateStore(); this.showScreen('store'); break;
      case 'showSocial': this.populateSocial(); this.showScreen('social'); break;
      case 'showSettings': this.populateSettingsUI(); this.showScreen('settings'); break;
      case 'showPrivacy': this.showScreen('priv'); break;
      case 'showRelease': this.showScreen('release'); break;
      case 'startLevel': this.startLevel(parseInt(param)); break;
      case 'purchase': this.purchaseItem(param); break;
      case 'sendChat': this.sendChat(); break;
      case 'postDevWall': this.postDevWall(); break;
      case 'resume': this.hideOverlay('pause'); this.game.resume(); break;
      case 'restart': this.hideOverlay('pause'); this.hideOverlay('gameover'); this.hideOverlay('levelComplete'); this.game.stop(); this.startLevel(this.game.level); break;
      case 'quit': this.quitToMenu(); break;
      case 'nextLevel': this.nextLevel(); break;
      case 'resetData': this.resetData(); break;
      case 'logout': this.logout(); break;
      case 'showHelp': this.showHelp(); break;
      case 'guestLogin': this.guestLogin(); break;
      case 'showTab': this.showTab(param); break;
    }
  }

  showScreen(id) {
    Object.values(this.screens).forEach(s => { if (s) s.classList.add('hidden'); });
    const screen = this.screens[id];
    if (screen) screen.classList.remove('hidden');
  }

  showOverlay(id) {
    const o = this.overlays[id];
    if (o) o.classList.remove('hidden');
  }

  hideOverlay(id) {
    const o = this.overlays[id];
    if (o) o.classList.add('hidden');
  }

  hideAllOverlays() {
    Object.values(this.overlays).forEach(o => { if (o) o.classList.add('hidden'); });
  }

  onGameState(state, data) {
    switch (state) {
      case 'playing': this.hideAllOverlays(); this.hud.classList.remove('hidden'); this.updateHUD(); this.updateTouchControls(); break;
      case 'paused': break;
      case 'gameover': this.showGameOver(data); break;
    }
  }

  showGameOver(data) {
    this.hud.classList.add('hidden');
    this.touchCtrl.classList.add('hidden');

    if (data.won) {
      this.showLevelComplete(data);
    } else {
      this.showGameOverScreen(data);
    }
  }

  showGameOverScreen(data) {
    const o = this.overlays.gameover;
    if (!o) return;
    document.getElementById('goScore').textContent = data.score;
    document.getElementById('goLength').textContent = data.length;
    document.getElementById('goTime').textContent = this.formatTime(data.time);
    document.getElementById('goReason').textContent = data.reason || 'Game Over';
    o.classList.remove('hidden');

    if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
  }

  showLevelComplete(data) {
    const o = this.overlays.levelComplete;
    if (!o) return;
    document.getElementById('lcScore').textContent = data.score;
    document.getElementById('lcLength').textContent = data.length;
    document.getElementById('lcTime').textContent = this.formatTime(data.time);
    document.getElementById('lcLevel').textContent = `Level ${data.level} Complete!`;

    if (data.coinsEarned > 0) {
      document.getElementById('lcCoins').textContent = `+${data.coinsEarned} coins`;
      document.getElementById('lcCoins').classList.remove('hidden');
    } else {
      document.getElementById('lcCoins').classList.add('hidden');
    }

    const rewardsEl = document.getElementById('lcRewards');
    rewardsEl.innerHTML = '';
    if (data.newUnlocks && data.newUnlocks.length > 0) {
      data.newUnlocks.forEach(r => {
        const div = document.createElement('div');
        div.className = 'reward-badge';
        div.innerHTML = `<span class="reward-icon">🎁</span><span>${r.name}</span>`;
        rewardsEl.appendChild(div);
      });
      this.audio.levelUp();
    }

    const hasNext = data.level < window.SNAKE_CONFIG.levels.total;
    document.getElementById('btnNextLevel').classList.toggle('hidden', !hasNext);

    o.classList.remove('hidden');

    const cs = this.game.renderer.cellSize;
    const cx = this.game.renderer.ox + this.game.gridSize * cs / 2;
    const cy = this.game.renderer.oy + this.game.gridSize * cs / 2;
    this.game.particles.levelUp(cx, cy);

    if (navigator.vibrate) navigator.vibrate(100);
  }

  nextLevel() {
    this.hideOverlay('levelComplete');
    this.game.stop();
    const next = this.game.level + 1;
    if (next <= window.SNAKE_CONFIG.levels.total) {
      this.startLevel(next);
    } else {
      this.quitToMenu();
    }
  }

  quitToMenu() {
    this.hideAllOverlays();
    this.game.stop();
    this.hud.classList.add('hidden');
    this.touchCtrl.classList.add('hidden');
    this.checkAuthAndShow();
  }

  startLevel(level) {
    if (!Auth.isLoggedIn()) { this.showScreen('login'); return; }
    if (!this.levelMgr.isLevelUnlocked(level)) return;

    this.hideAllOverlays();
    Object.values(this.screens).forEach(s => { if (s) s.classList.add('hidden'); });

    this.hud.classList.remove('hidden');
    this.updateTouchControls();

    this.game.start(level);
  }

  updateHUD() {
    const g = this.game;
    document.getElementById('hudScore').textContent = g.score;
    document.getElementById('hudTarget').textContent = g.winScore;
    document.getElementById('hudLevel').textContent = `Lv ${g.level}`;
    document.getElementById('hudLength').textContent = g.snake.getLength();
  }

  updateTouchControls() {
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const profile = Auth.getProfile();
    const show = isTouch && profile && profile.settings.touchControls;
    this.touchCtrl.classList.toggle('hidden', !show);
  }

  // === LOGIN ===
  doLogin() {
    const user = document.getElementById('loginUser').value.trim();
    const pass = document.getElementById('loginPass').value;
    const result = Auth.login(user, pass);
    if (result.ok) {
      this.onLoginSuccess();
    } else {
      document.getElementById('loginError').textContent = result.error;
      document.getElementById('loginError').classList.remove('hidden');
    }
  }

  doRegister() {
    const user = document.getElementById('loginUser').value.trim();
    const pass = document.getElementById('loginPass').value;
    const result = Auth.register(user, pass);
    if (result.ok) {
      Auth.login(user, pass);
      this.onLoginSuccess();
    } else {
      document.getElementById('loginError').textContent = result.error;
      document.getElementById('loginError').classList.remove('hidden');
    }
  }

  guestLogin() {
    const guestId = 'Guest_' + Math.random().toString(36).substr(2, 6).toUpperCase();
    Auth.register(guestId, 'guest');
    Auth.login(guestId, 'guest');
    this.onLoginSuccess();
  }

  onLoginSuccess() {
    document.getElementById('loginError').classList.add('hidden');
    document.getElementById('loginUser').value = '';
    document.getElementById('loginPass').value = '';
    const profile = Auth.getProfile();
    document.getElementById('mainUserBadge').textContent = profile.username;
    document.getElementById('mainUserCoins').textContent = `🪙 ${profile.coins}`;
    this.showScreen('main');

    if (profile && !profile.tutorialDone) {
      setTimeout(() => {
        if (window.tutorial) window.tutorial.start();
      }, 300);
    }
  }

  logout() {
    Auth.logout();
    this.game.stop();
    this.hud.classList.add('hidden');
    this.touchCtrl.classList.add('hidden');
    this.hideAllOverlays();
    this.showScreen('login');
  }

  checkAuthAndShow() {
    if (Auth.isLoggedIn()) {
      const p = Auth.getProfile();
      document.getElementById('mainUserBadge').textContent = p.username;
      document.getElementById('mainUserCoins').textContent = `🪙 ${p.coins}`;
      this.showScreen('main');
    } else {
      this.showScreen('login');
    }
  }

  // === LEVELS ===
  populateLevels() {
    const grid = document.getElementById('levelGrid');
    if (!grid) return;
    grid.innerHTML = '';
    const total = window.SNAKE_CONFIG.levels.total;
    const profile = Auth.getProfile();

    for (let i = 1; i <= total; i++) {
      const card = document.createElement('div');
      const unlocked = this.levelMgr.isLevelUnlocked(i);
      card.className = `level-card ${unlocked ? 'unlocked' : 'locked'}`;
      const hs = profile ? (profile.highScores[`level_${i}`] || 0) : 0;
      const stars = this.levelMgr.getStarRating(hs, i);
      card.innerHTML = `
        <div class="lv-num">${i}</div>
        <div class="lv-stars">${'★'.repeat(stars)}${'☆'.repeat(3 - stars)}</div>
        <div class="lv-hs">${hs > 0 ? hs : '-'}</div>
        ${!unlocked ? '<div class="lv-lock">🔒</div>' : ''}
      `;
      if (unlocked) {
        card.addEventListener('click', () => this.startLevel(i));
      }
      grid.appendChild(card);
    }
  }

  // === STORE ===
  populateStore() {
    const grid = document.getElementById('storeGrid');
    if (!grid) return;
    grid.innerHTML = '';
    const items = Economy.getStoreItems();
    items.forEach(item => {
      const card = document.createElement('div');
      card.className = `store-card ${item.owned ? 'owned' : ''}`;
      card.innerHTML = `
        <div class="store-name">${item.name}</div>
        <div class="store-desc">${item.desc}</div>
        <div class="store-price">${item.price > 0 ? `🪙 ${item.price}` : item.coins > 0 ? `+${item.coins}🪙` : 'Free'}</div>
        ${item.owned ? '<div class="store-owned">Owned</div>' :
          `<button class="btn btn-sm btn-primary" data-action="purchase" data-param="${item.id}">Buy</button>`}
      `;
      grid.appendChild(card);
    });
    grid.querySelectorAll('[data-action="purchase"]').forEach(b => {
      b.addEventListener('click', (e) => {
        e.stopPropagation();
        this.purchaseItem(b.dataset.param);
      });
    });

    const profile = Auth.getProfile();
    document.getElementById('storeCoins').textContent = profile ? profile.coins : 0;
  }

  purchaseItem(itemId) {
    const result = Economy.purchase(itemId);
    if (result.ok) {
      this.audio.coin();
      this.populateStore();
      this.populateThemes();
      const profile = Auth.getProfile();
      document.getElementById('mainUserCoins').textContent = `🪙 ${profile.coins}`;
      this.toast(`Purchased: ${result.item.name}`);
    } else {
      this.toast(result.error, true);
    }
  }

  // === SOCIAL ===
  populateSocial(tab = 'chat') {
    document.getElementById('chatMessages').innerHTML = '';
    document.getElementById('devWallPosts').innerHTML = '';

    const msgs = Social.getChatMessages();
    msgs.slice().reverse().forEach(m => {
      const div = document.createElement('div');
      div.className = 'chat-msg';
      div.innerHTML = `<strong>${m.user}</strong> <span class="chat-time">${this.formatTimeAgo(m.time)}</span><br><span>${m.text}</span>`;
      document.getElementById('chatMessages').appendChild(div);
    });

    const posts = Social.getDevWallPosts();
    posts.slice().reverse().forEach(p => {
      const div = document.createElement('div');
      div.className = 'dev-post';
      div.innerHTML = `<strong>${p.user}</strong> ${'⭐'.repeat(p.rating)} <span class="chat-time">${this.formatTimeAgo(p.time)}</span><br><span>${p.text}</span>`;
      document.getElementById('devWallPosts').appendChild(div);
    });

    this.showTab(tab);
  }

  showTab(tab) {
    document.getElementById('chatTab').classList.toggle('tab-active', tab === 'chat');
    document.getElementById('devTab').classList.toggle('tab-active', tab === 'dev');
    document.getElementById('chatPanel').classList.toggle('hidden', tab !== 'chat');
    document.getElementById('devPanel').classList.toggle('hidden', tab !== 'dev');
  }

  sendChat() {
    const input = document.getElementById('chatInput');
    const result = Social.sendChatMessage(input.value);
    if (result.ok) { input.value = ''; this.populateSocial('chat'); }
    else this.toast(result.error, true);
  }

  postDevWall() {
    const text = document.getElementById('devWallInput');
    const rating = parseInt(document.getElementById('devWallRating').value) || 5;
    const result = Social.postDevWall(text.value, rating);
    if (result.ok) { text.value = ''; this.populateSocial('dev'); }
    else this.toast(result.error, true);
  }

  // === SETTINGS ===
  applySettings() {
    const p = Auth.getProfile();
    if (!p) return;
    const s = p.settings;
    this.audio.setSound(s.soundEnabled);
    this.audio.setMusic(s.musicEnabled);
    this.game.renderer.showGrid = s.showGrid;
    this.game.particles.setEnabled(s.particles);
    this.game.renderer.anim = s.animations;
    this.themeMgr.setTheme(s.theme);
  }

  populateSettingsUI() {
    const p = Auth.getProfile();
    if (!p) return;
    const s = p.settings;
    const set = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.checked = val;
    };
    set('setSound', s.soundEnabled);
    set('setMusic', s.musicEnabled);
    set('setGrid', s.showGrid);
    set('setParticles', s.particles);
    set('setAnim', s.animations);
    set('setTouch', s.touchControls);
    set('setVibrate', s.vibration);

    document.getElementById('settingsUser').textContent = p.username;
    document.getElementById('settingsCoins').textContent = `🪙 ${p.coins}`;
    document.getElementById('settingsLevel').textContent = `Level ${p.currentLevel}`;
  }

  populateThemes() {
    const grid = document.getElementById('themeGrid');
    if (!grid) return;
    grid.innerHTML = '';
    const p = Auth.getProfile();
    const current = p ? p.settings.theme : 'dark';

    this.themeMgr.getOptions().forEach(t => {
      const isUnlocked = t.id === 'dark' || t.id === 'classic' || (p && (p.purchasedItems.includes('theme_' + t.id) || p.settings.theme === t.id));
      const el = document.createElement('div');
      el.className = `theme-option ${t.id === current ? 'active' : ''} ${!isUnlocked ? 'locked' : ''}`;
      el.style.background = `linear-gradient(135deg, ${t.bg}, ${t.accent})`;
      el.title = t.name;
      el.textContent = t.id === current ? '✓' : (!isUnlocked ? '🔒' : '');
      if (isUnlocked) {
        el.onclick = () => {
          if (p) { p.settings.theme = t.id; this.themeMgr.setTheme(t.id); Auth.saveProfile(); }
          grid.querySelectorAll('.theme-option').forEach(o => { o.classList.remove('active'); o.textContent = ''; });
          el.classList.add('active'); el.textContent = '✓';
        };
      }
      grid.appendChild(el);
    });
  }

  // === HELP ===
  showHelp() {
    this.toast('Controls: Arrow keys/WASD to move. Space/P to pause. Swipe on mobile.');
  }

  // === TOAST ===
  toast(msg, isError = false) {
    let t = document.querySelector('.toast');
    if (!t) { t = document.createElement('div'); t.className = 'toast'; document.body.appendChild(t); }
    t.textContent = msg;
    t.style.background = isError ? '#ff4444' : '';
    t.classList.add('show');
    clearTimeout(t._timer);
    t._timer = setTimeout(() => t.classList.remove('show'), 3000);
  }

  resetData() {
    if (confirm('Reset all data? This is permanent!')) {
      Database.resetAll();
      this.toast('All data reset');
      window.location.reload();
    }
  }

  formatTime(s) { const m = Math.floor(s / 60); const sec = s % 60; return `${m}:${sec.toString().padStart(2, '0')}`; }
  formatTimeAgo(ts) { const d = Math.floor((Date.now() - ts) / 1000); if (d < 60) return 'just now'; if (d < 3600) return `${Math.floor(d / 60)}m ago`; return `${Math.floor(d / 3600)}h ago`; }

  init() {
    if (Auth.isLoggedIn()) {
      const p = Auth.getProfile();
      document.getElementById('mainUserBadge').textContent = p.username;
      document.getElementById('mainUserCoins').textContent = `🪙 ${p.coins}`;
    }

    const setup = (id, field) => {
      const el = document.getElementById(id);
      if (!el) return;
      el.addEventListener('change', () => {
        const p = Auth.getProfile();
        if (!p) return;
        if (field === 'soundEnabled') this.audio.setSound(el.checked);
        if (field === 'musicEnabled') this.audio.setMusic(el.checked);
        if (field === 'showGrid') this.game.renderer.showGrid = el.checked;
        if (field === 'particles') this.game.particles.setEnabled(el.checked);
        if (field === 'animations') this.game.renderer.anim = el.checked;
        p.settings[field] = el.checked;
        Auth.saveProfile();
      });
    };
    setup('setSound', 'soundEnabled');
    setup('setMusic', 'musicEnabled');
    setup('setGrid', 'showGrid');
    setup('setParticles', 'particles');
    setup('setAnim', 'animations');
    setup('setTouch', 'touchControls');
    setup('setVibrate', 'vibration');

    document.getElementById('chatInput')?.addEventListener('keydown', (e) => { if (e.key === 'Enter') this.sendChat(); });
    document.getElementById('devWallInput')?.addEventListener('keydown', (e) => { if (e.key === 'Enter') this.postDevWall(); });
    document.getElementById('loginPass')?.addEventListener('keydown', (e) => { if (e.key === 'Enter') this.doLogin(); });
  }
}
