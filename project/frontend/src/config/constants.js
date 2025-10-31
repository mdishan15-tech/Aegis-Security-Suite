export const APP_CONFIG = {
  CURRENT_USER: 'Avengers Assemble',
  API_BASE_URL: process.env.REACT_APP_API_URL || 'http://127.0.0.1:5000',
  CURRENT_UTC: '2025-10-29 06:06:24'
};

export const ROUTES = {
  HOME: '/',
  HEIMDALL: '/heimdall',
  VAULT: '/vault',
  PRIVACY: '/privacy',
  TRAINING: '/training',
  SENTRY: '/sentry'
};

export const THREAT_SEVERITY_COLORS = {
  Low: 'text-green-500 bg-green-500/10 border-green-500/20',
  Medium: 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20',
  High: 'text-orange-500 bg-orange-500/10 border-orange-500/20',
  Critical: 'text-red-500 bg-red-500/10 border-red-500/20'
};

export const DEVICE_STATUS_COLORS = {
  secured: 'text-green-500',
  vulnerable: 'text-yellow-500',
  at_risk: 'text-orange-500',
  isolated: 'text-red-500'
};