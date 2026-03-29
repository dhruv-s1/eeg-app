# 🚀 QUICK SETUP GUIDE - Mobile Website

## ⚡ 3 Steps to Run

### **Step 1: Install Dependencies**
```bash
pip install -r requirements.txt
```

### **Step 2: Start Server**
```bash
python app.py
```

You'll see:
```
 * Running on http://127.0.0.1:5000
 * Debug mode: on
```

### **Step 3: Open in Browser**
- **Desktop Test**: Go to `http://localhost:5000`
- **Phone Test**: Find your IP and go to `http://YOUR-IP:5000`

---

## 📱 Test on Phone

### **Find Your IP Address**
**Windows:**
```
Open Command Prompt
Type: ipconfig
Look for "IPv4 Address" (usually starts with 192.168)
Example: 192.168.1.100
```

**Mac/Linux:**
```
Open Terminal
Type: ifconfig
Look for "inet" address
```

### **On Phone Browser**
```
Visit: http://192.168.1.100:5000
(Replace 192.168.1.100 with YOUR IP)
```

---

## 🧪 What You'll See

1. **Landing Page** - Welcome screen with login/signup
2. **Signup** - Create account (username, email, password)
3. **Login** - Login with username or email
4. **Dashboard** - Main app with menu and stats
5. **Map** - Live map with coastal zones
6. **Menu** - Tap ☰ to see navigation options

---

## 📋 File Structure

```
EEG App apk/
├── app.py              ← Main server
├── requirements.txt    ← Dependencies
├── README.md          ← Full documentation
├── QUICK_SETUP.md     ← This file
├── templates/         ← HTML pages
│   ├── mobile-*.html  ← Mobile pages
│   └── onboarding.html
└── static/           ← CSS & JavaScript
    ├── *.css
    └── *.js
```

---

## ✅ Features Ready to Use

- ✅ Mobile Landing Page
- ✅ User Registration (with validation)
- ✅ User Login (username or email)
- ✅ Dashboard with Drawer Menu
- ✅ Live Map with Coastal Markers
- ✅ Analytics & Stats
- ✅ Drone Fleet Tracking
- ✅ Real-time data updates

---

## 🔐 Test Accounts (After Signup)

Create one by signing up:
```
Username: testuser_123 (5+ chars)
Email: test@example.com (valid email)
Password: password123 (7+ chars)
```

Then login with either:
- Username: testuser_123
- Email: test@example.com

---

## 🛑 Common Issues

**Can't connect to app?**
- Make sure Flask is running
- Check port 5000 is not blocked
- Try: `python app.py` again

**Wrong IP address?**
- Run `ipconfig` on Windows
- Use IPv4 address, not IPv6
- Make sure phone is on same WiFi

**Page shows 404?**
- Check URL spelling
- Make sure Flask is running
- Clear browser cache (Ctrl+Shift+Delete)

**Login/Signup not working?**
- Check users.db exists (auto-created)
- Check requirements installed: `pip list`
- Restart Flask app

---

## 📊 System Requirements

- Python 3.8+
- Flask 2.3.3
- SQLAlchemy 2.0.21
- Flask-SQLAlchemy 3.0.5
- Flask-Login 0.6.2

All installed via: `pip install -r requirements.txt`

---

## 🌐 Network Setup

```
Computer                    Phone
   |                          |
   └─────── Same WiFi ────────┘
          (connected)

Access: http://COMPUTER-IP:5000
```

---

## 📚 Documentation

For detailed info, see **README.md** in this folder

---

## 🎉 You're Ready!

```bash
pip install -r requirements.txt
python app.py
# Then visit http://localhost:5000
```

Enjoy your mobile website! 🚀📱
