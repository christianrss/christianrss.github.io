import { execFileSync } from "node:child_process";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

const mds = resolve("node_modules/.bin/mds");
const pages = [
  {input:"content/en/index.mds",theme:"themes/portfolio",output:"en/index.html",canonical:"https://me.christiansoftware.org/en/",locale:"en_US",alternates:{en:"https://me.christiansoftware.org/en/","pt-BR":"https://me.christiansoftware.org/pt/","x-default":"https://me.christiansoftware.org/"}},
  {input:"content/pt/index.mds",theme:"themes/portfolio",output:"pt/index.html",canonical:"https://me.christiansoftware.org/pt/",locale:"pt_BR",alternates:{en:"https://me.christiansoftware.org/en/","pt-BR":"https://me.christiansoftware.org/pt/","x-default":"https://me.christiansoftware.org/"}},
  {input:"content/en/resume.mds",theme:"themes/resume",output:"resume/en/index.html",canonical:"https://me.christiansoftware.org/resume/en/",locale:"en_US",alternates:{en:"https://me.christiansoftware.org/resume/en/","pt-BR":"https://me.christiansoftware.org/resume/pt/"}},
  {input:"content/pt/resume.mds",theme:"themes/resume",output:"resume/pt/index.html",canonical:"https://me.christiansoftware.org/resume/pt/",locale:"pt_BR",alternates:{en:"https://me.christiansoftware.org/resume/en/","pt-BR":"https://me.christiansoftware.org/resume/pt/"}}
];

// Long-form product engineering case studies share the portfolio theme and SEO contract.
const caseStudySlugs = ["kaduo", "velis", "eviz", "chris-cleaner", "logv-learn"];
for (const slug of caseStudySlugs) {
  const enUrl = `https://me.christiansoftware.org/projects/en/${slug}/`;
  const ptUrl = `https://me.christiansoftware.org/projects/pt/${slug}/`;
  const alternates = {en: enUrl, "pt-BR": ptUrl};
  pages.push(
    {
      input: `content/en/projects/${slug}.mds`,
      theme: "themes/portfolio",
      output: `projects/en/${slug}/index.html`,
      canonical: enUrl,
      locale: "en_US",
      alternates,
    },
    {
      input: `content/pt/projects/${slug}.mds`,
      theme: "themes/portfolio",
      output: `projects/pt/${slug}/index.html`,
      canonical: ptUrl,
      locale: "pt_BR",
      alternates,
    },
  );
}

for (const page of pages) {
  await mkdir(dirname(page.output), {recursive:true});
  execFileSync(mds,["build",page.input,"--theme",resolve(page.theme),"--output",page.output],{stdio:"inherit"});
  let html=await readFile(page.output,"utf8");
  const alternateTags=Object.entries(page.alternates).map(([lang,href])=>`<link rel="alternate" hreflang="${lang}" href="${href}">`).join("\n  ");
  const seo=`<link rel="canonical" href="${page.canonical}">
  ${alternateTags}
  <meta property="og:type" content="website">
  <meta property="og:url" content="${page.canonical}">
  <meta property="og:locale" content="${page.locale}">
  <meta name="twitter:card" content="summary">
  <meta name="generator" content="MDS">`;
  html=html.replace("<!-- SEO_INJECTION -->",seo);
  await writeFile(page.output,html,"utf8");
}

const router=`<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Christian Rafael de Souza Silva</title>
  <meta name="description" content="Software engineer working across ML systems, AI infrastructure and systems software.">
  <meta name="robots" content="index,follow">
  <link rel="canonical" href="https://me.christiansoftware.org/">
  <link rel="alternate" hreflang="en" href="https://me.christiansoftware.org/en/">
  <link rel="alternate" hreflang="pt-BR" href="https://me.christiansoftware.org/pt/">
  <link rel="alternate" hreflang="x-default" href="https://me.christiansoftware.org/">
  <script>(function(){var langs=navigator.languages&&navigator.languages.length?navigator.languages:[navigator.language||"en"];var pt=langs.some(function(lang){return String(lang).toLowerCase().startsWith("pt")});location.replace(pt?"./pt/":"./en/")}());</script>
  <noscript><meta http-equiv="refresh" content="0; url=./en/"></noscript>
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-YJZ32MBJRQ"></script>
  <script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','G-YJZ32MBJRQ');</script>
  <style>body{font:16px/1.55 Georgia,"Times New Roman",serif;max-width:760px;margin:10vh auto;padding:0 22px;color:#171713;background:#fbfbf8}h1{font-size:32px;line-height:1.08}a{color:#0645ad}p{max-width:620px}</style>
</head>
<body>
  <h1>Christian Rafael de Souza Silva</h1>
  <p>Choose a language / Escolha um idioma:</p>
  <p><a href="./en/">English</a> · <a href="./pt/">Português</a></p>
</body>
</html>`;
await writeFile("index.html",router,"utf8");
