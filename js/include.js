// Previously this file used fetch() to pull components/navbar.html and
// components/footer.html into every page at runtime — that's now done
// once, at build time, by build.js (see that file for details). The
// navbar and footer already exist in the page's HTML by the time this
// script runs, so all that's left here is wiring up the mobile menu
// toggle, which needs real interactivity a build step can't provide.
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      const isOpen = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', isOpen);
    });
  }

  // script.js's wireUpForms() listens for this event so it knows the
  // (now always-present) footer newsletter form exists before wiring
  // it up. Kept for compatibility rather than restructuring script.js
  // as well — it also has its own DOMContentLoaded fallback, so this
  // is a belt-and-braces signal rather than a strict dependency.
  document.dispatchEvent(new Event('includes:loaded'));
});
