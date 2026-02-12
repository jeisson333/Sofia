require('dotenv').config();

const config = {
  // ServiceDesk Plus configuration
  sdp: {
    baseUrl: process.env.SDP_BASE_URL,
    apiKey: process.env.SDP_API_KEY,
    technicianKey: process.env.SDP_TECHNICIAN_KEY,
  },

  // Microsoft Teams configuration
  teams: {
    webhookUrl: process.env.TEAMS_WEBHOOK_URL,
  },

  // Server configuration
  server: {
    port: process.env.PORT || 3000,
    env: process.env.NODE_ENV || 'development',
  },

  // Agent configuration
  agent: {
    name: process.env.AGENT_NAME || 'Sofia',
    version: process.env.AGENT_VERSION || '1.0.0',
  },
};

// Validate required configuration
const validateConfig = () => {
  const required = [
    'SDP_BASE_URL',
    'SDP_API_KEY',
    'SDP_TECHNICIAN_KEY',
    'TEAMS_WEBHOOK_URL',
  ];

  const missing = required.filter(key => !process.env[key]);

  if (missing.length > 0) {
    console.warn(`Warning: Missing environment variables: ${missing.join(', ')}`);
    console.warn('Please check your .env file. Using example values for development.');
  }
};

validateConfig();

module.exports = config;
