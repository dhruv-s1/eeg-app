// ===== VIEW MANAGEMENT WITH SMOOTH ANIMATIONS =====
function switchView(viewName) {
    // Smooth fade out all views
    const allViews = document.querySelectorAll('.view-section');
    allViews.forEach(el => {
        el.style.opacity = '0';
        el.style.transition = 'opacity 0.3s ease-out';
    });

    // Show selected view with fade in
    setTimeout(() => {
        allViews.forEach(el => el.classList.remove('active'));
        const view = document.getElementById(viewName);
        if (view) {
            view.classList.add('active');
            view.style.opacity = '0';
            setTimeout(() => {
                view.style.opacity = '1';
                view.style.transition = 'opacity 0.4s ease-out';
            }, 10);
        }
    }, 300);

    // Update page title with animation
    const titles = {
        'landing': '📊 CoastGuard Dashboard',
        'charts': '📈 Analytics & Trends',
        'drones': '🚁 Active Drone Fleet'
    };

    const pageTitle = document.getElementById('pageTitle');
    pageTitle.style.opacity = '0.5';
    pageTitle.style.transform = 'translateY(-10px)';

    setTimeout(() => {
        pageTitle.textContent = titles[viewName] || 'Dashboard';
        pageTitle.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        pageTitle.style.opacity = '1';
        pageTitle.style.transform = 'translateY(0)';
    }, 150);

    // Update active nav item
    document.querySelectorAll('.nav-item').forEach(el => {
        el.classList.remove('active');
        el.style.transition = 'all 0.3s';
    });

    if (event && event.target) {
        event.target.classList.add('active');
    }

    // Load charts if charts view is selected
    if (viewName === 'charts' && !window.chartsInitialized) {
        setTimeout(loadCharts, 100);
    }

    // Load drone list if drones view is selected
    if (viewName === 'drones' && !window.dronesLoaded) {
        setTimeout(loadDroneList, 100);
    }
}

// ===== LOAD DASHBOARD STATISTICS WITH ANIMATION =====
async function loadDashboardStats() {
    try {
        const response = await fetch('/api/dashboard-stats');
        const data = await response.json();

        // Animate stat values
        animateValue('stat-donations', '$' + (data.total_donations / 1000000).toFixed(2) + 'M');
        animateValue('stat-pods', data.pod_count);
        animateValue('stat-area', data.area_scanned.toFixed(1));
        animateValue('stat-drones', data.drones_online);

        // Update time with pulse effect
        const updateTimeEl = document.getElementById('updateTime');
        updateTimeEl.style.opacity = '0.7';
        updateTimeEl.textContent = 'Last updated: ' + new Date(data.last_updated).toLocaleTimeString();
        updateTimeEl.style.transition = 'opacity 0.3s';
        setTimeout(() => {
            updateTimeEl.style.opacity = '1';
        }, 100);
    } catch (error) {
        console.error('Error loading stats:', error);
    }
}

// Animate number changes
function animateValue(elementId, newValue) {
    const element = document.getElementById(elementId);
    if (!element) return;

    element.style.transition = 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
    element.style.opacity = '0.7';
    element.style.transform = 'scale(0.95)';

    setTimeout(() => {
        element.textContent = newValue;
        element.style.opacity = '1';
        element.style.transform = 'scale(1)';
    }, 200);
}

