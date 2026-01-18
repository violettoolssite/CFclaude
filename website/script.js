// 复制代码功能
function copyCode(btn) {
  const code = btn.previousElementSibling.textContent;
  navigator.clipboard.writeText(code).then(() => {
    const originalText = btn.textContent;
    btn.textContent = '已复制!';
    btn.style.background = '#c8ff00';
    btn.style.color = '#0a0a0a';
    
    setTimeout(() => {
      btn.textContent = originalText;
      btn.style.background = '';
      btn.style.color = '';
    }, 2000);
  });
}

// 导航栏滚动效果
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset;
  
  if (currentScroll > 100) {
    navbar.style.background = 'rgba(10, 10, 10, 0.95)';
  } else {
    navbar.style.background = 'rgba(10, 10, 10, 0.8)';
  }
  
  lastScroll = currentScroll;
});

// 平滑滚动到锚点
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      const headerOffset = 80;
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  });
});

// 动画观察器 - 元素进入视口时添加动画
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

// 为需要动画的元素添加初始样式
document.addEventListener('DOMContentLoaded', () => {
  const animatedElements = document.querySelectorAll('.feature-card, .provider-card, .step');
  
  animatedElements.forEach((el, index) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = `all 0.6s ease ${index * 0.1}s`;
    observer.observe(el);
  });
});

// 打字机效果（可选）
function typeWriter(element, text, speed = 50) {
  let i = 0;
  element.textContent = '';
  
  function type() {
    if (i < text.length) {
      element.textContent += text.charAt(i);
      i++;
      setTimeout(type, speed);
    }
  }
  
  type();
}

// 统计数字动画
function animateNumber(element, target, duration = 2000) {
  const start = 0;
  const startTime = performance.now();
  
  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // 使用 easeOutQuart 缓动
    const easeProgress = 1 - Math.pow(1 - progress, 4);
    const current = Math.round(start + (target - start) * easeProgress);
    
    element.textContent = current;
    
    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }
  
  requestAnimationFrame(update);
}

// 页面加载完成后执行动画
window.addEventListener('load', () => {
  // 可以在这里添加更多的加载动画
  document.body.style.opacity = '1';
});

console.log('🚀 CFclaude Website Loaded');

