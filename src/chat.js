// 对话上下文管理
class ChatContext {
  constructor() {
    this.messages = [];
    this.maxContextRounds = 20; // 支持至少10轮，设置为20轮以提供更多上下文
    this.systemPrompt = `你是一位专业的党建阵地知识问答助手。你的任务是回答关于党建阵地、党的理论、党史、组织建设、思想教育等相关问题。

请遵循以下原则：
1. 回答要准确、专业，基于党的理论和实践
2. 语言要通俗易懂，便于理解
3. 如果问题超出党建阵地知识范围，礼貌地引导用户
4. 保持积极正面的态度
5. 可以结合具体案例和实际工作场景进行说明

党建阵地相关知识包括但不限于：
- 党的基本理论（马克思主义、毛泽东思想、邓小平理论、"三个代表"重要思想、科学发展观、习近平新时代中国特色社会主义思想）
- 党史和党的优良传统
- 党的组织建设（基层党组织、党员发展、组织生活等）
- 党的思想建设（理论学习、思想教育等）
- 党的作风建设
- 党的纪律建设
- 党建阵地建设实践
- 党员的权利和义务
- 党的组织原则和制度`;
  }

  // 添加消息到上下文
  addMessage(role, content) {
    this.messages.push({
      role: role,
      content: content,
      timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
    });

    // 保持上下文在合理范围内（保留系统提示和最近的对话）
    if (this.messages.length > this.maxContextRounds * 2 + 1) {
      // 保留系统提示和最近的对话
      const systemMessage = this.messages[0];
      const recentMessages = this.messages.slice(-this.maxContextRounds * 2);
      this.messages = [systemMessage, ...recentMessages];
    }
  }

  // 获取对话轮次
  getRoundCount() {
    // 排除系统提示，计算用户和助手的对话轮次
    return Math.floor((this.messages.length - 1) / 2);
  }

  // 清空上下文
  clear() {
    this.messages = [{
      role: 'system',
      content: this.systemPrompt
    }];
  }

  // 获取用于API调用的消息列表
  getMessagesForAPI() {
    return this.messages;
  }
}

// API调用管理
class APIManager {
  constructor() {
    this.currentModel = 'qwen3';
    // API配置 - 实际使用时需要配置真实的API密钥和端点
    this.apiConfig = {
      qwen3: {
        // Qwen3 API配置示例
        // 实际使用时需要替换为真实的API端点
        endpoint: 'https://api.example.com/v1/chat/completions', // 示例端点
        apiKey: 'your-qwen3-api-key', // 需要配置真实密钥
        model: 'qwen-plus'
      },
      deepseek: {
        // DeepSeek API配置示例
        endpoint: 'https://api.deepseek.com/v1/chat/completions', // 示例端点
        apiKey: 'your-deepseek-api-key', // 需要配置真实密钥
        model: 'deepseek-chat'
      }
    };
  }

  // 设置当前模型
  setModel(model) {
    this.currentModel = model;
  }

  // 调用大语言模型API
  async callLLM(messages) {
    const config = this.apiConfig[this.currentModel];
    
    try {
      // 模拟API调用 - 实际使用时需要替换为真实的API调用
      // 这里提供一个模拟实现，实际部署时需要配置真实的API
      
      // 方案1: 如果使用真实的API（需要配置API密钥）
      /*
      const response = await fetch(config.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.apiKey}`
        },
        body: JSON.stringify({
          model: config.model,
          messages: messages,
          temperature: 0.7,
          max_tokens: 2000
        })
      });

      if (!response.ok) {
        throw new Error(`API调用失败: ${response.statusText}`);
      }

      const data = await response.json();
      return data.choices[0].message.content;
      */

      // 方案2: 模拟API响应（用于演示和测试）
      return this.simulateAPIResponse(messages);
      
    } catch (error) {
      console.error('API调用错误:', error);
      throw new Error('AI服务暂时不可用，请稍后重试。错误信息: ' + error.message);
    }
  }

