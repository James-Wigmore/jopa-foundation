#!/usr/bin/env node
/**
 * build.js — JOPA Foundation Uganda static site builder
 * =========================================================
 * What this replaces: previously, every page shipped with an empty
 * <div id="navbar"></div> / <div id="footer"></div>, and js/include.js
 * used fetch() in the browser to pull in components/navbar.html and
 * components/footer.html at runtime. That meant:
 *   - a brief flash of missing nav/footer on every page load
 *   - a real network request the page couldn't render without
 *   - search engine crawlers seeing an empty nav/footer if they don't
 *     execute JS
 *   - the "active" nav-link highlight had to be figured out in the
 *     browser by comparing the current URL against every link
 *
 * This script does the same navbar/footer injection, but once, at
 * build time, directly into plain HTML files — so what actually
 * deploys already has the real nav/footer baked in, and the active
 * page's nav link is already marked before the browser ever sees it.
 * No framework, no npm dependencies — just Node's built-in fs/path.
 *
 * USAGE
 *   node build.js
 *
 * WHAT IT DOES
 *   1. Reads components/navbar.html and components/footer.html
 *   2. For each file in src/pages/*.html:
 *        - figures out that page's "slug" from its filename
 *          (index.html -> "/", about.html -> "about", etc.)
 *        - inserts class="active" onto the matching nav link
 *        - replaces <div id="navbar"></div> with the real navbar HTML
 *        - replaces <div id="footer"></div> with the real footer HTML
 *        - writes the result to the project root as the same filename
 *          (so index.html, about.html, etc. land right next to
 *          css/, js/, assets/ — exactly where Vercel expects them)
 *
 * WORKFLOW GOING FORWARD
 *   - Edit page content in src/pages/*.html
 *   - Edit the shared nav/footer in components/navbar.html and
 *     components/footer.html (same as before — nothing moved)
 *   - Run `node build.js` before committing
 *   - Commit BOTH the src/ changes and the regenerated root .html
 *     files — the root files are what Vercel actually serves, so
 *     they have to be committed too, not just src/
 *   - Push as normal; no Vercel build-command changes needed, since
 *     the output is the same kind of flat static HTML as before
 */

const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const PAGES_DIR = path.join(ROOT, 'src', 'pages');
const COMPONENTS_DIR = path.join(ROOT, 'components');

const navbarTemplate = fs.readFileSync(path.join(COMPONENTS_DIR, 'navbar.html'), 'utf8');
const footerTemplate = fs.readFileSync(path.join(COMPONENTS_DIR, 'footer.html'), 'utf8');

// Maps a page's filename to the exact href its own nav link uses in
// navbar.html, so the right link gets marked active. Keep this in
// sync with components/navbar.html if a page is ever renamed.
const SLUG_BY_FILE = {
  'index.html': '/',
  'about.html': 'about',
  'programs.html': 'programs',
  'projects.html': 'projects',
  'leadership.html': 'leadership',
  'gallery.html': 'gallery',
  'news.html': 'news',
  'contact.html': 'contact',
};

function escapeForRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function withActiveLink(navbarHtml, slug) {
  // Matches <a href="SLUG">...</a> or <a href="SLUG"> exactly (not a
  // prefix match — "about" must not also match "about-us" if that
  // ever existed) and inserts class="active" onto that one anchor only.
  const pattern = new RegExp(`<a href="${escapeForRegex(slug)}"(?![^>]*class=)([^>]*)>`);
  return navbarHtml.replace(pattern, `<a href="${slug}" class="active"$1>`);
}

function build() {
  if (!fs.existsSync(PAGES_DIR)) {
    console.error(`No src/pages directory found at ${PAGES_DIR}`);
    process.exit(1);
  }

  const files = fs.readdirSync(PAGES_DIR).filter((f) => f.endsWith('.html'));
  if (files.length === 0) {
    console.error('No .html files found in src/pages — nothing to build.');
    process.exit(1);
  }

  let builtCount = 0;

  for (const file of files) {
    const slug = SLUG_BY_FILE[file];
    if (slug === undefined) {
      console.warn(`⚠ Skipping ${file} — not listed in SLUG_BY_FILE, add it to build.js first.`);
      continue;
    }

    const srcPath = path.join(PAGES_DIR, file);
    let html = fs.readFileSync(srcPath, 'utf8');

    const navbarForPage = withActiveLink(navbarTemplate, slug);

    if (!html.includes('<div id="navbar"></div>')) {
      console.warn(`⚠ ${file}: no <div id="navbar"></div> found — navbar not injected.`);
    }
    if (!html.includes('<div id="footer"></div>')) {
      console.warn(`⚠ ${file}: no <div id="footer"></div> found — footer not injected.`);
    }

    html = html.replace('<div id="navbar"></div>', navbarForPage.trim());
    html = html.replace('<div id="footer"></div>', footerTemplate.trim());

    const outPath = path.join(ROOT, file);
    fs.writeFileSync(outPath, html, 'utf8');
    builtCount++;
    console.log(`✓ built ${file}`);
  }

  console.log(`\nDone — ${builtCount} page(s) built to the project root.`);
}

build();
