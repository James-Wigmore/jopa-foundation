// =========================================================
// SHARED FORM SUBMISSION HANDLER — Formspree
// Handles every form on every page, including the newsletter form in
// the footer (which is injected asynchronously by include.js, so this
// waits for the 'includes:loaded' event to make sure it exists first).
//
// SETUP: JOPA Foundation Uganda uses SEPARATE Formspree forms per
// submission type (Donate / Partner / Volunteer / General Contact),
// so each form on the site is looked up by its data-form-name and
// routed to its own Formspree ID below. Paste your real IDs in place
// of each placeholder. If a data-form-name isn't listed here, it
// falls back to FORMSPREE_IDS["General inquiry"].
// =========================================================
const FORMSPREE_IDS = {
  "Volunteer application": "mzdnprpk",
  "Partnership inquiry": "mvzepape",
  "Donation intent": "xbdnrojl",
  "General inquiry": "meeyjabv",
  // Both newsletter signup forms route to General Contact by default —
  // give them their own key here (and their own Formspree form) if you
  // want newsletter signups tracked separately.
  "Newsletter signup": "meeyjabv",
  "Footer newsletter signup": "meeyjabv"
};

function getFormspreeId(form) {
  const name = form.dataset.formName;
  return FORMSPREE_IDS[name] || FORMSPREE_IDS["General inquiry"];
}

function wireUpForms() {
  document.querySelectorAll('form[data-form-name]').forEach(form => {
    if (form.dataset.wired === 'true') return; // avoid double-binding
    form.dataset.wired = 'true';

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }

      const submitBtn = form.querySelector('button[type="submit"], button:not([type])');
      const originalText = submitBtn ? submitBtn.textContent : '';
      const successTarget = form.dataset.successTarget;
      const success = successTarget ? document.querySelector(`[data-success-for="${successTarget}"]`) : null;

      const formspreeId = getFormspreeId(form);
      if (!formspreeId || formspreeId.startsWith("YOUR_")) {
        alert(`Forms aren't connected yet — add the real Formspree ID for "${form.dataset.formName}" in js/script.js (FORMSPREE_IDS).`);
        return;
      }
      const endpoint = `https://formspree.io/f/${formspreeId}`;

      if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = "Sending..."; }

      try {
        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "Accept": "application/json" },
          body: new FormData(form)
        });

        if (res.ok) {
          form.style.display = "none";
          if (success) {
            success.style.display = "block";
            success.classList.add("visible");
          }
        } else {
          throw new Error("Formspree responded with an error");
        }
      } catch (err) {
        console.error("Form submission failed:", err);
        if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = originalText; }
        alert("Sorry, something went wrong sending this — please try again, or reach us directly at admin@jopafoundation.org.");
      }
    });
  });
}

// Static, same-page forms (e.g. contact.html) exist immediately;
// the footer's form is injected asynchronously. 'includes:loaded'
// (dispatched by include.js) fires after both are guaranteed to exist,
// so wiring everything up at that point covers both cases reliably.
document.addEventListener('includes:loaded', wireUpForms);
// Fallback in case a page doesn't use include.js at all.
document.addEventListener('DOMContentLoaded', () => setTimeout(wireUpForms, 300));
// Reusable "observe once" helper — watches elements matching `selector`,
// runs `callback(element)` the moment each one scrolls into view, then
// stops watching it. Used below for both scroll-reveal and count-up
// animations, which previously duplicated this same observer pattern.
function observeOnce(selector, threshold, callback) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        callback(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold });
  document.querySelectorAll(selector).forEach(el => observer.observe(el));
}

observeOnce('.scroll-reveal', 0.15, el => el.classList.add('is-visible'));

// Safety net: if for any reason an element never gets marked visible
// (observer misfires, element sits in a zero-height container, etc.),
// force it visible after a short delay so content is never stuck hidden.
setTimeout(() => {
  document.querySelectorAll('.scroll-reveal:not(.is-visible)').forEach(el => {
    el.classList.add('is-visible');
  });
}, 2500);

