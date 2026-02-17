// 服务端 AI 生成路由 (GLM API 代理)
// API key 保存在服务端环境变量中，不暴露给浏览器

import { NextRequest, NextResponse } from 'next/server'
import { PROMPT_TEMPLATES, getSystemPrompt } from '@/services/ai/prompt-templates'
import type { GenerationType } from '@/types/ai'

const GLM_API_BASE = 'https://open.bigmodel.cn/api/paas/v4/chat/completions'

interface GenerateRequest {
  type: GenerationType
  meetingData: {
    title: string
    date?: string
    location?: string
    description?: string
    attendees?: string
    budget?: string
    type?: string
    duration?: string
  }
}

function getMockContent(type: GenerationType): string {
  const mocks: Record<GenerationType, string> = {
    agenda: `📋 会议议程（演示内容）\n\n1. 【开幕 - 30分钟】\n   - 主持人开场\n   - 领导致辞\n\n2. 【主题分享 - 60分钟】\n   - 核心内容\n   - 案例分析\n\n3. 【互动讨论 - 45分钟】\n   - 分组讨论\n   - Q&A\n\n4. 【总结 - 15分钟】\n   - 会议总结\n   - 行动计划\n\n⚠️ 请配置 GLM_API_KEY 获取 AI 真实生成内容`,
    speech: `🎤 开场致辞（演示内容）\n\n尊敬的各位来宾：\n\n非常荣幸主持本次会议。今天我们汇聚一堂，共同探讨重要议题。\n\n本次会议的核心目标是推动交流与合作，共同迎接新的发展机遇。\n\n预祝会议圆满成功！\n\n⚠️ 请配置 GLM_API_KEY 获取 AI 真实生成内容`,
    poster: `🎨 海报设计方案（演示内容）\n\n设计风格：现代商务\n主色调：蓝色渐变\n\n核心元素：\n- 会议主题标题\n- 时间地点信息\n- 主办方 Logo\n- 二维码\n\n⚠️ 请配置 GLM_API_KEY 获取 AI 真实生成内容`,
    gifts: `🎁 伴手礼推荐（演示内容）\n\n方案一：商务礼品套装 - ¥38/份\n方案二：保温杯礼盒 - ¥45/份\n方案三：充电宝套装 - ¥52/份\n\n⚠️ 请配置 GLM_API_KEY 获取 AI 真实生成内容`
  }
  return mocks[type] || '演示内容'
}

export async function POST(request: NextRequest) {
  try {
    const body: GenerateRequest = await request.json()
    const { type, meetingData } = body

    if (!type || !meetingData) {
      return NextResponse.json(
        { success: false, error: '缺少必要参数: type 和 meetingData' },
        { status: 400 }
      )
    }

    const validTypes: GenerationType[] = ['agenda', 'speech', 'poster', 'gifts']
    if (!validTypes.includes(type)) {
      return NextResponse.json(
        { success: false, error: `不支持的生成类型: ${type}` },
        { status: 400 }
      )
    }

    const apiKey = process.env.GLM_API_KEY
    if (!apiKey) {
      // 无 API key 时返回演示内容
      return NextResponse.json({
        success: true,
        content: getMockContent(type),
        usage: { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 },
        mock: true
      })
    }

    const template = PROMPT_TEMPLATES[type.toUpperCase() as keyof typeof PROMPT_TEMPLATES]
    const userPrompt = template(meetingData)
    const systemPrompt = getSystemPrompt(type)

    const glmResponse = await fetch(GLM_API_BASE, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'glm-4-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        top_p: 0.9,
        max_tokens: 2000
      }),
      signal: AbortSignal.timeout(60000)
    })

    if (!glmResponse.ok) {
      const errorData = await glmResponse.json().catch(() => ({}))
      const errorMessage = (errorData as { error?: { message?: string } }).error?.message || glmResponse.statusText
      return NextResponse.json(
        { success: false, error: `GLM API 错误: ${errorMessage}` },
        { status: glmResponse.status }
      )
    }

    const glmData = await glmResponse.json() as {
      choices: Array<{ message: { content: string } }>
      usage: { prompt_tokens: number; completion_tokens: number; total_tokens: number }
    }
    const content = glmData.choices[0]?.message?.content || ''

    return NextResponse.json({
      success: true,
      content,
      usage: glmData.usage
    })
  } catch (error) {
    console.error('AI 生成失败:', error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'AI 生成失败' },
      { status: 500 }
    )
  }
}
