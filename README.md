# JOPA Foundation Uganda — Website

Static, multi-page site for JOPA Foundation Uganda. No build step —
plain HTML, CSS, and vanilla JS, deployed as static files.

## Project structure

```
/
├── index.html            Homepage
├── about.html             About / mission / vision / values
├── programs.html          8 official programs + budget breakdown
├── projects.html          5 priority income-generating projects
├── leadership.html        Director, executive team, board
├── contact.html           Volunteer / partner / donate forms + FAQ
├── gallery.html           Photo gallery (filterable)
├── news.html               News & updates + newsletter signup
├── css/
│   ├── style.css          Core design system (colors, buttons, hero,
│   │                      cards, animations, scroll-row carousel)
│   └── pages.css          Interior-page-only components (loaded on
│                          every page except index.html)
├── js/
│   ├── include.js         Loads components/navbar.html and
│   │                      components/footer.html into every page
│   └── script.js          Scroll-reveal, count-up stats, scroll-row
│                          carousels, wide-table scroll arrows, and
│                          the Formspree form handler (see below)
├── components/
│   ├── navbar.html        Shared navbar partial
│   └── footer.html        Shared footer partial (incl. newsletter form)
└── assets/
    └── images/            Logo, favicon, etc.
```

There should be exactly **one** copy of `style.css`, `pages.css`, and
`script.js` in the project — all inside `css/` and `js/` respectively.
Earlier in development this repo briefly had duplicate copies sitting
at the project root, which caused confusion about which file was
actually being edited vs. actually loaded by the pages. If you ever
see two files with the same name again, check which one the `<link>` /
`<script src>` tags in the HTML actually point to (they should all say
`./css/style.css`, `./css/pages.css`, `js/script.js`) — that's the only
one that matters, the other is dead weight and safe to delete.

## Running locally

Any static file server works. If using VS Code's Live Server extension,
make sure the folder you open in VS Code is this project's **root**
folder (the one containing `index.html`), not a subfolder — otherwise
relative asset paths (like the logo) can resolve differently locally
than they do in production.

## Forms (Formspree)

All forms — Volunteer, Partner, Donate, General Inquiry, and both
newsletter signups (news page + footer) — are handled by one shared
handler in `js/script.js`. Each form is submitted via `fetch()` to
Formspree, using this lookup table near the top of the file:

```js
const FORMSPREE_IDS = {
  "Volunteer application": "mzdnprpk",
  "Partnership inquiry": "mvzepape",
  "Donation intent": "xbdnrojl",
  "General inquiry": "meeyjabv",
  "Newsletter signup": "meeyjabv",
  "Footer newsletter signup": "meeyjabv"
};
```

Each key is the form's `data-form-name` attribute (already set on the
`<form>` tags in the HTML — don't need to touch those). Each value is
just the **bare Formspree form ID** — the short code after `/f/` in
your form's endpoint URL, e.g. if your endpoint is
`https://formspree.io/f/mzdnprpk`, the value is `mzdnprpk`, **not**
the full URL. The code adds the `https://formspree.io/f/` prefix
itself; pasting the full URL as the value will double it up and break
the submission.

If a form's `data-form-name` isn't found in the table, it falls back
to whatever `"General inquiry"` is set to.

**To update or add a Formspree ID:** edit the `FORMSPREE_IDS` object
directly in `js/script.js` — that's the only place these IDs live.

**To test:** submit each form once after any change and confirm you
get both the on-page success message and the actual email from
Formspree. If you see an alert saying a form "isn't connected yet,"
that form's ID is either missing or still a placeholder.

## Deployment

Deployed via Vercel from the `develop` branch. After pushing changes,
hard-refresh (Ctrl+Shift+R / Cmd+Shift+R) before testing — browsers
can cache the old `script.js`/`style.css` and make a successful deploy
look like it didn't take effect.

## Known placeholder content (not bugs — just not filled in yet)

- Testimonials on the homepage use bracketed placeholder names
  (`[Volunteer Name]`, etc.)
- Project/program/gallery/news images are all CSS gradient
  placeholders — no real photos wired in yet
- The About page's image caption text ("replace with real photo") is
  currently visible to visitors, not just a dev note
