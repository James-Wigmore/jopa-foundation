// Loads shared navbar and footer partials into any page that has
// <div id="navbar"></div> and <div id="footer"></div>
async function includeHTML(elementId, filePath) {
  const el = document.getElementById(elementId);
  if (!el) return;
  try {
    const res = await fetch(filePath);
    el.innerHTML = await res.text();
  } catch (err) {
    console.error(`Could not load ${filePath}:`, err);
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  await includeHTML('navbar', 'components/navbar.html');
  await includeHTML('footer', 'components/footer.html');

  // Highlight the active nav link once the navbar is in the DOM
  const current = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    if (link.getAttribute('href') === current) link.classList.add('active');
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
