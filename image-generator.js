// 图片生成器脚本
document.addEventListener('DOMContentLoaded', function() {
    // 生成首页新闻图片
    if (document.getElementById('news-img-1')) {
        generateNewsImage('news-img-1', 400, 200, '#eef2ff', '#4c51bf', '支付解决方案');
        generateNewsImage('news-img-2', 400, 200, '#e6fffa', '#38b2ac', '电子商务转化率');
        generateNewsImage('news-img-3', 400, 200, '#fff5f5', '#e53e3e', '2024趋势预测');
    }
    
    // 生成新闻详情页图片
    if (document.getElementById('news-image-1')) {
        generateNewsImage('news-image-1', 800, 400, '#f5f7fa', '#e4e7eb', '支付解决方案示意图');
        generateNewsImage('news-image-2', 800, 400, '#eef2ff', '#c3dafe', '数字支付趋势图表');
    }
    
    // 生成相关新闻图片
    if (document.getElementById('related-news-img-1')) {
        generateNewsImage('related-news-img-1', 400, 200, '#f0fff4', '#c6f6d5', '电子商务转化率');
        generateNewsImage('related-news-img-2', 400, 200, '#ebf8ff', '#bee3f8', '2024趋势');
        generateNewsImage('related-news-img-3', 400, 200, '#fff5f5', '#fed7d7', '客户忠诚度');
    }
});

// 生成新闻图片的函数
function generateNewsImage(containerId, width, height, bgColor, textColor, text) {
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