import { defineConfig, type Plugin } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import tailwindcss from '@tailwindcss/vite'

// Dev-only middleware that proxies /api/server-lookup to mcstatus.io
// (in production, Vercel's serverless function handles this with SSRF protection)
function devServerLookup(): Plugin {
  return {
    name: 'dev-server-lookup',
    configureServer(server) {
      server.middlewares.use('/api/server-lookup', (req, res) => {
        let body = '';
        req.on('data', (chunk) => { body += chunk.toString(); });
        req.on('end', async () => {
          try {
            const { ip, port } = JSON.parse(body);
            const url = `https://api.mcstatus.io/v2/status/java/${encodeURIComponent(ip)}:${port}`;
            const upstream = await fetch(url);
            const data = await upstream.text();
            res.setHeader('Content-Type', 'application/json');
            res.end(data);
          } catch {
            res.statusCode = 502;
            res.end(JSON.stringify({ error: 'Dev proxy: failed to reach mcstatus.io' }));
          }
        });
      });
    }
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    svelte(),
    tailwindcss(),
    devServerLookup()],
  build: {
    outDir: 'dist', // <-- this is what Vercel expects
  }
})
