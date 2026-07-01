/* ============================================================================
   JOPA FOUNDATION UGANDA - v2.0 WEBSITE
   Complete JavaScript Functionality
   ========================================================================== */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  initializeNavigation();
  initializeSearch();
  initializeScrollReveal();
  initializeAnimatedCounters();
  initializeBackToTop();
  initializeMobileMenu();
  initializeFormHandling();
  initializeGalleryFiltering();
  initializeProjectFiltering();
  initializeProgramFiltering();
  initializeFAQ();
  initializeLightbox();
  updateActiveNavLink();
});

// Listen to scroll events
window.addEventListener('scroll', function() {
  updateNavbarStyle();
  updateActiveNavLink();
  updateBackToTopButton();
});

/* ============================================================================
   NAVIGATION - Sticky & Mobile Menu
   ========================================================================== */

function initializeNavigation() {
  const navbar = document.querySelector('.navbar');
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');

  if (hamburger) {
    hamburger.addEventListener('click', function() {
      this.classList.toggle('active');
      navMenu.classList.toggle('active');
    });
  }

  // Close menu when a link is clicked
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', function() {
      if (hamburger) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
      }
    });
  });
}

function updateNavbarStyle() {
  const navbar = document.querySelector('.navbar');
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}

function initializeMobileMenu() {
  const navMenu = document.querySelector('.nav-menu');
  const hamburger = document.querySelector('.hamburger');

  // Close menu when clicking outside
  document.addEventListener('click', function(event) {
    if (hamburger && !hamburger.contains(event.target) && !navMenu.contains(event.target)) {
      hamburger.classList.remove('active');
      navMenu.classList.remove('active');
    }
  });
}

function updateActiveNavLink() {
  const navLinks = document.querySelectorAll('.nav-link');
  const currentPath = window.location.pathname;

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === window.location.pathname || 
        (currentPath.endsWith('/') && link.getAttribute('href') === 'index.html') ||
        (currentPath.includes(link.getAttribute('href').replace('.html', '')))) {
      link.classList.add('active');
    }
  });
}

/* ============================================================================
   SEARCH FUNCTIONALITY
   ========================================================================== */

function initializeSearch() {
  const searchToggle = document.getElementById('searchToggle');
  const searchBar = document.getElementById('searchBar');
  const searchInput = document.getElementById('searchInput');

  if (searchToggle) {
    searchToggle.addEventListener('click', function() {
      searchBar.classList.toggle('active');
      if (searchBar.classList.contains('active')) {
        searchInput.focus();
      }
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', function(e) {
      const query = e.target.value.trim().toLowerCase();
      if (query.length > 2) {
        performSearch(query);
      } else {
        document.getElementById('searchResults').innerHTML = '';
      }
    });
  }

  // Close search bar when pressing Escape
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && searchBar) {
      searchBar.classList.remove('active');
    }
  });
}

function performSearch(query) {
  // Searchable content structure
  const searchableContent = [
    { title: 'Home', url: 'index.html', keywords: ['home', 'jopa', 'foundation'] },
    { title: 'About Us', url: 'about.html', keywords: ['about', 'mission', 'vision', 'values'] },
    { title: 'Programs', url: 'programs.html', keywords: ['programs', 'education', 'health', 'agriculture', 'youth', 'women', 'entrepreneurship', 'environment', 'research', 'digital', 'innovation'] },
    { title: 'Projects', url: 'projects.html', keywords: ['projects', 'tech', 'agriculture', 'leadership'] },
    { title: 'Leadership', url: 'leadership.html', keywords: ['leadership', 'team', 'staff'] },
    { title: 'Gallery', url: 'gallery.html', keywords: ['gallery', 'images', 'photos'] },
    { title: 'News', url: 'news.html', keywords: ['news', 'updates', 'articles'] },
    { title: 'Contact', url: 'contact.html', keywords: ['contact', 'email', 'phone', 'address'] }
  ];

  const results = searchableContent.filter(item => 
    item.title.toLowerCase().includes(query) ||
    item.keywords.some(keyword => keyword.includes(query))
  );

  displaySearchResults(results, query);
}

function displaySearchResults(results, query) {
  const searchResults = document.getElementById('searchResults');
  
  if (results.length === 0) {
    searchResults.innerHTML = '<div class="search-result-item" style="padding: 1rem; text-align: center; color: #999;">No results found for "' + query + '"</div>';
    return;
  }

  let html = '';
  results.forEach(result => {
    html += `
      <div class="search-result-item">
        <a href="${result.url}">
          <strong>${result.title}</strong>
        </a>
      </div>
    `;
  });

  searchResults.innerHTML = html;
}

/* ============================================================================
   SCROLL REVEAL ANIMATIONS
   ========================================================================== */

function initializeScrollReveal() {
  const reveals = document.querySelectorAll('.scroll-reveal');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  reveals.forEach(reveal => {
    observer.observe(reveal);
  });
}

/* ============================================================================
   ANIMATED COUNTERS
   ========================================================================== */

