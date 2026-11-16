import { WAVES } from './config.js';
import { spawnEnemy } from './enemies.js';
export function beginWave(g, number = g.wave + 1) {
  g.wave = number; g.spawnTimer = 0; g.waveBanner = 2.8; g.clearTimer = .8;
  const count = Math.min(WAVES.cap, WAVES.base + number * WAVES.added);
  g.queue = Array.from({ length: count }, (_, i) => ({ type: number >= 3 && i % 7 === 0 ? 'brute' : number >= 2 && i % 3 === 0 ? 'dart' : 'chaser', boss: false }));
  if (number % WAVES.bossEvery === 0) g.queue.push({ type: 'brute', boss: true });
  g.audio.play('wave');
}
export function updateWaves(g, dt, onClear) {
  g.waveBanner = Math.max(0, g.waveBanner - dt);
  g.spawnTimer -= dt;
  if (g.queue.length && g.spawnTimer <= 0) { const next = g.queue.shift(); spawnEnemy(g, next.type, next.boss); g.spawnTimer = WAVES.spawnInterval / (1 + g.wave * .08); }
  if (!g.queue.length && !g.enemies.some(e => !e.dead)) { g.clearTimer -= dt; if (g.clearTimer <= 0) onClear(); }
}
