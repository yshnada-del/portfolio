import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react(), {
    name: 'jibsalife-entry',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = new URL(req.url, 'http://localhost');
        const app = ['/portfolio/jibsalife', '/portfolio/matmut'].find(path => url.pathname === path || url.pathname === `${path}/`);
        if (app) {
          res.writeHead(302, { Location: `${app}/index.html${url.search}` });
          res.end();
          return;
        }
        next();
      });
    },
  }],
  base: '/portfolio/',
});
