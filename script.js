document.addEventListener('DOMContentLoaded', function() {
    // FAQ 折叠展开功能
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            // 关闭其他打开的FAQ项
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });
            
            // 切换当前项的状态
            item.classList.toggle('active');
        });
    });
    
    // 简单的轮播图功能
    let currentTestimonial = 0;
    const testimonials = document.querySelectorAll('.testimonial');
    const totalTestimonials = testimonials.length;
    
    // 如果有多个评价，则设置自动轮播
    if (totalTestimonials > 1) {
        // 初始化显示第一个评价
        testimonials.forEach((testimonial, index) => {
            if (index !== 0) {
                testimonial.style.display = 'none';
            }
        });
        
        // 自动轮播
        setInterval(() => {
            testimonials[currentTestimonial].style.display = 'none';
            currentTestimonial = (currentTestimonial + 1) % totalTestimonials;
            testimonials[currentTestimonial].style.display = 'block';
        }, 5000); // 每5秒切换一次
    }
    
    // 滚动时导航栏效果
    const header = document.querySelector('header');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // 导航栏隐藏/显示效果
        if (scrollTop > lastScrollTop && scrollTop > 200) {
            // 向下滚动，隐藏导航栏
            header.style.transform = 'translateY(-100%)';
        } else {
            // 向上滚动，显示导航栏
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
    });
    
    // 购物车功能设置
    setupShoppingCart();
});

// 购物车功能设置
function setupShoppingCart() {
    // 添加购物车图标到导航栏
    addCartIconToNav();
    
    // 设置添加到购物车按钮的事件监听
    setupAddToCartButtons();
    
    // 从本地存储加载购物车数据
    loadCartFromStorage();
}

// 添加购物车图标到导航栏
function addCartIconToNav() {
    const nav = document.querySelector('nav ul');
    
    if (nav) {
        // 检查是否已经存在购物车图标
        if (!nav.querySelector('.cart-icon')) {
            const cartItem = document.createElement('li');
            cartItem.innerHTML = '<a href="cart.html" class="cart-icon"><i class="fas fa-shopping-cart"></i> <span class="cart-count">0</span></a>';
            nav.appendChild(cartItem);
            
            // 添加购物车图标样式
            const style = document.createElement('style');
            style.textContent = `
                .cart-icon {
                    position: relative;
                    color: #333;
                    text-decoration: none;
                }
                
                .cart-count {
                    position: absolute;
                    top: -8px;
                    right: -8px;
                    background: #e74c3c;
                    color: white;
                    font-size: 0.7rem;
                    width: 18px;
                    height: 18px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: bold;
                }
            `;
            document.head.appendChild(style);
        }
    }
}

// 设置添加到购物车按钮的事件监听
function setupAddToCartButtons() {
    const addToCartButtons = document.querySelectorAll('.btn-primary');
    
    addToCartButtons.forEach(button => {
        if (button.textContent.includes('立即购买') || button.textContent.includes('购买')) {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                
                // 获取产品信息
                const productCard = this.closest('.product-card') || this.closest('.product-info');
                if (productCard) {
                    const productName = productCard.querySelector('h3')?.textContent || '产品';
                    const productPrice = productCard.querySelector('.price')?.textContent || '¥0';
                    
                    const product = {
                        name: productName,
                        price: productPrice,
                        quantity: 1
                    };
                    
                    addToCart(product);
                }
            });
        }
    });
}

// 添加产品到购物车
function addToCart(product) {
    // 从本地存储获取当前购物车
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // 检查产品是否已存在
    const existingProduct = cart.find(item => item.name === product.name);
    
    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        cart.push(product);
    }
    
    // 保存到本地存储
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // 更新购物车计数
    updateCartCount();
    
    // 显示通知
    showNotification(`${product.name} 已添加到购物车`);
}

// 更新购物车计数
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    const cartCountElement = document.querySelector('.cart-count');
    if (cartCountElement) {
        cartCountElement.textContent = totalItems;
    }
}

// 从本地存储加载购物车数据
function loadCartFromStorage() {
    // 更新购物车计数
    updateCartCount();
}

// 显示通知
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    // 添加样式
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #2ecc71;
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;
    
    // 添加动画样式
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
    }
    
    // 添加到页面
    document.body.appendChild(notification);
    
    // 3秒后移除
    setTimeout(() => {
        notification.remove();
    }, 3000);
}
