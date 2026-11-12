import { existsSync } from 'node:fs';
import { cp, mkdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const source = process.env.JIBSALIFE_SOURCE || path.resolve(root, '../jibsalife');
const destination = path.join(root, 'public/jibsalife');
if (!existsSync(path.join(source, 'package.json'))) {
  throw new Error(`집사인생 소스를 찾을 수 없습니다: ${source}. JIBSALIFE_SOURCE로 경로를 지정해 주세요.`);
}
const sourcePackage = JSON.parse(await readFile(path.join(source, 'package.json'), 'utf8'));
if (sourcePackage.name !== 'jibsalife') throw new Error('집사인생 프로젝트 경로를 확인해 주세요.');
const result = spawnSync(process.platform === 'win32' ? 'npm.cmd' : 'npm', ['run', 'build', '--', '--base=/portfolio/jibsalife/'], {
  cwd: source,
  stdio: 'inherit',
  shell: process.platform === 'win32',
  env: { ...process.env, JIBSALIFE_PORTFOLIO_BUILD: '1' },
});
if (result.error) throw result.error;
if (result.status !== 0) process.exit(result.status || 1);
await mkdir(destination, { recursive: true });
await cp(path.join(source, 'dist'), destination, { recursive: true });
console.log('집사인생 앱을 /portfolio/jibsalife/ 경로에 준비했습니다.');
