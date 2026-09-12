/**
 * Environment Configuration
 * This file centralizes all environment-specific configuration
 */

const ENV = {
  prod: {
    API_URL: 'https://budgettrack-back.onrender.com',
    API_TIMEOUT: 10000,
    LOG_LEVEL: 'error',
  },
};

const getConfig = () => {
  return ENV.prod;
};

export default getConfig();