// Animated count-up for the Impact numbers.
// Set the real value on the element via data-count="123" — the "+" suffix
// is added automatically unless data-suffix overrides it.
function animateCount(el) {
  const target = parseInt(el.dataset.count, 10) || 0;
  const suffix = el.dataset.suffix ?? '+';
  const duration = 1400;
  const start = performance.now();

  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = Math.round(target * eased);
    el.textContent = value.toLocaleString() + (progress === 1 ? suffix : '');
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

observeOnce('.impact-number[data-count], .stat-number[data-count]', 0.4, animateCount);

// Pulse the district dots on the hero map in a soft staggered sequence
document.querySelectorAll('.district-dot').forEach((dot, i) => {
  dot.style.animationDelay = `${i * 0.35}s`;
});

// Scroll-row arrows + View All: wraps any .scroll-row in a wrapper with
// < / > buttons (only shown if the row currently overflows) and a
// "View All" toggle button. The toggle appears when the row overflows,
// OR when the row is marked data-force-viewall="true" (used on sections
// like Projects/Executive Team that will grow over time, so the control
// is ready in advance even before there's enough content to scroll).
// Rows that already link out to a dedicated full-list page are marked
// data-has-viewall="true" and are skipped entirely.
document.querySelectorAll('.scroll-row').forEach(row => {
  if (row.dataset.hasViewall === 'true') return;

  const overflowing = row.scrollWidth > row.clientWidth + 4;
  const forceViewAll = row.dataset.forceViewall === 'true';
  if (!overflowing && !forceViewAll) return;

  const wrapper = document.createElement('div');
  wrapper.className = 'scroll-row-wrapper';
  row.parentNode.insertBefore(wrapper, row);
  wrapper.appendChild(row);

  let prevBtn = null, nextBtn = null;

  if (overflowing) {
    prevBtn = document.createElement('button');
    prevBtn.className = 'scroll-arrow prev';
    prevBtn.setAttribute('aria-label', 'Scroll left');
    prevBtn.innerHTML = '&#8249;';

    nextBtn = document.createElement('button');
    nextBtn.className = 'scroll-arrow next';
    nextBtn.setAttribute('aria-label', 'Scroll right');
    nextBtn.innerHTML = '&#8250;';

    wrapper.appendChild(prevBtn);
    wrapper.appendChild(nextBtn);

    const scrollStep = () => (row.firstElementChild ? row.firstElementChild.getBoundingClientRect().width + 24 : 300);

    prevBtn.addEventListener('click', () => row.scrollBy({ left: -scrollStep(), behavior: 'smooth' }));
    nextBtn.addEventListener('click', () => row.scrollBy({ left: scrollStep(), behavior: 'smooth' }));

    const updateArrows = () => {
      if (row.classList.contains('row-expanded')) return;
      prevBtn.disabled = row.scrollLeft <= 4;
      nextBtn.disabled = row.scrollLeft >= row.scrollWidth - row.clientWidth - 4;
    };
    updateArrows();
    row.addEventListener('scroll', updateArrows);
    window.addEventListener('resize', updateArrows);
  }

  const count = row.children.length;
  const viewAllBtn = document.createElement('button');
  viewAllBtn.className = 'btn btn-outline scroll-row-viewall';
  viewAllBtn.textContent = `View All (${count})`;
  wrapper.insertAdjacentElement('afterend', viewAllBtn);

  viewAllBtn.addEventListener('click', () => {
    const expanded = row.classList.toggle('row-expanded');
    if (prevBtn) prevBtn.style.display = expanded ? 'none' : '';
    if (nextBtn) nextBtn.style.display = expanded ? 'none' : '';
    viewAllBtn.textContent = expanded ? 'Show Less' : `View All (${count})`;
    if (!expanded) {
      wrapper.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  });
});

// =========================================================
// WIDE TABLE ENHANCEMENTS — any table.data-table with more than
// 3 columns gets the same scroll-arrow treatment as the card
// carousels above (for horizontal overflow on narrow screens),
// plus a "View All" toggle if it has more than 3 body rows so
// long budget breakdowns start collapsed and expand on request.
// =========================================================
document.querySelectorAll('table.data-table').forEach(table => {
  const headerCells = table.querySelectorAll('thead th');
  if (headerCells.length <= 3) return;

  const responsiveWrap = table.closest('.table-responsive');
  if (!responsiveWrap || responsiveWrap.dataset.enhanced === 'true') return;
  responsiveWrap.dataset.enhanced = 'true';

  // --- Horizontal scroll arrows (mirrors the .scroll-row-wrapper pattern) ---
  const outer = document.createElement('div');
  outer.className = 'table-scroll-wrapper';
  responsiveWrap.parentNode.insertBefore(outer, responsiveWrap);
  outer.appendChild(responsiveWrap);

  if (responsiveWrap.scrollWidth > responsiveWrap.clientWidth + 4) {
    const prevBtn = document.createElement('button');
    prevBtn.className = 'scroll-arrow prev';
    prevBtn.setAttribute('aria-label', 'Scroll table left');
    prevBtn.innerHTML = '&#8249;';

    const nextBtn = document.createElement('button');
    nextBtn.className = 'scroll-arrow next';
    nextBtn.setAttribute('aria-label', 'Scroll table right');
    nextBtn.innerHTML = '&#8250;';

    outer.appendChild(prevBtn);
    outer.appendChild(nextBtn);

    const scrollStep = () => responsiveWrap.clientWidth * 0.7;
    prevBtn.addEventListener('click', () => responsiveWrap.scrollBy({ left: -scrollStep(), behavior: 'smooth' }));
    nextBtn.addEventListener('click', () => responsiveWrap.scrollBy({ left: scrollStep(), behavior: 'smooth' }));

    const updateArrows = () => {
      prevBtn.disabled = responsiveWrap.scrollLeft <= 4;
      nextBtn.disabled = responsiveWrap.scrollLeft >= responsiveWrap.scrollWidth - responsiveWrap.clientWidth - 4;
    };
    updateArrows();
    responsiveWrap.addEventListener('scroll', updateArrows);
    window.addEventListener('resize', updateArrows);
  }

  // --- "View All" toggle for tables with more than 3 data rows ---
  const bodyRows = table.querySelectorAll('tbody tr');
  if (bodyRows.length > 3) {
    responsiveWrap.classList.add('table-row-limit');
    const viewAllBtn = document.createElement('button');
    viewAllBtn.className = 'btn btn-outline table-view-all-btn';
    viewAllBtn.textContent = `View All ${bodyRows.length} Rows`;
    outer.insertAdjacentElement('afterend', viewAllBtn);

    let expanded = false;
    viewAllBtn.addEventListener('click', () => {
      expanded = !expanded;
      responsiveWrap.classList.toggle('table-expanded', expanded);
      viewAllBtn.textContent = expanded ? 'Show Fewer Rows' : `View All ${bodyRows.length} Rows`;
      if (!expanded) {
        outer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });
  }
});