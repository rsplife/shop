// 数字星球 - 增强版后端API接口配置
// 集成配置管理、JWT认证、支付系统、安全验证等功能

// 引入配置文件
// 注意：在实际部署时，config.js应该在api.js之前加载

// ==================== 安全中间件和数据验证 ====================

// 数据验证工具类
class DataValidator {
    // 验证邮箱格式
    static validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // 验证密码强度
    static validatePassword(password) {
        if (password.length < 8) {
            return { valid: false, message: '密码长度至少8位' };
        }
        if (!/(?=.*[a-z])/.test(password)) {
            return { valid: false, message: '密码必须包含小写字母' };
        }
        if (!/(?=.*[A-Z])/.test(password)) {
            return { valid: false, message: '密码必须包含大写字母' };
        }
        if (!/(?=.*\d)/.test(password)) {
            return { valid: false, message: '密码必须包含数字' };
        }
        if (!/(?=.*[@$!%*?&])/.test(password)) {
            return { valid: false, message: '密码必须包含特殊字符(@$!%*?&)' };
        }
        return { valid: true, message: '密码强度符合要求' };
    }
    
    // 验证手机号码
    static validatePhone(phone) {
        const phoneRegex = /^1[3-9]\d{9}$/;
        return phoneRegex.test(phone);
    }
    
    // 验证用户名
    static validateUsername(username) {
        if (username.length < 3 || username.length > 20) {
            return { valid: false, message: '用户名长度必须在3-20位之间' };
        }
        if (!/^[a-zA-Z0-9_\u4e00-\u9fa5]+$/.test(username)) {
            return { valid: false, message: '用户名只能包含字母、数字、下划线和中文' };
        }
        return { valid: true, message: '用户名格式正确' };
    }
    
    // 验证金额
    static validateAmount(amount) {
        const num = parseFloat(amount);
        if (isNaN(num) || num <= 0) {
            return { valid: false, message: '金额必须为正数' };
        }
        if (num > 999999.99) {
            return { valid: false, message: '金额不能超过999999.99' };
        }
        return { valid: true, message: '金额格式正确' };
    }
    
