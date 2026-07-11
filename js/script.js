// Scroll-reveal for elements marked .scroll-reveal
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.scroll-reveal').forEach(el => revealObserver.observe(el));

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

const countObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCount(entry.target);
      countObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.4 });

document.querySelectorAll('.impact-number[data-count], .stat-number[data-count]').forEach(el => countObserver.observe(el));

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
