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
