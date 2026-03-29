// ===== ONBOARDING TOUR LOGIC =====

let currentStep = 1;
const totalSteps = 7;

const stepData = [
    {
        title: "Welcome to CoastGuard",
        subtitle: "Let's explore the dashboard"
    },
    {
        title: "Dashboard Overview",
        subtitle: "Your central hub for monitoring"
    },
    {
        title: "Analytics & Trends",
        subtitle: "Track performance metrics"
    },
    {
        title: "Active Drone Fleet",
        subtitle: "Monitor all drones in real-time"
    },
    {
        title: "Live Coastal Monitoring Map",
        subtitle: "Real-time aerial view"
    },
    {
        title: "Sidebar Navigation",
        subtitle: "Quick access to features"
    },
    {
        title: "You're All Set!",
        subtitle: "Ready to get started"
    }
];

// Initialize onboarding
document.addEventListener('DOMContentLoaded', () => {
    updateProgress();
    updateButtons();
});

// Next step
function nextStep() {
    if (currentStep < totalSteps) {
        hidestep(currentStep);
        currentStep++;
        showStep(currentStep);
        updateProgress();
        updateButtons();
        window.scrollTo(0, 0);
    } else if (currentStep === totalSteps) {
        completeTour();
    }
}

// Previous step
function previousStep() {
    if (currentStep > 1) {
        hideStep(currentStep);
        currentStep--;
        showStep(currentStep);
        updateProgress();
        updateButtons();
        window.scrollTo(0, 0);
    }
}

// Show step
function showStep(stepNumber) {
    const steps = document.querySelectorAll('.step');
    const step = steps[stepNumber - 1];

    if (step) {
        step.classList.add('active');

        // Update header
        document.getElementById('stepTitle').textContent = stepData[stepNumber - 1].title;
        document.getElementById('stepSubtitle').textContent = stepData[stepNumber - 1].subtitle;
    }
}

// Hide step
function hideStep(stepNumber) {
    const steps = document.querySelectorAll('.step');
    const step = steps[stepNumber - 1];

    if (step) {
        step.classList.remove('active');
    }
}

// Update progress bar
function updateProgress() {
    const progressPercentage = (currentStep / totalSteps) * 100;
    const progressFill = document.getElementById('progressFill');
    progressFill.style.width = progressPercentage + '%';
}

// Update button states
function updateButtons() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    // Previous button
    if (currentStep === 1) {
        prevBtn.disabled = true;
    } else {
        prevBtn.disabled = false;
    }

    // Next button
    if (currentStep === totalSteps) {
        nextBtn.textContent = 'Complete Tour ✓';
    } else {
        nextBtn.textContent = 'Next →';
    }
}

// Skip tour
function skipTour() {
    if (confirm('Are you sure you want to skip the tour?')) {
        completeTour();
    }
}

// Complete tour and mark onboarding as complete
function completeTour() {
    // Send completion to backend
    fetch('/api/complete-onboarding', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Redirect to dashboard
            window.location.href = '/dashboard';
        }
    })
    .catch(error => {
        console.error('Error completing onboarding:', error);
        // Still redirect even if there's an error
        window.location.href = '/dashboard';
    });
}

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        nextStep();
    } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        previousStep();
    } else if (e.key === 'Escape') {
        skipTour();
    }
});
