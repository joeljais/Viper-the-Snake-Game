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
class Social {
  static MESSAGES_KEY = 'chat_messages';
  static WALL_KEY = 'dev_wall_posts';

  static sendChatMessage(text) {
    const p = Auth.getProfile();
    if (!p) return { ok: false, error: 'Login required' };
    const cfg = window.SNAKE_CONFIG.social;
    if (!text.trim()) return { ok: false, error: 'Empty message' };
    if (text.length > cfg.maxMessageLength)
      return { ok: false, error: `Max ${cfg.maxMessageLength} characters` };

    const msg = { user: p.username, text: this.sanitize(text.trim()), time: Date.now() };
    const msgs = this.getChatMessages();
    msgs.push(msg);
    if (msgs.length > cfg.maxChatMessages) msgs.splice(0, msgs.length - cfg.maxChatMessages);
    Database.set(this.MESSAGES_KEY, msgs);
    return { ok: true };
  }

  static getChatMessages() { return Database.get(this.MESSAGES_KEY, []); }

  static postDevWall(text, rating = 5) {
    const p = Auth.getProfile();
    if (!p) return { ok: false, error: 'Login required' };
    const cfg = window.SNAKE_CONFIG.social;
    if (!text.trim()) return { ok: false, error: 'Empty message' };
    if (text.length > cfg.maxMessageLength)
      return { ok: false, error: `Max ${cfg.maxMessageLength} characters` };

    const post = { user: p.username, text: this.sanitize(text.trim()), rating: Math.max(1, Math.min(5, rating)), time: Date.now() };
    const posts = this.getDevWallPosts();
    posts.push(post);
    if (posts.length > cfg.maxDevWallPosts) posts.splice(0, posts.length - cfg.maxDevWallPosts);
    Database.set(this.WALL_KEY, posts);
    return { ok: true };
  }

  static getDevWallPosts() { return Database.get(this.WALL_KEY, []); }

  static sanitize(str) {
    const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#x27;' };
    return str.replace(/[&<>"']/g, m => map[m]);
  }
}