  // 模拟API响应（用于演示）
  simulateAPIResponse(messages) {
    return new Promise((resolve) => {
      // 模拟网络延迟
      setTimeout(() => {
        const lastUserMessage = messages[messages.length - 1]?.content || '';
        
        // 根据用户问题生成模拟回答
        let response = '';
        
        if (lastUserMessage.includes('党建阵地') || lastUserMessage.includes('什么是')) {
          response = `党建阵地是指党组织开展活动、进行教育、凝聚党员和群众的重要场所和平台。它是基层党组织发挥作用的重要载体，包括：

1. **物理阵地**：党员活动室、党建文化墙、红色教育基地等实体场所
2. **网络阵地**：党建网站、微信公众号、学习平台等线上平台
3. **活动阵地**：主题党日活动、组织生活会、党课等组织活动

党建阵地的建设要注重：
- 规范化：按照标准建设，确保功能完善
- 特色化：结合本单位实际，打造特色品牌
- 实效化：真正发挥作用，服务党员和群众

您还想了解党建阵地的哪个方面呢？`;
        } else if (lastUserMessage.includes('组织建设') || lastUserMessage.includes('基层党组织')) {
          response = `加强基层党组织建设是党的建设的重要基础。主要措施包括：

**1. 健全组织体系**
- 优化组织设置，确保党组织全覆盖
- 选优配强党组织书记和班子成员
- 完善组织架构，明确职责分工

**2. 规范组织生活**
- 严格落实"三会一课"制度
- 定期开展主题党日活动
- 认真召开组织生活会和民主评议党员

**3. 加强党员队伍建设**
- 严格党员发展程序，保证发展质量
- 加强党员教育管理
- 发挥党员先锋模范作用

**4. 创新活动方式**
- 结合工作实际，创新活动载体
- 运用信息化手段，提升工作效能
- 打造党建品牌，形成工作特色

**5. 强化保障措施**
- 落实经费保障
- 完善活动场所
- 加强工作指导

您对哪个方面比较感兴趣？我可以进一步详细说明。`;
        } else if (lastUserMessage.includes('组织生活') || lastUserMessage.includes('形式')) {
          response = `党的组织生活主要有以下形式：

**1. 三会一课**
- **支部党员大会**：讨论决定支部重大事项
- **支部委员会**：研究支部日常工作
- **党小组会**：组织党员学习讨论
- **党课**：对党员进行教育

**2. 组织生活会**
- 定期召开，开展批评与自我批评
- 查摆问题，改进工作作风

**3. 民主评议党员**
- 每年进行一次
- 对党员进行评价和鉴定

**4. 主题党日活动**
- 每月固定日期开展
- 内容丰富，形式多样

**5. 谈心谈话**
- 党组织负责人与党员谈心
- 党员之间相互交流

**6. 其他形式**
- 参观红色教育基地
- 观看教育影片
- 开展志愿服务
- 学习讨论会等

这些形式要结合实际，注重实效，避免形式主义。您想了解哪种组织生活的具体做法？`;
        } else if (lastUserMessage.includes('权利') || lastUserMessage.includes('义务')) {
          response = `根据《中国共产党章程》，党员享有以下**权利**：

1. 参加党的有关会议，阅读党的有关文件，接受党的教育和培训
2. 在党的会议上和党报党刊上，参加关于党的政策问题的讨论
3. 对党的工作提出建议和倡议
4. 在党的会议上有根据地批评党的任何组织和任何党员
5. 行使表决权、选举权，有被选举权
6. 在党组织讨论决定对党员的党纪处分或作出鉴定时，本人有权参加和进行申辩
7. 对党的决议和政策如有不同意见，可以声明保留，并且可以把自己的意见向党的上级组织直至中央提出
8. 向党的上级组织直至中央提出请求、申诉和控告，并要求有关组织给以负责的答复

党员必须履行以下**义务**：

1. 认真学习党的理论，学习党的路线、方针、政策和决议
2. 贯彻执行党的基本路线和各项方针、政策
3. 坚持党和人民的利益高于一切
4. 自觉遵守党的纪律
5. 维护党的团结和统一
6. 切实开展批评和自我批评
7. 密切联系群众
8. 发扬社会主义新风尚

权利和义务是统一的，党员要正确行使权利，认真履行义务。您还想了解哪方面的内容？`;
        } else {
          // 通用回答模板
          response = `感谢您的问题。关于"${lastUserMessage}"，这是党建阵地建设中的重要内容。

在党建工作中，我们需要：
- 坚持理论联系实际
- 注重工作实效
- 创新方式方法
- 服务党员和群众

如果您能提供更具体的问题，我可以给出更详细的解答。比如：
- 您想了解具体的操作流程吗？
- 您遇到了什么实际问题？
- 您想学习相关的理论知识吗？

请告诉我您更关心哪个方面，我会尽力为您解答。`;
        }
        
        resolve(response);
      }, 1000 + Math.random() * 1000); // 模拟1-2秒的响应时间
    });
  }
}

