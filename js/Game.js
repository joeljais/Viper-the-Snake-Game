class Game {
  constructor(config) {
    this.canvas = config.canvas;
    this.renderer = config.renderer;
    this.input = config.input;
    this.audio = config.audio;
    this.particles = config.particles;
    this.themeMgr = config.themeMgr;
    this.levelMgr = config.levelMgr;
    this.onStateChange = config.onStateChange || (() => {});

    this.gridSize = 15;
    this.level = 1;
    this.state = 'idle';
    this.snake = null;
    this.food = null;
    this.obstacles = [];

    this.score = 0;
    this.foodEaten = 0;
    this.goldenEaten = 0;
    this.elapsed = 0;
    this.moveTimer = 0;
    this.baseInterval = 150;
    this.currentInterval = 150;
    this.speedMultiplier = 1;
    this.scoreMultiplier = 1;
    this.invincible = false;
    this.paused = false;
    this.winScore = 50;
    this.coinsEarned = 0;

    this.dt = 0;
    this.lastTime = 0;
    this.frameId = null;
  }

  start(level) {
    this.level = level;
    this.state = 'playing';
    this.paused = false;

    const cfg = this.levelMgr.getLevelConfig(level);
    this.gridSize = cfg.gridSize;
    this.baseInterval = cfg.speed;
    this.currentInterval = cfg.speed;
    this.winScore = cfg.winScore;
    this.coinsEarned = 0;

    this.speedMultiplier = 1;
    this.scoreMultiplier = 1;
    this.invincible = false;

    this.snake = new Snake(this.gridSize);
    this.food = new Food(this.gridSize);
    this.obstacles = this.levelMgr.generateObstacles(this.snake, this.gridSize, cfg.obstacleCount);

    this.score = 0;
    this.foodEaten = 0;
    this.goldenEaten = 0;
    this.elapsed = 0;
    this.moveTimer = 0;

    this.renderer.resize(this.gridSize);
    this.food.spawn(this.snake, this.obstacles);
    this.input.clearQueue();

    this.audio.init();
    this.audio.startMusic();
    this.lastTime = performance.now();
    this.onStateChange('playing');
    this.frameId = requestAnimationFrame(this.loop.bind(this));
  }

  stop() {
    this.state = 'idle';
    if (this.frameId) { cancelAnimationFrame(this.frameId); this.frameId = null; }
    this.audio.stopMusic();
    this.particles.clear();
  }

  pause() {
    if (this.state !== 'playing') return;
    this.paused = true;
    this.state = 'paused';
    this.onStateChange('paused');
  }

  resume() {
    if (this.state !== 'paused') return;
    this.paused = false;
    this.state = 'playing';
    this.lastTime = performance.now();
    this.onStateChange('playing');
  }

  togglePause() { if (this.paused) this.resume(); else this.pause(); }

  gameOver(reason, won = false) {
    this.state = 'gameover';
    this.audio.death();
    this.audio.stopMusic();
    const head = this.snake.getHead();
    const t = this.themeMgr.getCurrent();
    const cs = this.renderer.cellSize;
    const cx = this.renderer.ox + head.x * cs + cs / 2;
    const cy = this.renderer.oy + head.y * cs + cs / 2;
    this.particles.death(cx, cy, t.snakeHead);

    const profile = Auth.getProfile();
    let rewards = null;
    let levelUp = false;
    let newUnlocks = [];

    if (profile) {
      if (won && this.level >= profile.currentLevel) {
        profile.currentLevel = this.level + 1;
        levelUp = true;
        const r = this.levelMgr.getRewardsForLevel(this.level);
        profile.coins += r.coins;
        this.coinsEarned = r.coins;

        if (r.special) {
          if (r.special.type === 'food_unlock') {
            if (!profile.unlockedFoods.includes(r.special.value)) {
              profile.unlockedFoods.push(r.special.value);
              newUnlocks.push(r.special);
            }
          } else if (r.special.type === 'grid_unlock') {
            const v = parseInt(r.special.value);
            if (!profile.unlockedGrids.includes(v)) {
              profile.unlockedGrids.push(v);
              newUnlocks.push(r.special);
            }
          } else {
            if (!profile.inventory.includes(r.special.id)) {
              profile.inventory.push(r.special.id);
              newUnlocks.push(r.special);
            }
          }
        }
        rewards = r;
      }

      if (!won && this.score > (profile.highScores[`level_${this.level}`] || 0)) {
        profile.highScores[`level_${this.level}`] = this.score;
      }

      profile.stats.gamesPlayed = (profile.stats.gamesPlayed || 0) + 1;
      profile.stats.totalScore = (profile.stats.totalScore || 0) + this.score;
      profile.stats.totalFood = (profile.stats.totalFood || 0) + this.foodEaten;
      if (this.snake.getLength() > (profile.stats.longestSnake || 3))
        profile.stats.longestSnake = this.snake.getLength();
      profile.stats.totalTime = (profile.stats.totalTime || 0) + Math.floor(this.elapsed);
      Auth.saveProfile();
    }

    this.renderFrame();
    this.onStateChange('gameover', {
      score: this.score, length: this.snake.getLength(),
      time: Math.floor(this.elapsed), won,
      level: this.level, reason,
      coinsEarned: this.coinsEarned,
      levelUp, rewards, newUnlocks,
      highScore: profile ? (profile.highScores[`level_${this.level}`] || 0) : 0
    });
  }

  loop(ts) {
    if (this.state === 'idle' || this.state === 'gameover') return;
    this.dt = Math.min((ts - this.lastTime) / 1000, 0.05);
    this.lastTime = ts;

    if (!this.paused) {
      this.elapsed += this.dt;
      this.update();
    }

    this.render();
    this.input.pollGamepad();
    this.frameId = requestAnimationFrame(this.loop.bind(this));
  }

  renderFrame() {
    this.render();
  }

  update() {
    this.currentInterval = this.baseInterval / this.speedMultiplier;
    this.moveTimer += this.dt * 1000;

    const dir = this.input.consumeDirection();
    if (dir) this.snake.setDirection(dir.x, dir.y);

    if (this.moveTimer >= this.currentInterval) {
      this.moveTimer -= this.currentInterval;
      this.tick();
    }
  }

  tick() {
    this.snake.update();

    const head = this.snake.getHead();

    if (head.x < 0 || head.x >= this.gridSize || head.y < 0 || head.y >= this.gridSize) {
      this.snake.body[0] = {
        x: ((head.x % this.gridSize) + this.gridSize) % this.gridSize,
        y: ((head.y % this.gridSize) + this.gridSize) % this.gridSize
      };
    }

    const h = this.snake.getHead();

    if (!this.invincible && this.snake.checkSelfCollision(h)) {
      this.gameOver('Bit yourself!');
      return;
    }

    for (const o of this.obstacles) {
      if (h.x === o.x && h.y === o.y) { this.gameOver('Hit obstacle!'); return; }
    }

    this.checkFood(h);
  }

  checkFood(head) {
    if (head.x === this.food.position.x && head.y === this.food.position.y) {
      this.snake.grow();
      this.foodEaten++;
      const pts = this.food.getPoints() * this.scoreMultiplier;
      this.score += pts;

      if (this.food.type === 'golden') {
        this.goldenEaten++;
        this.audio.golden();
        const cs = this.renderer.cellSize;
        this.particles.golden(this.renderer.ox + head.x * cs + cs / 2, this.renderer.oy + head.y * cs + cs / 2);
      } else {
        this.audio.eat();
        const t = this.themeMgr.getCurrent();
        const cs = this.renderer.cellSize;
        this.particles.burst(this.renderer.ox + head.x * cs + cs / 2, this.renderer.oy + head.y * cs + cs / 2, this.food.getColor(t));
      }

      if (this.score >= this.winScore) {
        this.gameOver('Level Complete!', true);
        return;
      }

      this.food.spawn(this.snake, this.obstacles);
    }
  }

  render() {
    this.renderer.clear();
    this.renderer.grid();
    this.renderer.obstacles(this.obstacles);
    if (this.food) this.renderer.food(this.food, this.dt);
    this.renderer.snake(this.snake, this.invincible);
    this.particles.update(this.dt);
    this.particles.render(this.renderer.ctx);
  }
}
