import { FIELD, PLAYER, WEAPON } from './config.js';
import { burst } from './particles.js';
export function createPlayer() {
  return { ...PLAYER, ...WEAPON, radius: PLAYER.radius, speed: PLAYER.speed, x: FIELD.x, y: FIELD.y, maxHp: PLAYER.hp, angle: -.4, shotTimer: 0, dashTimer: 0, dashLeft: 0, invulnerable: 0, flash: 0, muzzle: 0, thorns: 0, upgrades: {}, dx: 1, dy: 0 };
}
export function shoot(g) {
  const p = g.player;
  for (let i = 0; i < p.projectiles; i++) {
    const a = p.angle + (i - (p.projectiles - 1) / 2) * .16;
    g.bolts.push({ x: p.x + Math.cos(a) * 20, y: p.y + Math.sin(a) * 20, vx: Math.cos(a) * WEAPON.speed, vy: Math.sin(a) * WEAPON.speed, life: WEAPON.life, damage: p.damage, pierce: p.pierce, hits: new Set() });
  }
  p.muzzle = .09; g.audio.play('shoot');
}
export function updatePlayer(g, input, dt) {
  const p = g.player, k = input.keys;
  p.angle = Math.atan2(input.mouse.y - p.y, input.mouse.x - p.x);
  p.dashTimer = Math.max(0, p.dashTimer - dt); p.invulnerable = Math.max(0, p.invulnerable - dt);
  p.flash = Math.max(0, p.flash - dt); p.muzzle = Math.max(0, p.muzzle - dt); p.shotTimer -= dt;
  let x = Number(k.has('KeyD') || k.has('ArrowRight')) - Number(k.has('KeyA') || k.has('ArrowLeft'));
  let y = Number(k.has('KeyS') || k.has('ArrowDown')) - Number(k.has('KeyW') || k.has('ArrowUp'));
  const length = Math.hypot(x, y); if (length) { x /= length; y /= length; }
  if ((input.pressed.has('ShiftLeft') || input.pressed.has('ShiftRight') || input.dash) && p.dashTimer <= 0) {
    p.dx = length ? x : Math.cos(p.angle); p.dy = length ? y : Math.sin(p.angle);
    p.dashLeft = PLAYER.dashTime; p.invulnerable = PLAYER.dashTime + .08; p.dashTimer = p.dashCooldown; g.audio.play('dash');
  }
  if (p.dashLeft > 0) {
    p.dashLeft -= dt; p.x += p.dx * PLAYER.dashSpeed * dt; p.y += p.dy * PLAYER.dashSpeed * dt;
    burst(g, p.x, p.y, '#ff9953', 4, 35);
    g.particles.push({ x: p.x, y: p.y, vx: 0, vy: 0, life: .3, max: .3, size: 12, color: '#ff9b53' });
  } else { p.x += x * p.speed * dt; p.y += y * p.speed * dt; }
  const d = Math.hypot(p.x - FIELD.x, p.y - FIELD.y), limit = FIELD.radius - p.radius - 8;
  if (d > limit) { p.x = FIELD.x + (p.x - FIELD.x) / d * limit; p.y = FIELD.y + (p.y - FIELD.y) / d * limit; }
  if ((input.mouse.down || k.has('Space')) && p.shotTimer <= 0) { shoot(g); p.shotTimer = p.interval; }
}