// 语音管理（语音输入 + 播报）
class SpeechManager {
  constructor(uiManager) {
    this.ui = uiManager;
    this.recognition = null;
    this.isListening = false;
    this.ttsEnabled = true;
    this.synth = window.speechSynthesis || null;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.lang = 'zh-CN';
      this.recognition.continuous = false;
      this.recognition.interimResults = false;

      this.recognition.onstart = () => {
        this.isListening = true;
        this.ui.setVoiceStatus('正在聆听，请开始讲话...', true);
      };

      this.recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        this.ui.setVoiceStatus('识别完成，已填入文本', false);
        this.ui.setInput(transcript);
        sendMessage();
      };

      this.recognition.onerror = (event) => {
        this.isListening = false;
        this.ui.setVoiceStatus(`语音识别出错：${event.error}`, false);
      };

      this.recognition.onend = () => {
        this.isListening = false;
        this.ui.setVoiceStatus('语音空闲', false);
        this.ui.setVoiceButtonActive(false);
      };
    } else {
      this.ui.setVoiceStatus('当前浏览器不支持语音识别', false);
    }
  }

  toggleListening() {
    if (!this.recognition) {
      this.ui.showNotification('当前浏览器不支持语音识别，请更换现代浏览器');
      return;
    }
    if (this.isListening) {
      this.recognition.stop();
      return;
    }
    this.ui.setVoiceButtonActive(true);
    this.ui.setVoiceStatus('正在聆听，请开始讲话...', true);
    this.recognition.start();
  }

  speak(text) {
    if (!this.ttsEnabled || !this.synth) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'zh-CN';
    utterance.rate = 1;
    utterance.pitch = 1;
    this.synth.cancel();
    this.synth.speak(utterance);
  }

  setTTSEnabled(enabled) {
    this.ttsEnabled = enabled;
    this.ui.showNotification(enabled ? '已开启语音播报' : '已关闭语音播报');
  }
}

