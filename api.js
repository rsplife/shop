// 数字星球 - 后端API接口配置
// 这是一个模拟的后端API配置文件，实际部署时需要连接真实的后端服务

const API_BASE_URL = 'https://api.digitalplanet.com'; // 后端API基础URL

// API接口配置
const API_ENDPOINTS = {
    // 用户认证相关
    auth: {
        login: `${API_BASE_URL}/auth/login`,
        register: `${API_BASE_URL}/auth/register`,
        logout: `${API_BASE_URL}/auth/logout`,
        refreshToken: `${API_BASE_URL}/auth/refresh`,
        forgotPassword: `${API_BASE_URL}/auth/forgot-password`,
        resetPassword: `${API_BASE_URL}/auth/reset-password`,
        // 社交登录
        socialLogin: {
            google: `${API_BASE_URL}/auth/google`,
            apple: `${API_BASE_URL}/auth/apple`,
            github: `${API_BASE_URL}/auth/github`,
            wechat: `${API_BASE_URL}/auth/wechat`,
            qq: `${API_BASE_URL}/auth/qq`,
            telegram: `${API_BASE_URL}/auth/telegram`
        }
    },
    
    // 用户信息相关
    user: {
        profile: `${API_BASE_URL}/user/profile`,
        updateProfile: `${API_BASE_URL}/user/profile`,
        changePassword: `${API_BASE_URL}/user/change-password`,
        orders: `${API_BASE_URL}/user/orders`,
        favorites: `${API_BASE_URL}/user/favorites`
    },
    
    // 产品相关
    products: {
        list: `${API_BASE_URL}/products`,
        detail: `${API_BASE_URL}/products/:id`,
        categories: `${API_BASE_URL}/products/categories`,
        search: `${API_BASE_URL}/products/search`
    },
    
    // 购物车相关
    cart: {
        get: `${API_BASE_URL}/cart`,
        add: `${API_BASE_URL}/cart/add`,
        update: `${API_BASE_URL}/cart/update`,
        remove: `${API_BASE_URL}/cart/remove`,
        clear: `${API_BASE_URL}/cart/clear`
    },
    
    // 订单相关
    orders: {
        create: `${API_BASE_URL}/orders`,
        list: `${API_BASE_URL}/orders`,
        detail: `${API_BASE_URL}/orders/:id`,
        cancel: `${API_BASE_URL}/orders/:id/cancel`
    },
    
    // 支付相关
    payment: {
        create: `${API_BASE_URL}/payment/create`,
        verify: `${API_BASE_URL}/payment/verify`,
        methods: `${API_BASE_URL}/payment/methods`
    }
};

// HTTP请求工具函数
class ApiClient {
    constructor() {
        this.token = localStorage.getItem('authToken');
    }
    
    // 设置认证令牌
    setToken(token) {
        this.token = token;
        localStorage.setItem('authToken', token);
    }
    
    // 清除认证令牌
    clearToken() {
        this.token = null;
        localStorage.removeItem('authToken');
    }
    
    // 获取请求头
    getHeaders() {
        const headers = {
            'Content-Type': 'application/json'
        };
        
        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }
        
        return headers;
    }
    
    // GET请求
    async get(url) {
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: this.getHeaders()
            });
            return await this.handleResponse(response);
        } catch (error) {
            console.error('GET请求失败:', error);
            throw error;
        }
    }
    
    // POST请求
    async post(url, data) {
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: this.getHeaders(),
                body: JSON.stringify(data)
            });
            return await this.handleResponse(response);
        } catch (error) {
            console.error('POST请求失败:', error);
            throw error;
        }
    }
    
    // PUT请求
    async put(url, data) {
        try {
            const response = await fetch(url, {
                method: 'PUT',
                headers: this.getHeaders(),
                body: JSON.stringify(data)
            });
            return await this.handleResponse(response);
        } catch (error) {
            console.error('PUT请求失败:', error);
            throw error;
        }
    }
    
    // DELETE请求
    async delete(url) {
        try {
            const response = await fetch(url, {
                method: 'DELETE',
                headers: this.getHeaders()
            });
            return await this.handleResponse(response);
        } catch (error) {
            console.error('DELETE请求失败:', error);
            throw error;
        }
    }
    
    // 处理响应
    async handleResponse(response) {
        if (response.status === 401) {
            // 未授权，清除令牌并跳转到登录页
            this.clearToken();
            window.location.href = '/login.html';
            throw new Error('未授权访问');
        }
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || '请求失败');
        }
        
        return await response.json();
    }
}

// 创建API客户端实例
const apiClient = new ApiClient();

// 用户认证API
const AuthAPI = {
    // 用户登录
    async login(email, password, rememberMe = false) {
        const data = await apiClient.post(API_ENDPOINTS.auth.login, {
            email,
            password,
            rememberMe
        });
        
        if (data.token) {
            apiClient.setToken(data.token);
        }
        
        return data;
    },
    
    // 用户注册
    async register(username, email, password) {
        return await apiClient.post(API_ENDPOINTS.auth.register, {
            username,
            email,
            password
        });
    },
    
    // 社交登录
    async socialLogin(provider) {
        const url = API_ENDPOINTS.auth.socialLogin[provider];
        if (!url) {
            throw new Error('不支持的登录方式');
        }
        
        // 重定向到社交登录页面
        window.location.href = url;
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

// 用户信息API
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
    }
};

// 导出API
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        API_ENDPOINTS,
        ApiClient,
        AuthAPI,
        UserAPI,
        ProductAPI,
        CartAPI
    };
} else {
    // 浏览器环境
    window.API_ENDPOINTS = API_ENDPOINTS;
    window.ApiClient = ApiClient;
    window.AuthAPI = AuthAPI;
    window.UserAPI = UserAPI;
    window.ProductAPI = ProductAPI;
    window.CartAPI = CartAPI;
}