// Loads shared navbar and footer partials into any page that has
// <div id="navbar"></div> and <div id="footer"></div>
async function includeHTML(elementId, filePath) {
  const el = document.getElementById(elementId);
  if (!el) return;
  try {
    const res = await fetch(filePath);
    if (!res.ok) throw new Error(`${filePath} returned ${res.status}`);
    el.innerHTML = await res.text();
  } catch (err) {
    console.error(`Could not load ${filePath}:`, err);
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  await includeHTML('navbar', 'components/navbar.html');
  await includeHTML('footer', 'components/footer.html');

  // Highlight the active nav link once the navbar is in the DOM.
  // Normalizes both the current URL path and each link's href down to
  // a bare "page slug" (strips .html, leading/trailing slashes, and
  // treats the site root as 'index') so this keeps working whether a
  // page is served as clean-url.com/about or the raw about.html file.
  function normalize(path) {
    path = path.split('#')[0].split('?')[0];
    path = path.replace(/\.html$/i, '');
    path = path.replace(/^\/+|\/+$/g, '');
    return path === '' ? 'index' : path;
  }
  const current = normalize(window.location.pathname);
  document.querySelectorAll('.nav-links a').forEach(link => {
    if (normalize(link.getAttribute('href')) === current) link.classList.add('active');
  });

  // Mobile nav toggle
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      const isOpen = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', isOpen);
    });
  }

  // Let the rest of the app know includes are ready
  document.dispatchEvent(new Event('includes:loaded'));
});