    // 清理和转义HTML内容
    static sanitizeHtml(str) {
        if (typeof str !== 'string') return str;
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#x27;')
            .replace(/\//g, '&#x2F;');
    }
    
    // 验证SQL注入
    static validateSqlInjection(str) {
        if (typeof str !== 'string') return { valid: true };
        const sqlPatterns = [
            /('|(\-\-)|(;)|(\||\|)|(\*|\*))/i,
            /(union|select|insert|delete|update|drop|create|alter|exec|execute)/i
        ];
        
        for (const pattern of sqlPatterns) {
            if (pattern.test(str)) {
                return { valid: false, message: '输入包含非法字符' };
            }
        }
        return { valid: true };
    }
    
    // 验证XSS攻击
    static validateXss(str) {
        if (typeof str !== 'string') return { valid: true };
        const xssPatterns = [
            /<script[^>]*>.*?<\/script>/gi,
            /<iframe[^>]*>.*?<\/iframe>/gi,
            /javascript:/gi,
            /on\w+\s*=/gi
        ];
        
        for (const pattern of xssPatterns) {
            if (pattern.test(str)) {
                return { valid: false, message: '输入包含非法脚本' };
            }
        }
        return { valid: true };
    }
}

// 安全中间件类
class SecurityMiddleware {
    // 请求频率限制
    static rateLimiter = new Map();
    
    // 检查请求频率
    static checkRateLimit(identifier, maxRequests = 100, windowMs = 60000) {
        const now = Date.now();
        const windowStart = now - windowMs;
        
        if (!this.rateLimiter.has(identifier)) {
            this.rateLimiter.set(identifier, []);
        }
        
        const requests = this.rateLimiter.get(identifier);
        // 清理过期请求
        const validRequests = requests.filter(time => time > windowStart);
        
        if (validRequests.length >= maxRequests) {
            return { allowed: false, message: '请求过于频繁，请稍后再试' };
        }
        
        validRequests.push(now);
        this.rateLimiter.set(identifier, validRequests);
        
        return { allowed: true };
    }
    
    // 生成CSRF令牌
    static generateCsrfToken() {
        const array = new Uint8Array(32);
        crypto.getRandomValues(array);
        return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    }
    
    // 验证CSRF令牌
    static validateCsrfToken(token, sessionToken) {
        return token === sessionToken;
    }
    
    // 检查用户代理
    static validateUserAgent(userAgent) {
        if (!userAgent || userAgent.length < 10) {
            return { valid: false, message: '无效的用户代理' };
        }
        
        // 检查是否为已知的恶意用户代理
        const maliciousPatterns = [
            /bot/i,
            /crawler/i,
            /spider/i,
            /scraper/i
        ];
        
        for (const pattern of maliciousPatterns) {
            if (pattern.test(userAgent)) {
                return { valid: false, message: '检测到自动化请求' };
            }
        }
        
        return { valid: true };
    }
    
    // 验证请求来源
    static validateOrigin(origin, allowedOrigins = []) {
        if (!origin) {
            return { valid: false, message: '缺少请求来源' };
        }
        
        if (allowedOrigins.length === 0) {
            return { valid: true }; // 如果没有限制，则允许所有来源
        }
        
        const isAllowed = allowedOrigins.some(allowed => {
            if (allowed === '*') return true;
            if (allowed.startsWith('*.')) {
                const domain = allowed.substring(2);
                return origin.endsWith(domain);
            }
            return origin === allowed;
        });
        
        return {
            valid: isAllowed,
            message: isAllowed ? '请求来源验证通过' : '请求来源不被允许'
        };
    }
    
    // 加密敏感数据
    static encryptSensitiveData(data, key) {
        // 简单的加密实现（实际项目中应使用更强的加密算法）
        try {
            const jsonString = JSON.stringify(data);
            const encrypted = btoa(jsonString); // Base64编码
            return encrypted;
        } catch (error) {
            console.error('数据加密失败:', error);
            return null;
        }
    }
    
    // 解密敏感数据
    static decryptSensitiveData(encryptedData, key) {
        try {
            const decrypted = atob(encryptedData); // Base64解码
            return JSON.parse(decrypted);
        } catch (error) {
            console.error('数据解密失败:', error);
            return null;
        }
    }
}

// 请求拦截器
class RequestInterceptor {
    static async validateRequest(url, options = {}) {
        const errors = [];
        
        // 验证URL
        try {
            new URL(url);
        } catch {
            errors.push('无效的请求URL');
        }
        
        // 验证请求方法
        const method = options.method || 'GET';
        const allowedMethods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];
        if (!allowedMethods.includes(method.toUpperCase())) {
            errors.push('不支持的请求方法');
        }
        
        // 验证请求体
        if (options.body && typeof options.body === 'string') {
            try {
                const data = JSON.parse(options.body);
                // 验证每个字段
                for (const [key, value] of Object.entries(data)) {
                    if (typeof value === 'string') {
                        const sqlCheck = DataValidator.validateSqlInjection(value);
                        const xssCheck = DataValidator.validateXss(value);
                        
                        if (!sqlCheck.valid) {
                            errors.push(`字段 ${key}: ${sqlCheck.message}`);
                        }
                        if (!xssCheck.valid) {
                            errors.push(`字段 ${key}: ${xssCheck.message}`);
                        }
                    }
                }
            } catch {
                errors.push('请求体格式错误');
            }
        }
        
        // 检查请求频率
        const identifier = this.getRequestIdentifier();
        const rateLimit = SecurityMiddleware.checkRateLimit(identifier);
        if (!rateLimit.allowed) {
            errors.push(rateLimit.message);
        }
        
        return {
            valid: errors.length === 0,
            errors: errors
        };
    }
    
    static getRequestIdentifier() {
        // 使用IP地址或用户ID作为标识符
        return localStorage.getItem('userInfo') ? 
            JSON.parse(localStorage.getItem('userInfo')).id || 'anonymous' : 
            'anonymous';
    }
}

// ==================== API配置 ====================

// API配置 - 使用配置文件中的设置
const getApiBaseUrl = () => {
    if (typeof CONFIG !== 'undefined') {
        return CONFIG.getCurrentApiConfig().BASE_URL;
    }
    // fallback到默认配置
    return 'https://api.digitalplanet.com/api';
};

const API_BASE_URL = getApiBaseUrl();

// API端点配置
const API_ENDPOINTS = {
    // 认证相关
    auth: {
        login: `${API_BASE_URL}/auth/login`,
        register: `${API_BASE_URL}/auth/register`,
        logout: `${API_BASE_URL}/auth/logout`,
        refreshToken: `${API_BASE_URL}/auth/refresh-token`,
        forgotPassword: `${API_BASE_URL}/auth/forgot-password`,
        resetPassword: `${API_BASE_URL}/auth/reset-password`,
        verifyEmail: `${API_BASE_URL}/auth/verify-email`,
        resendVerification: `${API_BASE_URL}/auth/resend-verification`,
        changePassword: `${API_BASE_URL}/auth/change-password`,
        // 社交登录端点
        socialLogin: {
            google: `${API_BASE_URL}/auth/google`,
            apple: `${API_BASE_URL}/auth/apple`,
            github: `${API_BASE_URL}/auth/github`,
            wechat: `${API_BASE_URL}/auth/wechat`,
            qq: `${API_BASE_URL}/auth/qq`,
            telegram: `${API_BASE_URL}/auth/telegram`
        },
        socialCallback: `${API_BASE_URL}/auth/social/callback`
    },
    
    // 用户信息相关
    user: {
        profile: `${API_BASE_URL}/user/profile`,
        updateProfile: `${API_BASE_URL}/user/profile`,
        changePassword: `${API_BASE_URL}/user/change-password`,
        orders: `${API_BASE_URL}/user/orders`,
        favorites: `${API_BASE_URL}/user/favorites`,
        addresses: `${API_BASE_URL}/user/addresses`,
        notifications: `${API_BASE_URL}/user/notifications`
    },
    
    // 产品相关
    products: {
        list: `${API_BASE_URL}/products`,
        detail: `${API_BASE_URL}/products/:id`,
        categories: `${API_BASE_URL}/products/categories`,
        search: `${API_BASE_URL}/products/search`,
        reviews: `${API_BASE_URL}/products/:id/reviews`,
        related: `${API_BASE_URL}/products/:id/related`
    },
    
    // 购物车相关
    cart: {
        get: `${API_BASE_URL}/cart`,
        add: `${API_BASE_URL}/cart/add`,
        update: `${API_BASE_URL}/cart/update`,
        remove: `${API_BASE_URL}/cart/remove`,
        clear: `${API_BASE_URL}/cart/clear`,
        count: `${API_BASE_URL}/cart/count`
    },
    
    // 订单相关
    orders: {
        create: `${API_BASE_URL}/orders`,
        list: `${API_BASE_URL}/orders`,
        detail: `${API_BASE_URL}/orders/:id`,
        cancel: `${API_BASE_URL}/orders/:id/cancel`,
        track: `${API_BASE_URL}/orders/:id/track`,
        refund: `${API_BASE_URL}/orders/:id/refund`
    },
    
    // 支付相关
    payment: {
        create: `${API_BASE_URL}/payment/create`,
        verify: `${API_BASE_URL}/payment/verify`,
        methods: `${API_BASE_URL}/payment/methods`,
        alipay: {
            create: `${API_BASE_URL}/payment/alipay/create`,
            verify: `${API_BASE_URL}/payment/alipay/verify`,
            notify: `${API_BASE_URL}/payment/alipay/notify`
        },
        wechat: {
            create: `${API_BASE_URL}/payment/wechat/create`,
            verify: `${API_BASE_URL}/payment/wechat/verify`,
            notify: `${API_BASE_URL}/payment/wechat/notify`
        },
        stripe: {
            create: `${API_BASE_URL}/payment/stripe/create`,
            verify: `${API_BASE_URL}/payment/stripe/verify`,
            webhook: `${API_BASE_URL}/payment/stripe/webhook`
        }
    }
};

// 增强版API客户端类
class ApiClient {
    constructor() {
        this.token = localStorage.getItem('auth_token');
        this.refreshToken = localStorage.getItem('refresh_token');
        this.isRefreshing = false;
        this.failedQueue = [];
    }
    
