// ===== MAP INITIALIZATION =====
// Center on Dubai/UAE Coastal Region
const map = L.map('map').setView([25.2048, 55.2708], 10);

// Modern light map theme
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© CoastGuard AI | Coastal Restoration Monitoring',
    maxZoom: 18
}).addTo(map);

// ===== COASTAL MONITORING DATA =====
const coastalData = [
    { 
        name: "Palm Jumeirah", 
        lat: 25.1124, 
        lng: 55.1390, 
        risk: "HIGH", 
        loss: "2.3m", 
        action: "Mangrove Deployment",
        area: 45.2,
        status: "CRITICAL",
        stability: "22%"
    },
    { 
        name: "Palm Jebel Ali", 
        lat: 24.9856, 
        lng: 55.0184, 
        risk: "MEDIUM", 
        loss: "1.2m", 
        action: "Soil Reinforcement",
        area: 52.1,
        status: "MONITORING",
        stability: "48%"
    },
    { 
        name: "Saadiyat Island", 
        lat: 24.5300, 
        lng: 54.4330, 
        risk: "LOW", 
        loss: "0.4m", 
        action: "Monitoring",
        area: 28.5,
        status: "STABLE",
        stability: "78%"
    },
    { 
        name: "Al Mamzar Beach", 
        lat: 25.3090, 
        lng: 55.3420, 
        risk: "MEDIUM", 
        loss: "1.0m", 
        action: "Vegetation Support",
        area: 18.3,
        status: "ACTIVE",
        stability: "55%"
    },
    { 
        name: "Jebel Ali Beach", 
        lat: 24.9650, 
        lng: 55.0100, 
        risk: "HIGH", 
        loss: "2.0m", 
        action: "Urgent Restoration",
        area: 32.7,
        status: "CRITICAL",
        stability: "28%"
    }
];

// ===== PALM ISLANDS HIGHLIGHT ZONES =====
const palmZones = [
    {
        name: "Palm Jumeirah",
        center: [25.1124, 55.1390],
        radius: 2000  // meters
    },
    {
        name: "Palm Jebel Ali",
        center: [24.9856, 55.0184],
        radius: 2500  // meters
    }
];

// Draw highlighted zones for Palm Islands
palmZones.forEach(zone => {
    L.circle(zone.center, {
        color: '#089ba7',
        fillColor: '#d1fae5',
        fillOpacity: 0.15,
        weight: 2,
        dashArray: '5, 5'
    }).addTo(map).bindPopup(`<strong>${zone.name}</strong><br/>Restoration Zone`);
});

// ===== INFO PANEL =====
const panel = document.getElementById("infoPanel");

// ===== COLOR CODING SYSTEM =====
function getColor(risk) {
    if (risk === "HIGH") return "#dc2626";
    if (risk === "MEDIUM") return "#ea580c";
    return "#10b981";
}

function getRiskClass(risk) {
    if (risk === "HIGH") return "risk-high";
    if (risk === "MEDIUM") return "risk-medium";
    return "risk-low";
}

function getStatusBadgeClass(status) {
    if (status === "ACTIVE" || status === "CRITICAL") return "status-active";
    return "status-scanning";
}

// ===== ADD LOCATION MARKERS =====
coastalData.forEach(loc => {
    const marker = L.circleMarker([loc.lat, loc.lng], {
        color: getColor(loc.risk),
        fillColor: getColor(loc.risk),
        fillOpacity: 0.85,
        radius: 12,
        weight: 3
    }).addTo(map);

    marker.on('click', () => {
        displayLocationData(loc);
    });
});

// ===== DISPLAY LOCATION DATA =====
function displayLocationData(loc) {
    const statusBadgeColor = loc.risk === "HIGH" ? "#fecaca" : 
                            loc.risk === "MEDIUM" ? "#fed7aa" : "#dcfce7";
    const statusTextColor = loc.risk === "HIGH" ? "#991b1b" : 
                           loc.risk === "MEDIUM" ? "#92400e" : "#15803d";
    
    panel.innerHTML = `
        <div class="card">
            <h2>${loc.name}</h2>
            <p style="color: #666; font-size: 13px; margin-bottom: 15px;">📍 Monitoring Zone</p>
            
            <div class="info-row">
                <span class="label">Risk Level</span>
                <span class="value ${getRiskClass(loc.risk)}">${loc.risk}</span>
            </div>
            
            <div class="info-row">
                <span class="label">Shoreline Loss</span>
                <span class="value">${loc.loss}</span>
            </div>
            
            <div class="info-row">
                <span class="label">Scanned Area</span>
                <span class="value">${loc.area} km²</span>
            </div>
            
            <div class="info-row">
                <span class="label">Stability Index</span>
                <span class="value" style="color: ${getColor(loc.risk === 'HIGH' ? 'LOW' : loc.risk === 'MEDIUM' ? 'MEDIUM' : 'HIGH')}">${loc.stability}</span>
            </div>
            
            <hr>
            
            <h3>✅ Recommended Action</h3>
            <p style="color: #666;">${loc.action}</p>
            
            <hr>
            
            <h3>🚁 Drone Fleet Status</h3>
            <div class="info-row">
                <span class="label">Drones Active</span>
                <span class="value">${Math.floor(Math.random() * 8 + 3)}</span>
            </div>
            <div class="info-row">
                <span class="label">Flight Hours Today</span>
                <span class="value">${Math.floor(Math.random() * 28 + 12)} hrs</span>
            </div>
            <div class="info-row">
                <span class="label">Data Collected</span>
                <span class="value">${Math.floor(Math.random() * 450 + 200)} images</span>
            </div>
            <span class="status-badge status-active">● SCANNING</span>
            
            <hr>
            
            <h3>🌱 Restoration Impact</h3>
            <div class="info-row">
                <span class="label">Baseline Stability</span>
                <span class="value">${loc.stability}</span>
            </div>
            <div class="info-row">
                <span class="label">Target Stability</span>
                <span class="value" style="color: #10b981;">85%</span>
            </div>
            <div class="info-row">
                <span class="label">Growth Projection</span>
                <span class="value" style="color: #10b981;">+${Math.floor(Math.random() * 25 + 15)}%</span>
            </div>
        </div>
    `;
}

