// 三会一课提醒管理
class ReminderManager {
  constructor() {
    this.reminders = [];
    this.checkInterval = null;
    this.loadReminders();
    this.startChecking();
  }

  // 从本地存储加载提醒
  loadReminders() {
    const saved = localStorage.getItem('partyReminders');
    if (saved) {
      this.reminders = JSON.parse(saved).map(reminder => ({
        ...reminder,
        date: new Date(reminder.date),
        remindTime: new Date(reminder.remindTime)
      }));
    }
    this.renderReminders();
    this.renderUpcomingSchedule();
  }

  // 保存提醒到本地存储
  saveReminders() {
    localStorage.setItem('partyReminders', JSON.stringify(this.reminders));
  }

  // 添加提醒
  addReminder(reminderData) {
    const reminder = {
      id: Date.now().toString(),
      type: reminderData.type,
      date: new Date(reminderData.date),
      time: reminderData.time,
      location: reminderData.location,
      topic: reminderData.topic,
      advance: parseInt(reminderData.advance) || 0,
      remindTime: this.calculateRemindTime(reminderData.date, reminderData.time, reminderData.advance),
      created: new Date(),
      notified: false
    };

    this.reminders.push(reminder);
    this.reminders.sort((a, b) => a.remindTime - b.remindTime);
    this.saveReminders();
    this.renderReminders();
    this.renderUpcomingSchedule();
    
    return reminder;
  }

  // 计算提醒时间
  calculateRemindTime(date, time, advanceMinutes) {
    const [hours, minutes] = time.split(':');
    const remindDate = new Date(date);
    remindDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    remindDate.setMinutes(remindDate.getMinutes() - advanceMinutes);
    return remindDate;
  }

  // 删除提醒
  deleteReminder(id) {
    this.reminders = this.reminders.filter(r => r.id !== id);
    this.saveReminders();
    this.renderReminders();
    this.renderUpcomingSchedule();
  }

  // 渲染提醒列表
  renderReminders() {
    const listContainer = document.getElementById('reminderList');
    const countElement = document.getElementById('reminderCount');
    
    if (!listContainer) return;

    countElement.textContent = this.reminders.length;

    if (this.reminders.length === 0) {
      listContainer.innerHTML = `
        <div class="empty-reminders">
          <i class="fa fa-bell-slash"></i>
          <div>暂无提醒，请添加新的提醒</div>
        </div>
      `;
      return;
    }

    listContainer.innerHTML = this.reminders.map(reminder => {
      const dateStr = reminder.date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long'
      });
      const timeStr = reminder.time;
      const remindTimeStr = reminder.remindTime.toLocaleString('zh-CN', {
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });

      let advanceText = '';
      if (reminder.advance === 0) {
        advanceText = '会议开始时提醒';
      } else if (reminder.advance < 60) {
        advanceText = `提前${reminder.advance}分钟提醒`;
      } else if (reminder.advance < 1440) {
        advanceText = `提前${Math.floor(reminder.advance / 60)}小时提醒`;
      } else {
        advanceText = `提前${Math.floor(reminder.advance / 1440)}天提醒`;
      }

      return `
        <div class="reminder-item">
          <div class="reminder-item-header">
            <div class="reminder-item-title">
              <i class="fa fa-calendar"></i> ${reminder.type}
            </div>
            <div class="reminder-item-actions">
              <button onclick="reminderManager.deleteReminder('${reminder.id}')" class="btn-delete" title="删除">
                <i class="fa fa-trash"></i>
              </button>
            </div>
          </div>
          <div class="reminder-item-info">
            <div><i class="fa fa-clock-o"></i> <strong>会议时间：</strong>${dateStr} ${timeStr}</div>
            <div><i class="fa fa-map-marker"></i> <strong>会议地点：</strong>${reminder.location}</div>
            <div><i class="fa fa-file-text"></i> <strong>会议议题：</strong>${reminder.topic}</div>
            <div><i class="fa fa-bell"></i> <strong>提醒时间：</strong>${remindTimeStr} (${advanceText})</div>
          </div>
        </div>
      `;
    }).join('');
  }

  // 渲染主页行程概览（显示最近3条未过期提醒）
  renderUpcomingSchedule() {
    const scheduleReminder = document.getElementById('scheduleReminder');
    const scheduleItems = document.getElementById('scheduleItems');
    const subtitleEl = document.getElementById('scheduleSubtitle');
    
    if (!scheduleReminder || !scheduleItems || !subtitleEl) return;

    const now = new Date();
    const upcoming = this.reminders
      .filter(r => {
        const meetingDate = new Date(r.date);
        const [h, m] = r.time.split(':');
        meetingDate.setHours(parseInt(h), parseInt(m), 0, 0);
        return meetingDate >= now;
      })
      .sort((a, b) => {
        const da = new Date(a.date);
        const db = new Date(b.date);
        const [ha, ma] = a.time.split(':');
        const [hb, mb] = b.time.split(':');
        da.setHours(parseInt(ha), parseInt(ma), 0, 0);
        db.setHours(parseInt(hb), parseInt(mb), 0, 0);
        return da - db;
      })
      .slice(0, 3);

    // 如果没有即将开始的会议，隐藏整个提醒区域
    if (upcoming.length === 0) {
      scheduleReminder.classList.remove('active');
      return;
    }

    // 有会议时显示提醒区域
    scheduleReminder.classList.add('active');

    const first = upcoming[0];
    const firstDate = new Date(first.date);
    const firstDateStr = firstDate.toLocaleDateString('zh-CN', {
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    });
    subtitleEl.textContent = `最近一场：${firstDateStr} ${first.time} · ${first.type}`;

    scheduleItems.innerHTML = upcoming.map(r => {
      const d = new Date(r.date);
      const isToday =
        d.getFullYear() === now.getFullYear() &&
        d.getMonth() === now.getMonth() &&
        d.getDate() === now.getDate();
      
      const dateStr = d.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long'
      });
      
      return `
        <div class="schedule-item ${isToday ? 'today' : ''}">
          <div class="schedule-item-header">
            <div class="schedule-item-type">${r.type}</div>
            <div class="schedule-item-time">${dateStr} ${r.time}</div>
          </div>
          <div class="schedule-item-details">
            <div><i class="fa fa-map-marker"></i><strong>地点：</strong>${r.location}</div>
            <div><i class="fa fa-file-text-o"></i><strong>议题：</strong>${r.topic}</div>
          </div>
        </div>
      `;
    }).join('');
  }

  // 检查并显示提醒
  checkReminders() {
    const now = new Date();
    
    this.reminders.forEach(reminder => {
      if (!reminder.notified && reminder.remindTime <= now) {
        this.showReminderNotification(reminder);
        reminder.notified = true;
        this.saveReminders();
      }
    });
    // 顺便刷新行程概览，移除已过期会议
    this.renderUpcomingSchedule();
  }

  // 显示提醒通知
  showReminderNotification(reminder) {
    const dateStr = reminder.date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    });

    const message = `
【三会一课提醒】

会议类型：${reminder.type}
会议时间：${dateStr} ${reminder.time}
会议地点：${reminder.location}
会议议题：${reminder.topic}

请准时参加！
    `.trim();

    // 在对话框中显示提醒
    if (typeof uiManager !== 'undefined') {
      uiManager.addMessage('assistant', message, undefined, undefined, undefined, undefined);
    }

    // 浏览器通知
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('三会一课提醒', {
        body: `${reminder.type}\n时间：${dateStr} ${reminder.time}\n地点：${reminder.location}`,
        icon: 'logo.jpg',
        tag: reminder.id
      });
    } else if ('Notification' in window && Notification.permission !== 'denied') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          new Notification('三会一课提醒', {
            body: `${reminder.type}\n时间：${dateStr} ${reminder.time}\n地点：${reminder.location}`,
            icon: 'logo.jpg',
            tag: reminder.id
          });
        }
      });
    }

    // 语音播报
    if (typeof speechManager !== 'undefined' && speechManager.ttsEnabled) {
      const speechText = `提醒：${reminder.type}将于${dateStr}${reminder.time}在${reminder.location}举行，议题是${reminder.topic}，请准时参加。`;
      speechManager.speak(speechText);
    }
  }

  // 开始定时检查
  startChecking() {
    // 每分钟检查一次
    this.checkInterval = setInterval(() => {
      this.checkReminders();
    }, 60000);
    
    // 立即检查一次
    this.checkReminders();
  }

  // 停止检查
  stopChecking() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
  }
}

