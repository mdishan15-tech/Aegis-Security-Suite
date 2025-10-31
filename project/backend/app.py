import os
import time
import random
import hashlib
from datetime import datetime, timedelta
from flask import Flask, jsonify, request
from flask_cors import CORS
from dotenv import load_dotenv
import json

load_dotenv()

app = Flask(__name__)
CORS(app)

# Enhanced Database Simulation
class SecurityDB:
    def __init__(self):
        self.threats = []
        self.encrypted_files = []
        self.user_sessions = {}
        self.iot_devices = []
        self.training_modules = []
        self.privacy_settings = {}
        self.threat_types = ['DDoS Attack', 'Phishing Attempt', 'Ransomware', 'SQL Injection', 'XSS Attack', 'Man-in-the-Middle', 'Zero-Day Exploit']
        self.initialize_data()
    
    def initialize_data(self):
        # Initialize IoT devices
        self.iot_devices = [
            {'id': 1, 'name': 'Smart Camera - Living Room', 'type': 'camera', 'ip': '192.168.1.101', 'status': 'secured', 'risk_level': 'low', 'last_scan': datetime.now().isoformat()},
            {'id': 2, 'name': 'Smart Thermostat', 'type': 'thermostat', 'ip': '192.168.1.102', 'status': 'vulnerable', 'risk_level': 'medium', 'last_scan': datetime.now().isoformat()},
            {'id': 3, 'name': 'Smart Door Lock', 'type': 'lock', 'ip': '192.168.1.103', 'status': 'secured', 'risk_level': 'low', 'last_scan': datetime.now().isoformat()},
            {'id': 4, 'name': 'Smart Speaker', 'type': 'speaker', 'ip': '192.168.1.104', 'status': 'at_risk', 'risk_level': 'high', 'last_scan': datetime.now().isoformat()},
            {'id': 5, 'name': 'Smart TV', 'type': 'tv', 'ip': '192.168.1.105', 'status': 'secured', 'risk_level': 'low', 'last_scan': datetime.now().isoformat()},
        ]
        
        # Initialize training modules
        self.training_modules = [
            {
                'id': 1,
                'title': 'Phishing Detection Basics',
                'description': 'Learn to identify and avoid phishing attacks',
                'difficulty': 'Beginner',
                'duration': '15 min',
                'completed': False,
                'scenarios': [
                    {
                        'question': 'You receive an email claiming to be from your bank asking you to verify your account. What should you do?',
                        'options': ['Click the link immediately', 'Contact your bank directly', 'Reply with your details', 'Forward to friends'],
                        'correct': 1
                    }
                ]
            },
            {
                'id': 2,
                'title': 'Password Security',
                'description': 'Best practices for creating and managing secure passwords',
                'difficulty': 'Beginner',
                'duration': '20 min',
                'completed': False,
                'scenarios': []
            },
            {
                'id': 3,
                'title': 'Ransomware Protection',
                'description': 'Understand how ransomware works and how to protect against it',
                'difficulty': 'Intermediate',
                'duration': '25 min',
                'completed': False,
                'scenarios': []
            },
            {
                'id': 4,
                'title': 'Social Engineering Defense',
                'description': 'Recognize and defend against social engineering tactics',
                'difficulty': 'Intermediate',
                'duration': '30 min',
                'completed': False,
                'scenarios': []
            },
            {
                'id': 5,
                'title': 'Advanced Threat Detection',
                'description': 'Learn to identify sophisticated cyber threats',
                'difficulty': 'Advanced',
                'duration': '45 min',
                'completed': False,
                'scenarios': []
            }
        ]
    
    def generate_threat(self, user):
        threat_type = random.choice(self.threat_types)
        severity_levels = ['Low', 'Medium', 'High', 'Critical']
        severity = random.choice(severity_levels)
        
        threat = {
            'id': len(self.threats) + 1,
            'type': threat_type,
            'severity': severity,
            'timestamp': datetime.now().isoformat(),
            'user': user,
            'status': 'blocked',
            'details': {
                'source_ip': f'{random.randint(1,255)}.{random.randint(1,255)}.{random.randint(1,255)}.{random.randint(1,255)}',
                'destination_port': random.randint(1, 65535),
                'protocol': random.choice(['TCP', 'UDP', 'HTTP', 'HTTPS', 'FTP']),
                'attack_vector': random.choice(['Email', 'Web', 'Network', 'Application', 'Physical']),
                'affected_systems': random.randint(1, 10)
            }
        }
        self.threats.append(threat)
        return threat

