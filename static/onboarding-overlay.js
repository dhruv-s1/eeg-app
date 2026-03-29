// ===== DASHBOARD ONBOARDING - COORDINATE SYSTEM =====

let currentStep = 0;
const totalSteps = 7;

// Coordinate system for guide positions
const guideCoordinates = [
    {
        title: "Welcome to CoastGuard! 🌊",
        description: "Advanced coastal monitoring and restoration tracking system. Let's explore the dashboard together!",
        x: null, // centered
        y: null  // centered
    },
    {
        title: "Dashboard Stats 📊",
        description: "Real-time monitoring data showing total donations, active pods, area scanned, and active drones.",
        elementId: "stats-guide",
        x: null, // will use element position
        y: null
    },
    {
        title: "Analytics Tab 📈",
        description: "Switch to this tab to view trend charts, pod activity over time, and area coverage by drone.",
        elementId: "analytics-guide",
        x: null,
        y: null
    },
    {
        title: "Drone Fleet Tab 🚁",
        description: "Monitor all active drones in real-time. Click on any drone card to view detailed information.",
        elementId: "drone-guide",
        x: null,
        y: null
    },
    {
        title: "Live Map 🗺️",
        description: "Click here to open the live coastal monitoring map with real-time drone tracking.",
        elementId: "map-guide",
        x: null,
        y: null
    },
    {
        title: "Sidebar Navigation ⚙️",
        description: "Quick access to all features. Switch between Dashboard, Analytics, Drone Fleet, and Live Map.",
        elementId: "sidebar-guide",
        x: null,
        y: null
    },
    {
        title: "You're All Set! ✅",
        description: "You now know how to navigate the CoastGuard dashboard. Start exploring!",
        x: null, // centered
        y: null
    }
];

// Create overlay HTML
function createOnboardingOverlay() {
    const overlay = document.createElement('div');
    overlay.id = 'onboarding-overlay';
    overlay.innerHTML = `
        <div class="onboarding-backdrop"></div>
        <div class="onboarding-spotlight"></div>
        <div class="onboarding-tooltip" id="guide-tooltip">
            <div class="tooltip-header">
                <h3 id="tooltip-title"></h3>
                <div class="progress-indicator">
                    <span id="step-counter"></span>
                </div>
            </div>
            <p id="tooltip-description"></p>
            <div class="tooltip-footer">
                <button class="btn-skip" onclick="skipOnboarding()">Skip Tour</button>
                <div class="btn-group">
                    <button class="btn-prev" id="btn-prev" onclick="previousStep()" disabled>← Previous</button>
                    <button class="btn-next" id="btn-next" onclick="nextStep()">Next →</button>
                </div>
            </div>
            <div class="progress-bar-small">
                <div class="progress-fill-small" id="progress-small"></div>
            </div>
        </div>
    `;
    document.body.appendChild(overlay);
}

function checkAndStartOnboarding() {
    const needsOnboarding = document.body.getAttribute('data-onboarding-needed') === 'true';
    if (needsOnboarding) {
        createOnboardingOverlay();
        setTimeout(() => showStep(0), 500);
    }
}

function removeHighlight() {
    document.querySelectorAll('.onboarding-highlight').forEach(el => {
        el.classList.remove('onboarding-highlight');
    });
}

function getScreenCenter() {
    return {
        x: window.innerWidth / 2,
        y: window.innerHeight / 2
    };
}

function getElementPosition(elementId) {
    const element = document.getElementById(elementId);
    if (!element) return null;

    const rect = element.getBoundingClientRect();
    return {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
        element: element,
        rect: rect
    };
}

function showStep(stepIndex) {
    currentStep = stepIndex;
    const step = guideCoordinates[stepIndex];

    removeHighlight();

    // Update text
    document.getElementById('tooltip-title').textContent = step.title;
    document.getElementById('tooltip-description').textContent = step.description;
    document.getElementById('step-counter').textContent = `Step ${stepIndex + 1} of ${totalSteps}`;

    // Update progress
    document.getElementById('progress-small').style.width = ((stepIndex + 1) / totalSteps) * 100 + '%';

    // Update buttons
    document.getElementById('btn-prev').disabled = stepIndex === 0;
    document.getElementById('btn-next').textContent = stepIndex === totalSteps - 1 ? 'Complete Tour ✓' : 'Next →';

    // Position the overlay
    setTimeout(() => {
        moveOverlay(step);
    }, 300);
}