// UI管理
class UIManager {
  constructor() {
    this.chatContainer = document.getElementById('chatContainer');
    this.messageInput = document.getElementById('messageInput');
    this.sendButton = document.getElementById('sendButton');
    this.welcomeMessage = document.getElementById('welcomeMessage');
    this.contextCount = document.getElementById('contextCount');
    this.modelSelect = document.getElementById('modelSelect');
    this.voiceButton = document.getElementById('voiceButton');
    this.voiceStatus = document.getElementById('voiceStatus');
    this.ttsToggle = document.getElementById('ttsToggle');
    this.speechManager = null;
    
    // 初始化输入框自动调整高度
    this.messageInput.addEventListener('input', () => {
      this.autoResizeTextarea();
    });
    
    // 回车发送（Shift+Enter换行）
    this.messageInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this.sendMessage();
      }
    });
    
    // 模型切换
    this.modelSelect.addEventListener('change', (e) => {
      apiManager.setModel(e.target.value);
      this.showNotification(`已切换到${e.target.value === 'qwen3' ? 'Qwen3' : 'DeepSeek'}模型`);
    });
  }

  // 绑定语音管理器
  bindSpeechManager(manager) {
    this.speechManager = manager;
    if (this.voiceButton) {
      this.voiceButton.addEventListener('click', () => {
        this.speechManager.toggleListening();
      });
    }
    if (this.ttsToggle) {
      this.ttsToggle.addEventListener('change', (e) => {
        this.speechManager.setTTSEnabled(e.target.checked);
      });
    }
  }

  // 自动调整文本框高度
  autoResizeTextarea() {
    this.messageInput.style.height = 'auto';
    this.messageInput.style.height = Math.min(this.messageInput.scrollHeight, 150) + 'px';
  }

  // 添加消息到聊天界面
  addMessage(role, content, timestamp, responseTime, roundNumber, modelType) {
    // 隐藏欢迎消息
    if (this.welcomeMessage) {
      this.welcomeMessage.style.display = 'none';
    }

    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${role}`;

    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    avatar.innerHTML = role === 'user' ? '<i class="fa fa-user"></i>' : '<i class="fa fa-robot"></i>';

    const bubble = document.createElement('div');
    bubble.className = 'message-bubble';
    bubble.textContent = content;

    const time = document.createElement('div');
    time.className = 'message-time';
    time.textContent = timestamp || new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });

    // 添加元信息（响应时间、对话轮数和模型类型）
    if (responseTime !== undefined || roundNumber !== undefined || modelType !== undefined) {
      const meta = document.createElement('div');
      meta.className = 'message-meta';
      
      if (responseTime !== undefined && role === 'assistant') {
        const responseTimeItem = document.createElement('div');
        responseTimeItem.className = 'message-meta-item response-time';
        responseTimeItem.innerHTML = `<i class="fa fa-clock-o"></i> 响应时间: ${responseTime}ms`;
        meta.appendChild(responseTimeItem);
      }
      
      if (modelType !== undefined && role === 'assistant') {
        const modelItem = document.createElement('div');
        modelItem.className = 'message-meta-item model-type';
        const modelName = modelType === 'qwen3' ? 'Qwen3' : modelType === 'deepseek' ? 'DeepSeek' : modelType;
        modelItem.innerHTML = `<i class="fa fa-cog"></i> 模型: ${modelName}`;
        meta.appendChild(modelItem);
      }
      
      if (roundNumber !== undefined) {
        const roundItem = document.createElement('div');
        roundItem.className = 'message-meta-item round-number';
        roundItem.innerHTML = `<i class="fa fa-comments"></i> 第 ${roundNumber} 轮对话`;
        meta.appendChild(roundItem);
      }
      
      bubble.appendChild(meta);
    }

    bubble.appendChild(time);
    messageDiv.appendChild(avatar);
    messageDiv.appendChild(bubble);

    this.chatContainer.appendChild(messageDiv);
    this.scrollToBottom();
  }

  // 显示输入指示器
  showTypingIndicator() {
    const indicator = document.createElement('div');
    indicator.className = 'chat-message assistant';
    indicator.id = 'typingIndicator';
    
    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    avatar.innerHTML = '<i class="fa fa-robot"></i>';
    
    const bubble = document.createElement('div');
    bubble.className = 'message-bubble typing-indicator';
    bubble.innerHTML = '<span></span><span></span><span></span>';
    
    indicator.appendChild(avatar);
    indicator.appendChild(bubble);
    this.chatContainer.appendChild(indicator);
    this.scrollToBottom();
  }

  // 移除输入指示器
  removeTypingIndicator() {
    const indicator = document.getElementById('typingIndicator');
    if (indicator) {
      indicator.remove();
    }
  }

  // 滚动到底部
  scrollToBottom() {
    this.chatContainer.scrollTop = this.chatContainer.scrollHeight;
  }

  // 更新上下文计数
  updateContextCount(count) {
    this.contextCount.textContent = `对话轮次: ${count}`;
  }

  // 清空聊天界面
  clearChat() {
    this.chatContainer.innerHTML = '';
    if (this.welcomeMessage) {
      this.welcomeMessage.style.display = 'block';
      this.chatContainer.appendChild(this.welcomeMessage);
    }
  }

  // 获取输入内容
  getInput() {
    return this.messageInput.value.trim();
  }

  // 设置输入内容
  setInput(text) {
    this.messageInput.value = text;
    this.autoResizeTextarea();
  }

  // 清空输入
  clearInput() {
    this.messageInput.value = '';
    this.autoResizeTextarea();
  }

  // 设置发送按钮状态
  setSendButtonEnabled(enabled) {
    this.sendButton.disabled = !enabled;
    if (enabled) {
      this.sendButton.innerHTML = '<i class="fa fa-paper-plane"></i> 发送';
    } else {
      this.sendButton.innerHTML = '<i class="fa fa-spinner fa-spin"></i> 发送中...';
    }
  }

  // 显示通知
  showNotification(message) {
    // 简单的通知实现
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #2196F3;
      color: white;
      padding: 12px 20px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
      z-index: 10000;
      animation: slideIn 0.3s ease-out;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.animation = 'slideOut 0.3s ease-out';
      setTimeout(() => notification.remove(), 300);
    }, 2000);
  }

  // 语音状态显示
  setVoiceStatus(text, busy) {
    if (!this.voiceStatus) return;
    this.voiceStatus.innerHTML = `<i class="fa fa-microphone"></i> ${text}`;
    this.voiceStatus.style.borderColor = busy ? '#2196F3' : '#BBDEFB';
    this.voiceStatus.style.background = busy ? '#E3F2FD' : '#E3F2FD';
  }

  setVoiceButtonActive(active) {
    if (!this.voiceButton) return;
    if (active) {
      this.voiceButton.classList.add('active');
    } else {
      this.voiceButton.classList.remove('active');
    }
  }
}

// 全局实例
const chatContext = new ChatContext();
const apiManager = new APIManager();
const uiManager = new UIManager();
const speechManager = new SpeechManager(uiManager);
uiManager.bindSpeechManager(speechManager);

// 初始化
chatContext.clear();

// 发送消息
async function sendMessage() {
  const input = uiManager.getInput();
  if (!input) {
    return;
  }

  // 获取当前对话轮数
  const currentRound = chatContext.getRoundCount() + 1;
  
  // 获取当前使用的模型类型
  const currentModel = apiManager.currentModel;

  // 添加用户消息
  chatContext.addMessage('user', input);
  uiManager.addMessage('user', input, undefined, undefined, currentRound, undefined);
  uiManager.clearInput();
  uiManager.setSendButtonEnabled(false);

  // 更新上下文计数
  uiManager.updateContextCount(chatContext.getRoundCount());

  // 显示输入指示器
  uiManager.showTypingIndicator();

  // 记录开始时间
  const startTime = performance.now();

  try {
    // 获取API消息格式
    const messages = chatContext.getMessagesForAPI();
    
    // 调用API
    const response = await apiManager.callLLM(messages);
    
    // 计算响应时间
    const endTime = performance.now();
    const responseTime = Math.round(endTime - startTime);
    
    // 移除输入指示器
    uiManager.removeTypingIndicator();
    
    // 添加助手回复（显示响应时间、对话轮数和模型类型）
    chatContext.addMessage('assistant', response);
    uiManager.addMessage('assistant', response, undefined, responseTime, currentRound, currentModel);
    // 语音播报
    speechManager.speak(response);
    
    // 更新上下文计数
    uiManager.updateContextCount(chatContext.getRoundCount());
    
  } catch (error) {
    const endTime = performance.now();
    const responseTime = Math.round(endTime - startTime);
    uiManager.removeTypingIndicator();
    uiManager.addMessage('assistant', `抱歉，出现了错误：${error.message}`, undefined, responseTime, currentRound, currentModel);
    console.error('发送消息错误:', error);
  } finally {
    uiManager.setSendButtonEnabled(true);
  }
}

// 快速提问
function askQuestion(question) {
  uiManager.messageInput.value = question;
  sendMessage();
}

// 清空对话
function clearChat() {
  if (confirm('确定要清空所有对话记录吗？')) {
    chatContext.clear();
    uiManager.clearChat();
    uiManager.updateContextCount(0);
  }
}

// 导出对话
function exportChat() {
  const messages = chatContext.messages;
  if (messages.length <= 1) {
    uiManager.showNotification('暂无对话记录可导出');
    return;
  }

  let content = '党建阵地知识问答对话记录\n';
  content += '='.repeat(50) + '\n';
  content += `导出时间: ${new Date().toLocaleString('zh-CN')}\n`;
  content += `使用模型: ${apiManager.currentModel === 'qwen3' ? 'Qwen3' : 'DeepSeek'}\n`;
  content += `对话轮次: ${chatContext.getRoundCount()}\n`;
  content += '='.repeat(50) + '\n\n';

  messages.forEach((msg, index) => {
    if (msg.role !== 'system') {
      const roleName = msg.role === 'user' ? '用户' : 'AI助手';
      content += `[${roleName}] (${msg.timestamp})\n`;
      content += msg.content + '\n\n';
    }
  });

  // 创建下载链接
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `党建问答对话_${new Date().toISOString().slice(0, 10)}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  uiManager.showNotification('对话记录已导出');
}

// 页面加载完成后的初始化
document.addEventListener('DOMContentLoaded', () => {
  console.log('党建阵地知识问答系统已加载');
  console.log('支持模型: Qwen3, DeepSeek');
  console.log('上下文管理: 支持至少10轮对话（当前设置为20轮）');
});

