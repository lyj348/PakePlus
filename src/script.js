 // 全局变量
let currentView = 'grid';
let currentPage = 1;
let totalPages = 3;
let searchHistory = [];

// 模拟员工数据
const employeeData = [
    {
        id: '1',
        name: '张三',
        position: '高级软件工程师',
        department: '技术部',
        employeeId: 'EMP001',
        joinDate: '2022-03-15',
        performance: '优秀',
        phone: '138-0000-0000',
        email: 'zhangsan@company.com',
        skills: ['Java', 'Spring Boot', '微服务', 'MySQL'],
        avatar: 'https://via.placeholder.com/60x60/4F46E5/FFFFFF?text=张',
        performanceHistory: [
            { period: '2024年Q1', score: 95, level: 'excellent' },
            { period: '2023年Q4', score: 92, level: 'excellent' },
            { period: '2023年Q3', score: 88, level: 'good' }
        ],
        learningRecords: [
            { course: '微服务架构设计', completionDate: '2024-01-15', score: 98, status: 'completed' },
            { course: 'Spring Cloud实战', completionDate: '2023-12-20', score: 95, status: 'completed' },
            { course: 'Docker容器化技术', completionDate: null, score: null, status: 'in-progress' }
        ],
        workHistory: [
            { position: '高级软件工程师', department: '技术部', startDate: '2022-03-15', endDate: null },
            { position: '软件工程师', department: '技术部', startDate: '2020-06-01', endDate: '2022-03-14' }
        ]
    },
    {
        id: '2',
        name: '李四',
        position: '产品经理',
        department: '产品部',
        employeeId: 'EMP002',
        joinDate: '2021-08-20',
        performance: '良好',
        phone: '139-0000-0000',
        email: 'lisi@company.com',
        skills: ['产品设计', '用户研究', '数据分析'],
        avatar: 'https://via.placeholder.com/60x60/10B981/FFFFFF?text=李',
        performanceHistory: [
            { period: '2024年Q1', score: 85, level: 'good' },
            { period: '2023年Q4', score: 88, level: 'good' },
            { period: '2023年Q3', score: 82, level: 'good' }
        ],
        learningRecords: [
            { course: '产品设计思维', completionDate: '2024-02-10', score: 92, status: 'completed' },
            { course: '数据分析基础', completionDate: '2023-11-15', score: 89, status: 'completed' }
        ],
        workHistory: [
            { position: '产品经理', department: '产品部', startDate: '2021-08-20', endDate: null },
            { position: '产品助理', department: '产品部', startDate: '2020-03-01', endDate: '2021-08-19' }
        ]
    },
    {
        id: '3',
        name: '王五',
        position: 'UI设计师',
        department: '设计部',
        employeeId: 'EMP003',
        joinDate: '2023-01-10',
        performance: '优秀',
        phone: '137-0000-0000',
        email: 'wangwu@company.com',
        skills: ['Figma', 'Sketch', 'Adobe XD'],
        avatar: 'https://via.placeholder.com/60x60/F59E0B/FFFFFF?text=王',
        performanceHistory: [
            { period: '2024年Q1', score: 96, level: 'excellent' },
            { period: '2023年Q4', score: 94, level: 'excellent' }
        ],
        learningRecords: [
            { course: 'UI/UX设计进阶', completionDate: '2024-01-20', score: 97, status: 'completed' },
            { course: '交互设计原理', completionDate: '2023-12-05', score: 93, status: 'completed' }
        ],
        workHistory: [
            { position: 'UI设计师', department: '设计部', startDate: '2023-01-10', endDate: null }
        ]
    }
];

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    loadSearchHistory();
    initializeAnalytics();
    initializeManagement();
});

// 初始化应用
function initializeApp() {
    console.log('员工档案智能检索系统已启动');
    updateResultCount(employeeData.length);
    renderEmployeeCards(employeeData);
}

// 设置事件监听器
function setupEventListeners() {
    // 搜索输入框事件
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', handleSearchInput);
    searchInput.addEventListener('focus', showSearchSuggestions);
    searchInput.addEventListener('blur', hideSearchSuggestions);
    
    // 搜索建议点击事件
    document.querySelectorAll('.suggestion-item').forEach(item => {
        item.addEventListener('click', function() {
            const query = this.querySelector('span').textContent;
            setSearchQuery(query);
        });
    });
    
    // 筛选器变化事件
    const filters = ['departmentFilter', 'levelFilter', 'joinDateFilter', 'performanceFilter'];
    filters.forEach(filterId => {
        const element = document.getElementById(filterId);
        if (element) {
            element.addEventListener('change', applyFilters);
        }
    });
}

// 处理搜索输入
function handleSearchInput(event) {
    const query = event.target.value;
    if (query.length > 2) {
        showSearchSuggestions();
        // 这里可以添加实时搜索建议逻辑
    } else {
        hideSearchSuggestions();
    }
}

// 显示搜索建议
function showSearchSuggestions() {
    const suggestions = document.getElementById('searchSuggestions');
    suggestions.style.display = 'block';
}

// 隐藏搜索建议
function hideSearchSuggestions() {
    setTimeout(() => {
        const suggestions = document.getElementById('searchSuggestions');
        suggestions.style.display = 'none';
    }, 200);
}

// 设置搜索查询
function setSearchQuery(query) {
    const searchInput = document.getElementById('searchInput');
    searchInput.value = query;
    hideSearchSuggestions();
    performSearch();
}

// 执行搜索
function performSearch() {
    const query = document.getElementById('searchInput').value.trim();
    if (!query) {
        showNotification('请输入搜索关键词', 'warning');
        return;
    }
    
    showLoading();
    
    // 模拟AI搜索延迟
    setTimeout(() => {
        const results = performAISearch(query);
        renderSearchResults(results);
        addToSearchHistory(query);
        hideLoading();
        showNotification(`找到 ${results.length} 条相关记录`, 'success');
    }, 1500);
}

