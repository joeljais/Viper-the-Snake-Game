class Renderer {
  constructor(canvas, themeMgr) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.theme = themeMgr;
    this.cellSize = 0;
    this.ox = 0; this.oy = 0;
    this.gridSize = 20;
    this.showGrid = true;
    this.anim = true;
    this.pulse = 0;
  }

  resize(gs) {
    this.gridSize = gs;
    const parent = this.canvas.parentElement;
    const w = parent.clientWidth, h = parent.clientHeight;
    const dpr = window.devicePixelRatio || 1;
    const maxDim = Math.min(w, h);
    const avail = maxDim * 0.92;
    this.cellSize = Math.floor(avail / gs);
    const total = this.cellSize * gs;
    this.ox = Math.floor((w - total) / 2);
    this.oy = Math.floor((h - total) / 2) - 20;
    this.canvas.width = w * dpr;
    this.canvas.height = h * dpr;
    this.canvas.style.width = w + 'px';
    this.canvas.style.height = h + 'px';
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  clear() {
    const t = this.theme.getCurrent();
    this.ctx.fillStyle = t.bg;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  grid() {
    if (!this.showGrid) return;
    const t = this.theme.getCurrent();
    const { ctx, ox, oy, cellSize: cs, gridSize: gs } = this;
    ctx.fillStyle = t.grid;
    ctx.fillRect(ox, oy, cs * gs, cs * gs);
    ctx.strokeStyle = t.gridLine;
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= gs; i++) {
      const x = ox + i * cs;
      ctx.beginPath(); ctx.moveTo(x, oy); ctx.lineTo(x, oy + cs * gs); ctx.stroke();
    }
    for (let i = 0; i <= gs; i++) {
      const y = oy + i * cs;
      ctx.beginPath(); ctx.moveTo(ox, y); ctx.lineTo(ox + cs * gs, y); ctx.stroke();
    }
  }

  snake(snake, invincible) {
    const t = this.theme.getCurrent();
    const body = snake.getBody();
    const { ctx, ox, oy, cellSize: cs } = this;
    for (let i = body.length - 1; i >= 0; i--) {
      const seg = body[i];
      if (seg.x < 0 || seg.x >= this.gridSize || seg.y < 0 || seg.y >= this.gridSize) continue;
      const x = ox + seg.x * cs, y = oy + seg.y * cs;
      const isHead = i === 0;
      const ratio = 1 - (i / body.length) * 0.5;
      if (isHead) {
        ctx.fillStyle = invincible
          ? `rgba(255,255,255,${0.6 + Math.sin(Date.now() * 0.01) * 0.3})`
          : t.snakeHead;
        this.rr(x + 2, y + 2, cs - 4, cs - 4, cs * 0.25);
        const cx = x + cs / 2, cy = y + cs / 2;
        ctx.fillStyle = '#000';
        const eo = cs * 0.2, es = cs * 0.08;
        const d = snake.direction;
        const e1x = cx + d.x * eo - d.y * eo;
        const e1y = cy + d.y * eo + d.x * eo;
        const e2x = cx + d.x * eo + d.y * eo;
        const e2y = cy + d.y * eo - d.x * eo;
        ctx.beginPath(); ctx.arc(e1x, e1y, es, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(e2x, e2y, es, 0, Math.PI * 2); ctx.fill();
      } else {
        ctx.globalAlpha = 0.4 + ratio * 0.6;
        ctx.fillStyle = t.snakeBody;
        this.rr(x + 3, y + 3, cs - 6, cs - 6, cs * 0.18);
        ctx.globalAlpha = 1;
      }
    }
  }

  food(food, dt) {
    if (!food.position) return;
    const { ctx, ox, oy, cellSize: cs } = this;
    const x = ox + food.position.x * cs, y = oy + food.position.y * cs;
    const color = food.getColor(this.theme.getCurrent());
    this.pulse += dt * 3;
    const p = Math.sin(this.pulse) * 0.15 + 1;
    const cx = x + cs / 2, cy = y + cs / 2;
    if (food.isSpecial()) { ctx.shadowColor = color; ctx.shadowBlur = 15; }
    ctx.fillStyle = color;
    ctx.beginPath(); ctx.arc(cx, cy, (cs / 2) * p * 0.7, 0, Math.PI * 2); ctx.fill();
    if (food.type === 'golden') {
      ctx.fillStyle = 'rgba(255,255,255,0.3)';
      ctx.beginPath();
      ctx.arc(cx - (cs / 2) * p * 0.15, cy - (cs / 2) * p * 0.15, (cs / 2) * p * 0.25, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.shadowBlur = 0;
  }

  obstacles(obs) {
    const t = this.theme.getCurrent();
    const { ctx, ox, oy, cellSize: cs } = this;
    for (const o of obs) {
      const x = ox + o.x * cs, y = oy + o.y * cs;
      ctx.fillStyle = t.obstacle;
      ctx.fillRect(x + 1, y + 1, cs - 2, cs - 2);
      ctx.strokeStyle = t.wall; ctx.lineWidth = 1;
      ctx.strokeRect(x + 1, y + 1, cs - 2, cs - 2);
    }
  }

  rr(x, y, w, h, r) {
    const { ctx } = this;
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath(); ctx.fill();
  }
}
