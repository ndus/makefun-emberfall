import { FIELD } from './config.js';
import { spawnEnemy, damageEnemy } from './enemies.js';
import { beginWave } from './waves.js';
import { shoot } from './player.js';
import { burst, updateParticles } from './particles.js';
// Frozen, seeded real-world arrangements: screenshot timing never changes the frame.
export function stageShot(g, name, reset, openUpgrade) {
  if (name === 'start') return;
  reset(); beginWave(g, name === 'end' ? 8 : 3);
  g.queue = []; g.enemies = []; g.waveBanner = 0; g.time = 12;
  for (let i = 0; i < 23; i++) {
    const a = g.rng() * Math.PI * 2, radius = 130 + g.rng() * 180;
    spawnEnemy(g, i % 7 === 0 ? 'brute' : i % 3 === 0 ? 'dart' : 'chaser', false, { x: FIELD.x + Math.cos(a) * radius, y: FIELD.y + Math.sin(a) * radius });
  }
  // Actual deaths yield the same shards, score text, and sparks as play.
  for (const e of g.enemies.slice(0, 6)) damageEnemy(g, e, 10000);
  g.enemies = g.enemies.filter(e => !e.dead);
  g.score += 1525; g.player.hp = 63; g.player.x = 690; g.player.y = 487; g.player.angle = -.55;
  for (let i = 0; i < 5; i++) { shoot(g); const b = g.bolts.at(-1); b.x += b.vx * i * .08; b.y += b.vy * i * .08; }
  burst(g, g.player.x - 25, g.player.y + 10, '#ffad58', 32, 200); updateParticles(g, .12);
  if (name === 'upgrade') { g.enemies = []; g.bolts = []; openUpgrade(); }
  if (name === 'end') { g.state = 'gameover'; g.player.hp = 0; g.score = 12860; g.best = Math.max(g.best, g.score); }
  g.staged = true;
}