// AI智能搜索
function performAISearch(query) {
    const keywords = query.toLowerCase().split(' ');
    const results = employeeData.filter(employee => {
        const searchText = [
            employee.name,
            employee.position,
            employee.department,
            employee.employeeId,
            employee.performance,
            ...employee.skills
        ].join(' ').toLowerCase();
        
        return keywords.some(keyword => searchText.includes(keyword));
    });
    
    return results;
}

// 渲染搜索结果
function renderSearchResults(results) {
    updateResultCount(results.length);
    renderEmployeeCards(results);
}

// 更新结果数量
function updateResultCount(count) {
    const resultCount = document.getElementById('resultCount');
    resultCount.textContent = `找到 ${count} 条记录`;
}

// 渲染员工卡片
function renderEmployeeCards(employees) {
    const grid = document.getElementById('employeeGrid');
    grid.innerHTML = '';
    
    employees.forEach(employee => {
        const card = createEmployeeCard(employee);
        grid.appendChild(card);
    });
}

// 创建员工卡片
function createEmployeeCard(employee) {
    const card = document.createElement('div');
    card.className = 'employee-card fade-in';
    
    const performanceClass = getPerformanceClass(employee.performance);
    
    card.innerHTML = `
        <div class="card-header">
            <div class="avatar">
                <img src="${employee.avatar}" alt="${employee.name}">
            </div>
            <div class="employee-info">
                <h3>${employee.name}</h3>
                <p class="position">${employee.position}</p>
                <p class="department">${employee.department}</p>
            </div>
            <div class="card-actions">
                <button class="action-btn" onclick="viewDetails('${employee.id}')">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="action-btn" onclick="editEmployee('${employee.id}')">
                    <i class="fas fa-edit"></i>
                </button>
            </div>
        </div>
        <div class="card-body">
            <div class="info-row">
                <span class="label">工号:</span>
                <span class="value">${employee.employeeId}</span>
            </div>
            <div class="info-row">
                <span class="label">入职时间:</span>
                <span class="value">${employee.joinDate}</span>
            </div>
            <div class="info-row">
                <span class="label">绩效等级:</span>
                <span class="value ${performanceClass}">${employee.performance}</span>
            </div>
        </div>
        <div class="card-footer">
            <div class="tags">
                ${employee.skills.map(skill => `<span class="tag">${skill}</span>`).join('')}
            </div>
        </div>
    `;
    
    return card;
}

// 获取绩效等级样式类
function getPerformanceClass(performance) {
    switch(performance) {
        case '优秀': return 'performance-excellent';
        case '良好': return 'performance-good';
        case '一般': return 'performance-average';
        default: return '';
    }
}

// 应用筛选器
function applyFilters() {
    const department = document.getElementById('departmentFilter').value;
    const level = document.getElementById('levelFilter').value;
    const joinDate = document.getElementById('joinDateFilter').value;
    const performance = document.getElementById('performanceFilter').value;
    
    let filteredData = [...employeeData];
    
    if (department) {
        filteredData = filteredData.filter(emp => emp.department === department);
    }
    
    if (level) {
        filteredData = filteredData.filter(emp => emp.position.includes(level));
    }
    
    if (joinDate) {
        filteredData = filteredData.filter(emp => emp.joinDate >= joinDate);
    }
    
    if (performance) {
        filteredData = filteredData.filter(emp => emp.performance === performance);
    }
    
    renderSearchResults(filteredData);
    showNotification(`筛选完成，找到 ${filteredData.length} 条记录`, 'info');
}

// 切换视图模式
function switchView(view) {
    currentView = view;
    const viewBtns = document.querySelectorAll('.view-btn');
    viewBtns.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    const grid = document.getElementById('employeeGrid');
    if (view === 'list') {
        grid.style.gridTemplateColumns = '1fr';
        grid.classList.add('list-view');
    } else {
        grid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(350px, 1fr))';
        grid.classList.remove('list-view');
    }
}