// ===== LOAD CHARTS WITH SMOOTH ANIMATIONS =====
let chartsInitialized = false;
async function loadCharts() {
    if (chartsInitialized) return;
    chartsInitialized = true;

    try {
        // Load pods time series
        const podsResponse = await fetch('/api/pods-timeseries');
        const podsData = await podsResponse.json();

        const ctx1 = document.getElementById('podsChart');
        if (ctx1 && !ctx1.chartInstance) {
            ctx1.chartInstance = new Chart(ctx1, {
                type: 'line',
                data: {
                    labels: podsData.map(d => new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })),
                    datasets: [{
                        label: 'Active Pods',
                        data: podsData.map(d => d.pods),
                        borderColor: '#00d9ff',
                        backgroundColor: 'rgba(0, 217, 255, 0.1)',
                        borderWidth: 3,
                        fill: true,
                        tension: 0.4,
                        pointRadius: 5,
                        pointBackgroundColor: '#00d9ff',
                        pointBorderColor: '#fff',
                        pointBorderWidth: 2,
                        pointHoverRadius: 7,
                        pointHoverBackgroundColor: '#00f0ff',
                        shadowColor: 'rgba(0, 217, 255, 0.3)',
                        shadowBlur: 15
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: true,
                    animation: {
                        duration: 1000,
                        easing: 'easeInOutQuart'
                    },
                    plugins: {
                        legend: {
                            display: true,
                            labels: {
                                color: '#666',
                                font: { size: 12, weight: '600' },
                                padding: 20,
                                usePointStyle: true
                            }
                        },
                        filler: {
                            propagate: true
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            grid: {
                                color: 'rgba(0, 217, 255, 0.1)',
                                drawBorder: false,
                                borderColor: 'transparent'
                            },
                            ticks: {
                                color: '#666',
                                font: { size: 12 }
                            }
                        },
                        x: {
                            grid: {
                                display: false,
                                drawBorder: false
                            },
                            ticks: {
                                color: '#666',
                                font: { size: 12 }
                            }
                        }
                    }
                }
            });
        }

        // Load drone coverage with animation
        const droneResponse = await fetch('/api/drone-coverage');
        const droneData = await droneResponse.json();

        const ctx2 = document.getElementById('droneAreaChart');
        if (ctx2 && !ctx2.chartInstance) {
            ctx2.chartInstance = new Chart(ctx2, {
                type: 'bar',
                data: {
                    labels: droneData.drones.map(d => d.id),
                    datasets: [{
                        label: 'Area Scanned (km²)',
                        data: droneData.drones.map(d => d.area),
                        backgroundColor: [
                            '#00d9ff',
                            '#00f0ff',
                            '#089ba7',
                            '#10b981',
                            '#b500ff'
                        ],
                        borderRadius: 8,
                        borderSkipped: false,
                        hoverBackgroundColor: '#00f0ff'
                    }]
                },
                options: {
                    indexAxis: 'y',
                    responsive: true,
                    maintainAspectRatio: true,
                    animation: {
                        duration: 1000,
                        easing: 'easeInOutQuart',
                        delay: (context) => {
                            let delay = 0;
                            if (context.type === 'data') {
                                delay = context.dataIndex * 50 + context.datasetIndex * 100;
                            }
                            return delay;
                        }
                    },
                    plugins: {
                        legend: { display: false }
                    },
                    scales: {
                        x: {
                            grid: {
                                color: 'rgba(0, 217, 255, 0.1)',
                                drawBorder: false
                            },
                            ticks: {
                                color: '#666',
                                font: { size: 12 }
                            }
                        },
                        y: {
                            ticks: {
                                color: '#666',
                                font: { size: 12, weight: '600' }
                            }
                        }
                    }
                }
            });
        }
    } catch (error) {
        console.error('Error loading charts:', error);
    }
}

// ===== LOAD DRONE LIST WITH STAGGERED ANIMATIONS =====
async function loadDroneList() {
    try {
        const response = await fetch('/api/drone-coverage');
        const data = await response.json();

        const droneList = document.getElementById('droneList');
        droneList.innerHTML = data.drones.map((drone, index) => `
            <div class="drone-card" style="animation: fadeInUp 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) ${index * 0.1}s both;">
                <div class="drone-name">${drone.id}</div>
                <div class="area">📍 ${drone.area.toFixed(1)} km²</div>
                <div style="margin-top: 8px; font-size: 12px; color: #10b981; font-weight: 700;">
                    <span style="display: inline-block; animation: pulse 2s ease-in-out infinite;">● ACTIVE</span>
                </div>
            </div>
        `).join('');

        // Add hover animations
        document.querySelectorAll('.drone-card').forEach((card, index) => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-8px) scale(1.05)';
                this.style.transition = 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)';
            });
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
            });
        });

        window.dronesLoaded = true;
    } catch (error) {
        console.error('Error loading drone list:', error);
    }
}

// ===== MAP FUNCTIONALITY MOVED =====
// Map functionality has been moved to a separate optimized page: /map
// View map.js and map.html for map-related code
// Drone movement system and live tracking remain intact and functional

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    loadDashboardStats();
    setInterval(loadDashboardStats, 30000); // Update stats every 30 seconds
});
