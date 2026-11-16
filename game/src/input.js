import { FIELD } from './config.js';
export function createInput(canvas) {
  const input = { keys: new Set(), pressed: new Set(), mouse: { x: 920, y: 420, down: false }, dash: false };
  window.addEventListener('keydown', e => {
    if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(e.code)) e.preventDefault();
    if (!e.repeat) input.pressed.add(e.code);
    input.keys.add(e.code);
  });
  window.addEventListener('keyup', e => input.keys.delete(e.code));
  function pointer(e) {
    const r = canvas.getBoundingClientRect();
    input.mouse.x = (e.clientX - r.left) * FIELD.width / r.width;
    input.mouse.y = (e.clientY - r.top) * FIELD.height / r.height;
  }
  canvas.addEventListener('pointermove', pointer);
  canvas.addEventListener('pointerdown', e => { pointer(e); if (e.button === 0) input.mouse.down = true; if (e.button === 2) input.dash = true; });
  window.addEventListener('pointerup', e => { if (e.button === 0) input.mouse.down = false; });
  canvas.addEventListener('contextmenu', e => e.preventDefault());
  input.clear = () => { input.keys.clear(); input.pressed.clear(); input.mouse.down = false; input.dash = false; };
  window.addEventListener('blur', input.clear);
  input.endFrame = () => { input.pressed.clear(); input.dash = false; };
  return input;
}
