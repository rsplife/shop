// 数字星球配置文件
// 浏览器环境专用版本

(function() {
    'use strict';
    
    // 检测当前环境
    function detectEnvironment() {
        if (typeof window === 'undefined') return 'development';
        
        const hostname = window.location.hostname;
        if (hostname === 'localhost' || hostname === '127.0.0.1') {
            return 'development';
        } else if (hostname.includes('vercel.app') || hostname.includes('staging')) {
            return 'staging';
        } else {
            return 'production';
        }
    }

    // 配置对象
    const CONFIG = {
        // 环境配置
        ENVIRONMENT: detectEnvironment(),
        
        // API配置
        API: {
            development: {
                BASE_URL: 'http://localhost:5000/api',
                TIMEOUT: 10000,
                RETRY_ATTEMPTS: 3
            },
            staging: {
                BASE_URL: 'https://shop-34y5grpcm-reslifes-projects.vercel.app/api',
                TIMEOUT: 15000,
                RETRY_ATTEMPTS: 3
            },
            production: {
                BASE_URL: 'https://shop-34y5grpcm-reslifes-projects.vercel.app/api',
                TIMEOUT: 20000,
                RETRY_ATTEMPTS: 5
            }
        },
        
        // 安全配置
        SECURITY: {
            PASSWORD_MIN_LENGTH: 8,
            PASSWORD_MAX_LENGTH: 128,
            USERNAME_MIN_LENGTH: 3,
            USERNAME_MAX_LENGTH: 50,
            EMAIL_MAX_LENGTH: 255,
            PHONE_LENGTH: 11,
            AMOUNT_MAX_DIGITS: 10,
            AMOUNT_MAX_DECIMAL_PLACES: 2
        },
        
        // 社交登录配置
        SOCIAL_LOGIN: {
            GOOGLE: {
                CLIENT_ID: 'your_google_client_id',
                REDIRECT_URI: (typeof window !== 'undefined' ? window.location.origin : '') + '/auth/google/callback',
                SCOPE: 'openid email profile'
            },
            
            GITHUB: {
                CLIENT_ID: 'your_github_client_id',
                REDIRECT_URI: (typeof window !== 'undefined' ? window.location.origin : '') + '/auth/github/callback',
                SCOPE: 'user:email'
            },
            
            WECHAT: {
                APP_ID: 'your_wechat_login_app_id',
                REDIRECT_URI: (typeof window !== 'undefined' ? window.location.origin : '') + '/auth/wechat/callback',
                SCOPE: 'snsapi_login'
            }
        },
        
        // 获取当前环境的API配置
        getCurrentApiConfig: function() {
            return this.API[this.ENVIRONMENT] || this.API.development;
        },
        
        // 获取完整的API端点URL
        getApiUrl: function(endpoint) {
            const apiConfig = this.getCurrentApiConfig();
            return apiConfig.BASE_URL + endpoint;
        },
        
        // 验证配置
        validate: function() {
            const apiConfig = this.getCurrentApiConfig();
            if (!apiConfig.BASE_URL) {
                throw new Error('API Base URL is not configured');
            }
            return true;
        }
    };
    
    // 导出到全局作用域
    if (typeof window !== 'undefined') {
        window.CONFIG = CONFIG;
    }
    
    if (typeof global !== 'undefined') {
        global.CONFIG = CONFIG;
    }
    
    // 验证配置
    try {
        CONFIG.validate();
        console.log('CONFIG loaded successfully:', CONFIG.ENVIRONMENT);
    } catch (error) {
        console.error('Configuration validation failed:', error);
    }
    
})();