export function burst(g, x, y, color, count = 12, speed = 150) {
  for (let i = 0; i < count && g.particles.length < 850; i++) {
    const angle = g.rng() * Math.PI * 2, v = speed * (.2 + g.rng());
    const life = .25 + g.rng() * .5;
    g.particles.push({ x, y, vx: Math.cos(angle) * v, vy: Math.sin(angle) * v, life, max: life, size: 1 + g.rng() * 3, color });
  }
}
export function floatText(g, x, y, text, color = '#ffcf85') { g.texts.push({ x, y, text, color, life: 1 }); }
export function updateParticles(g, dt) {
  for (const p of g.particles) { p.life -= dt; p.x += p.vx * dt; p.y += p.vy * dt; p.vx *= .96; p.vy *= .96; }
  g.particles = g.particles.filter(p => p.life > 0);
  for (const t of g.texts) { t.life -= dt; t.y -= 30 * dt; }
  g.texts = g.texts.filter(t => t.life > 0);
}
