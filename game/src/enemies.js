import { FIELD, ENEMIES, WAVES } from './config.js';
import { burst, floatText } from './particles.js';
export function spawnEnemy(g, type, boss = false, position) {
  const a = g.rng() * Math.PI * 2, base = ENEMIES[type];
  const e = { ...base, type, id: g.nextId++, x: FIELD.x + Math.cos(a) * (FIELD.radius - 15), y: FIELD.y + Math.sin(a) * (FIELD.radius - 15), boss, flash: 0, hitCooldown: 0, lunge: 1 + g.rng(), kx: 0, ky: 0, facing: 0, dead: false };
  e.hp *= (1 + (g.wave - 1) * WAVES.hpScale) * (boss ? WAVES.bossHP : 1); e.maxHp = e.hp;
  e.speed *= 1 + Math.min(2, (g.wave - 1) * WAVES.speedScale);
  if (boss) { e.radius = WAVES.bossRadius; e.score *= 10; e.damage *= 1.5; }
  if (position) Object.assign(e, position);
  g.enemies.push(e); return e;
}
export function damageEnemy(g, e, damage, vx = 0, vy = 0) {
  if (e.dead) return;
  e.hp -= damage; e.flash = .09; e.kx += vx * (e.boss ? .025 : .13); e.ky += vy * (e.boss ? .025 : .13);
  burst(g, e.x, e.y, e.color, 5, 100); g.audio.play('hit');
  if (e.hp <= 0) {
    e.dead = true; burst(g, e.x, e.y, e.color, e.boss ? 45 : 18, 180);
    g.kills++; g.score += e.score; floatText(g, e.x, e.y - e.radius, `+${e.score}`);
    const n = e.boss ? 18 : e.type === 'brute' ? 5 : 2;
    for (let i = 0; i < n; i++) g.shards.push({ x: e.x + (g.rng() - .5) * 35, y: e.y + (g.rng() - .5) * 35, phase: g.rng() * 6.28 });
    // Old uncollected shards merge in value to keep endless runs bounded.
    if (g.shards.length > 450) { const a = g.shards.shift(); g.shards[0].value = (g.shards[0].value || 10) + (a.value || 10); }
  }
}
export function updateEnemies(g, dt) {
  const p = g.player;
  for (const e of g.enemies) {
    if (e.dead) continue;
    e.flash = Math.max(0, e.flash - dt); e.hitCooldown -= dt;
    const dx = p.x - e.x, dy = p.y - e.y, d = Math.hypot(dx, dy) || 1;
    e.facing = Math.atan2(dy, dx); let speed = e.speed;
    if (e.type === 'dart') {
      e.lunge -= dt;
      if (e.lunge < 0) { e.lunge = ENEMIES.dart.lungeEvery; e.lx = dx / d; e.ly = dy / d; }
      if (e.lunge > ENEMIES.dart.lungeEvery - ENEMIES.dart.lungeTime) speed = ENEMIES.dart.lungeSpeed * (e.speed / ENEMIES.dart.speed);
      else if (e.lunge < .35) speed *= .25;
    }
    const lunging = e.type === 'dart' && e.lunge > ENEMIES.dart.lungeEvery - ENEMIES.dart.lungeTime;
    e.x += ((lunging ? e.lx : dx / d) * speed + e.kx) * dt;
    e.y += ((lunging ? e.ly : dy / d) * speed + e.ky) * dt;
    e.kx *= .85; e.ky *= .85;
    if (d < e.radius + p.radius && e.hitCooldown <= 0 && p.invulnerable <= 0) {
      e.hitCooldown = .8; p.hp = Math.max(0, p.hp - e.damage); p.invulnerable = .55; p.flash = .18;
      g.shake = 10; g.audio.play('hurt'); burst(g, p.x, p.y, '#ffab6d', 24, 220);
      e.kx -= dx / d * 190; e.ky -= dy / d * 190;
      if (p.thorns) damageEnemy(g, e, p.thorns);
    }
  }
}
