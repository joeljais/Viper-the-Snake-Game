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
class Food {
  constructor(gridSize) {
    this.gridSize = gridSize;
    this.position = { x: 0, y: 0 };
    this.type = 'normal';
    this.types = ['normal', 'golden', 'speed', 'slow', 'rainbow'];
    this.weights = { normal: 0.55, golden: 0.12, speed: 0.12, slow: 0.12, rainbow: 0.09 };
  }

  spawn(snake, obstacles = []) {
    const occupied = new Set();
    snake.getBody().forEach(s => occupied.add(`${s.x},${s.y}`));
    obstacles.forEach(o => occupied.add(`${o.x},${o.y}`));

    const empty = [];
    for (let x = 0; x < this.gridSize; x++) {
      for (let y = 0; y < this.gridSize; y++) {
        if (!occupied.has(`${x},${y}`)) empty.push({ x, y });
      }
    }
    if (empty.length === 0) return;
    this.position = empty[Math.floor(Math.random() * empty.length)];
    this.type = this.selectType();
  }

  selectType() {
    const profile = Auth.getProfile();
    const unlocked = profile ? profile.unlockedFoods : ['normal'];
    const r = Math.random();
    const available = this.types.filter(t => unlocked.includes(t));
    const weights = {};
    available.forEach(t => { weights[t] = this.weights[t] || 0.1; });
    const total = Object.values(weights).reduce((a, b) => a + b, 0);
    let cum = 0;
    for (const t of available) {
      cum += (weights[t] || 0.1) / total;
      if (r < cum) return t;
    }
    return 'normal';
  }

  getPoints() {
    const cfg = window.SNAKE_CONFIG.gameplay;
    switch (this.type) {
      case 'golden': return cfg.goldenFoodBonus;
      case 'speed': return 15;
      case 'slow': return 15;
      case 'rainbow': return 100;
      default: return cfg.pointsPerFood;
    }
  }

  getColor(theme) {
    switch (this.type) {
      case 'golden': return theme.golden;
      case 'speed': return theme.speed;
      case 'slow': return theme.slow;
      case 'rainbow': return `hsl(${(Date.now() * 0.1) % 360}, 100%, 60%)`;
      default: return theme.food;
    }
  }

  isSpecial() { return this.type !== 'normal'; }
}