    // 设置认证令牌
    setToken(token, refreshToken = null) {
        this.token = token;
        localStorage.setItem('auth_token', token);
        
        if (refreshToken) {
            this.refreshToken = refreshToken;
            localStorage.setItem('refresh_token', refreshToken);
        }
    }
    
    // 清除认证令牌
    clearToken() {
        this.token = null;
        this.refreshToken = null;
        localStorage.removeItem('auth_token');
        localStorage.removeItem('refresh_token');
    }
    
    // 获取请求头
    getHeaders() {
        const headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        };
        
        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }
        
        return headers;
    }
    
    // 处理令牌刷新
    async refreshAuthToken() {
        if (this.isRefreshing) {
            return new Promise((resolve, reject) => {
                this.failedQueue.push({ resolve, reject });
            });
        }
        
        this.isRefreshing = true;
        
        try {
            const response = await fetch(API_ENDPOINTS.auth.refreshToken, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    refreshToken: this.refreshToken
                })
            });
            
            if (response.ok) {
                const data = await response.json();
                this.setToken(data.accessToken, data.refreshToken);
                
                // 处理队列中的请求
                this.failedQueue.forEach(({ resolve }) => resolve(data.accessToken));
                this.failedQueue = [];
                
                return data.accessToken;
            } else {
                throw new Error('Token refresh failed');
            }
        } catch (error) {
            this.failedQueue.forEach(({ reject }) => reject(error));
            this.failedQueue = [];
            this.clearToken();
            window.location.href = '/login.html';
            throw error;
        } finally {
            this.isRefreshing = false;
        }
    }
    
    // GET请求
    async get(url) {
        return this.request(url, { method: 'GET' });
    }
    
    // POST请求
    async post(url, data) {
        return this.request(url, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }
    
    // PUT请求
    async put(url, data) {
        return this.request(url, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }
    
    // DELETE请求
    async delete(url) {
        return this.request(url, { method: 'DELETE' });
    }
    
    // 通用请求方法
    async request(url, options = {}) {
        const config = typeof CONFIG !== 'undefined' ? CONFIG.getCurrentApiConfig() : { TIMEOUT: 10000, RETRY_ATTEMPTS: 3 };
        
        // ==================== 安全验证 ====================
        
        // 1. 请求验证
        const validation = await RequestInterceptor.validateRequest(url, options);
        if (!validation.valid) {
            throw new Error(`请求验证失败: ${validation.errors.join(', ')}`);
        }
        
        // 2. 数据清理和验证
        if (options.body && typeof options.body === 'string') {
            try {
                const data = JSON.parse(options.body);
                const cleanedData = {};
                
                for (const [key, value] of Object.entries(data)) {
                    if (typeof value === 'string') {
                        // 清理HTML内容
                        cleanedData[key] = DataValidator.sanitizeHtml(value);
                    } else {
                        cleanedData[key] = value;
                    }
                }
                
                options.body = JSON.stringify(cleanedData);
            } catch (error) {
                console.warn('数据清理失败:', error);
            }
        }
        
        // 3. 添加安全头部
        const requestOptions = {
            ...options,
            headers: {
                ...this.getHeaders(),
                ...options.headers,
                'X-Requested-With': 'XMLHttpRequest',
                'X-Content-Type-Options': 'nosniff',
                'X-Frame-Options': 'DENY',
                'X-XSS-Protection': '1; mode=block'
            }
        };
        
        // 4. 添加CSRF令牌（如果需要）
        if (['POST', 'PUT', 'DELETE', 'PATCH'].includes((options.method || 'GET').toUpperCase())) {
            const csrfToken = localStorage.getItem('csrfToken') || SecurityMiddleware.generateCsrfToken();
            localStorage.setItem('csrfToken', csrfToken);
            requestOptions.headers['X-CSRF-Token'] = csrfToken;
        }
        
        // 5. 添加超时控制
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), config.TIMEOUT);
        requestOptions.signal = controller.signal;
        
        try {
            // 6. 记录请求日志（开发环境）
            if (typeof CONFIG !== 'undefined' && CONFIG.getCurrentApiConfig().DEBUG) {
                console.log('API请求:', {
                    url,
                    method: options.method || 'GET',
                    headers: requestOptions.headers,
                    timestamp: new Date().toISOString()
                });
            }
            
            const response = await fetch(url, requestOptions);
            clearTimeout(timeoutId);
            
            // 7. 处理401未授权错误
            if (response.status === 401 && this.refreshToken) {
                try {
                    await this.refreshAuthToken();
                    // 重新发送原始请求
                    requestOptions.headers['Authorization'] = `Bearer ${this.token}`;
                    const retryResponse = await fetch(url, requestOptions);
                    return this.handleResponse(retryResponse);
                } catch (refreshError) {
                    // 清除无效的认证信息
                    this.clearToken();
                    localStorage.removeItem('userInfo');
                    throw new Error('Authentication failed');
                }
            }
            
            // 8. 处理其他HTTP错误状态
            if (response.status === 403) {
                throw new Error('访问被拒绝，权限不足');
            }
            if (response.status === 429) {
                throw new Error('请求过于频繁，请稍后再试');
            }
            if (response.status >= 500) {
                throw new Error('服务器内部错误，请稍后再试');
            }
            
            return this.handleResponse(response);
        } catch (error) {
            clearTimeout(timeoutId);
            
            // 9. 错误处理和日志记录
            if (error.name === 'AbortError') {
                throw new Error('Request timeout');
            }
            
            // 记录错误日志
            console.error('API请求失败:', {
                url,
                method: options.method || 'GET',
                error: error.message,
                timestamp: new Date().toISOString()
            });
            
            throw error;
        }
    }
    
    // 处理响应
    async handleResponse(response) {
        const contentType = response.headers.get('content-type');
        
        if (contentType && contentType.includes('application/json')) {
            const data = await response.json();
            
            if (response.ok) {
                return data;
            } else {
                throw new Error(data.message || `HTTP ${response.status}: ${response.statusText}`);
            }
        } else {
            if (response.ok) {
                return await response.text();
            } else {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
        }
    }
}

