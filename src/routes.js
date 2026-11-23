const basePath = import.meta.env.BASE_URL.replace(/\/$/, '');

export function withBasePath(path) {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;

  return `${basePath}${normalizedPath}`;
}

export function getArchiveUrl(id, { embedded = false } = {}) {
  return `${withBasePath('/?view=archive')}${embedded ? '&embedded=1' : ''}#${id}`;
}

export function getReelUrl() {
  return withBasePath('/?view=reel');
}

export function getHomeUrl() {
  return withBasePath('/');
}

export function isCurrentPath(pathname, targetPath) {
  const normalize = (value) => value.replace(/\/$/, '') || '/';

  return normalize(pathname) === normalize(withBasePath(targetPath));
}
