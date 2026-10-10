import { readFile } from 'node:fs/promises';

const slugs = ['kaduo', 'velis', 'eviz', 'chris-cleaner', 'logv-learn'];
const sourceFiles = [
  'content/en/index.mds', 'content/pt/index.mds',
  'content/en/resume.mds', 'content/pt/resume.mds',
  ...slugs.flatMap(slug => [
    `content/en/projects/${slug}.mds`,
    `content/pt/projects/${slug}.mds`,
  ]),
];

const stockPhrases = [
  /\bArchitecture overview\b/i,
  /\bQuality strategy and evidence\b/i,
  /\bPublic architecture case study\b/i,
  /\bthe public description follows\b/i,
  /\bthis case study (?:therefore )?describes\b/i,
  /\bA (?:sound|responsible) validation (?:program|plan)\b/i,
  /\bVisão geral da arquitetura\b/i,
  /\bDecisões e compromissos\b/i,
  /\bQualidade e evidências disponíveis\b/i,
  /\bEste documento é uma visão\b/i,
  /\bNão são atribuídos números\b/i,
  /\bOs projetos estão organizados pelo tipo\b/i,
];
let errors = [];
const pages = {};
for (const file of sourceFiles) {
  const text = await readFile(file, 'utf8');
  pages[file] = text;
  for (const phrase of stockPhrases) {
    if (phrase.test(text)) errors.push(`${file}: boilerplate editorial pattern ${phrase}`);
  }
  if (/\/projects\//.test(file)) {
    const headings = [...text.matchAll(/^## /gm)].length;
    if (!text.includes('::: case-hero home') || headings < 3 || headings > 5) {
      errors.push(`${file}: case study must have a distinctive title and 3–5 technical sections`);
    }
    if (text.includes('::: hero home')) errors.push(`${file}: generic personal-portrait hero must not appear`);
  }
}
for (const lang of ['en','pt']) {
  const index = pages[`content/${lang}/index.mds`];
  for (const slug of slugs) {
    if (!index.includes(`/projects/${lang}/${slug}/`)) {
      errors.push(`content/${lang}/index.mds: missing product route ${slug}`);
    }
  }
}
if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log('Editorial and page structure checks passed. Manual review remains required.');
