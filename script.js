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
            header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
            header.style.background = 'rgba(255, 255, 255, 0.95)';
        } else {
            header.style.boxShadow = '0 2px 15px rgba(0, 0, 0, 0.1)';
            header.style.background = 'white';
        }
        
        lastScrollTop = scrollTop;
    });
    
    // 平滑滚动到锚点
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // 考虑导航栏高度
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // 产品卡片悬停效果增强
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px)';
            card.style.boxShadow = '0 15px 30px rgba(0, 0, 0, 0.1)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
            card.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.05)';
        });
    });
    
    // 购物车功能
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
        if (!document.querySelector('.cart-icon')) {
            // 创建购物车图标元素
            const cartItem = document.createElement('li');
            cartItem.className = 'cart-icon';
            
            cartItem.innerHTML = `
                <a href="cart.html">
                    <i class="fas fa-shopping-cart"></i>
                    <span class="cart-count">0</span>
                </a>
            `;
            
            // 添加样式
            const style = document.createElement('style');
            style.textContent = `
                .cart-icon {
                    position: relative;
                }
                
                .cart-icon a {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.2rem;
                }
                
                .cart-count {
                    position: absolute;
                    top: -8px;
                    right: -8px;
                    background-color: #e74c3c;
                    color: white;
                    font-size: 0.7rem;
                    width: 18px;
                    height: 18px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                
                .notification {
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    background: #2ecc71;
                    color: white;
                    padding: 15px 25px;
                    border-radius: 5px;
                    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
                    z-index: 1000;
                    animation: slideIn 0.3s ease, fadeOut 0.5s ease 2.5s forwards;
                }
                
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                
                @keyframes fadeOut {
                    from { opacity: 1; }
                    to { opacity: 0; }
                }
            `;
            
            document.head.appendChild(style);
            
            // 插入到登录/注册按钮之前
            const loginButton = nav.querySelector('li:last-child');
            nav.insertBefore(cartItem, loginButton);
        }
    }
}

// 设置添加到购物车按钮的事件监听
function setupAddToCartButtons() {
    const addToCartButtons = document.querySelectorAll('.btn-primary');
    
    addToCartButtons.forEach(button => {
        // 只为产品卡片中的按钮添加事件
        if (button.closest('.product-card') || button.classList.contains('add-to-cart-btn')) {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                
                // 获取产品信息
                let productName, productPrice, productImage, productQuantity = 1;
                
                if (button.classList.contains('add-to-cart-btn')) {
                    // 产品详情页
                    productName = document.querySelector('.product-info-detail h1').textContent;
                    productPrice = parseFloat(document.querySelector('.current-price').textContent.replace('¥', ''));
                    productImage = document.getElementById('main-image').src;
                    productQuantity = parseInt(document.querySelector('.quantity-input').value);
                } else {
                    // 产品卡片
                    const productCard = button.closest('.product-card');
                    productName = productCard.querySelector('h3').textContent;
                    productPrice = parseFloat(productCard.querySelector('.price').textContent.replace('¥', ''));
                    productImage = productCard.querySelector('img').src;
                }
                
                // 添加到购物车
                addToCart({
                    name: productName,
                    price: productPrice,
                    image: productImage,
                    quantity: productQuantity
                });
                
                // 显示添加成功提示
                showNotification(`已将 ${productQuantity} 个 ${productName} 添加到购物车`);
            });
        }
    });
}

// 添加商品到购物车
function addToCart(product) {
    // 从本地存储获取购物车
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // 检查商品是否已在购物车中
    const existingProductIndex = cart.findIndex(item => item.name === product.name);
    
    if (existingProductIndex !== -1) {
        // 更新数量
        cart[existingProductIndex].quantity += product.quantity;
    } else {
        // 添加新商品
        cart.push(product);
    }
    
    // 保存到本地存储
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // 更新购物车计数
    updateCartCount();
}

