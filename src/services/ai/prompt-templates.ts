// Prompt 模板

export interface PromptData {
  title: string
  date?: string
  location?: string
  description?: string
  attendees?: string
  budget?: string
  type?: string
  duration?: string
}

export const PROMPT_TEMPLATES = {
  // 议程生成模板
  AGENDA: (data: PromptData): string => `你是一位专业的会议策划专家。请根据以下会议信息，生成一份详细的会议议程。

会议信息：
- 主题：${data.title}
- 日期：${data.date || '待定'}
- 地点：${data.location || '待定'}
- 参会人数：${data.attendees || '待定'}人
- 会议时长：${data.duration || '4'}小时
- 会议类型：${data.type || '通用会议'}
- 会议描述：${data.description || '无'}

要求：
1. 议程要包含时间节点、内容描述、负责人
2. 合理分配时间，包含开场、主体内容、互动、总结环节
3. 考虑茶歇和用餐时间
4. 以清晰的格式输出，使用emoji图标增强可读性

请直接输出议程内容，不要添加额外的解释说明。`,

  // 演讲稿生成模板
  SPEECH: (data: PromptData): string => `你是一位专业的演讲稿撰写专家。请根据以下会议信息，撰写一份专业的开幕演讲稿。

会议信息：
- 主题：${data.title}
- 日期：${data.date || '待定'}
- 地点：${data.location || '待定'}
- 参会人数：${data.attendees || '待定'}人
- 会议类型：${data.type || '通用会议'}
- 会议描述：${data.description || '无'}

要求：
1. 演讲稿时长约${Math.max(5, Math.floor((parseInt(data.duration || '4') || 4) / 8))}分钟
2. 包含：欢迎致辞、会议背景、核心内容、期望成果、感谢致辞
3. 语言要正式而富有感染力
4. 适合${data.type || '通用'}类型的会议风格

请直接输出演讲稿内容，不要添加额外的解释说明。`,

  // 海报设计建议模板
  POSTER: (data: PromptData): string => `你是一位专业的平面设计师。请根据以下会议信息，提供海报设计方案。

会议信息：
- 主题：${data.title}
- 日期：${data.date || '待定'}
- 地点：${data.location || '待定'}
- 会议类型：${data.type || '通用会议'}

要求：
1. 设计风格建议（现代/商务/创意等）
2. 主色调和配色方案
3. 核心视觉元素
4. 布局建议
5. 文字排版建议
6. 尺寸和用途建议

请以结构化的方式输出设计方案。`,

  // 伴手礼推荐模板
  GIFTS: (data: PromptData): string => `你是一位专业的会议策划顾问。请根据以下会议信息，推荐合适的伴手礼方案。

会议信息：
- 主题：${data.title}
- 参会人数：${data.attendees || '100'}人
- 预算范围：${data.budget || '中等'}
- 会议类型：${data.type || '通用会议'}

要求：
1. 推荐3-5个不同档次的伴手礼方案
2. 每个方案包含：名称、单价、特点、适用场景
3. 计算总成本预算
4. 提供采购建议
5. 考虑环保和实用性

请以结构化的方式输出推荐方案。`
}

// 获取系统提示词
export const getSystemPrompt = (type: string): string => {
  const prompts: Record<string, string> = {
    agenda: '你是一位专业的会议策划专家，擅长制定详细、合理的会议议程。',
    speech: '你是一位专业的演讲稿撰写专家，擅长撰写富有感染力的会议演讲稿。',
    poster: '你是一位专业的平面设计师，擅长会议海报设计。',
    gifts: '你是一位专业的会议策划顾问，擅长为各类会议推荐合适的伴手礼。'
  }
  return prompts[type] || '你是一位专业的会议策划助手。'
}
