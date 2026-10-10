# christianrss.github.io

Personal technical website and professional résumé for Christian Rafael de Souza Silva.

Production: https://me.christiansoftware.org/

The site is authored in [MDS](https://github.com/ziyu/mds), compiled to static HTML, and published with GitHub Pages. English and Portuguese are first-class content variants.

## Information architecture

- `/en/` — English portfolio.
- `/pt/` — Portuguese portfolio.
- `/resume/en/` — print-oriented English résumé.
- `/resume/pt/` — print-oriented Portuguese résumé.
- `/resume/christian-rafael-cv-en.pdf` — generated English PDF.
- `/resume/christian-rafael-cv-pt.pdf` — generated Portuguese PDF.
- `/` — lightweight language router.
- `/projects/en/{slug}/`, `/projects/pt/{slug}/` — bilingual technical case studies for Velis, Kaduo, Eviz, Chris Cleaner and LOGV Learn.

## Source of truth

- `content/en/index.mds`
- `content/pt/index.mds`
- `content/en/resume.mds`
- `content/pt/resume.mds`
- `content/en/projects/*.mds` and `content/pt/projects/*.mds` — individual technical case studies, source-file evidence and explicit test/measurement limitations.

Themes:

- `themes/portfolio/` — editorial web portfolio.
- `themes/resume/` — A4-first résumé theme.

Generated HTML and PDF files should not be edited manually.

## Local development

Requires Node.js 20.19 or newer.

```bash
npm install
npx playwright install chromium
npm run check
npm run build
npm run pdf
npm run preview
```

Edit content with the MDS editor:

```bash
npm run edit:en
npm run edit:pt
```

## Deployment

GitHub Actions validates all MDS sources and ten engineering case-study pages, renders static HTML, generates both PDFs with headless Chromium, verifies language/SEO invariants and commits generated artifacts. GitHub Pages continues to publish from the repository root on `main`.

The runtime website itself ships no frontend framework.

## Design direction

The public portfolio intentionally uses an austere research-homepage aesthetic: plain HTML structure, native fonts, classic text links, compact chronology and no card/dashboard UI. The information architecture combines an academic homepage, a durable research index and Unix-manual-like metadata. Projects and research are presented before résumé chronology, and the systems map explains how the main technical projects relate across the computing stack.
