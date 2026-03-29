from flask import Flask, render_template, redirect, url_for, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
from werkzeug.security import generate_password_hash, check_password_hash
from sqlalchemy import inspect, text
import json
from datetime import datetime, timedelta
import random
import re
import os

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret123'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.db'

db = SQLAlchemy(app)

login_manager = LoginManager()
login_manager.init_app(app)

# USER MODEL
class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)
    onboarding_complete = db.Column(db.Boolean, default=False)

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

# ===== VALIDATION FUNCTIONS =====
def validate_username(username):
    """Validate username (at least 5 characters, alphanumeric and underscore)"""
    if len(username) < 5:
        return False, "Username must be at least 5 characters"
    if not re.match(r'^[a-zA-Z0-9_]+$', username):
        return False, "Username can only contain letters, numbers, and underscores"
    return True, "Valid"

def validate_password(password):
    """Validate password (at least 7 characters)"""
    if len(password) < 7:
        return False, "Password must be at least 7 characters"
    return True, "Valid"

def validate_email(email):
    """Validate email format"""
    email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    if not re.match(email_pattern, email):
        return False, "Invalid email format"
    return True, "Valid"

# ===== DATABASE MIGRATION =====
def migrate_database():
    """Add missing columns to existing tables"""
    with app.app_context():
        db.create_all()

        # Check if columns exist, if not add them
        inspector = inspect(db.engine)
        columns = [column['name'] for column in inspector.get_columns('user')]

        if 'onboarding_complete' not in columns:
            with db.engine.connect() as connection:
                connection.execute(text('ALTER TABLE user ADD COLUMN onboarding_complete BOOLEAN DEFAULT 0'))
                connection.commit()
            print("✅ Added onboarding_complete column to user table")

        if 'email' not in columns:
            with db.engine.connect() as connection:
                connection.execute(text('ALTER TABLE user ADD COLUMN email VARCHAR(120)'))
                connection.commit()
            print("✅ Added email column to user table")

# ROUTES

@app.route('/')
def home():
    return render_template('landing.html')

@app.route('/mobile-landing')
def mobile_landing():
    return render_template('mobile-landing.html')

@app.route('/signup', methods=['GET','POST'])
def signup():
    if request.method == 'POST':
        username = request.form.get('username', '').strip()
        email = request.form.get('email', '').strip()
        password = request.form.get('password', '').strip()

        # Validate username
        username_valid, username_msg = validate_username(username)
        if not username_valid:
            return render_template('signup.html', error=username_msg)

        # Validate email
        email_valid, email_msg = validate_email(email)
        if not email_valid:
            return render_template('signup.html', error=email_msg)

        # Validate password
        password_valid, password_msg = validate_password(password)
        if not password_valid:
            return render_template('signup.html', error=password_msg)

        # Check if username already exists
        if User.query.filter_by(username=username).first():
            return render_template('signup.html', error='Username already exists')

        # Check if email already exists
        if User.query.filter_by(email=email).first():
            return render_template('signup.html', error='Email already registered')

        # Create new user
        hashed_password = generate_password_hash(password)
        new_user = User(username=username, email=email, password=hashed_password)
        db.session.add(new_user)
        db.session.commit()

        return redirect('/login')

    return render_template('signup.html')

@app.route('/mobile-signup', methods=['GET','POST'])
def mobile_signup():
    if request.method == 'POST':
        username = request.form.get('username', '').strip()
        email = request.form.get('email', '').strip()
        password = request.form.get('password', '').strip()

        # Validate username
        username_valid, username_msg = validate_username(username)
        if not username_valid:
            return render_template('mobile-signup.html', error=username_msg)

        # Validate email
        email_valid, email_msg = validate_email(email)
        if not email_valid:
            return render_template('mobile-signup.html', error=email_msg)

        # Validate password
        password_valid, password_msg = validate_password(password)
        if not password_valid:
            return render_template('mobile-signup.html', error=password_msg)

        # Check if username already exists
        if User.query.filter_by(username=username).first():
            return render_template('mobile-signup.html', error='Username already exists')

        # Check if email already exists
        if User.query.filter_by(email=email).first():
            return render_template('mobile-signup.html', error='Email already registered')

        # Create new user
        hashed_password = generate_password_hash(password)
        new_user = User(username=username, email=email, password=hashed_password)
        db.session.add(new_user)
        db.session.commit()

        return redirect('/mobile-login')

    return render_template('mobile-signup.html')

@app.route('/login', methods=['GET','POST'])
def login():
    if request.method == 'POST':
        login_input = request.form.get('login', '').strip()
        password = request.form.get('password', '').strip()

        # Try to find user by username or email
        user = User.query.filter(
            (User.username == login_input) | (User.email == login_input)
        ).first()

        if user and check_password_hash(user.password, password):
            login_user(user)
            return redirect('/dashboard')

        # Show error for invalid credentials
        return render_template('login.html', error='Invalid username/email or password')

    return render_template('login.html')

