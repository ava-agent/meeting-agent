// GLM-4.7 API 客户端

import axios from 'axios'
import type { AIRequest, AIResponse } from '@/types/ai'

const GLM_API_BASE = 'https://open.bigmodel.cn/api/paas/v4/chat/completions'

export class GLMClient {
  private apiKey: string
  private baseURL: string

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.NEXT_PUBLIC_GLM_API_KEY || ''
    this.baseURL = GLM_API_BASE

    if (!this.apiKey) {
      console.warn('GLM API Key not provided, using mock mode')
    }
  }

  async chat(request: AIRequest): Promise<AIResponse> {
    // 如果没有API密钥，返回模拟响应
    if (!this.apiKey) {
      return this.getMockResponse(request)
    }

    try {
      const response = await axios.post<AIResponse>(
        this.baseURL,
        request,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          },
          timeout: 60000 // 60秒超时
        }
      )
      return response.data
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.error?.message || error.message
        throw new Error(`GLM API 请求失败: ${errorMessage}`)
      }
      throw error
    }
  }

  // 带重试的聊天方法
  async chatWithRetry(request: AIRequest, maxRetries = 3): Promise<AIResponse> {
    // 如果没有API密钥，直接返回模拟响应
    if (!this.apiKey) {
      return this.getMockResponse(request)
    }

    let lastError: Error | null = null

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await this.chat(request)
      } catch (error) {
        lastError = error as Error
        if (attempt < maxRetries) {
          // 指数退避
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000))
        }
      }
    }

    throw lastError || new Error('GLM API 请求失败')
  }

  // 模拟响应（用于开发测试）
  private getMockResponse(request: AIRequest): AIResponse {
    const userMessage = request.messages[request.messages.length - 1]
    const content = this.generateMockContent(userMessage.content)

    return {
      id: `mock-${Date.now()}`,
      created: Math.floor(Date.now() / 1000),
      model: request.model,
      choices: [{
        index: 0,
        message: {
          role: 'assistant',
          content: content
        },
        finish_reason: 'stop'
      }],
      usage: {
        prompt_tokens: 100,
        completion_tokens: 200,
        total_tokens: 300
      }
    }
  }

  // 生成模拟内容
  private generateMockContent(prompt: string): string {
    const lowerPrompt = prompt.toLowerCase()

    if (lowerPrompt.includes('议程') || lowerPrompt.includes('agenda')) {
      return this.getMockAgenda()
    } else if (lowerPrompt.includes('演讲') || lowerPrompt.includes('speech')) {
      return this.getMockSpeech()
    } else if (lowerPrompt.includes('海报') || lowerPrompt.includes('poster')) {
      return this.getMockPoster()
    } else if (lowerPrompt.includes('伴手礼') || lowerPrompt.includes('gift')) {
      return this.getMockGifts()
    }

    return '这是一个模拟的AI响应。请配置 GLM_API_KEY 环境变量以使用真实的AI服务。'
  }

  private getMockAgenda(): string {
    return `📋 会议议程

1. 【开幕环节 - 30分钟】
   - 主持人开场介绍
   - 领导致辞
   - 会议主题宣布

2. 【主题分享 - 60分钟】
   - 核心内容讲解
   - 数据分析展示
   - 案例分享

3. 【互动讨论 - 45分钟】
   - 分组讨论
   - 意见收集
   - 问题解答

4. 【总结展望 - 30分钟】
   - 会议总结
   - 后续行动计划
   - 闭幕致辞

🎯 会议目标：
- 分享最新行业动态
- 促进交流与合作
- 明确发展方向
- 制定行动计划

📝 注意事项：
- 请提前15分钟入场
- 会议期间请保持安静
- 积极参与讨论互动`
  }

  private getMockSpeech(): string {
    return `🎤 开场致辞

尊敬的各位来宾，女士们、先生们：

大家好！

非常荣幸能够在这里主持本次会议。今天，我们齐聚一堂，共同见证这个重要的时刻。

🌟 会议背景

随着行业的发展和技术的进步，我们面临着新的机遇和挑战。本次会议的召开，正是为了更好地应对这些变化，把握发展机遇。

💡 核心内容

1. 行业发展趋势分析
   - 市场环境变化
   - 技术创新驱动
   - 政策环境影响

2. 最佳实践分享
   - 成功案例剖析
   - 经验教训总结
   - 方法论提炼

3. 未来展望
   - 发展趋势预测
   - 战略规划建议
   - 行动指南

🎯 我们的目标

通过本次会议，我们希望能够：
- 明确发展方向
- 凝聚共识力量
- 促进合作共赢
- 推动创新发展

最后，预祝本次会议圆满成功！感谢各位的大力支持和参与！

谢谢大家！`
  }

  private getMockPoster(): string {
    return `🎨 海报设计方案

设计风格：现代科技感 + 专业商务风
主色调：蓝色渐变 + 金色点缀

核心元素：
- 会议主题大标题设计
- 时间地点信息清晰展示
- 精美背景图案和装饰
- 二维码扫码了解详情
- 主办方logo和品牌元素

设计亮点：
✅ 视觉层次清晰，信息传达准确
✅ 色彩搭配和谐，美观大方
✅ 现代感强，符合当前审美
✅ 品牌识别度高，专业可靠

海报规格：A3尺寸（竖版）
使用场景：线上宣传、线下张贴
建议用途：微信公众号、官网banner、会议现场

✨ 立即下载高清版本，开启您的会议宣传！`
  }

  private getMockGifts(): string {
    return `🎁 伴手礼推荐方案

基于您的会议需求，为您量身定制：

💼 商务礼品系列（推荐）：
• 高级真皮笔记本 + 签字笔套装 - ¥38/份
• 不锈钢保温杯 + 咖啡礼盒 - ¥45/份
• 多功能充电宝 + 数据线 - ¥52/份

🎨 创意礼品系列：
• 定制帆布托特包 - ¥28/份
• 精美台历 + 书签套装 - ¥18/份
• 香薰蜡烛 + 点香器 - ¥35/份

🛍️ 食品礼品系列：
• 高端茶叶礼盒 - ¥48/份
• 进口巧克力礼盒 - ¥32/份
• 精品坚果礼包 - ¥25/份

🎯 推荐理由：
1. 实用性强，参会者喜欢
2. 品牌传播效果明显
3. 成本控制合理
4. 包装精美有档次

💡 采购建议：
- 选择正规供应商确保品质
- 提前批量采购获得优惠
- 考虑环保材料符合趋势
- 准备备用礼品以防缺货`
  }
}

// 导出单例实例
export const glmClient = new GLMClient()
export default glmClient
