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
    const headings = [...text.matchAll(/^## (.+)$/gm)].map(m => m[1]);
    const lang = file.includes('/pt/') ? 'pt' : 'en';
    const expected = lang === 'pt' ? ['Arquitetura', 'Tecnologias'] : ['Architecture', 'Technologies'];
    if (!text.includes('::: case-hero home') || JSON.stringify(headings) !== JSON.stringify(expected)) {
      errors.push(`${file}: only architecture and technologies sections are permitted`);
    }
    if (text.includes('::: hero home')) errors.push(`${file}: generic personal-portrait hero must not appear`);
    if (/\b(?:tests?|testing|verification|evidence|recommendations?|alternatives?|limitations?|benchmarks?|reliability|considerations?|trade-offs)\b/i.test(text) ||
        /\b(?:testes?|testagem|verificação|evidências?|recomendações?|alternativas?|limitações?|confiabilidade|considerações?|compromissos|validação)\b/i.test(text)) {
      errors.push(`${file}: non-architectural editorial commentary must not appear`);
    }
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
