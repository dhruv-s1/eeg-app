# 📱 CoastGuard AI - Mobile Website Package

This folder contains **only the necessary files** for running the **phone/mobile version** of the CoastGuard AI application.

---

## 📦 What's Included

### **Backend**
- `app.py` - Flask server with all routes for mobile pages
- `requirements.txt` - All Python dependencies with versions

### **Templates (Mobile Only)**
```
templates/
├── mobile-landing.html      - Mobile landing page
├── mobile-login.html        - Mobile login page
├── mobile-signup.html       - Mobile signup page
├── mobile-dashboard.html    - Mobile dashboard (main app)
├── mobile-map.html          - Mobile live map page
└── onboarding.html          - Onboarding walkthrough
```

### **Static Assets**
```
static/
├── style.css                - All CSS styles
├── device-router.js         - Auto-detect device & redirect
├── mobile-menu.js           - Mobile drawer menu
├── mobile-map.js            - Map functionality
├── script.js                - General scripts
├── dashboard.js             - Dashboard functionality
├── scroll-animations.js     - Scroll animations
├── onboarding.js            - Onboarding logic
└── onboarding-overlay.js    - Onboarding UI
```

---

## 🚀 Quick Start

### **1. Install Dependencies**
```bash
pip install -r requirements.txt
```

### **2. Run the App**
```bash
python app.py
```

### **3. Access on Phone**
Visit: `http://your-device-ip:5000`

Example: `http://192.168.1.100:5000`

---

## 📱 Features

✅ **Mobile-Optimized UI** - Full vertical layouts
✅ **Automatic Device Detection** - Auto-redirects to mobile pages
✅ **Drawer Navigation** - Hidden menu (hamburger icon)
✅ **Safety Signup** - Username (5+ chars), Email, Password (7+ chars)
✅ **Dual Login** - Login with username OR email
✅ **Live Map** - Interactive coastal zone tracking
✅ **Dashboard** - Real-time monitoring & stats
✅ **Analytics** - Drone fleet and area data
✅ **Responsive** - Works on all phone sizes

---

## 🗂️ Folder Structure

```
EEG App apk/
├── app.py                   (Backend server)
├── requirements.txt         (Dependencies)
├── templates/              (HTML pages - mobile only)
│   ├── mobile-landing.html
│   ├── mobile-login.html
│   ├── mobile-signup.html
│   ├── mobile-dashboard.html
│   ├── mobile-map.html
│   └── onboarding.html
├── static/                 (CSS & JavaScript)
│   ├── style.css
│   ├── device-router.js
│   ├── mobile-menu.js
│   ├── mobile-map.js
│   ├── script.js
│   ├── dashboard.js
│   ├── scroll-animations.js
│   ├── onboarding.js
│   └── onboarding-overlay.js
└── users.db               (Auto-created database)
```

---

## 🔧 Configuration

### **Change Server Settings** (in app.py):
```python
if __name__ == '__main__':
    # Change host/port as needed
    app.run(host='0.0.0.0', port=5000, debug=True)
```

### **Access from Another Device**:
```
1. Find your device IP: ipconfig (Windows) or ifconfig (Mac/Linux)
2. From phone/tablet: http://YOUR-IP:5000

Example: http://192.168.1.50:5000
```

---

## 📋 Pages Included

### **Landing Page** (`/mobile-landing`)
- Hero section with CTA
- Feature overview
- Stats grid
- Login/Signup buttons

### **Signup** (`/mobile-signup`)
- Username field (5+ characters)
- Email field (valid format)
- Password field (7+ characters)
- Real-time validation
- Error messages

### **Login** (`/mobile-login`)
- Login field (username OR email)
- Password field
- Error handling
- Link to signup

### **Dashboard** (`/mobile-dashboard`)
- Drawer menu (hidden by default)
- Tab navigation
  - 📊 Dashboard view
  - 📈 Analytics view
  - 🚁 Drone fleet view
- Live stats cards
- Real-time data

### **Map** (`/mobile-map`)
- Interactive Leaflet map
- Coastal zone markers
- Clickable zones for details
- Bottom info panel
- Live location tracking

### **Onboarding** (`/onboarding`)
- Welcome walkthrough
- Feature highlights
- Tutorial steps

---