db = SecurityDB()

# API Endpoints

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat(),
        'version': '2.0.0'
    })

# Heimdall - Threat Detection
@app.route('/api/simulate/heimdall', methods=['POST'])
def simulate_threat():
    user = request.headers.get('X-User-Login', 'rahullalwani007')
    threat_detected = random.choice([True, True, True, False])  # 75% chance
    
    if threat_detected:
        threat = db.generate_threat(user)
        return jsonify({
            'threat_detected': True,
            'details': threat,
            'action_taken': 'Automatically blocked and quarantined',
            'timestamp': datetime.now().isoformat()
        })
    
    return jsonify({
        'threat_detected': False,
        'message': 'Network scan complete. No threats detected.',
        'timestamp': datetime.now().isoformat()
    })

@app.route('/api/threats/history', methods=['GET'])
def get_threats_history():
    return jsonify({
        'threats': db.threats[-20:],  # Last 20 threats
        'total': len(db.threats),
        'blocked': len([t for t in db.threats if t['status'] == 'blocked']),
        'timestamp': datetime.now().isoformat()
    })

@app.route('/api/threats/analytics', methods=['GET'])
def get_threat_analytics():
    # Generate analytics data
    threat_by_type = {}
    for threat in db.threats:
        threat_type = threat['type']
        threat_by_type[threat_type] = threat_by_type.get(threat_type, 0) + 1
    
    severity_distribution = {}
    for threat in db.threats:
        severity = threat['severity']
        severity_distribution[severity] = severity_distribution.get(severity, 0) + 1
    
    return jsonify({
        'threat_by_type': threat_by_type,
        'severity_distribution': severity_distribution,
        'total_threats': len(db.threats),
        'threats_last_24h': len([t for t in db.threats if datetime.fromisoformat(t['timestamp']) > datetime.now() - timedelta(days=1)]),
        'blocked_rate': 100 if len(db.threats) > 0 else 0,
        'timestamp': datetime.now().isoformat()
    })

# Vault - Encryption
@app.route('/api/simulate/vault', methods=['POST'])
def simulate_encryption():
    data = request.get_json() or {}
    filename = data.get('filename', 'document.pdf')
    
    # Simulate encryption process
    encryption_key = hashlib.sha256(str(random.random()).encode()).hexdigest()
    
    file_data = {
        'id': len(db.encrypted_files) + 1,
        'filename': filename,
        'encrypted': True,
        'encryption_key': encryption_key[:32] + '...',
        'algorithm': 'AES-256-GCM',
        'timestamp': datetime.now().isoformat(),
        'size': random.randint(1000, 10000000),
        'checksum': hashlib.md5(filename.encode()).hexdigest()
    }
    
    db.encrypted_files.append(file_data)
    
    return jsonify({
        'success': True,
        'file': file_data,
        'message': 'File encrypted successfully with AES-256-GCM',
        'timestamp': datetime.now().isoformat()
    })

@app.route('/api/vault/files', methods=['GET'])
def get_encrypted_files():
    return jsonify({
        'files': db.encrypted_files,
        'total': len(db.encrypted_files),
        'total_size': sum([f['size'] for f in db.encrypted_files]),
        'timestamp': datetime.now().isoformat()
    })

@app.route('/api/vault/decrypt/<int:file_id>', methods=['POST'])
def decrypt_file(file_id):
    file_data = next((f for f in db.encrypted_files if f['id'] == file_id), None)
    
    if not file_data:
        return jsonify({'error': 'File not found'}), 404
    
    return jsonify({
        'success': True,
        'file': file_data,
        'message': 'File decrypted successfully',
        'timestamp': datetime.now().isoformat()
    })

# Privacy - Data Masking
@app.route('/api/simulate/privacy', methods=['POST'])
def toggle_privacy():
    data = request.get_json()
    field = data.get('field')
    is_masked = data.get('isMasked')
    
    masked_values = {
        'email': '***************@example.com' if is_masked else 'rahullalwani007@example.com',
        'phone': '*** *** ****' if is_masked else '+1 234 567 8900',
        'address': '*** **** **, ****' if is_masked else '123 Main St, City, ST 12345',
        'payment': '**** **** **** ****' if is_masked else '**** **** **** 4321'
    }
    
    return jsonify({
        'field': field,
        'value': masked_values.get(field, ''),
        'isMasked': is_masked,
        'timestamp': datetime.now().isoformat()
    })

