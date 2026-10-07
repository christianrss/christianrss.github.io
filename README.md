# christianrss.github.io

Personal technical portfolio for Christian Rafael de Souza Silva.

The site is authored in [MDS](https://github.com/ziyu/mds) and compiled to a standalone `index.html` for GitHub Pages.

## Structure

- `index.mds` — canonical portfolio content.
- `themes/portfolio/` — local MDS theme and semantic block templates.
- `index.html` — generated artifact served by GitHub Pages.
- `.github/workflows/build.yml` — validation and deterministic rendering.

The old monolithic HTML, course/certificate archive and template leftovers are intentionally not part of the new site.

## Local development

Requires Node.js 20.19 or newer.

```bash
npm install
npm run check
npm run build
npm run preview
```

To use the MDS editor:

```bash
npm run edit
```

Do not hand-edit `index.html`. Edit `index.mds` or the theme and rebuild.

## Deployment

The repository keeps the GitHub Pages-compatible root `index.html`, but it is generated from MDS.

On pushes and pull requests, GitHub Actions:

1. installs the pinned MDS CLI;
2. validates `index.mds`;
3. renders the standalone HTML;
4. checks critical portfolio content;
5. on branch pushes, commits the generated `index.html` and lockfile when they changed.

This preserves the existing GitHub Pages branch/root publishing model while making MDS the source of truth.