// 查看员工详情
function viewDetails(employeeId) {
    const employee = employeeData.find(emp => emp.id === employeeId);
    if (!employee) return;
    
    const modal = document.getElementById('employeeModal');
    populateEmployeeModal(employee);
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// 填充员工详情模态框
function populateEmployeeModal(employee) {
    // 更新基本信息
    document.querySelector('.detail-info h3').textContent = employee.name;
    document.querySelector('.detail-position').textContent = employee.position;
    document.querySelector('.detail-department').textContent = employee.department;
    document.querySelector('.detail-avatar img').src = employee.avatar;
    
    // 更新基本信息标签页
    const basicInfo = document.querySelectorAll('#basic-tab .info-item');
    const infoData = [
        { label: '工号', value: employee.employeeId },
        { label: '姓名', value: employee.name },
        { label: '部门', value: employee.department },
        { label: '职位', value: employee.position },
        { label: '入职时间', value: employee.joinDate },
        { label: '联系电话', value: employee.phone },
        { label: '邮箱', value: employee.email }
    ];
    
    infoData.forEach((data, index) => {
        if (basicInfo[index]) {
            basicInfo[index].querySelector('span').textContent = data.value;
        }
    });
    
    // 更新技能标签
    const skillTags = document.querySelector('.skill-tags');
    skillTags.innerHTML = employee.skills.map(skill => 
        `<span class="skill-tag">${skill}</span>`
    ).join('');
    
    // 更新绩效数据
    updatePerformanceTab(employee);
    
    // 更新学习记录
    updateLearningTab(employee);
    
    // 更新工作履历
    updateWorkHistoryTab(employee);
}

// 更新绩效标签页
function updatePerformanceTab(employee) {
    const performanceDetails = document.querySelector('#performance-tab .performance-details');
    performanceDetails.innerHTML = employee.performanceHistory.map(item => `
        <div class="performance-item">
            <span class="period">${item.period}</span>
            <span class="score ${item.level}">${item.score}分</span>
        </div>
    `).join('');
}

// 更新学习记录标签页
function updateLearningTab(employee) {
    const courseList = document.querySelector('#learning-tab .course-list');
    courseList.innerHTML = employee.learningRecords.map(course => `
        <div class="course-item">
            <div class="course-info">
                <h5>${course.course}</h5>
                <p>${course.completionDate ? `完成时间: ${course.completionDate}` : '进行中'}</p>
            </div>
            <div class="course-score">
                <span class="score">${course.score || '-'}</span>
                <span class="status ${course.status}">${course.status === 'completed' ? '已完成' : '进行中'}</span>
            </div>
        </div>
    `).join('');
}

// 更新工作履历标签页
function updateWorkHistoryTab(employee) {
    const timeline = document.querySelector('#history-tab .timeline');
    timeline.innerHTML = employee.workHistory.map(job => `
        <div class="timeline-item">
            <div class="timeline-marker"></div>
            <div class="timeline-content">
                <h5>${job.position}</h5>
                <p>${job.department}</p>
                <span class="timeline-date">${job.startDate} ${job.endDate ? `- ${job.endDate}` : '至今'}</span>
            </div>
        </div>
    `).join('');
}

// 切换标签页
function switchTab(tabName) {
    // 隐藏所有标签页
    document.querySelectorAll('.tab-pane').forEach(pane => {
        pane.classList.remove('active');
    });
    
    // 移除所有标签按钮的激活状态
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // 显示选中的标签页
    const targetTab = document.getElementById(`${tabName}-tab`);
    if (targetTab) {
        targetTab.classList.add('active');
    }
    
    // 激活选中的标签按钮
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(btn => {
        if (btn.getAttribute('onclick') && btn.getAttribute('onclick').includes(tabName)) {
            btn.classList.add('active');
        }
    });
}

// 关闭模态框
function closeModal() {
    const modal = document.getElementById('employeeModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// 编辑员工
function editEmployee(employeeId) {
    showNotification('编辑功能开发中...', 'info');
}

// 切换侧边栏
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('open');
}

// 添加员工
function addEmployee() {
    showNotification('添加员工功能开发中...', 'info');
}

// 导出数据
function exportData() {
    showNotification('数据导出功能开发中...', 'info');
}

// 导入数据
function importData() {
    showNotification('数据导入功能开发中...', 'info');
}

// 生成报告
function generateReport() {
    showNotification('报告生成功能开发中...', 'info');
}

// 分页功能
function changePage(direction) {
    const newPage = currentPage + direction;
    if (newPage >= 1 && newPage <= totalPages) {
        currentPage = newPage;
        updatePagination();
        showNotification(`切换到第 ${currentPage} 页`, 'info');
    }
}

// 更新分页显示
function updatePagination() {
    const pageNumbers = document.querySelectorAll('.page-number');
    pageNumbers.forEach((btn, index) => {
        btn.classList.toggle('active', index + 1 === currentPage);
    });
}

// 添加到搜索历史
function addToSearchHistory(query) {
    if (!searchHistory.includes(query)) {
        searchHistory.unshift(query);
        if (searchHistory.length > 10) {
            searchHistory.pop();
        }
        saveSearchHistory();
        updateSearchHistoryDisplay();
    }
}

// 保存搜索历史
function saveSearchHistory() {
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
}

// 加载搜索历史
function loadSearchHistory() {
    const saved = localStorage.getItem('searchHistory');
    if (saved) {
        searchHistory = JSON.parse(saved);
        updateSearchHistoryDisplay();
    }
}

// 更新搜索历史显示
function updateSearchHistoryDisplay() {
    const historyContainer = document.querySelector('.search-history');
    if (historyContainer) {
        historyContainer.innerHTML = searchHistory.map(query => `
            <div class="history-item" onclick="setSearchQuery('${query}')">
                <i class="fas fa-history"></i>
                <span>${query}</span>
            </div>
        `).join('');
    }
}

// 显示加载状态
function showLoading() {
    const overlay = document.getElementById('loadingOverlay');
    overlay.classList.add('show');
}

// 隐藏加载状态
function hideLoading() {
    const overlay = document.getElementById('loadingOverlay');
    overlay.classList.remove('show');
}

// 显示通知
function showNotification(message, type = 'info') {
    // 创建通知元素
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${getNotificationIcon(type)}"></i>
        <span>${message}</span>
    `;
    
    // 添加样式
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${getNotificationColor(type)};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        z-index: 4000;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        animation: slideInRight 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    // 3秒后自动移除
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-in';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// 获取通知图标
function getNotificationIcon(type) {
    const icons = {
        success: 'check-circle',
        error: 'exclamation-circle',
        warning: 'exclamation-triangle',
        info: 'info-circle'
    };
    return icons[type] || 'info-circle';
}

// 获取通知颜色
function getNotificationColor(type) {
    const colors = {
        success: '#10b981',
        error: '#ef4444',
        warning: '#f59e0b',
        info: '#3b82f6'
    };
    return colors[type] || '#3b82f6';
}

// 添加CSS动画
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .list-view .employee-card {
        display: flex;
        align-items: center;
        padding: 1rem;
    }
    
    .list-view .card-header {
        margin-bottom: 0;
        margin-right: 1rem;
    }
    
    .list-view .card-body {
        flex: 1;
        margin-bottom: 0;
    }
    
    .list-view .card-footer {
        border-top: none;
        padding-top: 0;
    }
`;
document.head.appendChild(style);

// 点击模态框外部关闭
window.onclick = function(event) {
    const modal = document.getElementById('employeeModal');
    if (event.target === modal) {
        closeModal();
    }
}

// 键盘快捷键
document.addEventListener('keydown', function(event) {
    // ESC键关闭模态框
    if (event.key === 'Escape') {
        closeModal();
    }
    
    // Ctrl+K 聚焦搜索框
    if (event.ctrlKey && event.key === 'k') {
        event.preventDefault();
        document.getElementById('searchInput').focus();
    }
});

// 数据分析功能
function initializeAnalytics() {
    console.log('数据分析模块已初始化');
    setupAnalyticsCharts();
    setupAnalyticsFilters();
}

// 设置分析图表
function setupAnalyticsCharts() {
    // 部门分布饼图
    createDepartmentChart();
    // 绩效趋势图
    createPerformanceTrendChart();
    // 学习完成情况图
    createLearningChart();
}

// 创建部门分布饼图
function createDepartmentChart() {
    const canvas = document.getElementById('departmentChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const data = {
        labels: ['技术部', '产品部', '设计部', '人事部', '财务部'],
        values: [45, 25, 15, 10, 5],
        colors: ['#667eea', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']
    };
    
    drawPieChart(ctx, data, canvas.width / 2, canvas.height / 2, Math.min(canvas.width, canvas.height) / 2 - 20);
}

// 创建绩效趋势图
function createPerformanceTrendChart() {
    const canvas = document.getElementById('performanceTrendChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const data = {
        labels: ['Q1', 'Q2', 'Q3', 'Q4'],
        values: [85, 88, 87, 90],
        color: '#667eea'
    };
    
    drawLineChart(ctx, data, canvas.width, canvas.height);
}

// 创建学习完成情况图
function createLearningChart() {
    const canvas = document.getElementById('learningChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const data = {
        labels: ['已完成', '进行中', '未开始'],
        values: [75, 20, 5],
        colors: ['#10b981', '#f59e0b', '#ef4444']
    };
    
    drawDoughnutChart(ctx, data, canvas.width / 2, canvas.height / 2, Math.min(canvas.width, canvas.height) / 2 - 20);
}

// 绘制饼图
function drawPieChart(ctx, data, centerX, centerY, radius) {
    let currentAngle = 0;
    const total = data.values.reduce((sum, val) => sum + val, 0);
    
    data.values.forEach((value, index) => {
        const sliceAngle = (value / total) * 2 * Math.PI;
        
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
        ctx.closePath();
        ctx.fillStyle = data.colors[index];
        ctx.fill();
        
        // 绘制标签
        const labelAngle = currentAngle + sliceAngle / 2;
        const labelX = centerX + Math.cos(labelAngle) * (radius + 30);
        const labelY = centerY + Math.sin(labelAngle) * (radius + 30);
        
        ctx.fillStyle = '#374151';
        ctx.font = '12px Inter';
        ctx.textAlign = 'center';
        ctx.fillText(data.labels[index], labelX, labelY);
        const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
        ctx.fillText(value + ' (' + percentage + '%)', labelX, labelY + 15);
        
        currentAngle += sliceAngle;
    });
}

// 绘制折线图
function drawLineChart(ctx, data, width, height) {
    const padding = 40;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;
    const maxValue = Math.max(...data.values);
    
    // 绘制坐标轴
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.stroke();
    
    // 绘制数据线
    ctx.strokeStyle = data.color;
    ctx.lineWidth = 3;
    ctx.beginPath();
    
    data.values.forEach((value, index) => {
        const x = padding + (index * chartWidth) / (data.values.length - 1);
        const y = height - padding - (value / maxValue) * chartHeight;
        
        if (index === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
        
        // 绘制数据点
        ctx.fillStyle = data.color;
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, 2 * Math.PI);
        ctx.fill();
    });
    
    ctx.stroke();
    
    // 绘制标签
    ctx.fillStyle = '#64748b';
    ctx.font = '12px Inter';
    ctx.textAlign = 'center';
    
    data.labels.forEach((label, index) => {
        const x = padding + (index * chartWidth) / (data.values.length - 1);
        ctx.fillText(label, x, height - padding + 20);
    });
}

// 绘制环形图
function drawDoughnutChart(ctx, data, centerX, centerY, radius) {
    const innerRadius = radius * 0.6;
    let currentAngle = 0;
    const total = data.values.reduce((sum, val) => sum + val, 0);
    
    data.values.forEach((value, index) => {
        const sliceAngle = (value / total) * 2 * Math.PI;
        
        // 外圆
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
        ctx.closePath();
        ctx.fillStyle = data.colors[index];
        ctx.fill();
        
        // 内圆（创建环形效果）
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, innerRadius, currentAngle, currentAngle + sliceAngle);
        ctx.closePath();
        ctx.fillStyle = '#ffffff';
        ctx.fill();
        
        // 绘制标签
        const labelAngle = currentAngle + sliceAngle / 2;
        const labelX = centerX + Math.cos(labelAngle) * (radius + 30);
        const labelY = centerY + Math.sin(labelAngle) * (radius + 30);
        
        ctx.fillStyle = '#374151';
        ctx.font = '12px Inter';
        ctx.textAlign = 'center';
        ctx.fillText(data.labels[index], labelX, labelY);
        const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
        ctx.fillText(value + ' (' + percentage + '%)', labelX, labelY + 15);
        
        currentAngle += sliceAngle;
    });
}

// 设置分析筛选器
function setupAnalyticsFilters() {
    const departmentFilter = document.getElementById('departmentChartFilter');
    const performanceFilter = document.getElementById('performanceChartFilter');
    
    if (departmentFilter) {
        departmentFilter.addEventListener('change', function() {
            updateDepartmentChart(this.value);
        });
    }
    
    if (performanceFilter) {
        performanceFilter.addEventListener('change', function() {
            updatePerformanceChart(this.value);
        });
    }
}

// 更新部门图表
function updateDepartmentChart(filter) {
    console.log('更新部门图表:', filter);
    // 这里可以根据筛选条件更新图表数据
    createDepartmentChart();
}

// 更新绩效图表
function updatePerformanceChart(filter) {
    console.log('更新绩效图表:', filter);
    // 这里可以根据筛选条件更新图表数据
    createPerformanceTrendChart();
}

// 权限管理功能
function initializeManagement() {
    console.log('权限管理模块已初始化');
    setupUserManagement();
    setupPermissionMatrix();
    setupSecurityLogs();
}

// 设置用户管理
function setupUserManagement() {
    const roleFilter = document.getElementById('roleFilter');
    const statusFilter = document.getElementById('statusFilter');
    const userSearch = document.getElementById('userSearch');
    
    if (roleFilter) {
        roleFilter.addEventListener('change', filterUsers);
    }
    
    if (statusFilter) {
        statusFilter.addEventListener('change', filterUsers);
    }
    
    if (userSearch) {
        userSearch.addEventListener('input', debounce(filterUsers, 300));
    }
}

// 设置权限矩阵
function setupPermissionMatrix() {
    const checkboxes = document.querySelectorAll('.permission-matrix input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            updatePermission(this);
        });
    });
}

