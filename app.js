/**
 * WEALTH SPAZE — Interactive Platform Logic
 * Powered by AARIXA INNOVIX PVT LTD
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initFraudAlertModal();
  initLegalModals();
  initContactForm();
});

/* ================= 1. FRAUD, PHISHING & IMPERSONATION POPUP MODAL (NEW VISITORS ONLY) ================= */
async function initFraudAlertModal() {
  const modal = document.getElementById('fraudAlertModal');
  const closeBtn = document.getElementById('modalCloseBtn');
  const ackBtn = document.getElementById('modalAckBtn');
  const STORAGE_KEY = 'wealthspaze_notice_seen';
  const IP_STORAGE_KEY = 'wealthspaze_visitor_ip';

  if (!modal) return;

  function openModal() {
    modal.classList.add('active');
    document.body.classList.add('modal-open');
  }

  function closeModal() {
    modal.classList.remove('active');
    document.body.classList.remove('modal-open');
    try {
      localStorage.setItem(STORAGE_KEY, 'true');
      localStorage.setItem('wealthspaze_notice_timestamp', new Date().toISOString());
    } catch (e) {
      console.warn('LocalStorage unavailable', e);
    }
  }

  // Check if visitor has already seen the notice on this device
  const alreadySeen = localStorage.getItem(STORAGE_KEY);

  if (alreadySeen) {
    return;
  }

  // IP Checker: Check if IP was previously registered as seen
  try {
    const cachedIP = localStorage.getItem(IP_STORAGE_KEY);
    const response = await fetch('https://api.ipify.org?format=json');
    if (response.ok) {
      const data = await response.json();
      const currentIP = data.ip;

      if (cachedIP && cachedIP === currentIP) {
        return;
      }

      localStorage.setItem(IP_STORAGE_KEY, currentIP);
    }
  } catch (error) {
    console.debug('IP fetch skipped or offline:', error);
  }

  // If new visitor, trigger popup after 400ms
  setTimeout(() => {
    openModal();
  }, 400);

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (ackBtn) ackBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}

/* ================= 2. LEGAL MODALS (TERMS, PRIVACY & DISCLAIMER) ================= */
function initLegalModals() {
  const triggers = document.querySelectorAll('.legal-link-trigger');
  const closeBtns = document.querySelectorAll('.legal-close-btn');

  function openLegalModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('active');
      document.body.classList.add('modal-open');
    }
  }

  function closeLegalModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('active');
      document.body.classList.remove('modal-open');
    }
  }

  triggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const modalId = trigger.getAttribute('data-modal');
      if (modalId) openLegalModal(modalId);
    });
  });

  closeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const modalId = btn.getAttribute('data-close');
      if (modalId) closeLegalModal(modalId);
    });
  });

  const legalModals = document.querySelectorAll('.legal-modal');
  legalModals.forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
        document.body.classList.remove('modal-open');
      }
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      legalModals.forEach(modal => {
        if (modal.classList.contains('active')) {
          modal.classList.remove('active');
          document.body.classList.remove('modal-open');
        }
      });
    }
  });
}

/* ================= 3. NAVBAR & MOBILE MENU ================= */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const menuToggle = document.getElementById('menuToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');

  // Header scroll shadow
  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Mobile menu toggle
  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (link.classList.contains('dropdown-toggle') && window.innerWidth <= 768) {
          return;
        }
        navMenu.classList.remove('active');
      });
    });

    const dropdownLinks = document.querySelectorAll('.dropdown-link');
    dropdownLinks.forEach(dLink => {
      dLink.addEventListener('click', () => {
        navMenu.classList.remove('active');
      });
    });
  }
}

/* ================= 4. CONTACT & INQUIRY FORM ================= */
function initContactForm() {
  const form = document.getElementById('demoForm');
  const feedback = document.getElementById('formFeedback');
  const submitBtn = document.getElementById('submitBtn');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('fullName').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const role = document.getElementById('userRole').value;

    if (!name || !email || !phone || !role) {
      alert('Please fill all mandatory fields marked with *');
      return;
    }

    submitBtn.disabled = true;
    submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Submitting...`;

    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = `<span>Send Message</span> <i class="fa-solid fa-paper-plane"></i>`;
      
      feedback.className = 'form-feedback success';
      feedback.innerHTML = `
        <i class="fa-solid fa-circle-check"></i> Thank you, <strong>${name}</strong>! Your inquiry has been received. Our team will reach out to <strong>${email}</strong> / <strong>${phone}</strong> shortly.
      `;
      feedback.classList.remove('hidden');

      form.reset();
    }, 900);
  });
}

