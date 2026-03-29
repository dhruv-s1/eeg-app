// ===== DEVICE DETECTION =====
const isMobileDevice = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

const getDeviceType = () => {
  const userAgent = navigator.userAgent.toLowerCase();
  if (/iphone|ipod|ipad/.test(userAgent)) return 'iOS';
  if (/android/.test(userAgent)) return 'Android';
  if (/windows phone/.test(userAgent)) return 'Windows Phone';
  return 'Desktop';
};

const isPortrait = () => window.innerHeight > window.innerWidth;
const isLandscape = () => window.innerWidth > window.innerHeight;

// ===== DASHBOARD SIDEBAR HAMBURGER MENU =====
function initDashboardMobileMenu() {
  const sidebar = document.querySelector('.sidebar');
  const header = document.querySelector('.header');
  const mainPanel = document.querySelector('.main-panel');

  // Only initialize if we're on the dashboard (sidebar exists)
  if (!sidebar || !header) return;

  // Create hamburger menu only if not already present
  if (header.querySelector('.hamburger-menu')) return;

  const sidebarHamburger = document.createElement('button');
  sidebarHamburger.className = 'hamburger-menu';
  sidebarHamburger.innerHTML = '<span></span><span></span><span></span>';
  sidebarHamburger.setAttribute('aria-label', 'Toggle sidebar menu');
  sidebarHamburger.style.position = 'absolute';
  sidebarHamburger.style.left = '15px';

  // Insert hamburger at the beginning of header
  header.insertBefore(sidebarHamburger, header.firstChild);

  // Create overlay for mobile
  const overlay = document.createElement('div');
  overlay.className = 'sidebar-overlay';
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 998;
    display: none;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  `;
  document.body.appendChild(overlay);

  // Toggle sidebar on hamburger click
  sidebarHamburger.addEventListener('click', (e) => {
    e.stopPropagation();
    sidebarHamburger.classList.toggle('active');
    sidebar.classList.toggle('mobile-open');

    // Show/hide overlay
    if (sidebar.classList.contains('mobile-open')) {
      overlay.style.display = 'block';
    } else {
      overlay.style.display = 'none';
    }
  });

  // Close sidebar when clicking on overlay
  overlay.addEventListener('click', () => {
    sidebarHamburger.classList.remove('active');
    sidebar.classList.remove('mobile-open');
    overlay.style.display = 'none';
  });

  // Close sidebar when clicking nav items or logout
  sidebar.querySelectorAll('.nav-item, .logout-btn, form').forEach(item => {
    item.addEventListener('click', () => {
      sidebarHamburger.classList.remove('active');
      sidebar.classList.remove('mobile-open');
      overlay.style.display = 'none';
    });
  });

  // Close sidebar on outside click (main content area)
  if (mainPanel) {
    mainPanel.addEventListener('click', (e) => {
      const openSidebar = sidebar.classList.contains('mobile-open');
      if (openSidebar && !sidebar.contains(e.target) && !sidebarHamburger.contains(e.target)) {
        sidebarHamburger.classList.remove('active');
        sidebar.classList.remove('mobile-open');
        overlay.style.display = 'none';
      }
    });
  }

  // Mark as initialized
  sidebar.dataset.mobileInitialized = 'true';
}

// ===== SCREEN SIZE MONITORING =====
function handleResponsiveLayout() {
  const width = window.innerWidth;
  const isMobile = width <= 768;

  // Update data attribute for CSS/JS checks
  document.documentElement.setAttribute('data-device', isMobile ? 'mobile' : 'desktop');
  document.documentElement.setAttribute('data-device-type', getDeviceType());
  document.documentElement.setAttribute('data-orientation', isPortrait() ? 'portrait' : 'landscape');

  // Log device info in console
  console.log({
    isMobileDevice: isMobileDevice(),
    deviceType: getDeviceType(),
    screenWidth: width,
    isMobile: isMobile,
    orientation: isPortrait() ? 'portrait' : 'landscape'
  });
}

// ===== KEYBOARD HANDLING =====
document.addEventListener('keydown', (e) => {
  // Close menu on ESC
  if (e.key === 'Escape') {
    const hamburger = document.querySelector('.hamburger-menu.active');
    const sidebar = document.querySelector('.sidebar.mobile-open');
    const overlay = document.querySelector('.sidebar-overlay');

    if (hamburger) {
      hamburger.classList.remove('active');
    }
    if (sidebar) {
      sidebar.classList.remove('mobile-open');
    }
    if (overlay) {
      overlay.style.display = 'none';
    }
  }
});

// ===== VIEWPORT CHANGE HANDLING =====
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    handleResponsiveLayout();

    // Close mobile menu on resize to desktop
    if (window.innerWidth > 768) {
      const hamburger = document.querySelector('.hamburger-menu.active');
      const sidebar = document.querySelector('.sidebar.mobile-open');
      const overlay = document.querySelector('.sidebar-overlay');

      if (hamburger) {
        hamburger.classList.remove('active');
      }
      if (sidebar) {
        sidebar.classList.remove('mobile-open');
      }
      if (overlay) {
        overlay.style.display = 'none';
      }
    }
  }, 250);
});

// ===== ORIENTATION CHANGE =====
window.addEventListener('orientationchange', () => {
  setTimeout(() => {
    handleResponsiveLayout();

    const hamburger = document.querySelector('.hamburger-menu.active');
    const sidebar = document.querySelector('.sidebar.mobile-open');
    const overlay = document.querySelector('.sidebar-overlay');

    if (hamburger) {
      hamburger.classList.remove('active');
    }
    if (sidebar) {
      sidebar.classList.remove('mobile-open');
    }
    if (overlay) {
      overlay.style.display = 'none';
    }
  }, 100);
});

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
  // Only initialize dashboard menu
  initDashboardMobileMenu();
  handleResponsiveLayout();
});

// Re-initialize if dynamic content is loaded
const observer = new MutationObserver(() => {
  initDashboardMobileMenu();
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});

// ===== UTILITY FUNCTIONS =====
window.mobileUtils = {
  isMobile: isMobileDevice,
  getDeviceType: getDeviceType,
  isPortrait: isPortrait,
  isLandscape: isLandscape,
  toggleSidebar: () => {
    const hamburger = document.querySelector('.hamburger-menu');
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.querySelector('.sidebar-overlay');
    if (hamburger && sidebar) {
      hamburger.classList.toggle('active');
      sidebar.classList.toggle('mobile-open');
      if (overlay) {
        overlay.style.display = sidebar.classList.contains('mobile-open') ? 'block' : 'none';
      }
    }
  },
  closeAllMenus: () => {
    const hamburger = document.querySelector('.hamburger-menu');
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.querySelector('.sidebar-overlay');
    if (hamburger) hamburger.classList.remove('active');
    if (sidebar) sidebar.classList.remove('mobile-open');
    if (overlay) overlay.style.display = 'none';
  }
};


