(function() {
  'use strict';

  function showToast(message, type = 'success') {
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
      existingToast.remove();
    }

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'polite');

    document.body.appendChild(toast);

    setTimeout(() => {
      toast.style.animation = 'slideIn 0.3s ease-out reverse';
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }

  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  function validateForm(formEl) {
    let isValid = true;
    const inputs = formEl.querySelectorAll('input[required], textarea[required]');

    inputs.forEach(input => {
      const formGroup = input.closest('.form-group');

      if (!input.value.trim()) {
        isValid = false;
        input.classList.add('error');
        formGroup.classList.add('has-error');
      } else if (input.type === 'email' && !validateEmail(input.value)) {
        isValid = false;
        input.classList.add('error');
        formGroup.classList.add('has-error');
      } else {
        input.classList.remove('error');
        formGroup.classList.remove('has-error');
      }
    });

    return isValid;
  }

  function handleEmailSignup(formEl) {
    formEl.addEventListener('submit', function(e) {
      e.preventDefault();

      if (!validateForm(formEl)) {
        showToast('Please enter a valid email address', 'error');
        return;
      }

      const submitBtn = formEl.querySelector('button[type="submit"]');
      const emailInput = formEl.querySelector('input[type="email"]');
      const originalBtnText = submitBtn.textContent;

      submitBtn.disabled = true;
      submitBtn.textContent = 'Submitting...';

      setTimeout(() => {
        showToast('Thank you! We\'ll notify you when we launch.', 'success');
        emailInput.value = '';
        submitBtn.disabled = false;
        submitBtn.textContent = originalBtnText;
        emailInput.classList.remove('error');
        emailInput.closest('.form-group').classList.remove('has-error');
      }, 1000);
    });

    const inputs = formEl.querySelectorAll('input, textarea');
    inputs.forEach(input => {
      input.addEventListener('input', function() {
        this.classList.remove('error');
        this.closest('.form-group').classList.remove('has-error');
      });
    });
  }

  function handleContactForm(formEl) {
    formEl.addEventListener('submit', function(e) {
      e.preventDefault();

      if (!validateForm(formEl)) {
        showToast('Please fill in all required fields correctly', 'error');
        return;
      }

      const submitBtn = formEl.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn.textContent;

      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';

      setTimeout(() => {
        window.location.href = '/index.html?contact=success';
      }, 1000);
    });

    const inputs = formEl.querySelectorAll('input, textarea');
    inputs.forEach(input => {
      input.addEventListener('input', function() {
        this.classList.remove('error');
        this.closest('.form-group').classList.remove('has-error');
      });
    });
  }

  function initNavActiveState() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-links a');

    navLinks.forEach(link => {
      const linkPath = new URL(link.href).pathname;
      if (linkPath === currentPath ||
          (currentPath === '/' && linkPath.includes('index.html'))) {
        link.classList.add('active');
      }
    });
  }

  function initQueryParamAlerts() {
    const urlParams = new URLSearchParams(window.location.search);

    if (urlParams.get('contact') === 'success') {
      showToast('Thank you for contacting us! We\'ll get back to you soon.', 'success');

      const cleanUrl = window.location.origin + window.location.pathname;
      window.history.replaceState({}, document.title, cleanUrl);
    }
  }

  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  }

  document.addEventListener('DOMContentLoaded', function() {
    const signupForm = document.querySelector('.signup-form');
    if (signupForm) {
      handleEmailSignup(signupForm);
    }

    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
      handleContactForm(contactForm);
    }

    initNavActiveState();
    initQueryParamAlerts();
    initSmoothScroll();
  });
})();