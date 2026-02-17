// Supabase 数据库操作服务

import { supabase } from '@/lib/supabase'
import type { Meeting, GeneratedContent } from '@/types/meeting'

type MeetingRow = {
  id: string
  user_id: string
  title: string
  date: string
  location: string
  description: string
  attendees: number
  budget: string
  type: string
  duration: string
  status: string
  generated_content: GeneratedContent | null
  created_at: string
  updated_at: string
}

function rowToMeeting(row: MeetingRow): Meeting {
  return {
    id: row.id,
    userId: row.user_id,
    title: row.title,
    date: row.date,
    location: row.location,
    description: row.description,
    attendees: row.attendees,
    budget: row.budget,
    type: row.type as Meeting['type'],
    duration: row.duration as Meeting['duration'],
    status: row.status as Meeting['status'],
    generatedContent: row.generated_content || undefined,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at)
  }
}

export class SupabaseDatabase {
  async createMeeting(meeting: Omit<Meeting, 'id' | 'createdAt' | 'updatedAt'>): Promise<Meeting> {
    const { data, error } = await supabase
      .from('meetings')
      .insert({
        user_id: meeting.userId,
        title: meeting.title,
        date: meeting.date,
        location: meeting.location,
        description: meeting.description,
        attendees: meeting.attendees,
        budget: meeting.budget,
        type: meeting.type,
        duration: meeting.duration,
        status: meeting.status,
        generated_content: meeting.generatedContent || null
      })
      .select()
      .single()

    if (error) throw new Error(`创建会议失败: ${error.message}`)
    return rowToMeeting(data as MeetingRow)
  }

  async getUserMeetings(userId: string): Promise<Meeting[]> {
    const { data, error } = await supabase
      .from('meetings')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw new Error(`获取会议列表失败: ${error.message}`)
    return (data as MeetingRow[]).map(rowToMeeting)
  }

  async getMeetingById(id: string): Promise<Meeting | null> {
    const { data, error } = await supabase
      .from('meetings')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') return null
      throw new Error(`获取会议详情失败: ${error.message}`)
    }
    return rowToMeeting(data as MeetingRow)
  }

  async updateMeeting(id: string, updates: Partial<Meeting>): Promise<void> {
    const updateData: Record<string, unknown> = {}
    if (updates.title !== undefined) updateData.title = updates.title
    if (updates.date !== undefined) updateData.date = updates.date
    if (updates.location !== undefined) updateData.location = updates.location
    if (updates.description !== undefined) updateData.description = updates.description
    if (updates.attendees !== undefined) updateData.attendees = updates.attendees
    if (updates.budget !== undefined) updateData.budget = updates.budget
    if (updates.type !== undefined) updateData.type = updates.type
    if (updates.duration !== undefined) updateData.duration = updates.duration
    if (updates.status !== undefined) updateData.status = updates.status
    if (updates.generatedContent !== undefined) updateData.generated_content = updates.generatedContent

    const { error } = await supabase
      .from('meetings')
      .update(updateData)
      .eq('id', id)

    if (error) throw new Error(`更新会议失败: ${error.message}`)
  }

  async updateMeetingContent(id: string, content: GeneratedContent): Promise<void> {
    const { error } = await supabase
      .from('meetings')
      .update({ generated_content: content, status: 'completed' })
      .eq('id', id)

    if (error) throw new Error(`更新会议内容失败: ${error.message}`)
  }

  async deleteMeeting(id: string): Promise<void> {
    const { error } = await supabase
      .from('meetings')
      .delete()
      .eq('id', id)

    if (error) throw new Error(`删除会议失败: ${error.message}`)
  }

  async saveGenerationRecord(record: {
    meetingId: string
    userId: string
    type: string
    content: string
    prompt: string
    model: string
    tokens: { prompt: number; completion: number; total: number }
  }): Promise<void> {
    const { error } = await supabase
      .from('ai_generations')
      .insert({
        meeting_id: record.meetingId,
        user_id: record.userId,
        type: record.type,
        content: record.content,
        prompt: record.prompt,
        model: record.model,
        tokens: record.tokens
      })

    if (error) {
      // Non-critical: log but don't throw
      console.error('保存生成记录失败:', error.message)
    }
  }
}

export const supabaseDB = new SupabaseDatabase()
export default supabaseDB
