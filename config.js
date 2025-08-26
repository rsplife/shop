// 环境配置文件
// 根据不同环境配置不同的API端点和密钥

// 检测当前环境
const detectEnvironment = () => {
    const hostname = window.location.hostname;
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
        return 'development';
    } else if (hostname.includes('vercel.app') || hostname.includes('staging')) {
        return 'staging';
    } else {
        return 'production';
    }
};

const CONFIG = {
    // 环境配置
    ENVIRONMENT: detectEnvironment(),
    
    // API配置
    API: {
        development: {
            BASE_URL: 'http://localhost:3000/api',
            TIMEOUT: 10000,
            RETRY_ATTEMPTS: 3
        },
        staging: {
            BASE_URL: '/api', // 使用 Vercel 代理
            TIMEOUT: 15000,
            RETRY_ATTEMPTS: 3
        },
        production: {
            BASE_URL: '/api', // 使用 Vercel 代理
            TIMEOUT: 20000,
            RETRY_ATTEMPTS: 5
        }
    },
    
    // 支付配置
    PAYMENT: {
        // 支付宝配置
        ALIPAY: {
            APP_ID: process.env.ALIPAY_APP_ID || 'your_alipay_app_id',
            GATEWAY_URL: 'https://openapi.alipay.com/gateway.do',
            RETURN_URL: window.location.origin + '/payment/alipay/return',
            NOTIFY_URL: 'https://api.digitalplanet.com/payment/alipay/notify'
        },
        
        // 微信支付配置
        WECHAT: {
            APP_ID: process.env.WECHAT_APP_ID || 'your_wechat_app_id',
            MCH_ID: process.env.WECHAT_MCH_ID || 'your_merchant_id',
            API_URL: 'https://api.mch.weixin.qq.com',
            NOTIFY_URL: 'https://api.digitalplanet.com/payment/wechat/notify'
        },
        
        // Stripe配置（银行卡支付）
        STRIPE: {
            PUBLIC_KEY: process.env.STRIPE_PUBLIC_KEY || 'pk_test_your_stripe_public_key',
            API_VERSION: '2023-10-16'
        }
    },
    
    // 社交登录配置
    SOCIAL_LOGIN: {
        GOOGLE: {
            CLIENT_ID: process.env.GOOGLE_CLIENT_ID || 'your_google_client_id',
            REDIRECT_URI: window.location.origin + '/auth/google/callback',
            SCOPE: 'openid email profile'
        },
        
        GITHUB: {
            CLIENT_ID: process.env.GITHUB_CLIENT_ID || 'your_github_client_id',
            REDIRECT_URI: window.location.origin + '/auth/github/callback',
            SCOPE: 'user:email'
        },
        
        WECHAT: {
            APP_ID: process.env.WECHAT_LOGIN_APP_ID || 'your_wechat_login_app_id',
            REDIRECT_URI: window.location.origin + '/auth/wechat/callback',
            SCOPE: 'snsapi_login'
        }
    },
    
    // JWT配置
    JWT: {
        ALGORITHM: 'HS256',
        EXPIRES_IN: '24h',
        REFRESH_EXPIRES_IN: '7d'
    },
    
    // 安全配置
    SECURITY: {
        PASSWORD_MIN_LENGTH: 8,
        PASSWORD_REQUIRE_UPPERCASE: true,
        PASSWORD_REQUIRE_LOWERCASE: true,
        PASSWORD_REQUIRE_NUMBERS: true,
        PASSWORD_REQUIRE_SYMBOLS: true,
        MAX_LOGIN_ATTEMPTS: 5,
        LOCKOUT_TIME: 15 * 60 * 1000, // 15分钟
        SESSION_TIMEOUT: 30 * 60 * 1000 // 30分钟
    },
    
    // 邮件配置
    EMAIL: {
        SMTP_HOST: process.env.SMTP_HOST || 'smtp.gmail.com',
        SMTP_PORT: process.env.SMTP_PORT || 587,
        SMTP_USER: process.env.SMTP_USER || 'your_email@gmail.com',
        FROM_EMAIL: 'noreply@digitalplanet.com',
        FROM_NAME: '数字星球'
    },
    
    // 文件上传配置
    UPLOAD: {
        MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
        ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
        UPLOAD_PATH: '/uploads/'
    },
    
    // 缓存配置
    CACHE: {
        DEFAULT_TTL: 3600, // 1小时
        USER_SESSION_TTL: 1800, // 30分钟
        PRODUCT_CACHE_TTL: 7200 // 2小时
    }
};

// 获取当前环境的API配置
CONFIG.getCurrentApiConfig = function() {
    return this.API[this.ENVIRONMENT] || this.API.development;
};

// 获取完整的API端点URL
CONFIG.getApiUrl = function(endpoint) {
    const apiConfig = this.getCurrentApiConfig();
    return `${apiConfig.BASE_URL}${endpoint}`;
};

// 验证配置
CONFIG.validate = function() {
    const apiConfig = this.getCurrentApiConfig();
    if (!apiConfig.BASE_URL) {
        throw new Error('API Base URL is not configured');
    }
    
    // 在生产环境中验证必要的环境变量
    if (this.ENVIRONMENT === 'production') {
        const requiredEnvVars = [
            'ALIPAY_APP_ID',
            'WECHAT_APP_ID',
            'STRIPE_PUBLIC_KEY',
            'GOOGLE_CLIENT_ID',
            'GITHUB_CLIENT_ID'
        ];
        
        const missing = requiredEnvVars.filter(varName => !process.env[varName]);
        if (missing.length > 0) {
            console.warn('Missing environment variables:', missing);
        }
    }
};

// 导出配置
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
} else {
    window.CONFIG = CONFIG;
}

// 初始化时验证配置
try {
    CONFIG.validate();
} catch (error) {
    console.error('Configuration validation failed:', error);
}