// 全局提醒管理器实例
let reminderManager;

// 打开提醒弹窗
function openReminderModal() {
  const modal = document.getElementById('reminderModal');
  if (modal) {
    modal.classList.add('active');
    if (reminderManager) {
      reminderManager.renderReminders();
    }
  }
}

// 关闭提醒弹窗
function closeReminderModal() {
  const modal = document.getElementById('reminderModal');
  if (modal) {
    modal.classList.remove('active');
  }
}

// 重置提醒表单
function resetReminderForm() {
  const form = document.getElementById('reminderForm');
  if (form) {
    form.reset();
  }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
  // 初始化提醒管理器
  reminderManager = new ReminderManager();

  // 绑定表单提交事件
  const form = document.getElementById('reminderForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const formData = {
        type: document.getElementById('reminderType').value,
        date: document.getElementById('reminderDate').value,
        time: document.getElementById('reminderTime').value,
        location: document.getElementById('reminderLocation').value,
        topic: document.getElementById('reminderTopic').value,
        advance: document.getElementById('reminderAdvance').value
      };

      // 验证必填项
      if (!formData.type || !formData.date || !formData.time || !formData.location || !formData.topic) {
        alert('请填写所有必填项！');
        return;
      }

      // 验证日期不能是过去
      const selectedDate = new Date(formData.date + ' ' + formData.time);
      if (selectedDate < new Date()) {
        alert('会议时间不能是过去的时间！');
        return;
      }

      // 添加提醒
      reminderManager.addReminder(formData);
      
      // 重置表单
      resetReminderForm();
      
      // 显示成功消息
      if (typeof uiManager !== 'undefined') {
        uiManager.showNotification('提醒添加成功！');
      } else {
        alert('提醒添加成功！');
      }
    });
  }

  // 点击弹窗外部关闭
  const modal = document.getElementById('reminderModal');
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeReminderModal();
      }
    });
  }

  // 请求通知权限
  if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission();
  }
});

