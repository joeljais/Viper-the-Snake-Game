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
class Economy {
  static getCoins() {
    const p = Auth.getProfile();
    return p ? p.coins : 0;
  }

  static addCoins(amount) {
    const p = Auth.getProfile();
    if (!p) return false;
    p.coins += amount;
    Auth.saveProfile();
    return true;
  }

  static spendCoins(amount) {
    const p = Auth.getProfile();
    if (!p || p.coins < amount) return false;
    p.coins -= amount;
    Auth.saveProfile();
    return true;
  }

  static purchase(itemId) {
    const cfg = window.SNAKE_CONFIG.store.items;
    const item = cfg.find(i => i.id === itemId);
    if (!item) return { ok: false, error: 'Item not found' };
    const p = Auth.getProfile();
    if (!p) return { ok: false, error: 'Not logged in' };
    if (p.purchasedItems.includes(itemId))
      return { ok: false, error: 'Already owned' };

    if (item.price > 0 && !this.spendCoins(item.price))
      return { ok: false, error: 'Not enough coins' };

    if (item.type === 'theme') {
      if (!p.purchasedItems.includes(itemId)) p.purchasedItems.push(itemId);
    } else if (item.type === 'perk') {
      if (!p.inventory.includes(itemId)) p.inventory.push(itemId);
    } else if (!item.type) {
    }

    if (!p.purchasedItems.includes(itemId)) p.purchasedItems.push(itemId);
    if (item.coins > 0) { p.coins += item.coins; }
    Auth.saveProfile();
    return { ok: true, item };
  }

  static getStoreItems() {
    const p = Auth.getProfile();
    return window.SNAKE_CONFIG.store.items.map(item => ({
      ...item,
      owned: p ? p.purchasedItems.includes(item.id) : false,
      affordable: p ? p.coins >= item.price : false
    }));
  }

  static hasItem(itemId) {
    const p = Auth.getProfile();
    return p ? p.purchasedItems.includes(itemId) || p.inventory.includes(itemId) : false;
  }
}
