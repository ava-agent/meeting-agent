// 会议相关类型定义

export type MeetingStatus = 'draft' | 'completed' | 'published'

export type MeetingType = 'company' | 'academic' | 'product' | 'training' | 'social' | 'other'

export interface Meeting {
  id?: string
  _id?: string
  userId?: string
  title: string
  date: string
  location: string
  description: string
  attendees: number
  budget: string
  type: MeetingType | '' // 允许空字符串
  duration: string | '' // 允许空字符串
  status: MeetingStatus
  generatedContent?: GeneratedContent
  createdAt?: Date
  updatedAt?: Date
}

export type MeetingInput = Omit<Meeting, 'id' | '_id' | 'createdAt' | 'updatedAt'> & {
  createdAt?: Date
  updatedAt?: Date
}

export interface MeetingFormData {
  title: string
  date: string
  location: string
  description: string
  attendees: string
  budget: string
  type: MeetingType
  duration: string
}

export interface GeneratedContent {
  agenda?: string
  speech?: string
  poster?: string
  gifts?: string
}

export interface MeetingWithContent extends Meeting {
  generatedContent?: GeneratedContent
}