@app.route('/mobile-login', methods=['GET','POST'])
def mobile_login():
    if request.method == 'POST':
        login_input = request.form.get('login', '').strip()
        password = request.form.get('password', '').strip()

        # Try to find user by username or email
        user = User.query.filter(
            (User.username == login_input) | (User.email == login_input)
        ).first()

        if user and check_password_hash(user.password, password):
            login_user(user)
            return redirect('/mobile-dashboard')

        # Show error for invalid credentials
        return render_template('mobile-login.html', error='Invalid username/email or password')

    return render_template('mobile-login.html')

@app.route('/dashboard')
@login_required
def dashboard():
    onboarding_needed = 'true' if not current_user.onboarding_complete else 'false'
    return render_template('dashboard.html', onboarding_needed=onboarding_needed)

@app.route('/mobile-dashboard')
@login_required
def mobile_dashboard():
    onboarding_needed = 'true' if not current_user.onboarding_complete else 'false'
    return render_template('mobile-dashboard.html', onboarding_needed=onboarding_needed)

@app.route('/api/dashboard-stats')
@login_required
def get_dashboard_stats():
    """Return dashboard statistics"""
    return jsonify({
        'total_donations': 2450000,
        'pod_count': 87,
        'area_scanned': 1245.5,
        'drones_online': 5,
        'last_updated': datetime.now().isoformat()
    })

@app.route('/api/pods-timeseries')
@login_required
def get_pods_timeseries():
    """Return pod time series data (last 7 days)"""
    data = []
    base_date = datetime.now() - timedelta(days=7)
    for i in range(8):
        date = base_date + timedelta(days=i)
        count = 60 + i * 2 + random.randint(-1, 1)
        data.append({
            'date': date.strftime('%a %d'),
            'pods': int(count)
        })
    return jsonify(data)

@app.route('/api/drone-coverage')
@login_required
def get_drone_coverage():
    """Return area scanned per drone (core 5 drones)"""
    return jsonify({
        'drones': [
            {'id': 'Drone A1', 'area': round(45 + random.randint(2, 8), 1)},
            {'id': 'Drone A2', 'area': round(52 + random.randint(2, 8), 1)},
            {'id': 'Drone B1', 'area': round(38 + random.randint(2, 8), 1)},
            {'id': 'Drone B2', 'area': round(48 + random.randint(2, 8), 1)},
            {'id': 'Drone C1', 'area': round(42 + random.randint(2, 8), 1)}
        ]
    })

@app.route('/api/coral-zones')
@login_required
def get_coral_zones():
    """Return coastal zones with data"""
    return jsonify([
        { 
            'name': "Palm Jumeirah", 
            'lat': 25.1124, 
            'lng': 55.1390, 
            'risk': "HIGH", 
            'loss': "2.3m", 
            'action': "Mangrove Deployment",
            'area': 45.2,
            'status': "CRITICAL",
            'stability': "22%"
        },
        { 
            'name': "Palm Jebel Ali", 
            'lat': 24.9856, 
            'lng': 55.0184, 
            'risk': "MEDIUM", 
            'loss': "1.2m", 
            'action': "Soil Reinforcement",
            'area': 52.1,
            'status': "MONITORING",
            'stability': "48%"
        },
        { 
            'name': "Saadiyat Island", 
            'lat': 24.5300, 
            'lng': 54.4330, 
            'risk': "LOW", 
            'loss': "0.4m", 
            'action': "Monitoring",
            'area': 28.5,
            'status': "STABLE",
            'stability': "78%"
        },
        { 
            'name': "Al Mamzar Beach", 
            'lat': 25.3090, 
            'lng': 55.3420, 
            'risk': "MEDIUM", 
            'loss': "1.0m", 
            'action': "Vegetation Support",
            'area': 18.3,
            'status': "ACTIVE",
            'stability': "55%"
        },
        { 
            'name': "Jebel Ali Beach", 
            'lat': 24.9650, 
            'lng': 55.0100, 
            'risk': "HIGH", 
            'loss': "2.0m", 
            'action': "Urgent Restoration",
            'area': 32.7,
            'status': "CRITICAL",
            'stability': "28%"
        }
    ])

@app.route('/onboarding')
@login_required
def onboarding():
    return render_template('onboarding.html')

@app.route('/api/complete-onboarding', methods=['POST'])
@login_required
def complete_onboarding():
    current_user.onboarding_complete = True
    db.session.commit()
    return jsonify({'success': True})

@app.route('/map')
@login_required
def map_view():
    return render_template('map.html')

@app.route('/mobile-map')
@login_required
def mobile_map():
    return render_template('mobile-map.html')

@app.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect('/login')

if __name__ == '__main__':
    migrate_database()
    port = int(os.environ.get("PORT", 10000))  # Render sets PORT automatically
    app.run(debug=False, host="0.0.0.0", port=port)