// 设置安全日志
function setupSecurityLogs() {
    const logLevelFilter = document.getElementById('logLevelFilter');
    if (logLevelFilter) {
        logLevelFilter.addEventListener('change', filterLogs);
    }
}

// 筛选用户
function filterUsers() {
    const roleFilter = document.getElementById('roleFilter')?.value;
    const statusFilter = document.getElementById('statusFilter')?.value;
    const searchTerm = document.getElementById('userSearch')?.value.toLowerCase();
    
    const rows = document.querySelectorAll('#userTableBody tr');
    
    rows.forEach(row => {
        let showRow = true;
        
        // 角色筛选
        if (roleFilter) {
            const roleBadge = row.querySelector('.role-badge');
            if (roleBadge && !roleBadge.classList.contains(roleFilter)) {
                showRow = false;
            }
        }
        
        // 状态筛选
        if (statusFilter) {
            const statusBadge = row.querySelector('.status-badge');
            if (statusBadge && !statusBadge.classList.contains(statusFilter)) {
                showRow = false;
            }
        }
        
        // 搜索筛选
        if (searchTerm) {
            const userName = row.querySelector('.user-name')?.textContent.toLowerCase();
            const userEmail = row.querySelector('.user-email')?.textContent.toLowerCase();
            if (!userName?.includes(searchTerm) && !userEmail?.includes(searchTerm)) {
                showRow = false;
            }
        }
        
        row.style.display = showRow ? '' : 'none';
    });
    
    showNotification(`筛选完成，显示 ${document.querySelectorAll('#userTableBody tr[style=""]').length} 条记录`, 'info');
}

