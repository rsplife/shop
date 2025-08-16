// 这个文件用于生成SVG图片，因为我们不能直接创建二进制图片文件
document.addEventListener('DOMContentLoaded', function() {
    // 创建SVG图片并替换页面中的img标签
    createPlaceholderImages();
    
    // 检查是否在首页
    if (document.getElementById('news-img-1')) {
        createSvgImage('news-img-1', 400, 200, '#eef2ff', '#4c51bf', '支付解决方案');
        createSvgImage('news-img-2', 400, 200, '#e6fffa', '#38b2ac', '电子商务转化率');
        createSvgImage('news-img-3', 400, 200, '#fff5f5', '#e53e3e', '2024趋势预测');
    }
    
    // 检查是否在新闻详情页
    if (document.getElementById('news-image-1')) {
        createSvgImage('news-image-1', 800, 400, '#f5f7fa', '#e4e7eb', '支付解决方案示意图');
        createSvgImage('news-image-2', 800, 400, '#eef2ff', '#c3dafe', '数字支付趋势图表');
    }
    
    // 检查是否有相关新闻图片
    if (document.getElementById('related-news-img-1')) {
        createSvgImage('related-news-img-1', 400, 200, '#f0fff4', '#c6f6d5', '电子商务转化率');
        createSvgImage('related-news-img-2', 400, 200, '#ebf8ff', '#bee3f8', '2024趋势');
        createSvgImage('related-news-img-3', 400, 200, '#fff5f5', '#fed7d7', '客户忠诚度');
    }
});

function createPlaceholderImages() {
    // 创建产品图片的SVG占位符
    createSVGPlaceholder('gmail-main.jpg', '#3498db', 'Gmail', 'white');
    createSVGPlaceholder('gmail-2.jpg', '#2980b9', 'Gmail', 'white');
    createSVGPlaceholder('gmail-3.jpg', '#1abc9c', 'Gmail', 'white');
    createSVGPlaceholder('gmail-4.jpg', '#16a085', 'Gmail', 'white');
    
    // 创建相关产品图片
    createSVGPlaceholder('outlook.jpg', '#e74c3c', 'Outlook', 'white');
    createSVGPlaceholder('google-drive.jpg', '#f39c12', 'Drive', 'white');
    createSVGPlaceholder('youtube.jpg', '#c0392b', 'YouTube', 'white');
    createSVGPlaceholder('protonmail.jpg', '#8e44ad', 'ProtonMail', 'white');
    
    // 创建用户头像
    createSVGPlaceholder('user1.jpg', '#2c3e50', 'User 1', 'white');
    createSVGPlaceholder('user2.jpg', '#27ae60', 'User 2', 'white');
    createSVGPlaceholder('user3.jpg', '#d35400', 'User 3', 'white');
    
    // 创建评价图片
    createSVGPlaceholder('review-image1.jpg', '#95a5a6', 'Review 1', 'white');
    createSVGPlaceholder('review-image2.jpg', '#7f8c8d', 'Review 2', 'white');
}

function createSVGPlaceholder(imageName, bgColor, text, textColor) {
    // 查找所有使用该图片名称的img标签
    const imgElements = document.querySelectorAll(`img[src="${imageName}"]`);
    
    imgElements.forEach(img => {
        // 获取图片尺寸
        const width = img.width || 300;
        const height = img.height || 200;
        
        // 创建SVG
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', width);
        svg.setAttribute('height', height);
        svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
        svg.style.backgroundColor = bgColor;
        
        // 添加文本
        const textElement = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        textElement.setAttribute('x', '50%');
        textElement.setAttribute('y', '50%');
        textElement.setAttribute('dominant-baseline', 'middle');
        textElement.setAttribute('text-anchor', 'middle');
        textElement.setAttribute('fill', textColor);
        textElement.setAttribute('font-family', 'Arial, sans-serif');
        textElement.setAttribute('font-size', '24px');
        textElement.textContent = text;
        
        svg.appendChild(textElement);
        
        // 将SVG转换为Data URL
        const svgData = new XMLSerializer().serializeToString(svg);
        const svgDataUrl = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
        
        // 替换img的src
        img.src = svgDataUrl;
    });
}

// 生成SVG图片的函数
function createSvgImage(containerId, width, height, bgColor, textColor, text) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
    svg.style.display = 'block';
    
    // 背景矩形
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('width', width);
    rect.setAttribute('height', height);
    rect.setAttribute('fill', bgColor || '#f0f0f0');
    svg.appendChild(rect);
    
    // 添加文本
    const textElement = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    textElement.setAttribute('x', width / 2);
    textElement.setAttribute('y', height / 2);
    textElement.setAttribute('text-anchor', 'middle');
    textElement.setAttribute('dominant-baseline', 'middle');
    textElement.setAttribute('fill', textColor || '#333');
    textElement.setAttribute('font-family', 'Arial, sans-serif');
    textElement.setAttribute('font-size', '16');
    textElement.textContent = text || '图片占位符';
    svg.appendChild(textElement);
    
    container.appendChild(svg);
}