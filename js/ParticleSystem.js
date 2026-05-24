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
class Particle {
  constructor(x, y, vx, vy, color, size, life) {
    this.x = x; this.y = y;
    this.vx = vx; this.vy = vy;
    this.color = color;
    this.size = size;
    this.life = life;
    this.maxLife = life;
    this.alive = true;
  }
  update(dt) {
    this.x += this.vx * dt;
    this.y += this.vy * dt;
    this.vy += 120 * dt;
    this.life -= dt;
    if (this.life <= 0) this.alive = false;
  }
}

class ParticleSystem {
  constructor() {
    this.particles = [];
    this.enabled = true;
  }

  setEnabled(v) { this.enabled = v; }

  emit(x, y, count, color, speed = 100, size = 4, life = 0.5) {
    if (!this.enabled) return;
    for (let i = 0; i < count; i++) {
      const a = Math.random() * Math.PI * 2;
      const s = speed * (0.3 + Math.random() * 0.7);
      this.particles.push(new Particle(x, y, Math.cos(a) * s, Math.sin(a) * s - 50, color, size * (0.5 + Math.random() * 0.5), life * (0.5 + Math.random() * 0.5)));
    }
  }

  burst(x, y, color, count = 12) { this.emit(x, y, count, color, 150, 5, 0.6); }
  death(x, y, color) { this.emit(x, y, 30, color, 200, 6, 0.8); }
  golden(x, y) { for (let i = 0; i < 3; i++) setTimeout(() => this.emit(x, y, 8, '#ffd93d', 120, 4, 0.5), i * 80); }
  powerUp(x, y) { this.emit(x, y, 20, '#a855f7', 180, 5, 0.7); }
  levelUp(x, y) { this.emit(x, y, 25, '#ffd93d', 160, 5, 0.6); }
  coinCollect(x, y) { this.emit(x, y, 8, '#ffd700', 100, 3, 0.4); }

  update(dt) {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      this.particles[i].update(dt);
      if (!this.particles[i].alive) this.particles.splice(i, 1);
    }
  }

  render(ctx) {
    for (const p of this.particles) {
      const a = Math.max(0, p.life / p.maxLife);
      ctx.globalAlpha = a;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * a, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  clear() { this.particles = []; }
}