// 更新权限
function updatePermission(checkbox) {
    const row = checkbox.closest('.matrix-row');
    const roleName = row.querySelector('.role-name').textContent;
    const permissionName = checkbox.closest('.permission-cell').previousElementSibling?.textContent || 
                          checkbox.closest('.permission-cell').parentElement.querySelector('.permission-column').textContent;
    
    const status = checkbox.checked ? '授权' : '取消授权';
    showNotification(`${roleName} 的 ${permissionName} 权限已${status}`, 'info');
    
    // 记录权限变更日志
    addSecurityLog('info', `用户权限配置已更新 - ${roleName}: ${permissionName}`, `操作人: 管理员 | 时间: ${new Date().toLocaleString()}`);
}

// 筛选日志
function filterLogs() {
    const levelFilter = document.getElementById('logLevelFilter')?.value;
    const logItems = document.querySelectorAll('.log-item');
    
    logItems.forEach(item => {
        const logLevel = item.querySelector('.log-level').textContent.toLowerCase();
        const shouldShow = !levelFilter || logLevel === levelFilter;
        item.style.display = shouldShow ? '' : 'none';
    });
}

// 添加安全日志
function addSecurityLog(level, message, details) {
    const logList = document.querySelector('.log-list');
    if (!logList) return;
    
    const logItem = document.createElement('div');
    logItem.className = 'log-item';
    
    const iconClass = {
        'info': 'fas fa-info-circle',
        'warning': 'fas fa-exclamation-triangle',
        'error': 'fas fa-times-circle'
    }[level] || 'fas fa-info-circle';
    
    const iconBgClass = {
        'info': 'info',
        'warning': 'warning',
        'error': 'error'
    }[level] || 'info';
    
    logItem.innerHTML = `
        <div class="log-icon ${iconBgClass}">
            <i class="${iconClass}"></i>
        </div>
        <div class="log-content">
            <div class="log-message">${message}</div>
            <div class="log-details">${details}</div>
        </div>
        <div class="log-level ${iconBgClass}">${level === 'info' ? '信息' : level === 'warning' ? '警告' : '错误'}</div>
    `;
    
    logList.insertBefore(logItem, logList.firstChild);
    
    // 限制日志数量
    const maxLogs = 50;
    const logs = logList.querySelectorAll('.log-item');
    if (logs.length > maxLogs) {
        logs[logs.length - 1].remove();
    }
}

// 用户管理操作
function addUser() {
    showNotification('添加用户功能开发中...', 'info');
    // 这里可以打开添加用户的模态框
}

function editUser(userId) {
    showNotification(`编辑用户 ${userId} 功能开发中...`, 'info');
    // 这里可以打开编辑用户的模态框
}

function viewUserPermissions(userId) {
    showNotification(`查看用户 ${userId} 权限功能开发中...`, 'info');
    // 这里可以打开权限查看的模态框
}

function deleteUser(userId) {
    if (confirm('确定要删除此用户吗？此操作不可撤销。')) {
        showNotification(`用户 ${userId} 已删除`, 'success');
        addSecurityLog('info', `用户 ${userId} 已被删除`, `操作人: 管理员 | 时间: ${new Date().toLocaleString()}`);
    }
}

