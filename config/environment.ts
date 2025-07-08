// 环境配置
export const ENV_CONFIG = {
  // 当前环境：development | production
  NODE_ENV: process.env.NODE_ENV || 'development',
  
  // API配置
  API: {
    // 开发环境API地址（使用代理避免跨域）
    DEVELOPMENT: {
      BASE_URL: '/api'
    },
    
    // 生产环境API地址（待配置）
    PRODUCTION: {
      BASE_URL: 'https://api.your-production-domain.com'
    }
  }
};

// 获取当前环境的API基础URL
export const getApiBaseUrl = () => {
  return ENV_CONFIG.NODE_ENV === 'production' 
    ? ENV_CONFIG.API.PRODUCTION.BASE_URL 
    : ENV_CONFIG.API.DEVELOPMENT.BASE_URL;
};

// 导出当前使用的API配置
export const CURRENT_API_CONFIG = {
  BASE_URL: getApiBaseUrl(),
  ENDPOINTS: {
    AGENTS: '/hedge-fund/agents'
  }
}; 