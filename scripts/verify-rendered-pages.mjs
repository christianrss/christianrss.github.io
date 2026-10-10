import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { chromium } from 'playwright';

const slugs = ['kaduo', 'velis', 'eviz', 'chris-cleaner', 'logv-learn'];
const routes = [
  '/en/', '/pt/', '/resume/en/', '/resume/pt/',
  ...slugs.flatMap(slug => [`/projects/en/${slug}/`, `/projects/pt/${slug}/`]),
];
const types = {'.html':'text/html; charset=utf-8','.jpg':'image/jpeg','.css':'text/css','.pdf':'application/pdf'};

const server = createServer(async (request, response) => {
  try {
    const path = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    let file = normalize(path).replace(/^[/\\]+/, '');
    if (!file || file.endsWith('/')) file += 'index.html';
    if (file.includes('..')) { response.writeHead(403).end(); return; }
    const data = await readFile(join(process.cwd(), file));
    response.writeHead(200, {'Content-Type': types[extname(file)] ?? 'application/octet-stream'});
    response.end(data);
  } catch { response.writeHead(404).end('Not found'); }
});
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const port = server.address().port;
let browser;
try {
  browser = await chromium.launch({headless:true});
  const issues = [];
  for (const width of [375, 1280]) {
    const page = await browser.newPage({viewport:{width,height:850}});
    for (const route of routes) {
      const response = await page.goto(`http://127.0.0.1:${port}${route}`, {waitUntil:'load'});
      if (!response?.ok()) { issues.push(`${route}: HTTP ${response?.status()}`); continue; }
      const result = await page.evaluate(() => ({
        overflow: document.documentElement.scrollWidth > window.innerWidth + 2,
        h1: document.querySelectorAll('h1').length,
        portrait: [...document.querySelectorAll('.hero-photo,.resume-photo')].map(img => ({
          complete: img.complete,
          width: img.naturalWidth,
        })),
        duplicateIds: (() => {
          const ids = [...document.querySelectorAll('[id]')].map(e => e.id);
          return ids.length !== new Set(ids).size;
        })(),
      }));
      if (result.overflow) issues.push(`${route} @${width}: horizontal overflow`);
      if (result.h1 !== 1) issues.push(`${route} @${width}: expected one h1, found ${result.h1}`);
      if (result.duplicateIds) issues.push(`${route} @${width}: duplicate element IDs`);
      if (result.portrait.some(img=>!img.complete || !img.width)) issues.push(`${route} @${width}: portrait failed to load`);
      if (route.startsWith('/projects/') && result.portrait.length) issues.push(`${route} @${width}: case note includes personal portrait`);
    }
    await page.close();
  }
  if (issues.length) {
    console.error(issues.join('\n'));
    process.exitCode = 1;
  } else {
    console.log(`Rendered-page smoke test passed: ${routes.length} routes at 375px and 1280px.`);
  }
} finally {
  await browser?.close();
  await new Promise(resolve => server.close(resolve));
}