@app.route('/api/privacy/settings', methods=['GET'])
def get_privacy_settings():
    return jsonify({
        'settings': {
            'email': {'masked': False, 'shared_with': []},
            'phone': {'masked': True, 'shared_with': []},
            'address': {'masked': True, 'shared_with': []},
            'payment': {'masked': True, 'shared_with': []}
        },
        'privacy_score': random.randint(75, 95),
        'timestamp': datetime.now().isoformat()
    })

@app.route('/api/privacy/score', methods=['GET'])
def get_privacy_score():
    return jsonify({
        'score': random.randint(75, 95),
        'factors': {
            'data_encryption': random.randint(80, 100),
            'access_control': random.randint(70, 95),
            'data_minimization': random.randint(65, 90),
            'third_party_sharing': random.randint(60, 85)
        },
        'recommendations': [
            'Enable two-factor authentication on all accounts',
            'Review third-party app permissions',
            'Update privacy settings on social media'
        ],
        'timestamp': datetime.now().isoformat()
    })

# Training - Security Awareness
@app.route('/api/training/modules', methods=['GET'])
def get_training_modules():
    return jsonify({
        'modules': db.training_modules,
        'total': len(db.training_modules),
        'completed': len([m for m in db.training_modules if m['completed']]),
        'timestamp': datetime.now().isoformat()
    })

@app.route('/api/training/start/<int:module_id>', methods=['POST'])
def start_training(module_id):
    module = next((m for m in db.training_modules if m['id'] == module_id), None)
    
    if not module:
        return jsonify({'error': 'Module not found'}), 404
    
    return jsonify({
        'module': module,
        'started_at': datetime.now().isoformat(),
        'estimated_completion': (datetime.now() + timedelta(minutes=int(module['duration'].split()[0]))).isoformat()
    })

@app.route('/api/training/submit/<int:module_id>', methods=['POST'])
def submit_training(module_id):
    data = request.get_json()
    answer = data.get('answer')
    
    module = next((m for m in db.training_modules if m['id'] == module_id), None)
    
    if not module:
        return jsonify({'error': 'Module not found'}), 404
    
    # Simulate grading
    score = random.randint(70, 100)
    passed = score >= 70
    
    if passed:
        module['completed'] = True
    
    return jsonify({
        'score': score,
        'passed': passed,
        'feedback': 'Great job! You demonstrated strong understanding of security concepts.' if passed else 'Review the material and try again.',
        'timestamp': datetime.now().isoformat()
    })

# Sentry - IoT Security
@app.route('/api/sentry/devices', methods=['GET'])
def get_devices():
    return jsonify({
        'devices': db.iot_devices,
        'total': len(db.iot_devices),
        'secured': len([d for d in db.iot_devices if d['status'] == 'secured']),
        'vulnerable': len([d for d in db.iot_devices if d['status'] in ['vulnerable', 'at_risk']]),
        'timestamp': datetime.now().isoformat()
    })

@app.route('/api/sentry/isolate/<int:device_id>', methods=['POST'])
def isolate_device(device_id):
    device = next((d for d in db.iot_devices if d['id'] == device_id), None)
    
    if not device:
        return jsonify({'error': 'Device not found'}), 404
    
    device['status'] = 'isolated'
    device['risk_level'] = 'quarantined'
    
    return jsonify({
        'success': True,
        'device': device,
        'message': f'{device["name"]} has been isolated from the network',
        'timestamp': datetime.now().isoformat()
    })

@app.route('/api/sentry/scan', methods=['POST'])
def scan_network():
    # Simulate network scan
    for device in db.iot_devices:
        device['last_scan'] = datetime.now().isoformat()
        # Randomly update status
        if random.random() > 0.7:
            device['status'] = random.choice(['secured', 'vulnerable', 'at_risk'])
            device['risk_level'] = random.choice(['low', 'medium', 'high'])
    
    return jsonify({
        'scan_complete': True,
        'devices_scanned': len(db.iot_devices),
        'vulnerabilities_found': len([d for d in db.iot_devices if d['status'] != 'secured']),
        'timestamp': datetime.now().isoformat()
    })