// 创建API客户端实例
const apiClient = new ApiClient();

// 认证API
const AuthAPI = {
    // 用户登录
    async login(email, password, rememberMe = false) {
        try {
            const response = await apiClient.post(API_ENDPOINTS.auth.login, {
                email,
                password,
                rememberMe
            });
            
            if (response.accessToken) {
                apiClient.setToken(response.accessToken, response.refreshToken);
            }
            
            return response;
        } catch (error) {
            throw new Error(error.message || '登录失败');
        }
    },
    
    // 用户注册
    async register(username, email, password) {
        // 密码强度验证
        if (typeof CONFIG !== 'undefined') {
            const security = CONFIG.SECURITY;
            if (password.length < security.PASSWORD_MIN_LENGTH) {
                throw new Error(`密码长度至少${security.PASSWORD_MIN_LENGTH}位`);
            }
            
            if (security.PASSWORD_REQUIRE_UPPERCASE && !/[A-Z]/.test(password)) {
                throw new Error('密码必须包含大写字母');
            }
            
            if (security.PASSWORD_REQUIRE_LOWERCASE && !/[a-z]/.test(password)) {
                throw new Error('密码必须包含小写字母');
            }
            
            if (security.PASSWORD_REQUIRE_NUMBERS && !/\d/.test(password)) {
                throw new Error('密码必须包含数字');
            }
            
            if (security.PASSWORD_REQUIRE_SYMBOLS && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
                throw new Error('密码必须包含特殊字符');
            }
        }
        
        return await apiClient.post(API_ENDPOINTS.auth.register, {
            username,
            email,
            password
        });
    },
    
    // 邮箱验证
    async verifyEmail(token) {
        return await apiClient.post(API_ENDPOINTS.auth.verifyEmail, { token });
    },
    
    // 重发验证邮件
    async resendVerification(email) {
        return await apiClient.post(API_ENDPOINTS.auth.resendVerification, { email });
    },
    
    // 忘记密码
    async forgotPassword(email) {
        return await apiClient.post(API_ENDPOINTS.auth.forgotPassword, { email });
    },
    
    // 重置密码
    async resetPassword(token, newPassword) {
        return await apiClient.post(API_ENDPOINTS.auth.resetPassword, {
            token,
            newPassword
        });
    },
    
    // 社交登录
    async socialLogin(provider, isRegister = false) {
        const url = API_ENDPOINTS.auth.socialLogin[provider];
        if (!url) {
            throw new Error('不支持的登录方式');
        }
        
        // 返回授权URL，让调用方处理跳转
        return {
            success: true,
            data: {
                authUrl: url + (isRegister ? '&register=true' : '')
            }
        };
    },
    
    // 处理社交登录回调
    async handleSocialCallback(provider, code, state) {
        return await apiClient.post(API_ENDPOINTS.auth.socialCallback, {
            provider,
            code,
            state
        });
    },
    
    // 显示社交登录授权弹窗
    showSocialLoginModal(provider, authUrl) {
        // 创建模态框
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
        `;
        
        const modalContent = document.createElement('div');
        modalContent.style.cssText = `
            background: white;
            padding: 30px;
            border-radius: 10px;
            text-align: center;
            max-width: 400px;
            width: 90%;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        `;
        
        const providerNames = {
            google: 'Google',
            apple: 'Apple ID',
            github: 'GitHub',
            wechat: '微信',
            qq: 'QQ',
            telegram: 'Telegram'
        };
        
        modalContent.innerHTML = `
            <div style="margin-bottom: 20px;">
                <i class="fas fa-shield-alt" style="font-size: 48px; color: #007bff; margin-bottom: 15px;"></i>
                <h3 style="margin: 0 0 10px 0;">授权登录</h3>
                <p style="color: #666; margin: 0;">即将跳转到 ${providerNames[provider]} 进行安全登录</p>
            </div>
            
            <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin-bottom: 20px; font-size: 14px; color: #666;">
                <i class="fas fa-info-circle" style="margin-right: 8px;"></i>
                我们不会存储您的${providerNames[provider]}密码，登录过程完全安全
            </div>
            
            <div style="display: flex; gap: 10px; justify-content: center;">
                <button id="confirmAuth" style="
                    background: #007bff;
                    color: white;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 5px;
                    cursor: pointer;
                    font-size: 16px;
                ">继续登录</button>
                <button id="cancelAuth" style="
                    background: #6c757d;
                    color: white;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 5px;
                    cursor: pointer;
                    font-size: 16px;
                ">取消</button>
            </div>
        `;
        
        modal.appendChild(modalContent);
        document.body.appendChild(modal);
        
        // 绑定事件
        document.getElementById('confirmAuth').addEventListener('click', () => {
            // 模拟授权登录过程
            modalContent.innerHTML = `
                <div style="text-align: center;">
                    <i class="fas fa-spinner fa-spin" style="font-size: 48px; color: #007bff; margin-bottom: 15px;"></i>
                    <h3 style="margin: 0 0 10px 0;">正在授权...</h3>
                    <p style="color: #666; margin: 0;">请稍候，正在与${providerNames[provider]}建立安全连接</p>
                </div>
            `;
            
            // 模拟登录成功
            setTimeout(() => {
                modalContent.innerHTML = `
                    <div style="text-align: center;">
                        <i class="fas fa-check-circle" style="font-size: 48px; color: #28a745; margin-bottom: 15px;"></i>
                        <h3 style="margin: 0 0 10px 0;">登录成功！</h3>
                        <p style="color: #666; margin: 0;">欢迎回到数字星球</p>
                    </div>
                `;
                
                setTimeout(() => {
                    document.body.removeChild(modal);
                    // 模拟登录成功后的操作
                    alert('登录成功！欢迎回到数字星球');
                    window.location.href = 'index.html';
                }, 1500);
            }, 2000);
        });
        
        document.getElementById('cancelAuth').addEventListener('click', () => {
            document.body.removeChild(modal);
        });
        
        // 点击背景关闭
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });
    },
    
    // 用户登出
    async logout() {
        try {
            await apiClient.post(API_ENDPOINTS.auth.logout);
        } finally {
            apiClient.clearToken();
            window.location.href = '/index.html';
        }
    }
};

// 支付API
const PaymentAPI = {
    // 创建支付订单
    async createPayment(orderData, paymentMethod) {
        const endpoint = this.getPaymentEndpoint(paymentMethod);
        return await apiClient.post(endpoint, orderData);
    },
    
    // 验证支付结果
    async verifyPayment(paymentId, paymentMethod) {
        const endpoint = this.getVerifyEndpoint(paymentMethod);
        return await apiClient.post(endpoint, { paymentId });
    },
    
    // 获取支付方式
    async getPaymentMethods() {
        return await apiClient.get(API_ENDPOINTS.payment.methods);
    },
    
    // 获取支付端点
    getPaymentEndpoint(method) {
        switch (method) {
            case 'alipay':
                return API_ENDPOINTS.payment.alipay.create;
            case 'wechat':
                return API_ENDPOINTS.payment.wechat.create;
            case 'stripe':
            case 'card':
                return API_ENDPOINTS.payment.stripe.create;
            default:
                return API_ENDPOINTS.payment.create;
        }
    },
    
    // 获取验证端点
    getVerifyEndpoint(method) {
        switch (method) {
            case 'alipay':
                return API_ENDPOINTS.payment.alipay.verify;
            case 'wechat':
                return API_ENDPOINTS.payment.wechat.verify;
            case 'stripe':
            case 'card':
                return API_ENDPOINTS.payment.stripe.verify;
            default:
                return API_ENDPOINTS.payment.verify;
        }
    }
};

// 用户API
const UserAPI = {
    // 获取用户信息
    async getProfile() {
        return await apiClient.get(API_ENDPOINTS.user.profile);
    },
    
    // 更新用户信息
    async updateProfile(data) {
        return await apiClient.put(API_ENDPOINTS.user.updateProfile, data);
    },
    
    // 获取用户订单
    async getOrders() {
        return await apiClient.get(API_ENDPOINTS.user.orders);
    },
    
    // 获取用户地址
    async getAddresses() {
        return await apiClient.get(API_ENDPOINTS.user.addresses);
    },
    
    // 获取通知
    async getNotifications() {
        return await apiClient.get(API_ENDPOINTS.user.notifications);
    }
};

// 产品API
const ProductAPI = {
    // 获取产品列表
    async getProducts(params = {}) {
        const url = new URL(API_ENDPOINTS.products.list);
        Object.keys(params).forEach(key => {
            url.searchParams.append(key, params[key]);
        });
        return await apiClient.get(url.toString());
    },
    
    // 获取产品详情
    async getProductDetail(id) {
        const url = API_ENDPOINTS.products.detail.replace(':id', id);
        return await apiClient.get(url);
    },
    
    // 获取产品分类
    async getCategories() {
        return await apiClient.get(API_ENDPOINTS.products.categories);
    },
    
    // 搜索产品
    async searchProducts(query, params = {}) {
        const url = new URL(API_ENDPOINTS.products.search);
        url.searchParams.append('q', query);
        Object.keys(params).forEach(key => {
            url.searchParams.append(key, params[key]);
        });
        return await apiClient.get(url.toString());
    }
};

// 购物车API
const CartAPI = {
    // 获取购物车
    async getCart() {
        return await apiClient.get(API_ENDPOINTS.cart.get);
    },
    
    // 添加到购物车
    async addToCart(productId, quantity = 1) {
        return await apiClient.post(API_ENDPOINTS.cart.add, {
            productId,
            quantity
        });
    },
    
    // 更新购物车项目
    async updateCartItem(itemId, quantity) {
        return await apiClient.put(API_ENDPOINTS.cart.update, {
            itemId,
            quantity
        });
    },
    
    // 从购物车移除
    async removeFromCart(itemId) {
        return await apiClient.delete(`${API_ENDPOINTS.cart.remove}/${itemId}`);
    },
    
    // 清空购物车
    async clearCart() {
        return await apiClient.delete(API_ENDPOINTS.cart.clear);
    },
    
    // 获取购物车商品数量
    async getCartCount() {
        return await apiClient.get(API_ENDPOINTS.cart.count);
    }
};

// 订单API
const OrderAPI = {
    // 创建订单
    async createOrder(orderData) {
        return await apiClient.post(API_ENDPOINTS.orders.create, orderData);
    },
    
    // 获取订单列表
    async getOrders(params = {}) {
        const url = new URL(API_ENDPOINTS.orders.list);
        Object.keys(params).forEach(key => {
            url.searchParams.append(key, params[key]);
        });
        return await apiClient.get(url.toString());
    },
    
    // 获取订单详情
    async getOrderDetail(id) {
        const url = API_ENDPOINTS.orders.detail.replace(':id', id);
        return await apiClient.get(url);
    },
    
    // 取消订单
    async cancelOrder(id) {
        const url = API_ENDPOINTS.orders.cancel.replace(':id', id);
        return await apiClient.post(url);
    },
    
    // 跟踪订单
    async trackOrder(id) {
        const url = API_ENDPOINTS.orders.track.replace(':id', id);
        return await apiClient.get(url);
    }
};

// 导出API
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        API_ENDPOINTS,
        ApiClient,
        AuthAPI,
        PaymentAPI,
        UserAPI,
        ProductAPI,
        CartAPI,
        OrderAPI,
        // 安全中间件和验证工具
        DataValidator,
        SecurityMiddleware,
        RequestInterceptor
    };
} else {
    // 浏览器环境
    window.API_ENDPOINTS = API_ENDPOINTS;
    window.ApiClient = ApiClient;
    window.AuthAPI = AuthAPI;
    window.PaymentAPI = PaymentAPI;
    window.UserAPI = UserAPI;
    window.ProductAPI = ProductAPI;
    window.CartAPI = CartAPI;
    window.OrderAPI = OrderAPI;
    // 安全中间件和验证工具
    window.DataValidator = DataValidator;
    window.SecurityMiddleware = SecurityMiddleware;
    window.RequestInterceptor = RequestInterceptor;
}