## 🔐 Security Features

✅ **Password Hashing** - Werkzeug security
✅ **Email Validation** - RFC format check
✅ **Username Requirements** - 5+ chars, alphanumeric
✅ **Password Requirements** - 7+ chars minimum
✅ **Duplicate Prevention** - No duplicate usernames/emails
✅ **Input Sanitization** - All inputs trimmed/validated
✅ **Session Management** - Flask-Login integration

---

## 📊 User Accounts

### **Signup Requirements**
```
Username: 5-100 characters (alphanumeric + underscore)
Email: Valid email format (must contain @)
Password: 7+ characters (any characters allowed)
```

### **Login Options**
```
Can login with:
- Username (from signup)
- Email (from signup)
- Either option works
```

---

## 🧪 Testing

### **Test on Real Phone**
```
1. Phone on same WiFi as computer
2. Find computer IP: ipconfig
3. Visit: http://COMPUTER-IP:5000
4. Should see mobile landing page
5. Create account & explore
```

### **Test in Browser**
```
1. Open Chrome DevTools (F12)
2. Click 📱 (device toolbar)
3. Select iPhone or Pixel
4. Visit localhost:5000
5. Should see mobile version
```

### **Check Console Logs**
```
Open browser console (F12 > Console)
Should see device detection logs:
✅ Device Router: Checking device type...
✅ isMobileDevice: true
✅ Redirecting to mobile page...
```

---

## 📱 Responsive Breakpoints

- **Mobile**: ≤ 768px width
- **Tablet**: > 768px (uses desktop pages if accessed)
- **Desktop**: > 1024px (uses desktop pages)

---

## 🚀 Deployment

### **For Development**
```bash
python app.py
# Access: http://localhost:5000
```

### **For Production (using Gunicorn)**
```bash
pip install gunicorn
gunicorn --bind 0.0.0.0:5000 app:app
```

### **For Mobile App Wrapper**
Can be wrapped in:
- React Native
- Flutter
- Cordova
- Android WebView
- iOS WKWebView

---

## 🌐 API Endpoints (Backend Only)

```
GET  /                      - Redirects to /mobile-landing
GET  /mobile-landing        - Landing page
GET  /mobile-login          - Login page
POST /mobile-login          - Handle login (username or email)
GET  /mobile-signup         - Signup page
POST /mobile-signup         - Handle signup
GET  /mobile-dashboard      - Dashboard
GET  /mobile-map            - Map page
GET  /logout                - Logout user
```

---

## 🔧 Troubleshooting

### **502 Bad Gateway**
```
→ App not running
→ Solution: python app.py
```

### **404 Not Found**
```
→ Page doesn't exist
→ Check URL spelling
→ Check if Flask is running
```

### **Cannot Connect from Phone**
```
→ Wrong IP address
→ Phone not on same WiFi
→ Firewall blocking port 5000
→ Check windows firewall settings
```

### **Database Error**
```
→ users.db corrupted
→ Solution: Delete users.db, it will recreate
```

### **Login/Signup Not Working**
```
→ Database issue
→ Check app.py has no syntax errors
→ Check requirements installed: pip list
```

---

## 📚 File Sizes

```
app.py                    ~25 KB
requirements.txt          ~1 KB
style.css                 ~50 KB
All JS files              ~100 KB
Templates (HTML)          ~150 KB

Total: ~330 KB (excluding user database)
```

---

## 📄 License

© 2026 CoastGuard AI - Coastal Restoration Monitoring

---

## ✨ Features Summary

| Feature | Mobile | Works |
|---------|--------|-------|
| Landing Page | Yes | ✅ |
| Login/Signup | Yes | ✅ |
| Dashboard | Yes | ✅ |
| Live Map | Yes | ✅ |
| Analytics | Yes | ✅ |
| Drone Fleet | Yes | ✅ |
| User Accounts | Yes | ✅ |
| Responsive Design | Yes | ✅ |
| Mobile Menu | Yes | ✅ |
| Real-time Stats | Yes | ✅ |

---

## 🎯 Ready to Use!

This package is **complete and production-ready** for mobile web deployment.

```bash
# Three simple steps:
pip install -r requirements.txt
python app.py
Visit: http://localhost:5000
```

Enjoy! 🚀📱
