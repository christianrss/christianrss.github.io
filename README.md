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
- `content/en/projects/*.mds` and `content/pt/projects/*.mds` — individual project descriptions limited to architecture, verified components and technology stack.

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

## Editorial and visual direction

The public site is a concise technical index, not a product-marketing landing page. White background, restrained serif body copy, monospaced metadata, ordinary hyperlinks and deliberate whitespace are part of its design. The landing page prioritizes concrete work and externally verifiable artifacts. Individual project pages document system architecture and technologies without speculation, test commentary or recommendations.

English and Portuguese are edited independently. The résumé is a separate print-first artifact; neither its content nor the public website should be padded with broad lists of unverifiable claims.

## Quality gates

- `npm run check` verifies editorial patterns, public disclosure rules and MDS validity.
- `npm run build` renders both language indexes, both résumés and ten product notes.
- `npm run pdf` renders the résumé PDFs.
- `npm run verify:site` checks every published route at desktop/mobile widths in Chromium, including loaded portraits, headings and horizontal overflow.
- GitHub Actions also verifies language alternates, canonical URLs, route presence and publication artifacts.


## Public disclosure rules

Project pages describe system responsibilities, component boundaries and technologies identified in source. Do not publish private repository paths, security internals, service addresses, configuration, credentials, raw logs, unreviewed vulnerabilities, internal test fixtures or unverified performance figures. Restricted evidence stays in private engineering repositories. The build pipeline checks these disclosure rules automatically.
