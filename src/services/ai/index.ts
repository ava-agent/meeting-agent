// AI 服务统一接口

import { glmClient } from './glm-client'
import { PROMPT_TEMPLATES, getSystemPrompt } from './prompt-templates'
import type { AIGenerationRequest, AIGenerationResult, GenerationType } from '@/types/ai'

class AIService {
  private client = glmClient

  async generateContent(request: AIGenerationRequest): Promise<AIGenerationResult> {
    try {
      const { type, meetingData } = request

      // 获取对应的 prompt 模板
      const template = PROMPT_TEMPLATES[type.toUpperCase() as keyof typeof PROMPT_TEMPLATES]
      if (!template) {
        return {
          success: false,
          content: '',
          error: `不支持的生成类型: ${type}`
        }
      }

      const userPrompt = template(meetingData)
      const systemPrompt = getSystemPrompt(type)

      // 调用 GLM API
      const response = await this.client.chatWithRetry({
        model: 'glm-4-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        top_p: 0.9,
        max_tokens: 2000
      })

      // 提取生成内容
      const content = response.choices[0]?.message?.content || ''

      return {
        success: true,
        content,
        usage: response.usage
      }
    } catch (error) {
      console.error('AI生成失败:', error)
      return {
        success: false,
        content: '',
        error: error instanceof Error ? error.message : '未知错误'
      }
    }
  }

  // 生成会议议程
  async generateAgenda(meetingData: AIGenerationRequest['meetingData']): Promise<AIGenerationResult> {
    return this.generateContent({ type: 'agenda', meetingData })
  }

  // 生成演讲稿
  async generateSpeech(meetingData: AIGenerationRequest['meetingData']): Promise<AIGenerationResult> {
    return this.generateContent({ type: 'speech', meetingData })
  }

  // 生成海报设计
  async generatePoster(meetingData: AIGenerationRequest['meetingData']): Promise<AIGenerationResult> {
    return this.generateContent({ type: 'poster', meetingData })
  }

  // 生成伴手礼建议
  async generateGifts(meetingData: AIGenerationRequest['meetingData']): Promise<AIGenerationResult> {
    return this.generateContent({ type: 'gifts', meetingData })
  }

  // 批量生成所有内容
  async generateAllContent(meetingData: AIGenerationRequest['meetingData']): Promise<Record<GenerationType, AIGenerationResult>> {
    const results: Record<GenerationType, AIGenerationResult> = {
      agenda: { success: false, content: '' },
      speech: { success: false, content: '' },
      poster: { success: false, content: '' },
      gifts: { success: false, content: '' }
    }

    // 并行生成所有内容
    const [agenda, speech, poster, gifts] = await Promise.all([
      this.generateAgenda(meetingData),
      this.generateSpeech(meetingData),
      this.generatePoster(meetingData),
      this.generateGifts(meetingData)
    ])

    results.agenda = agenda
    results.speech = speech
    results.poster = poster
    results.gifts = gifts

    return results
  }
}

// 导出单例实例
export const aiService = new AIService()
export default aiService