function exportLogs() {
    showNotification('导出日志功能开发中...', 'info');
    // 这里可以实现日志导出功能
}

// 防抖函数
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// 导航切换功能
function switchNavigation(section) {
    // 隐藏所有section
    document.querySelectorAll('main > section').forEach(sec => {
        sec.style.display = 'none';
    });
    
    // 移除所有导航链接的active类
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    // 显示选中的section
    const targetSection = document.getElementById(section);
    if (targetSection) {
        targetSection.style.display = 'block';
    }
    
    // 激活对应的导航链接
    const targetLink = document.querySelector(`.nav-link[href="#${section}"]`);
    if (targetLink) {
        targetLink.classList.add('active');
    }
    
    // 根据section执行相应的初始化
    switch(section) {
        case 'analytics':
            initializeAnalytics();
            break;
        case 'management':
            initializeManagement();
            break;
    }
}

// 更新导航事件监听器
document.addEventListener('DOMContentLoaded', function() {
    // 为导航链接添加点击事件
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const section = this.getAttribute('href').substring(1);
            switchNavigation(section);
        });
    });
    
    // 初始化新功能
    initializeQA();
    initializeStatistics();
    initializeArchive();
    
    // 问答输入框回车事件
    const qaInput = document.getElementById('qaInput');
    if (qaInput) {
        qaInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendQuestion();
            }
        });
    }
});

// ==================== 智能问答功能 ====================
function initializeQA() {
    console.log('智能问答模块已初始化');
}

function sendQuestion() {
    const input = document.getElementById('qaInput');
    const question = input.value.trim();
    
    if (!question) {
        showNotification('请输入您的问题', 'warning');
        return;
    }
    
    // 添加用户消息
    addMessage('user', question);
    input.value = '';
    
    // 显示加载状态
    const loadingMessage = addMessage('bot', '正在思考中...', true);
    
    // 模拟AI处理延迟
    setTimeout(() => {
        // 移除加载消息
        if (loadingMessage && loadingMessage.parentNode) {
            loadingMessage.parentNode.removeChild(loadingMessage);
        }
        
        // 获取答案
        const answer = getAnswer(question);
        addMessage('bot', answer);
    }, 1500);
}

function askQuickQuestion(question) {
    const input = document.getElementById('qaInput');
    input.value = question;
    sendQuestion();
}