@app.route('/api/sentry/status/<int:device_id>', methods=['GET'])
def get_device_status(device_id):
    device = next((d for d in db.iot_devices if d['id'] == device_id), None)
    
    if not device:
        return jsonify({'error': 'Device not found'}), 404
    
    return jsonify({
        'device': device,
        'security_details': {
            'firmware_version': '2.1.0',
            'last_updated': datetime.now().isoformat(),
            'open_ports': [80, 443, 8080] if device['status'] == 'vulnerable' else [443],
            'encryption': device['status'] == 'secured'
        },
        'timestamp': datetime.now().isoformat()
    })

# Additional Security Features
@app.route('/api/security/audit', methods=['GET'])
def security_audit():
    return jsonify({
        'audit_score': random.randint(75, 95),
        'categories': {
            'network_security': random.randint(80, 100),
            'data_protection': random.randint(75, 95),
            'access_control': random.randint(70, 90),
            'incident_response': random.randint(65, 85),
            'compliance': random.randint(80, 95)
        },
        'recommendations': [
            'Implement multi-factor authentication across all systems',
            'Update firewall rules to block suspicious traffic',
            'Conduct quarterly security training for all employees',
            'Enable encryption for data at rest and in transit'
        ],
        'timestamp': datetime.now().isoformat()
    })

@app.route('/api/password/strength', methods=['POST'])
def check_password_strength():
    data = request.get_json()
    password = data.get('password', '')
    
    score = 0
    feedback = []
    
    if len(password) >= 8:
        score += 25
    else:
        feedback.append('Password should be at least 8 characters long')
    
    if any(c.isupper() for c in password):
        score += 25
    else:
        feedback.append('Add uppercase letters')
    
    if any(c.isdigit() for c in password):
        score += 25
    else:
        feedback.append('Add numbers')
    
    if any(c in '!@#$%^&*()_+-=[]{}|;:,.<>?' for c in password):
        score += 25
    else:
        feedback.append('Add special characters')
    
    strength = 'Weak' if score < 50 else 'Medium' if score < 75 else 'Strong' if score < 100 else 'Very Strong'
    
    return jsonify({
        'score': score,
        'strength': strength,
        'feedback': feedback,
        'timestamp': datetime.now().isoformat()
    })

# Phishing and Spam Analysis
@app.route('/api/phishing/analyze', methods=['POST'])
def analyze_content():
    data = request.get_json()
    text_content = data.get('text', '')

    # In a real application, you would send this to a powerful LLM API.
    # For this simulation, we'll use simple keyword matching.
    is_phishing = any(keyword in text_content.lower() for keyword in ['credit card', 'password', 'urgent', 'verify', 'ssn', 'bank account'])
    
    suspicion_score = random.randint(70, 100) if is_phishing else random.randint(0, 40)
    
    analysis = []
    if suspicion_score > 60:
        analysis.append('Urgent language detected, which is a common phishing tactic.')
        analysis.append('Requests for sensitive information (e.g., passwords, credit card numbers).')
    elif suspicion_score > 30:
        analysis.append('Contains links that should be verified before clicking.')
        analysis.append('Generic greetings are sometimes used in phishing emails.')
    else:
        analysis.append('The content appears to be safe.')
        analysis.append('No immediate signs of phishing or malicious intent detected.')
        
    return jsonify({
        'suspicion_score': suspicion_score,
        'analysis': '\n'.join(analysis)
    })

@app.route('/api/spam/check', methods=['POST'])
def check_spam_link():
    data = request.get_json()
    url = data.get('url', '')

    # Simple simulation of a spam check
    is_spam = any(shortener in url for shortener in ['bit.ly', 'tinyurl.com', 'shorturl.at'])
    
    return jsonify({
        'is_spam': is_spam,
        'reason': 'URL uses a known link shortener often used for spam.' if is_spam else 'URL does not appear to be a spam link.'
    })


# Error Handlers
@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Endpoint not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    print('🛡️  Aegis Security Suite Backend Starting...')
    print('📡 Server running on http://127.0.0.1:5000')
    print('👤 Current user: rahullalwani007')
    print('⏰ Current UTC time:', datetime.now().strftime('%Y-%m-%d %H:%M:%S'))
    app.run(debug=True, host='0.0.0.0', port=5000)