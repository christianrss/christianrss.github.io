import { readFile } from 'node:fs/promises';

const slugs = ['kaduo', 'velis', 'eviz', 'chris-cleaner', 'logv-learn'];
const files = ['content/en/index.mds', 'content/pt/index.mds', 'content/en/resume.mds', 'content/pt/resume.mds', 'llms.txt'];
for (const slug of slugs) {
  files.push(`content/en/projects/${slug}.mds`, `content/pt/projects/${slug}.mds`);
}

const forbidden = [
  ['private source file path', /\b(?:backend|frontend|media-server|apps)\/(?:src\/)?[\w.-]+(?:\/[\w.-]+){1,}/i],
  ['private product source URL', /https?:\/\/(?:www\.)?github\.com\/logicvisionai\/(?:kaduo|velis-web|eviz-card|chris-cleaner|logv-learn|christian-software-web)(?:\/|\b)/i],
  ['secret or credential assignment', /\b[A-Z][A-Z0-9_]*(?:SECRET|TOKEN|PASSWORD|API_KEY)\s*=/],
  ['internal address or localhost', /\b(?:localhost|127\.0\.0\.1|10\.\d{1,3}\.\d{1,3}\.\d{1,3}|192\.168\.\d{1,3}\.\d{1,3})\b/i],
  ['implementation or configuration filename', /\b(?:docker-compose\.ya?ml|Server\.xml|\.env(?:\.[\w-]+)?|[\w.-]+\.(?:spec|test)\.(?:ts|tsx|js))\b/i],
  ['unpublished implementation defect identifier', /\bPAYMET_RECEIVED\b/],
  ['internal operating instruction', /\b(?:kubectl|npx prisma migrate|docker compose up)\b/i],
];

let failures = 0;
for (const file of files) {
  const source = await readFile(file, 'utf8');
  for (const [description, pattern] of forbidden) {
    if (pattern.test(source)) {
      console.error(`Public disclosure gate: ${description} in ${file}`);
      failures += 1;
    }
  }
}

if (failures) {
  console.error(`Public disclosure checks failed (${failures}). Perform an editorial review.`);
  process.exit(1);
}

console.log(`Public disclosure checks passed for ${files.length} source files. Human review remains mandatory.`);