function addMessage(type, content, isLoading = false) {
    const messagesContainer = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}-message`;
    
    const avatarIcon = type === 'user' ? 'fa-user' : 'fa-robot';
    
    messageDiv.innerHTML = `
        <div class="message-avatar">
            <i class="fas ${avatarIcon}"></i>
        </div>
        <div class="message-content">
            <p>${content}</p>
        </div>
    `;
    
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    return messageDiv;
}

function getAnswer(question) {
    const lowerQuestion = question.toLowerCase();
    
    // 智能问答逻辑
    if (lowerQuestion.includes('技术部') || lowerQuestion.includes('技术')) {
        const techEmployees = employeeData.filter(emp => emp.department === '技术部');
        return `技术部共有 ${techEmployees.length} 名员工，包括：${techEmployees.map(e => e.name).join('、')}。`;
    }
    
    if (lowerQuestion.includes('绩效优秀') || lowerQuestion.includes('优秀员工')) {
        const excellent = employeeData.filter(emp => emp.performance === '优秀');
        return `绩效优秀的员工共有 ${excellent.length} 名：${excellent.map(e => e.name).join('、')}。`;
    }
    
    if (lowerQuestion.includes('最近入职') || lowerQuestion.includes('新员工')) {
        const sorted = [...employeeData].sort((a, b) => new Date(b.joinDate) - new Date(a.joinDate));
        const recent = sorted.slice(0, 3);
        return `最近入职的员工有：${recent.map(e => `${e.name}（${e.joinDate}）`).join('、')}。`;
    }
    
    if (lowerQuestion.includes('部门') && lowerQuestion.includes('分布')) {
        const deptCount = {};
        employeeData.forEach(emp => {
            deptCount[emp.department] = (deptCount[emp.department] || 0) + 1;
        });
        const deptInfo = Object.entries(deptCount).map(([dept, count]) => `${dept}：${count}人`).join('，');
        return `各部门人员分布情况：${deptInfo}。`;
    }
    
    if (lowerQuestion.includes('考试成绩') || lowerQuestion.includes('成绩')) {
        const nameMatch = question.match(/([\u4e00-\u9fa5]+)/);
        if (nameMatch) {
            const name = nameMatch[1];
            const employee = employeeData.find(emp => emp.name.includes(name));
            if (employee && employee.learningRecords.length > 0) {
                const scores = employee.learningRecords
                    .filter(r => r.score)
                    .map(r => `${r.course}：${r.score}分`)
                    .join('，');
                return `${employee.name}的考试成绩：${scores}。`;
            }
        }
        return '未找到相关员工的考试成绩信息。';
    }
    
    // 默认回答
    return `根据您的问题"${question}"，我为您找到了相关信息。如需更详细的查询，请使用智能检索功能。`;
}

// ==================== 数据统计功能 ====================
function initializeStatistics() {
    console.log('数据统计模块已初始化');
    updateStatistics();
}

function switchStatTab(tabName) {
    // 隐藏所有标签页
    document.querySelectorAll('.stat-pane').forEach(pane => {
        pane.classList.remove('active');
    });
    
    // 移除所有标签的激活状态
    document.querySelectorAll('.stat-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // 显示选中的标签页
    const targetPane = document.getElementById(`${tabName}-stat`);
    if (targetPane) {
        targetPane.classList.add('active');
    }
    
    // 激活对应的标签
    const tabs = document.querySelectorAll('.stat-tab');
    tabs.forEach(tab => {
        if (tab.getAttribute('onclick') && tab.getAttribute('onclick').includes(tabName)) {
            tab.classList.add('active');
        }
    });
    
    // 更新统计数据
    updateStatistics();
}

function updateStatistics() {
    // 总览统计
    document.getElementById('totalEmployees').textContent = employeeData.length;
    
    const departments = [...new Set(employeeData.map(emp => emp.department))];
    document.getElementById('totalDepartments').textContent = departments.length;
    
    const excellent = employeeData.filter(emp => emp.performance === '优秀').length;
    document.getElementById('excellentEmployees').textContent = excellent;
    
    const totalCourses = employeeData.reduce((sum, emp) => sum + emp.learningRecords.length, 0);
    const completedCourses = employeeData.reduce((sum, emp) => 
        sum + emp.learningRecords.filter(r => r.status === 'completed').length, 0);
    const trainingRate = totalCourses > 0 ? Math.round((completedCourses / totalCourses) * 100) : 0;
    document.getElementById('trainingRate').textContent = trainingRate + '%';
    
    // 部门统计
    updateDepartmentStatistics();
    
    // 绩效统计
    updatePerformanceStatistics();
    
    // 学习统计
    updateLearningStatistics();
    
    // 更新图表
    updateStatisticsCharts();
}

function updateDepartmentStatistics() {
    const deptCount = {};
    employeeData.forEach(emp => {
        deptCount[emp.department] = (deptCount[emp.department] || 0) + 1;
    });
    
    const container = document.getElementById('departmentStatsList');
    if (!container) return;
    
    container.innerHTML = Object.entries(deptCount).map(([dept, count]) => `
        <div class="department-stat-card">
            <h4>${dept}</h4>
            <div class="stat-value" style="font-size: 2rem; color: #667eea; margin: 1rem 0;">${count}</div>
            <div class="stat-desc">员工人数</div>
        </div>
    `).join('');
}

function updatePerformanceStatistics() {
    const excellent = employeeData.filter(emp => emp.performance === '优秀').length;
    const good = employeeData.filter(emp => emp.performance === '良好').length;
    const average = employeeData.filter(emp => emp.performance === '一般').length;
    const total = employeeData.length;
    
    document.getElementById('excellentCount').textContent = excellent;
    document.getElementById('excellentPercent').textContent = total > 0 ? Math.round((excellent / total) * 100) + '%' : '0%';
    
    document.getElementById('goodCount').textContent = good;
    document.getElementById('goodPercent').textContent = total > 0 ? Math.round((good / total) * 100) + '%' : '0%';
    
    document.getElementById('averageCount').textContent = average;
    document.getElementById('averagePercent').textContent = total > 0 ? Math.round((average / total) * 100) + '%' : '0%';
}

function updateLearningStatistics() {
    const completed = employeeData.reduce((sum, emp) => 
        sum + emp.learningRecords.filter(r => r.status === 'completed').length, 0);
    const inProgress = employeeData.reduce((sum, emp) => 
        sum + emp.learningRecords.filter(r => r.status === 'in-progress').length, 0);
    
    document.getElementById('completedCourses').textContent = completed;
    document.getElementById('inProgressCourses').textContent = inProgress;
    
    // 计算平均学习时长（模拟数据）
    const avgHours = Math.round((completed * 4.2) / employeeData.length);
    document.getElementById('avgLearningTime').textContent = avgHours + '小时';
}

function updateStatisticsCharts() {
    // 总览图表
    const overviewCanvas = document.getElementById('overviewChart');
    if (overviewCanvas) {
        const ctx = overviewCanvas.getContext('2d');
        const deptCount = {};
        employeeData.forEach(emp => {
            deptCount[emp.department] = (deptCount[emp.department] || 0) + 1;
        });
        
        const data = {
            labels: Object.keys(deptCount),
            values: Object.values(deptCount),
            colors: ['#667eea', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']
        };
        
        drawPieChart(ctx, data, overviewCanvas.width / 2, overviewCanvas.height / 2, 
                    Math.min(overviewCanvas.width, overviewCanvas.height) / 2 - 40);
    }
    
    // 部门统计图表
    const deptCanvas = document.getElementById('departmentStatChart');
    if (deptCanvas) {
        const ctx = deptCanvas.getContext('2d');
        const deptCount = {};
        employeeData.forEach(emp => {
            deptCount[emp.department] = (deptCount[emp.department] || 0) + 1;
        });
        
        const data = {
            labels: Object.keys(deptCount),
            values: Object.values(deptCount),
            colors: ['#667eea', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']
        };
        
        drawPieChart(ctx, data, deptCanvas.width / 2, deptCanvas.height / 2, 
                    Math.min(deptCanvas.width, deptCanvas.height) / 2 - 40);
    }
    
    // 绩效统计图表
    const perfCanvas = document.getElementById('performanceStatChart');
    if (perfCanvas) {
        const ctx = perfCanvas.getContext('2d');
        const excellent = employeeData.filter(emp => emp.performance === '优秀').length;
        const good = employeeData.filter(emp => emp.performance === '良好').length;
        const average = employeeData.filter(emp => emp.performance === '一般').length;
        
        const data = {
            labels: ['优秀', '良好', '一般'],
            values: [excellent, good, average],
            colors: ['#10b981', '#f59e0b', '#ef4444']
        };
        
        drawPieChart(ctx, data, perfCanvas.width / 2, perfCanvas.height / 2, 
                    Math.min(perfCanvas.width, perfCanvas.height) / 2 - 40);
    }
    
    // 学习统计图表
    const learnCanvas = document.getElementById('learningStatChart');
    if (learnCanvas) {
        const ctx = learnCanvas.getContext('2d');
        const completed = employeeData.reduce((sum, emp) => 
            sum + emp.learningRecords.filter(r => r.status === 'completed').length, 0);
        const inProgress = employeeData.reduce((sum, emp) => 
            sum + emp.learningRecords.filter(r => r.status === 'in-progress').length, 0);
        
        const data = {
            labels: ['已完成', '进行中'],
            values: [completed, inProgress],
            colors: ['#10b981', '#f59e0b']
        };
        
        drawDoughnutChart(ctx, data, learnCanvas.width / 2, learnCanvas.height / 2, 
                         Math.min(learnCanvas.width, learnCanvas.height) / 2 - 40);
    }
}

// ==================== 档案管理功能 ====================
function initializeArchive() {
    console.log('档案管理模块已初始化');
    renderArchives();
}

function renderArchives() {
    // 按部门分类
    renderDepartmentArchives();
    
    // 按职位分类
    renderPositionArchives();
    
    // 按绩效分类
    renderPerformanceArchives();
    
    // 列表视图
    renderArchiveListView();
}

function renderDepartmentArchives() {
    const container = document.getElementById('departmentArchiveList');
    if (!container) return;
    
    const deptGroups = {};
    employeeData.forEach(emp => {
        if (!deptGroups[emp.department]) {
            deptGroups[emp.department] = [];
        }
        deptGroups[emp.department].push(emp);
    });
    
    container.innerHTML = Object.entries(deptGroups).map(([dept, employees]) => `
        <div class="archive-group">
            <h4>${dept} (${employees.length}人)</h4>
            <div class="archive-items">
                ${employees.map(emp => createArchiveItem(emp)).join('')}
            </div>
        </div>
    `).join('');
}

function renderPositionArchives() {
    const container = document.getElementById('positionArchiveList');
    if (!container) return;
    
    const positionGroups = {};
    employeeData.forEach(emp => {
        const position = emp.position.split(' ')[0] || emp.position;
        if (!positionGroups[position]) {
            positionGroups[position] = [];
        }
        positionGroups[position].push(emp);
    });
    
    container.innerHTML = Object.entries(positionGroups).map(([position, employees]) => `
        <div class="archive-group">
            <h4>${position} (${employees.length}人)</h4>
            <div class="archive-items">
                ${employees.map(emp => createArchiveItem(emp)).join('')}
            </div>
        </div>
    `).join('');
}

function renderPerformanceArchives() {
    const container = document.getElementById('performanceArchiveList');
    if (!container) return;
    
    const perfGroups = {};
    employeeData.forEach(emp => {
        if (!perfGroups[emp.performance]) {
            perfGroups[emp.performance] = [];
        }
        perfGroups[emp.performance].push(emp);
    });
    
    container.innerHTML = Object.entries(perfGroups).map(([perf, employees]) => `
        <div class="archive-group">
            <h4>${perf} (${employees.length}人)</h4>
            <div class="archive-items">
                ${employees.map(emp => createArchiveItem(emp)).join('')}
            </div>
        </div>
    `).join('');
}

function renderArchiveListView() {
    const container = document.getElementById('archiveListView');
    if (!container) return;
    
    container.innerHTML = employeeData.map(emp => createArchiveItem(emp)).join('');
}

function createArchiveItem(employee) {
    return `
        <div class="archive-item" onclick="viewDetails('${employee.id}')">
            <div class="archive-item-header">
                <div class="archive-item-avatar">
                    <img src="${employee.avatar}" alt="${employee.name}">
                </div>
                <div class="archive-item-info">
                    <h4>${employee.name}</h4>
                    <p>${employee.position}</p>
                </div>
            </div>
            <div class="archive-item-details">
                <div>部门：${employee.department}</div>
                <div>工号：${employee.employeeId}</div>
                <div>入职时间：${employee.joinDate}</div>
                <div>绩效：<span class="performance-${getPerformanceClass(employee.performance)}">${employee.performance}</span></div>
            </div>
        </div>
    `;
}

function filterArchives() {
    const category = document.getElementById('archiveCategoryFilter').value;
    const searchTerm = document.getElementById('archiveSearch').value.toLowerCase();
    
    // 根据分类和搜索词筛选
    let filteredData = [...employeeData];
    
    if (searchTerm) {
        filteredData = filteredData.filter(emp => 
            emp.name.toLowerCase().includes(searchTerm) ||
            emp.department.toLowerCase().includes(searchTerm) ||
            emp.position.toLowerCase().includes(searchTerm) ||
            emp.employeeId.toLowerCase().includes(searchTerm)
        );
    }
    
    // 更新显示
    if (category === 'all') {
        renderArchiveListView();
    } else {
        // 根据分类重新渲染
        renderArchives();
    }
    
    showNotification(`找到 ${filteredData.length} 条档案记录`, 'info');
}

function exportArchives() {
    showNotification('档案导出功能开发中...', 'info');
    // 这里可以实现档案导出功能
}

// 扩展导航切换功能以支持新模块
const originalSwitchNavigation = switchNavigation;
switchNavigation = function(section) {
    // 隐藏所有section
    document.querySelectorAll('main > section').forEach(sec => {
        sec.style.display = 'none';
    });
    
    // 移除所有导航链接的active类
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    // 显示选中的section
    const targetSection = document.getElementById(section);
    if (targetSection) {
        targetSection.style.display = 'block';
    }
    
    // 激活对应的导航链接
    const targetLink = document.querySelector(`.nav-link[href="#${section}"]`);
    if (targetLink) {
        targetLink.classList.add('active');
    }
    
    // 根据section执行相应的初始化
    switch(section) {
        case 'qa':
            initializeQA();
            break;
        case 'statistics':
            initializeStatistics();
            break;
        case 'archive':
            initializeArchive();
            break;
        case 'analytics':
            initializeAnalytics();
            break;
        case 'management':
            initializeManagement();
            break;
    }
};

console.log('员工档案智能检索系统 JavaScript 已加载完成');
