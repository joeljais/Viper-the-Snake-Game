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
class Database {
  static PREFIX = 'snake2_';

  static get(key, fallback = null) {
    try {
      const v = localStorage.getItem(this.PREFIX + key);
      return v !== null ? JSON.parse(v) : fallback;
    } catch { return fallback; }
  }

  static set(key, value) {
    try { localStorage.setItem(this.PREFIX + key, JSON.stringify(value)); return true; }
    catch { return false; }
  }

  static remove(key) {
    try { localStorage.removeItem(this.PREFIX + key); } catch {}
  }

  static getAllKeys() {
    return Object.keys(localStorage).filter(k => k.startsWith(this.PREFIX));
  }

  static resetAll() {
    this.getAllKeys().forEach(k => localStorage.removeItem(k));
  }
}

class Auth {
  static USERS_KEY = 'users_index';

  static hashPassword(password) {
    let hash = 5381;
    for (let i = 0; i < password.length; i++) {
      hash = ((hash << 5) + hash) + password.charCodeAt(i);
      hash = hash & hash;
    }
    return 'h_' + Math.abs(hash).toString(36);
  }

  static getUsers() {
    return Database.get(this.USERS_KEY, {});
  }

  static saveUsers(users) {
    Database.set(this.USERS_KEY, users);
  }

  static register(username, password) {
    const cfg = window.SNAKE_CONFIG.auth;
    if (username.length < cfg.minUsernameLength || username.length > cfg.maxUsernameLength)
      return { ok: false, error: `Username must be ${cfg.minUsernameLength}-${cfg.maxUsernameLength} characters` };
    if (password.length < cfg.minPasswordLength)
      return { ok: false, error: `Password must be at least ${cfg.minPasswordLength} characters` };
    if (!/^[a-zA-Z0-9_]+$/.test(username))
      return { ok: false, error: 'Username can only contain letters, numbers, underscores' };

    const users = this.getUsers();
    if (users[username.toLowerCase()])
      return { ok: false, error: 'Username already taken' };

    users[username.toLowerCase()] = { pwd: this.hashPassword(password), created: Date.now() };
    this.saveUsers(users);
    this.createProfile(username);
    return { ok: true };
  }

  static login(username, password) {
    const users = this.getUsers();
    const key = username.toLowerCase();
    if (!users[key]) return { ok: false, error: 'User not found' };
    if (users[key].pwd !== this.hashPassword(password))
      return { ok: false, error: 'Wrong password' };
    this.loadProfile(username);
    return { ok: true };
  }

  static userExists(username) {
    const users = this.getUsers();
    return !!users[username.toLowerCase()];
  }

  static getProfileKey(username) {
    return 'profile_' + username.toLowerCase();
  }

  static createProfile(username) {
    const key = this.getProfileKey(username);
    if (Database.get(key)) return;
    const cfg = window.SNAKE_CONFIG;
    Database.set(key, {
      username,
      coins: cfg.levels.initialCoins,
      currentLevel: 1,
      highScores: {},
      unlockedFoods: ['normal'],
      unlockedGrids: [15, 20],
      inventory: [],
      purchasedItems: [],
      stats: { gamesPlayed: 0, totalScore: 0, totalFood: 0, longestSnake: 3, totalTime: 0 },
      settings: {
        theme: 'dark', soundEnabled: true, musicEnabled: true,
        showGrid: true, particles: true, animations: true,
        touchControls: true, vibration: true
      },
      tutorialDone: false,
      created: Date.now()
    });
  }

  static loadProfile(username) {
    const key = this.getProfileKey(username);
    const profile = Database.get(key);
    if (profile) window._profile = profile;
  }

  static saveProfile() {
    const p = window._profile;
    if (!p) return;
    Database.set(this.getProfileKey(p.username), p);
  }

  static getProfile() {
    return window._profile || null;
  }

  static isLoggedIn() {
    return !!window._profile;
  }

  static logout() {
    if (window._profile) this.saveProfile();
    window._profile = null;
  }
}
