// AI服务相关类型定义

export type GenerationType = 'agenda' | 'speech' | 'poster' | 'gifts'

export interface AIMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export interface AIRequest {
  model: string
  messages: AIMessage[]
  temperature?: number
  top_p?: number
  max_tokens?: number
  stream?: boolean
}

export interface AIChoice {
  index: number
  message: AIMessage
  finish_reason: string
}

export interface AIUsage {
  prompt_tokens: number
  completion_tokens: number
  total_tokens: number
}

export interface AIResponse {
  id: string
  created: number
  model: string
  choices: AIChoice[]
  usage: AIUsage
}

export interface AIGenerationRequest {
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

export interface AIGenerationResult {
  success: boolean
  content: string
  error?: string
  usage?: AIUsage
}

export interface GenerationRecord {
  id?: string
  _id?: string
  meetingId: string
  type: GenerationType
  content: string
  prompt: string
  model: string
  tokens: {
    prompt: number
    completion: number
    total: number
  }
  createdAt?: Date
}