function initializeAnimatedCounters() {
  const counters = document.querySelectorAll('[data-target]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.5
  });

  counters.forEach(counter => {
    observer.observe(counter);
  });
}

function animateCounter(element) {
  const target = parseInt(element.getAttribute('data-target'));
  const increment = target / 50;
  let current = 0;

  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      element.textContent = target.toLocaleString();
      clearInterval(timer);
    } else {
      element.textContent = Math.floor(current).toLocaleString();
    }
  }, 30);
}

/* ============================================================================
   BACK TO TOP BUTTON
   ========================================================================== */

function initializeBackToTop() {
  const backToTopBtn = document.getElementById('backToTop');

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', function() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
}

function updateBackToTopButton() {
  const backToTopBtn = document.getElementById('backToTop');

  if (backToTopBtn) {
    if (window.scrollY > 300) {
      backToTopBtn.classList.add('show');
    } else {
      backToTopBtn.classList.remove('show');
    }
  }
}

/* ============================================================================
   FORM HANDLING & VALIDATION
   ========================================================================== */

function initializeFormHandling() {
  const contactForm = document.getElementById('contactForm');

  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();

      // Get form values
      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const phone = document.getElementById('phone').value.trim();
      const subject = document.getElementById('subject').value;
      const message = document.getElementById('message').value.trim();

      // Validation
      if (!validateForm(name, email, subject, message)) {
        return;
      }

      // Show success message
      showNotification('Thank you for reaching out! We will get back to you shortly.', 'success');

      // Reset form
      this.reset();

      // Here you would typically send the data to a server
      // Example: sendFormData({ name, email, phone, subject, message });
    });
  }
}