// 更新购物车计数
function updateCartCount() {
    const cartCountElement = document.querySelector('.cart-count');
    
    if (cartCountElement) {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        
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
    // 创建通知元素
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `<p>${message}</p>`;
    
    // 添加到页面
    document.body.appendChild(notification);
    
    // 3秒后移除
    setTimeout(() => {
        notification.remove();
    }, 3000);
}
    
    // 模拟产品搜索功能
    const searchForm = document.createElement('div');
    searchForm.className = 'search-form';
    searchForm.innerHTML = `
        <input type="text" placeholder="搜索产品...">
        <button><i class="fas fa-search"></i></button>
    `;
    
    // 将搜索框添加到导航栏
    const nav = document.querySelector('nav ul');
    nav.insertBefore(searchForm, nav.firstChild);
    
    // 搜索框样式
    const style = document.createElement('style');
    style.textContent = `
        .search-form {
            display: flex;
            margin-right: 20px;
        }
        
        .search-form input {
            padding: 8px 15px;
            border: 1px solid #e0e0e0;
            border-radius: 20px 0 0 20px;
            outline: none;
            width: 200px;
        }
        
        .search-form button {
            background: #3498db;
            color: white;
            border: none;
            padding: 8px 15px;
            border-radius: 0 20px 20px 0;
            cursor: pointer;
        }
        
        @media (max-width: 992px) {
            .search-form {
                margin: 10px 0;
                width: 100%;
            }
            
            .search-form input {
                width: 100%;
            }
        }
    `;
    
    document.head.appendChild(style);
    
    // 购物车功能
    const cartIcon = document.createElement('li');
    cartIcon.innerHTML = `<a href="#" class="cart-icon"><i class="fas fa-shopping-cart"></i> <span class="cart-count">0</span></a>`;
    nav.appendChild(cartIcon);
    
    // 购物车样式
    const cartStyle = document.createElement('style');
    cartStyle.textContent = `
        .cart-icon {
            position: relative;
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
        }
    `;
    
    document.head.appendChild(cartStyle);
    
    // 添加到购物车功能
    const buyButtons = document.querySelectorAll('.product-info .btn-primary');
    let cartCount = 0;
    
    buyButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // 增加购物车数量
            cartCount++;
            document.querySelector('.cart-count').textContent = cartCount;
            
            // 获取产品信息
            const productCard = this.closest('.product-card');
            const productName = productCard.querySelector('h3').textContent;
            const productPrice = productCard.querySelector('.price').textContent;
            
            // 显示添加成功提示
            const notification = document.createElement('div');
            notification.className = 'notification';
            notification.innerHTML = `<p>已将 ${productName} 添加到购物车</p>`;
            document.body.appendChild(notification);
            
            // 添加通知样式
            const notificationStyle = document.createElement('style');
            notificationStyle.textContent = `
                .notification {
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    background: #2ecc71;
                    color: white;
                    padding: 15px 25px;
                    border-radius: 5px;
                    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
                    z-index: 1000;
                    animation: slideIn 0.3s ease, fadeOut 0.5s ease 2.5s forwards;
                }
                
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                
                @keyframes fadeOut {
                    from { opacity: 1; }
                    to { opacity: 0; }
                }
            `;
            
            document.head.appendChild(notificationStyle);
            
            // 3秒后移除通知
            setTimeout(() => {
                notification.remove();
                notificationStyle.remove();
            }, 3000);
        });
    });
    
    // 创建返回顶部按钮
    const backToTop = document.createElement('div');
    backToTop.className = 'back-to-top';
    backToTop.innerHTML = '<i class="fas fa-arrow-up"></i>';
    document.body.appendChild(backToTop);
    
    // 返回顶部按钮样式
    const backToTopStyle = document.createElement('style');
    backToTopStyle.textContent = `
        .back-to-top {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 40px;
            height: 40px;
            background: #3498db;
            color: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
            z-index: 999;
            box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
        }
        
        .back-to-top.visible {
            opacity: 1;
            visibility: visible;
        }
        
        .back-to-top:hover {
            background: #2980b9;
            transform: translateY(-3px);
        }
    `;
    
    document.head.appendChild(backToTopStyle);
    
    // 返回顶部功能
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });
    
    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
});