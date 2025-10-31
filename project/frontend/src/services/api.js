import axios from 'axios';
import { APP_CONFIG } from '../config/constants';

const api = axios.create({
  baseURL: APP_CONFIG.API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'X-User-Login': APP_CONFIG.CURRENT_USER
  }
});

export const heimdallService = {
  simulateThreatDetection: () => api.post('/api/simulate/heimdall'),
  getThreatsHistory: () => api.get('/api/threats/history'),
  getThreatAnalytics: () => api.get('/api/threats/analytics'),
  analyzeNetwork: () => api.post('/api/analyze/network')
};

export const vaultService = {
  simulateEncryption: (filename) => api.post('/api/simulate/vault', { filename }),
  getEncryptedFiles: () => api.get('/api/vault/files'),
  decryptFile: (fileId) => api.post(`/api/vault/decrypt/${fileId}`)
};

export const privacyService = {
  toggleFieldMask: (field, isMasked) => 
    api.post('/api/simulate/privacy', { field, isMasked }),
  getPrivacySettings: () => api.get('/api/privacy/settings'),
  getPrivacyScore: () => api.get('/api/privacy/score'),
  updatePrivacyPolicy: (settings) => api.post('/api/privacy/settings', settings)
};

export const phalanxService = {
  getTrainingModules: () => api.get('/api/training/modules'),
  startSimulation: (moduleId) => api.post(`/api/training/start/${moduleId}`),
  submitAnswer: (moduleId, answer) => api.post(`/api/training/submit/${moduleId}`, { answer })
};

export const phishingService = {
  analyzeContent: (text) => api.post('/api/phishing/analyze', { text }),
  checkSpamLink: (url) => api.post('/api/spam/check', { url }),
};

export const sentryService = {
  getDevices: () => api.get('/api/sentry/devices'),
  isolateDevice: (deviceId) => api.post(`/api/sentry/isolate/${deviceId}`),
  scanNetwork: () => api.post('/api/sentry/scan'),
  getDeviceStatus: (deviceId) => api.get(`/api/sentry/status/${deviceId}`)
};

export const securityService = {
  getSecurityAudit: () => api.get('/api/security/audit'),
  checkPasswordStrength: (password) => api.post('/api/password/strength', { password })
};