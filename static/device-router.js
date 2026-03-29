// ===== DEVICE DETECTOR & ROUTER (MOBILE-FIRST) =====
// Auto-redirects mobile users to mobile-optimized pages

(function() {
    'use strict';

    // ===== DEVICE DETECTION =====
    const isMobileUserAgent = () => {
        const userAgent = navigator.userAgent.toLowerCase();
        // Check for mobile user agents
        const mobilePattern = /android|webos|iphone|ipod|blackberry|iemobile|opera mini|mobile|touch/i;
        return mobilePattern.test(userAgent);
    };

    const isMobileViewport = () => {
        // Check viewport width with a buffer for orientation changes
        return window.innerWidth <= 768;
    };

    const isMobileDevice = () => {
        // Mobile if: (user agent says mobile) OR (viewport is small AND not iPad)
        const isPhone = isMobileUserAgent() && navigator.userAgent.indexOf('iPad') === -1;
        const isSmallScreen = isMobileViewport();
        return isPhone || (isSmallScreen && !navigator.userAgent.includes('iPad'));
    };

    // ===== PAGE DETECTION =====
    const getCurrentPage = () => {
        const path = window.location.pathname;

        // Normalize path
        if (path === '/' || path === '/landing' || path === '' || path.startsWith('/landing')) {
            return 'landing';
        }
        if (path.startsWith('/login') && !path.includes('mobile')) {
            return 'login';
        }
        if (path.startsWith('/signup') && !path.includes('mobile')) {
            return 'signup';
        }
        if (path.startsWith('/dashboard') && !path.includes('mobile')) {
            return 'dashboard';
        }
        if (path.startsWith('/map') && !path.includes('mobile')) {
            return 'map';
        }
        if (path.startsWith('/onboarding')) {
            return 'onboarding';
        }

        return null;
    };

    const isMobilePage = () => {
        const path = window.location.pathname;
        return path.includes('/mobile-');
    };

    // ===== PAGE MAPPING =====
    const mobilePages = {
        landing: '/mobile-landing',
        login: '/mobile-login',
        signup: '/mobile-signup',
        dashboard: '/mobile-dashboard',
        map: '/mobile-map',
        onboarding: '/onboarding' // Onboarding stays same
    };

    // ===== REDIRECT LOGIC =====
    const performRedirect = () => {
        const isCurrentlyMobile = isMobileDevice();
        const currentPage = getCurrentPage();
        const isAlreadyOnMobilePage = isMobilePage();

        // Log for debugging
        console.log({
            timestamp: new Date().toISOString(),
            isMobileUserAgent: isMobileUserAgent(),
            isMobileViewport: isMobileViewport(),
            isCurrentlyMobile: isCurrentlyMobile,
            currentPage: currentPage,
            isAlreadyOnMobilePage: isAlreadyOnMobilePage,
            viewport: `${window.innerWidth}x${window.innerHeight}`,
            userAgent: navigator.userAgent.substring(0, 80)
        });

        // Only redirect if: mobile device AND not already on mobile page AND page is known
        if (isCurrentlyMobile && !isAlreadyOnMobilePage && currentPage && mobilePages[currentPage]) {
            const targetUrl = mobilePages[currentPage];
            console.log(`🚀 Redirecting to mobile page: ${targetUrl}`);
            window.location.href = targetUrl;
        }

        // Store current device type for reference
        localStorage.setItem('deviceType', isCurrentlyMobile ? 'mobile' : 'desktop');
        localStorage.setItem('lastCheck', new Date().toISOString());
    };

    // ===== RUN IMMEDIATELY (before page fully loads) =====
    // Run as soon as script loads
    console.log('🔍 Device Router: Checking device type...');
    performRedirect();

    // ===== MONITOR ORIENTATION & RESIZE CHANGES =====
    let resizeTimer;
    window.addEventListener('orientationchange', () => {
        console.log('🔄 Orientation changed, checking device...');
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(performRedirect, 500);
    });

    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            const newMobileStatus = isMobileDevice();
            const currentMobileStatus = localStorage.getItem('deviceType') === 'mobile';

            // Only redirect if device status changed
            if (newMobileStatus !== currentMobileStatus) {
                console.log('📐 Viewport changed significantly, checking device...');
                performRedirect();
            }
        }, 500);
    });

    // ===== EXPOSE UTILITIES =====
    window.deviceRouter = {
        isMobile: isMobileDevice,
        isMobileUserAgent: isMobileUserAgent,
        isMobileViewport: isMobileViewport,
        getCurrentPage: getCurrentPage,
        deviceType: isMobileDevice() ? 'mobile' : 'desktop'
    };

})();