function moveOverlay(step) {
    const tooltip = document.getElementById('guide-tooltip');
    const spotlight = document.querySelector('.onboarding-spotlight');

    if (!tooltip || !spotlight) return;

    let x, y;
    let xOffset = 0;
    let yOffset = 0;

    // Get position - either from element or centered
    if (step.elementId) {
        const pos = getElementPosition(step.elementId);
        if (pos) {
            x = pos.x;
            y = pos.y;

            // Highlight the element
            pos.element.classList.add('onboarding-highlight');

            // Show spotlight around element
            const padding = 12;
            const rect = pos.rect;
            spotlight.style.display = 'block';
            spotlight.style.top = (rect.top - padding) + 'px';
            spotlight.style.left = (rect.left - padding) + 'px';
            spotlight.style.width = (rect.width + padding * 2) + 'px';
            spotlight.style.height = (rect.height + padding * 2) + 'px';

            // Adjust tooltip position based on element type
            if (step.elementId === 'stats-guide') {
                // Move down for stats
                yOffset = 300;
            } else if (step.elementId === 'analytics-guide' || step.elementId === 'drone-guide' || step.elementId === 'map-guide') {
                // Move right for nav bar items
                xOffset = 320;
            } else if (step.elementId === 'sidebar-guide') {
                // Move right for full sidebar
                xOffset = 400;
            }
        }
    } else {
        // Centered
        const center = getScreenCenter();
        x = center.x;
        y = center.y;
        spotlight.style.display = 'none';
    }

    // Move tooltip box to x,y position
    const tooltipWidth = 360;
    const tooltipHeight = 220;

    let finalX = x - tooltipWidth / 2 + xOffset;
    let finalY = y - tooltipHeight / 2 - 80 + yOffset;

    // Keep tooltip within viewport
    if (finalX < 10) finalX = 10;
    if (finalX + tooltipWidth > window.innerWidth - 10) finalX = window.innerWidth - tooltipWidth - 10;
    if (finalY < 10) finalY = 10;
    if (finalY + tooltipHeight > window.innerHeight - 10) finalY = window.innerHeight - tooltipHeight - 10;

    // Apply styles
    tooltip.style.position = 'fixed';
    tooltip.style.left = finalX + 'px';
    tooltip.style.top = finalY + 'px';
    tooltip.style.width = tooltipWidth + 'px';
}

function nextStep() {
    if (currentStep < totalSteps - 1) {
        showStep(currentStep + 1);
    } else {
        completeOnboarding();
    }
}

function previousStep() {
    if (currentStep > 0) {
        showStep(currentStep - 1);
    }
}

function skipOnboarding() {
    if (confirm('Skip the tour?')) {
        completeOnboarding();
    }
}

function completeOnboarding() {
    removeHighlight();
    const overlay = document.getElementById('onboarding-overlay');
    if (overlay) {
        overlay.style.animation = 'fadeOut 0.3s ease-out';
        setTimeout(() => overlay.remove(), 300);
    }

    fetch('/api/complete-onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
    }).catch(err => console.error("Error:", err));
}

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        checkAndStartOnboarding();
    }, 500);
});

window.addEventListener('resize', () => {
    if (currentStep < totalSteps) {
        const step = guideCoordinates[currentStep];
        moveOverlay(step);
    }
});

document.addEventListener('keydown', (e) => {
    const overlay = document.getElementById('onboarding-overlay');
    if (!overlay) return;
    if (e.key === 'ArrowRight') nextStep();
    if (e.key === 'ArrowLeft') previousStep();
    if (e.key === 'Escape') skipOnboarding();
});
