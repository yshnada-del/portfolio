// The background's ceiling bows down at the centre; its skirting bows up.
// Project each live frame onto that same recessed wall.
export function createCinemaSurface(width, height, viewportHeight) {
  const upperSag = Math.min(viewportHeight * 0.052, width * 0.035, height * 0.12);
  const lowerSag = Math.min(viewportHeight * 0.016, width * 0.012, height * 0.05);
  const angle = 0.35;
  return (x, y) => {
    const horizontal = (x - width / 2) / (width / 2);
    const depth = Math.max(0, 1 - horizontal * horizontal);
    return {
      x: width / 2 + width / 2 * Math.tan(horizontal * angle) / Math.tan(angle),
      y: y + depth * (upperSag * (1 - y / height) - lowerSag * y / height),
    };
  };
}

// Map a real HTML rectangle to the four projected corners, retaining its links,
// focus outlines, text, and existing admission animation.
export function rectangleToQuad(width, height, [p0, p1, p2, p3]) {
  const dx1 = p1.x - p2.x;
  const dx2 = p3.x - p2.x;
  const dx3 = p0.x - p1.x + p2.x - p3.x;
  const dy1 = p1.y - p2.y;
  const dy2 = p3.y - p2.y;
  const dy3 = p0.y - p1.y + p2.y - p3.y;
  const determinant = dx1 * dy2 - dx2 * dy1;
  const g = Math.abs(determinant) < 1e-8 ? 0 : (dx3 * dy2 - dx2 * dy3) / determinant;
  const h = Math.abs(determinant) < 1e-8 ? 0 : (dx1 * dy3 - dx3 * dy1) / determinant;
  return [
    (p1.x - p0.x + g * p1.x) / width, (p1.y - p0.y + g * p1.y) / width, 0, g / width,
    (p3.x - p0.x + h * p3.x) / height, (p3.y - p0.y + h * p3.y) / height, 0, h / height,
    0, 0, 1, 0,
    p0.x, p0.y, 0, 1,
  ];
}

