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
class LevelManager {
  constructor() {
    this.cfg = window.SNAKE_CONFIG.levels;
  }

  getLevelConfig(level) {
    const config = window.SNAKE_CONFIG;
    const obstacleCount = Math.min(
      this.cfg.obstaclesPerLevel + (level - 1) * this.cfg.obstaclesGrowthPerLevel,
      Math.floor(config.grid.defaultSize * config.grid.defaultSize * this.cfg.maxObstaclesPercent)
    );
    const winScore = this.cfg.winScoreBase + (level - 1) * this.cfg.winScoreGrowth;
    const coinsReward = this.cfg.coinsPerLevel + (level - 1) * this.cfg.coinsGrowthPerLevel;
    const gridSize = this.getGridSizeForLevel(level);

    return {
      level,
      gridSize,
      obstacleCount,
      winScore,
      coinsReward,
      speed: Math.max(config.gameplay.minSpeed, config.gameplay.baseSpeed + (level - 1) * config.gameplay.speedPerLevel)
    };
  }

  getGridSizeForLevel(level) {
    if (level >= 25) return 30;
    if (level >= 15) return 25;
    if (level >= 5) return 20;
    return 15;
  }

  isLevelUnlocked(level) {
    const profile = Auth.getProfile();
    if (!profile) return level === 1;
    return level <= profile.currentLevel;
  }

  getSpecialReward(level) {
    const rewards = window.SNAKE_CONFIG.rewards.specialRewards;
    return rewards[level] || null;
  }

  getRewardsForLevel(level) {
    const cfg = this.getLevelConfig(level);
    const special = this.getSpecialReward(level);
    const rewards = { coins: cfg.coinsReward, special };
    return rewards;
  }

  generateObstacles(snake, gridSize, count) {
    const obstacles = [];
    const occupied = new Set();
    snake.getBody().forEach(s => occupied.add(`${s.x},${s.y}`));
    const head = snake.getHead();
    for (let dx = -2; dx <= 2; dx++) {
      for (let dy = -2; dy <= 2; dy++) {
        occupied.add(`${head.x + dx},${head.y + dy}`);
      }
    }
    let attempts = 0;
    while (obstacles.length < count && attempts < 1000) {
      const pos = { x: Math.floor(Math.random() * gridSize), y: Math.floor(Math.random() * gridSize) };
      if (!occupied.has(`${pos.x},${pos.y}`)) {
        obstacles.push(pos);
        occupied.add(`${pos.x},${pos.y}`);
      }
      attempts++;
    }
    return obstacles;
  }

  getStarRating(score, level) {
    const cfg = this.getLevelConfig(level);
    if (score >= cfg.winScore * 3) return 3;
    if (score >= cfg.winScore * 2) return 2;
    if (score >= cfg.winScore) return 1;
    return 0;
  }
}
