import { execFileSync } from "node:child_process";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

const mds = resolve("node_modules/.bin/mds");
const pages = [
  {input:"content/en/index.mds",theme:"themes/portfolio",output:"en/index.html",canonical:"https://christianrss.github.io/en/",locale:"en_US",alternates:{en:"https://christianrss.github.io/en/","pt-BR":"https://christianrss.github.io/pt/","x-default":"https://christianrss.github.io/"}},
  {input:"content/pt/index.mds",theme:"themes/portfolio",output:"pt/index.html",canonical:"https://christianrss.github.io/pt/",locale:"pt_BR",alternates:{en:"https://christianrss.github.io/en/","pt-BR":"https://christianrss.github.io/pt/","x-default":"https://christianrss.github.io/"}},
  {input:"content/en/resume.mds",theme:"themes/resume",output:"resume/en/index.html",canonical:"https://christianrss.github.io/resume/en/",locale:"en_US",alternates:{en:"https://christianrss.github.io/resume/en/","pt-BR":"https://christianrss.github.io/resume/pt/"}},
  {input:"content/pt/resume.mds",theme:"themes/resume",output:"resume/pt/index.html",canonical:"https://christianrss.github.io/resume/pt/",locale:"pt_BR",alternates:{en:"https://christianrss.github.io/resume/en/","pt-BR":"https://christianrss.github.io/resume/pt/"}}
];

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
  <link rel="canonical" href="https://christianrss.github.io/">
  <link rel="alternate" hreflang="en" href="https://christianrss.github.io/en/">
  <link rel="alternate" hreflang="pt-BR" href="https://christianrss.github.io/pt/">
  <link rel="alternate" hreflang="x-default" href="https://christianrss.github.io/">
  <script>(function(){var langs=navigator.languages&&navigator.languages.length?navigator.languages:[navigator.language||"en"];var pt=langs.some(function(lang){return String(lang).toLowerCase().startsWith("pt")});location.replace(pt?"./pt/":"./en/")}());</script>
  <noscript><meta http-equiv="refresh" content="0; url=./en/"></noscript>
  <style>body{font:16px/1.5 system-ui,sans-serif;max-width:680px;margin:12vh auto;padding:0 24px;color:#171815;background:#f7f7f3}a{color:#174b9b}</style>
</head>
<body>
  <h1>Christian Rafael de Souza Silva</h1>
  <p>Choose a language / Escolha um idioma:</p>
  <p><a href="./en/">English</a> · <a href="./pt/">Português</a></p>
</body>
</html>`;
await writeFile("index.html",router,"utf8");
