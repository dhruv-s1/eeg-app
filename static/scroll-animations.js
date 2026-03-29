// ===== PROFESSIONAL SCROLL REVEAL ANIMATIONS =====

// Initialize Intersection Observer for scroll animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all elements with scroll-reveal class
    document.querySelectorAll('.scroll-reveal').forEach(element => {
        observer.observe(element);
    });
}

// ===== COUNTER ANIMATION =====
function animateCounters() {
    const counterElements = document.querySelectorAll('[data-target]');

    const observerOptions = {
        threshold: 0.5
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const target = parseInt(element.getAttribute('data-target'));
                const duration = parseInt(element.getAttribute('data-duration')) || 1500;

                animateValue(element, 0, target, duration);
                observer.unobserve(element);
            }
        });
    }, observerOptions);

    counterElements.forEach(element => observer.observe(element));
}

function animateValue(element, start, end, duration) {
    let startTimestamp = null;

    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const value = Math.floor(progress * (end - start) + start);
        element.textContent = value;

        if (progress < 1) {
            requestAnimationFrame(step);
        }
    };

    requestAnimationFrame(step);
}

// ===== INITIALIZE ALL SCROLL ANIMATIONS =====
document.addEventListener('DOMContentLoaded', () => {
    initScrollAnimations();
    animateCounters();
});

// Re-initialize on dynamic content load
window.addEventListener('load', () => {
    setTimeout(() => {
        initScrollAnimations();
    }, 500);
});
