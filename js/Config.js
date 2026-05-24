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
window.SNAKE_CONFIG = {
  version: '2.0.0',
  debug: false,

  grid: {
    minSize: 10,
    maxSize: 30,
    defaultSize: 20,
    unlockedAt: { 15: 1, 20: 1, 25: 10, 30: 25 }
  },

  gameplay: {
    baseSpeed: 150,
    minSpeed: 50,
    speedPerLevel: -2,
    speedMultiplier: 1,
    pointsPerFood: 10,
    goldenFoodBonus: 50,
    foodTypes: ['normal', 'golden', 'speed', 'slow', 'rainbow'],
    foodWeights: { normal: 0.55, golden: 0.12, speed: 0.12, slow: 0.12, rainbow: 0.09 },
    foodUnlockedAt: { normal: 1, golden: 5, speed: 10, slow: 15, rainbow: 25 }
  },

  levels: {
    total: 50,
    obstaclesPerLevel: 0,
    obstaclesGrowthPerLevel: 1,
    maxObstaclesPercent: 0.15,
    coinsPerLevel: 25,
    coinsGrowthPerLevel: 5,
    initialCoins: 100,
    winScoreBase: 50,
    winScoreGrowth: 10,
    starsPerLevel: 3
  },

  rewards: {
    specialRewards: {
      5:  { id: 'golden_unlock', name: 'Golden Food Unlocked', type: 'food_unlock', value: 'golden' },
      10: { id: 'speed_unlock', name: 'Speed Food Unlocked', type: 'food_unlock', value: 'speed' },
      15: { id: 'slow_unlock', name: 'Slow Food Unlocked', type: 'food_unlock', value: 'slow' },
      20: { id: 'grid_25', name: '25x25 Grid Unlocked', type: 'grid_unlock', value: '25' },
      25: { id: 'rainbow_unlock', name: 'Rainbow Food Unlocked', type: 'food_unlock', value: 'rainbow' },
      30: { id: 'grid_30', name: '30x30 Grid Unlocked', type: 'grid_unlock', value: '30' },
      35: { id: 'invincible_powerup', name: 'Invincibility Power-Up', type: 'powerup', value: 'invincible' },
      40: { id: 'magnet_powerup', name: 'Magnet Power-Up', type: 'powerup', value: 'magnet' },
      45: { id: 'double_points', name: '2x Points Power-Up', type: 'powerup', value: 'double_points' },
      50: { id: 'master_crown', name: 'Master Crown (Legendary)', type: 'skin', value: 'crown' }
    }
  },

  store: {
    items: [
      { id: 'coin_pack_small', name: 'Small Coin Pack', desc: '+50 coins', price: 0, coins: 50 },
      { id: 'coin_pack_medium', name: 'Medium Coin Pack', desc: '+200 coins', price: 0, coins: 200 },
      { id: 'coin_pack_large', name: 'Large Coin Pack', desc: '+500 coins', price: 0, coins: 500 },
      { id: 'theme_neon', name: 'Neon Theme', desc: 'Cyberpunk neon look', price: 150, coins: 0, type: 'theme', value: 'neon' },
      { id: 'theme_ocean', name: 'Ocean Theme', desc: 'Deep blue ocean', price: 150, coins: 0, type: 'theme', value: 'ocean' },
      { id: 'theme_sunset', name: 'Sunset Theme', desc: 'Warm sunset colors', price: 200, coins: 0, type: 'theme', value: 'sunset' },
      { id: 'theme_candy', name: 'Candy Theme', desc: 'Sweet pink vibes', price: 200, coins: 0, type: 'theme', value: 'candy' },
      { id: 'powerup_start', name: 'Start with Shield', desc: 'Start with invincibility', price: 100, coins: 0, type: 'perk', value: 'start_shield' },
      { id: 'powerup_slow', name: 'Slow Start', desc: '50% slower start speed', price: 80, coins: 0, type: 'perk', value: 'slow_start' }
    ]
  },

  auth: {
    minUsernameLength: 3,
    maxUsernameLength: 20,
    minPasswordLength: 4,
    allowGuestMode: true
  },

  social: {
    maxChatMessages: 100,
    maxDevWallPosts: 100,
    chatCooldown: 3000,
    maxMessageLength: 200
  }
};
