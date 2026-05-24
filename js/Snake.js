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
class Snake {
  constructor(gridSize) {
    this.gridSize = gridSize;
    this.reset();
  }

  reset() {
    const mid = Math.floor(this.gridSize / 2);
    this.body = [
      { x: mid, y: mid },
      { x: mid - 1, y: mid },
      { x: mid - 2, y: mid }
    ];
    this.direction = { x: 1, y: 0 };
    this.nextDirection = { x: 1, y: 0 };
    this.growing = false;
    this.alive = true;
  }

  setDirection(x, y) {
    if (x === -this.direction.x && y === -this.direction.y) return;
    if (x === this.direction.x && y === this.direction.y) return;
    this.nextDirection = { x, y };
  }

  update() {
    if (!this.alive) return;
    this.direction = { ...this.nextDirection };
    const head = this.body[0];
    const newHead = {
      x: head.x + this.direction.x,
      y: head.y + this.direction.y
    };

    this.body.unshift(newHead);
    if (this.growing) {
      this.growing = false;
    } else {
      this.body.pop();
    }
  }

  wrapPosition(pos) {
    const g = this.gridSize;
    return {
      x: ((pos.x % g) + g) % g,
      y: ((pos.y % g) + g) % g
    };
  }

  checkSelfCollision(head) {
    return this.body.slice(1).some(s => s.x === head.x && s.y === head.y);
  }

  checkWallCollision(head) {
    return head.x < 0 || head.x >= this.gridSize || head.y < 0 || head.y >= this.gridSize;
  }

  grow() { this.growing = true; }

  getHead() { return this.body[0]; }
  getBody() { return this.body; }
  getLength() { return this.body.length; }

  occupies(x, y) {
    return this.body.some(s => s.x === x && s.y === y);
  }
}
