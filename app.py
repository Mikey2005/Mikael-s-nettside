from flask import Flask, request, jsonify, session
from werkzeug.security import generate_password_hash, check_password_hash
import sqlite3
import os
from math import ceil

app = Flask(__name__)
app.secret_key = 'change_this_secret'
DATABASE = 'database.db'


def get_db():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    if not os.path.exists(DATABASE):
        conn = get_db()
        conn.execute(
            """
            CREATE TABLE users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE NOT NULL,
                password_hash TEXT NOT NULL,
                first_name TEXT,
                last_name TEXT,
                address TEXT,
                job TEXT,
                education TEXT
            )
            """
        )
        conn.commit()
        conn.close()


@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json(force=True)
    required = ['username', 'password', 'first_name', 'last_name', 'address']
    if not all(field in data and data[field] for field in required):
        return jsonify({'error': 'Missing fields'}), 400
    username = data['username']
    password_hash = generate_password_hash(data['password'])
    conn = get_db()
    try:
        conn.execute(
            'INSERT INTO users (username, password_hash, first_name, last_name, address) VALUES (?,?,?,?,?)',
            (username, password_hash, data['first_name'], data['last_name'], data['address'])
        )
        conn.commit()
    except sqlite3.IntegrityError:
        conn.close()
        return jsonify({'error': 'Username taken'}), 409
    conn.close()
    return jsonify({'message': 'User registered'}), 201


@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json(force=True)
    username = data.get('username')
    password = data.get('password')
    conn = get_db()
    cur = conn.execute('SELECT * FROM users WHERE username=?', (username,))
    user = cur.fetchone()
    conn.close()
    if user and check_password_hash(user['password_hash'], password):
        session['username'] = username
        return jsonify({'message': 'Logged in'}), 200
    return jsonify({'error': 'Invalid credentials'}), 401


@app.route('/api/profile', methods=['GET', 'PUT'])
def profile():
    if 'username' not in session:
        return jsonify({'error': 'Not logged in'}), 401
    username = session['username']
    conn = get_db()
    if request.method == 'GET':
        cur = conn.execute(
            'SELECT username, first_name, last_name, address, job, education FROM users WHERE username=?',
            (username,)
        )
        user = cur.fetchone()
        conn.close()
        if user:
            return jsonify(dict(user)), 200
        return jsonify({'error': 'User not found'}), 404
    else:
        data = request.get_json(force=True)
        conn.execute(
            'UPDATE users SET job=?, education=? WHERE username=?',
            (data.get('job'), data.get('education'), username)
        )
        conn.commit()
        conn.close()
        return jsonify({'message': 'Profile updated'}), 200


@app.route('/api/logout', methods=['POST'])
def logout():
    session.pop('username', None)
    return jsonify({'message': 'Logged out'})


# --- Lysfart kalkulator ---
C = 299_792_458  # meters per second
LIGHT_YEAR_METERS = 9.461e15


def simulate_lightspeed(speed_percent: float, passengers: int, distance_ly: float):
    """Calculate travel data for a spaceship."""
    base_speed = speed_percent / 100 * C
    rocket_count = passengers * 15
    cooling_fraction = 0.2
    effective_speed = base_speed * ((1 - cooling_fraction) + cooling_fraction * 0.5)
    total_distance = distance_ly * LIGHT_YEAR_METERS
    total_time_seconds = total_distance / effective_speed
    log = [
        f'Fart satt til {speed_percent}% av lyset ({base_speed:.0f} m/s).',
        f'{rocket_count} raketter installert.',
        '20% av rakettene må kjøles ned underveis.'
    ]
    log.append(
        f'Effektiv fart blir {effective_speed:.0f} m/s. Estimert reisetid '
        f'{ceil(total_time_seconds)} sekunder.'
    )
    return {
        'base_speed': base_speed,
        'rocket_count': rocket_count,
        'effective_speed': effective_speed,
        'total_time_seconds': total_time_seconds,
        'log': log,
    }


@app.route('/api/lightspeed', methods=['POST'])
def lightspeed_endpoint():
    data = request.get_json(force=True)
    try:
        speed_percent = float(data.get('speed_percent', 0))
        passengers = int(data.get('passengers', 2))
        distance_ly = float(data.get('distance', 1))
    except (TypeError, ValueError):
        return jsonify({'error': 'Invalid input'}), 400

    if speed_percent <= 0 or passengers < 2 or distance_ly <= 0:
        return jsonify({'error': 'Invalid parameters'}), 400

    result = simulate_lightspeed(speed_percent, passengers, distance_ly)
    return jsonify(result)


if __name__ == '__main__':
    init_db()
    app.run(host='0.0.0.0', port=5000, debug=True)
