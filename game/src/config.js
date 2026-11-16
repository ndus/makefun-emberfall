export const FIELD = { width: 1440, height: 900, x: 720, y: 470, radius: 365 };
export const STEP = 1 / 60;
export const PLAYER = { radius: 13, speed: 220, hp: 100, dashSpeed: 780, dashTime: .19, dashCooldown: 2.5, magnet: 70 };
export const WEAPON = { damage: 22, interval: .19, speed: 660, life: 1.1, radius: 5, projectiles: 1, pierce: 0 };
export const ENEMIES = {
  chaser: { hp: 38, speed: 67, radius: 17, damage: 12, score: 25, color: '#a58bdf' },
  dart: { hp: 21, speed: 96, radius: 12, damage: 9, score: 35, color: '#6bdbc9', lungeEvery: 2.6, lungeTime: .32, lungeSpeed: 270 },
  brute: { hp: 135, speed: 39, radius: 29, damage: 22, score: 75, color: '#a675dc' },
};
export const WAVES = { base: 7, added: 3, cap: 120, hpScale: .12, speedScale: .025, spawnInterval: .35, bossEvery: 5, bossHP: 7, bossRadius: 48 };
export const UPGRADES = [
  { id: 'damage', icon: '✦', name: 'HEART OF CINDER', tag: 'POWER', text: 'Your fire burns brighter.', effect: '+25% bolt damage', apply: p => p.damage *= 1.25 },
  { id: 'rate', icon: '»', name: 'QUICKENING', tag: 'TEMPO', text: 'A spark becomes a storm.', effect: '18% faster firing', apply: p => p.interval = Math.max(.055, p.interval * .82) },
  { id: 'speed', icon: '↗', name: 'ASH WALKER', tag: 'MOBILITY', text: 'Leave the dark behind.', effect: '+12% movement speed', apply: p => p.speed *= 1.12 },
  { id: 'health', icon: '♡', name: 'SECOND SUN', tag: 'VITALITY', text: 'Keep a little warmth inside.', effect: '+25 max health · heal 40', apply: p => { p.maxHp += 25; p.hp = Math.min(p.maxHp, p.hp + 40); } },
  { id: 'dash', icon: 'ϟ', name: 'FLASHPOINT', tag: 'DASH', text: 'Gone in a flicker of flame.', effect: '20% faster dash recharge', apply: p => p.dashCooldown = Math.max(.65, p.dashCooldown * .8) },
  { id: 'multi', icon: '⋔', name: 'FORKED FLAME', tag: 'MULTISHOT', text: 'One flame. Many endings.', effect: '+1 ember bolt per shot', max: 5, apply: p => p.projectiles++ },
  { id: 'pierce', icon: '⟶', name: 'SUN NEEDLE', tag: 'PIERCING', text: 'Let nothing stop the light.', effect: 'Bolts pierce +1 enemy', apply: p => p.pierce++ },
  { id: 'magnet', icon: '◎', name: 'EMBER CALL', tag: 'COLLECTION', text: 'Lost embers find their way home.', effect: '+55 shard attraction radius', apply: p => p.magnet += 55 },
  { id: 'thorns', icon: '✧', name: 'BURNING VEIL', tag: 'DEFENSE', text: 'Even your wounds carry fire.', effect: '+25 retaliatory contact damage', apply: p => p.thorns += 25 },
];
export function seededRandom(seed = 1) {
  let a = Number(seed) >>> 0;
  return () => { a += 0x6D2B79F5; let t = Math.imul(a ^ a >>> 15, 1 | a); t ^= t + Math.imul(t ^ t >>> 7, 61 | t); return ((t ^ t >>> 14) >>> 0) / 4294967296; };
}
