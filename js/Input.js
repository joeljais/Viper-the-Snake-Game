/* Snake Game — Proprietary License. See LICENSE for full terms. */
class Input {
  constructor() {
    this.directionQueue = [];
    this.onDirection = null;
    this.onPause = null;
    this.onAction = null;
    this.paused = false;

    this.keyState = {};
    this.touchStart = null;
    this.swipeThreshold = 25;
    this.gamepadIndex = null;

    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
    this.handleTouchStart = this.handleTouchStart.bind(this);
    this.handleTouchEnd = this.handleTouchEnd.bind(this);
    this.handleGamepad = this.handleGamepadConnected.bind(this);
    this.handleGamepadDisc = this.handleGamepadDisconnected.bind(this);
  }

  init() {
    document.addEventListener('keydown', this.handleKeyDown);
    document.addEventListener('keyup', this.handleKeyUp);
    document.addEventListener('touchstart', this.handleTouchStart, { passive: false });
    document.addEventListener('touchend', this.handleTouchEnd, { passive: false });
    window.addEventListener('gamepadconnected', this.handleGamepad);
    window.addEventListener('gamepaddisconnected', this.handleGamepadDisc);
    this.bindTouchButtons();
  }

  destroy() {
    document.removeEventListener('keydown', this.handleKeyDown);
    document.removeEventListener('keyup', this.handleKeyUp);
    document.removeEventListener('touchstart', this.handleTouchStart);
    document.removeEventListener('touchend', this.handleTouchEnd);
    window.removeEventListener('gamepadconnected', this.handleGamepad);
    window.removeEventListener('gamepaddisconnected', this.handleGamepadDisc);
  }

  bindTouchButtons() {
    const map = [
      ['btnUp', 0, -1], ['btnDown', 0, 1],
      ['btnLeft', -1, 0], ['btnRight', 1, 0]
    ];
    map.forEach(([id, dx, dy]) => {
      const el = document.getElementById(id);
      if (!el) return;
      const handler = (e) => { e.preventDefault(); this.queueDirection(dx, dy); };
      el.addEventListener('touchstart', handler, { passive: false });
      el.addEventListener('mousedown', handler);
    });
    const pb = document.getElementById('btnPause');
    if (pb) {
      pb.addEventListener('touchstart', (e) => { e.preventDefault(); if (this.onPause) this.onPause(); }, { passive: false });
      pb.addEventListener('mousedown', () => { if (this.onPause) this.onPause(); });
    }
  }

  handleKeyDown(e) {
    if (e.repeat) return;
    this.keyState[e.key] = true;

    const map = {
      'ArrowUp': [0, -1], 'w': [0, -1], 'W': [0, -1],
      'ArrowDown': [0, 1], 's': [0, 1], 'S': [0, 1],
      'ArrowLeft': [-1, 0], 'a': [-1, 0], 'A': [-1, 0],
      'ArrowRight': [1, 0], 'd': [1, 0], 'D': [1, 0],
    };

    if (map[e.key]) {
      e.preventDefault();
      this.queueDirection(map[e.key][0], map[e.key][1]);
    }

    if (e.key === ' ' || e.key === 'p' || e.key === 'P' || e.key === 'Escape') {
      e.preventDefault();
      if (this.onPause) this.onPause();
    }
  }

  handleKeyUp(e) {
    this.keyState[e.key] = false;
  }

  handleTouchStart(e) {
    const t = e.touches[0];
    this.touchStart = { x: t.clientX, y: t.clientY };
  }

  handleTouchEnd(e) {
    if (!this.touchStart) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - this.touchStart.x;
    const dy = t.clientY - this.touchStart.y;
    const adx = Math.abs(dx), ady = Math.abs(dy);

    if (Math.max(adx, ady) < this.swipeThreshold) {
      if (this.onPause) this.onPause();
    } else if (adx > ady) {
      this.queueDirection(dx > 0 ? 1 : -1, 0);
    } else {
      this.queueDirection(0, dy > 0 ? 1 : -1);
    }
    this.touchStart = null;
  }

  handleGamepadConnected(e) { this.gamepadIndex = e.gamepad.index; }
  handleGamepadDisconnected() { this.gamepadIndex = null; }

  pollGamepad() {
    if (this.gamepadIndex === null) return;
    const gp = navigator.getGamepads()[this.gamepadIndex];
    if (!gp) return;
    if (gp.buttons[9]?.pressed && this.onPause) this.onPause();
    const ax = gp.axes[0], ay = gp.axes[1];
    const t = 0.5;
    if (ax < -t) this.queueDirection(-1, 0);
    else if (ax > t) this.queueDirection(1, 0);
    else if (ay < -t) this.queueDirection(0, -1);
    else if (ay > t) this.queueDirection(0, 1);
    else {
      if (gp.buttons[14]?.pressed) this.queueDirection(-1, 0);
      else if (gp.buttons[15]?.pressed) this.queueDirection(1, 0);
      else if (gp.buttons[12]?.pressed) this.queueDirection(0, -1);
      else if (gp.buttons[13]?.pressed) this.queueDirection(0, 1);
    }
  }

  queueDirection(x, y) {
    if (this.directionQueue.length >= 3) return;
    const last = this.directionQueue[this.directionQueue.length - 1];
    if (last && last.x === x && last.y === y) return;
    if (last && last.x === -x && last.y === -y) return;
    if (!last) {
      if (this.onDirection) this.onDirection(x, y);
    }
    this.directionQueue.push({ x, y });
  }

  consumeDirection() {
    if (this.directionQueue.length > 0) {
      return this.directionQueue.shift();
    }
    return null;
  }

  clearQueue() {
    this.directionQueue = [];
  }
}
