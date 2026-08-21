// 智慧党建综合智能管理平台 - 公共函数库

// 关闭模态框
function closeModal(modalId) {
  document.getElementById(modalId).classList.remove('show');
}

// 打开模态框
function openModal(modalId) {
  document.getElementById(modalId).classList.add('show');
}

// 导出数据
function exportData(type) {
  alert('导出' + type + '数据');
}

// 导入数据
function importData(type) {
  alert('导入' + type + '数据');
}

// 标签页切换
function switchTab(tabName) {
  document.querySelectorAll('.tab-nav-item').forEach(item => item.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
  
  event.target.classList.add('active');
  document.getElementById('tab-' + tabName).classList.add('active');
}

// 点击模态框外部关闭
window.onclick = function(event) {
  const modals = document.querySelectorAll('.modal');
  modals.forEach(modal => {
    if (event.target === modal) {
      modal.classList.remove('show');
    }
  });
}

// 获取当前页面名称
function getCurrentPage() {
  const path = window.location.pathname;
  const filename = path.split('/').pop();
  return filename.replace('.html', '');
}

// 设置顶部导航激活状态
function setActiveMenu() {
  const currentPage = getCurrentPage();

  document.querySelectorAll('.nav-tabs a').forEach(item => {
    const href = item.getAttribute('href') || '';
    const hrefPage = href.replace('.html', '');
    const isHome = (currentPage === 'index' || currentPage === '') && hrefPage === 'index';
    const isMatch = hrefPage && currentPage && hrefPage === currentPage;
    if (isHome || isMatch) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });
}

// 格式化日期
function formatDate(date) {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// 格式化日期时间
function formatDateTime(date) {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}`;
}

// 删除确认
function confirmDelete(message, callback) {
  if (confirm(message || '确定要删除吗？')) {
    callback();
  }
}

// 消息提示
function showMessage(message, type) {
  // 创建消息提示元素
  const messageDiv = document.createElement('div');
  messageDiv.className = `alert alert-${type || 'info'}`;
  messageDiv.style.cssText = `
    position: fixed;
    top: 80px;
    right: 20px;
    z-index: 9999;
    padding: 15px 20px;
    border-radius: 6px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    min-width: 250px;
    animation: slideIn 0.3s ease-out;
  `;
  messageDiv.textContent = message;
  
  // 根据类型设置颜色
  const colors = {
    success: { bg: '#d4edda', color: '#155724', border: '#c3e6cb' },
    error: { bg: '#f8d7da', color: '#721c24', border: '#f5c6cb' },
    warning: { bg: '#fff3cd', color: '#856404', border: '#ffeaa7' },
    info: { bg: '#d1ecf1', color: '#0c5460', border: '#bee5eb' }
  };
  
  const style = colors[type] || colors.info;
  messageDiv.style.backgroundColor = style.bg;
  messageDiv.style.color = style.color;
  messageDiv.style.border = `1px solid ${style.border}`;
  
  document.body.appendChild(messageDiv);
  
  // 3秒后自动移除
  setTimeout(() => {
    messageDiv.style.animation = 'slideOut 0.3s ease-out';
    setTimeout(() => {
      document.body.removeChild(messageDiv);
    }, 300);
  }, 3000);
}

// 添加CSS动画
if (!document.getElementById('message-animations')) {
  const style = document.createElement('style');
  style.id = 'message-animations';
  style.textContent = `
    @keyframes slideIn {
      from {
        transform: translateX(400px);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
    @keyframes slideOut {
      from {
        transform: translateX(0);
        opacity: 1;
      }
      to {
        transform: translateX(400px);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);
}

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
  setActiveMenu();
});


