const basePath = import.meta.env.BASE_URL.replace(/\/$/, '');

export function withBasePath(path) {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;

  return `${basePath}${normalizedPath}`;
}

export function getArchiveUrl(id) {
  return `${withBasePath('/?view=archive')}#${id}`;
}

export function getReelUrl() {
  return withBasePath('/?view=reel');
}

export function isCurrentPath(pathname, targetPath) {
  const normalize = (value) => value.replace(/\/$/, '') || '/';

  return normalize(pathname) === normalize(withBasePath(targetPath));
}
