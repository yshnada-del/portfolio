// Detect deliberate back-and-forth movement, not ordinary slow model rotation.
export function createShakeTracker() {
  let previous = null;
  let direction = null;
  let distance = 0;
  let lastSpill = -Infinity;
  return {
    start(x, y, time) {
      previous = { x, y, time };
      direction = null;
      distance = 0;
      lastSpill = -Infinity;
    },
    move(x, y, time) {
      if (!previous) return null;
      const dx = x - previous.x;
      const dy = y - previous.y;
      const elapsed = Math.max(8, time - previous.time);
      previous = { x, y, time };
      const length = Math.hypot(dx, dy);
      if (elapsed > 250) { direction = null; distance = 0; return null; }
      if (length < 2) return null;
      const next = { x: dx / length, y: dy / length };
      const reversed = direction && direction.x * next.x + direction.y * next.y < -0.25;
      distance += length;
      const speed = length / elapsed;
      direction = next;
      if (!reversed || speed < 0.28 || distance < 18 || time - lastSpill < 140) return null;
      distance = 0;
      lastSpill = time;
      return { direction: Math.sign(dx || -dy), strength: Math.min(1.8, Math.max(0.45, speed / 0.8)) };
    },
    stop() { previous = null; direction = null; distance = 0; },
  };
}