// ===== INITIAL WELCOME MESSAGE =====
window.addEventListener('load', () => {
    showWelcomeMessage();
    initiateDroneSwarm();
});

function showWelcomeMessage() {
    panel.innerHTML = `
        <div class="card">
            <h2>🤖 Welcome to CoastGuard</h2>
            <p style="color: #666; margin: 15px 0; line-height: 1.6;">Real-time monitoring of UAE's critical coastal restoration zones.</p>
            
            <hr>
            
            <h3>📡 System Status</h3>
            <div class="info-row">
                <span class="label">Drone Fleet</span>
                <span class="value" style="color: #10b981;">● 12 Active</span>
            </div>
            <div class="info-row">
                <span class="label">Coverage</span>
                <span class="value" style="color: #10b981;">● 98% Online</span>
            </div>
            <div class="info-row">
                <span class="label">Data Sync</span>
                <span class="value" style="color: #10b981;">● Real-time</span>
            </div>
            
            <hr>
            
            <h3>🗺️ How to Use</h3>
            <p style="color: #666; font-size: 13px;">Click on any red/orange/green zone marker on the map to view detailed restoration data and drone monitoring status.</p>
            
            <p style="color: #888; font-size: 12px; margin-top: 20px; padding-top: 15px; border-top: 1px solid #f0f0f0;">Watch the drones (blue pulsing dots) scan the coastline in real-time.</p>
        </div>
    `;
}

// ===== DRONE SWARM SYSTEM =====
const drones = [];
const droneCount = 10;
const droneMarkers = [];

function initiateDroneSwarm() {
    // Create initial drone positions
    for (let i = 0; i < droneCount; i++) {
        drones.push({
            id: i,
            lat: 24.95 + Math.random() * 0.4,
            lng: 54.95 + Math.random() * 0.6,
            targetIndex: Math.floor(Math.random() * coastalData.length),
            speed: 0.0008 + Math.random() * 0.0004,
            status: 'ACTIVE'
        });
    }

    // Create custom drone icon
    const droneIcon = L.divIcon({
        html: '<div class="drone-icon"></div>',
        iconSize: [24, 24],
        className: 'drone-marker'
    });

    // Add drone markers to map
    drones.forEach(drone => {
        const marker = L.marker([drone.lat, drone.lng], { icon: droneIcon }).addTo(map);
        marker.bindPopup(`Drone ${drone.id + 1} - Status: ${drone.status}`);
        droneMarkers.push(marker);
    });

    // Animate drones
    animateDrones();
}

function animateDrones() {
    drones.forEach((drone, idx) => {
        const target = coastalData[drone.targetIndex];
        
        // Move drone towards target
        const dLat = target.lat - drone.lat;
        const dLng = target.lng - drone.lng;
        const distance = Math.sqrt(dLat * dLat + dLng * dLng);
        
        if (distance > 0.01) {
            drone.lat += (dLat / distance) * drone.speed;
            drone.lng += (dLng / distance) * drone.speed;
        } else {
            // Reached target, pick new target
            drone.targetIndex = Math.floor(Math.random() * coastalData.length);
        }
        
        // Update marker position
        droneMarkers[idx].setLatLng([drone.lat, drone.lng]);
    });

    // Continue animation
    requestAnimationFrame(animateDrones);
}

// Add click handler for map clicks
map.on('click', (e) => {
    // Check if clicked near any coastal location
    let nearbyLocation = null;
    const clickLat = e.latlng.lat;
    const clickLng = e.latlng.lng;
    
    coastalData.forEach(loc => {
        const distance = Math.sqrt(
            Math.pow(loc.lat - clickLat, 2) + 
            Math.pow(loc.lng - clickLng, 2)
        );
        if (distance < 0.05) {
            nearbyLocation = loc;
        }
    });
    
    if (nearbyLocation) {
        displayLocationData(nearbyLocation);
    }
});

// Update drone data periodically
setInterval(() => {
    // Randomly update drone statuses and speeds
    drones.forEach(drone => {
        if (Math.random() > 0.9) {
            drone.speed = 0.0008 + Math.random() * 0.0004;
        }
    });
}, 5000);