function validateForm(name, email, subject, message) {
  if (!name || name.length < 2) {
    showNotification('Please enter a valid name.', 'error');
    return false;
  }

  if (!isValidEmail(email)) {
    showNotification('Please enter a valid email address.', 'error');
    return false;
  }

  if (!subject) {
    showNotification('Please select a subject.', 'error');
    return false;
  }

  if (!message || message.length < 10) {
    showNotification('Please enter a message (at least 10 characters).', 'error');
    return false;
  }

  return true;
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function showNotification(message, type) {
  // Create notification element
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 100px;
    right: 20px;
    padding: 16px 24px;
    background: ${type === 'success' ? '#10B981' : '#EF4444'};
    color: white;
    border-radius: 8px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
    z-index: 3000;
    animation: slideInRight 0.3s ease-out;
  `;

  document.body.appendChild(notification);

  // Remove after 4 seconds
  setTimeout(() => {
    notification.style.animation = 'slideInLeft 0.3s ease-out';
    setTimeout(() => notification.remove(), 300);
  }, 4000);
}

/* ============================================================================
   GALLERY FILTERING
   ========================================================================== */

function initializeGalleryFiltering() {
  const filterButtons = document.querySelectorAll('[data-filter]');
  const galleryItems = document.querySelectorAll('.gallery-item');

  filterButtons.forEach(button => {
    button.addEventListener('click', function() {
      const filter = this.getAttribute('data-filter');

      // Update active button
      filterButtons.forEach(btn => btn.classList.remove('active'));
      this.classList.add('active');

      // Filter items
      galleryItems.forEach(item => {
        if (filter === 'all' || item.getAttribute('data-category').includes(filter)) {
          item.style.opacity = '1';
          item.style.pointerEvents = 'auto';
        } else {
          item.style.opacity = '0.5';
          item.style.pointerEvents = 'none';
        }
      });
    });
  });
}

/* ============================================================================
   PROJECT FILTERING
   ========================================================================== */

function initializeProjectFiltering() {
  const filterButtons = document.querySelectorAll('.projects-filter-section [data-filter]');
  const projectItems = document.querySelectorAll('.large-project-card');

  filterButtons.forEach(button => {
    button.addEventListener('click', function() {
      const filter = this.getAttribute('data-filter');

      // Update active button
      filterButtons.forEach(btn => btn.classList.remove('active'));
      this.classList.add('active');

      // Filter items
      projectItems.forEach(item => {
        const categories = item.getAttribute('data-category').split(' ');
        if (filter === 'all' || categories.includes(filter)) {
          item.style.display = 'block';
          item.style.opacity = '1';
          setTimeout(() => item.style.transform = 'scale(1)', 10);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.95)';
          setTimeout(() => item.style.display = 'none', 300);
        }
      });
    });
  });
}

/* ============================================================================
   PROGRAM FILTERING
   ========================================================================== */

function initializeProgramFiltering() {
  const filterButtons = document.querySelectorAll('.programs-filter-section [data-filter]');
  const programItems = document.querySelectorAll('.program-detailed-card');

  filterButtons.forEach(button => {
    button.addEventListener('click', function() {
      const filter = this.getAttribute('data-filter');

      // Update active button
      filterButtons.forEach(btn => btn.classList.remove('active'));
      this.classList.add('active');

      // Filter items
      programItems.forEach(item => {
        const category = item.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          item.style.display = 'block';
          item.style.opacity = '1';
        } else {
          item.style.display = 'none';
          item.style.opacity = '0';
        }
      });
    });
  });
}

/* ============================================================================
   FAQ ACCORDION
   ========================================================================== */

function initializeFAQ() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    const toggle = item.querySelector('.faq-toggle');

    if (question) {
      question.addEventListener('click', function() {
        // Close other items
        faqItems.forEach(otherItem => {
          if (otherItem !== item) {
            otherItem.classList.remove('active');
            const otherAnswer = otherItem.querySelector('.faq-answer');
            const otherToggle = otherItem.querySelector('.faq-toggle');
            if (otherAnswer) otherAnswer.style.maxHeight = '0';
            if (otherToggle) otherToggle.textContent = '+';
          }
        });

        // Toggle current item
        item.classList.toggle('active');

        if (item.classList.contains('active')) {
          if (answer) answer.style.maxHeight = answer.scrollHeight + 'px';
          if (toggle) toggle.textContent = '−';
        } else {
          if (answer) answer.style.maxHeight = '0';
          if (toggle) toggle.textContent = '+';
        }
      });
    }
  });
}

/* ============================================================================
   LIGHTBOX GALLERY
   ========================================================================== */

function initializeLightbox() {
  const lightbox = document.getElementById('lightbox');
  const galleryItems = document.querySelectorAll('.gallery-item');
  let currentIndex = 0;

  if (!lightbox) return;

  const galleryImages = Array.from(galleryItems).map(item => ({
    src: item.querySelector('img').src,
    alt: item.querySelector('img').alt
  }));

  galleryItems.forEach((item, index) => {
    item.addEventListener('click', function() {
      currentIndex = index;
      openLightbox(galleryImages[index]);
    });
  });

  function openLightbox(image) {
    const lightboxImage = document.getElementById('lightbox-image');
    if (lightboxImage) {
      lightboxImage.src = image.src;
      lightboxImage.alt = image.alt;
    }
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = 'auto';
  }

  function showImage(index) {
    if (index >= 0 && index < galleryImages.length) {
      currentIndex = index;
      openLightbox(galleryImages[index]);
    }
  }

  // Close button
  const closeBtn = document.querySelector('.lightbox-close');
  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);

  // Previous button
  const prevBtn = document.querySelector('.lightbox-prev');
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      showImage((currentIndex - 1 + galleryImages.length) % galleryImages.length);
    });
  }

  // Next button
  const nextBtn = document.querySelector('.lightbox-next');
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      showImage((currentIndex + 1) % galleryImages.length);
    });
  }

  // Close on background click
  lightbox.addEventListener('click', function(e) {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  // Keyboard navigation
  document.addEventListener('keydown', function(e) {
    if (!lightbox.classList.contains('active')) return;

    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showImage((currentIndex - 1 + galleryImages.length) % galleryImages.length);
    if (e.key === 'ArrowRight') showImage((currentIndex + 1) % galleryImages.length);
  });
}

/* ============================================================================
   HELPER FUNCTIONS
   ========================================================================== */

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    if (href === '#') return;

    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// Add staggered animation delay classes
function addStaggerDelay() {
  const items = document.querySelectorAll('[class*="-grid"] > *');
  items.forEach((item, index) => {
    item.style.animationDelay = `${index * 0.1}s`;
  });
}

window.addEventListener('load', addStaggerDelay);

/* ============================================================================
   INTERSECTION OBSERVER FOR LAZY LOADING
   ========================================================================== */

if ('IntersectionObserver' in window) {
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          imageObserver.unobserve(img);
        }
      }
    });
  });

  document.querySelectorAll('img[data-src]').forEach(img => {
    imageObserver.observe(img);
  });
}

/* ============================================================================
   PERFORMANCE: DEBOUNCE & THROTTLE
   ========================================================================== */

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Throttle scroll events for better performance
window.addEventListener('scroll', throttle(function() {
  updateNavbarStyle();
  updateActiveNavLink();
  updateBackToTopButton();
}, 100));

/* ============================================================================
   PAGE LOAD ANIMATION
   ========================================================================== */

window.addEventListener('load', function() {
  // Add loaded class for any final animations
  document.body.classList.add('loaded');
});

/* ============================================================================
   ERROR HANDLING
   ========================================================================== */

// Handle form submit with proper error handling
function handleFormSubmit(formId, callback) {
  const form = document.getElementById(formId);
  if (!form) return;

  form.addEventListener('submit', async function(e) {
    e.preventDefault();
    try {
      await callback(new FormData(this));
    } catch (error) {
      console.error('Form submission error:', error);
      showNotification('An error occurred. Please try again.', 'error');
    }
  });
}

/* ============================================================================
   CONSOLE WELCOME MESSAGE
   ========================================================================== */

console.log(
  '%cJOPA Foundation Uganda v2.0',
  'font-size: 20px; font-weight: bold; color: #1B5E20;'
);
console.log(
  '%cBuilding Hope. Empowering Communities.',
  'font-size: 14px; color: #F4B400;'
);
console.log(
  '%cModern, Professional, Premium NGO Website',
  'font-size: 12px; color: #6B7280;'
);
