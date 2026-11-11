export function getArchiveFrameLayout({ width, height }) {
  // Media queries must use the space available inside the film, not an enlarged artboard.
  return { width, height, scale: 1 };
}
