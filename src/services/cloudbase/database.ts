// CloudBase 数据库操作（真实实现）

import type { User } from '@/types/user'
import type { Meeting, GeneratedContent } from '@/types/meeting'
import type { GenerationRecord } from '@/types/ai'
import { getDatabase } from '@/lib/cloudbase'

export class CloudBaseDatabase {
  private db: ReturnType<typeof getDatabase> | null = null

  // 私有方法：确保已初始化
  private ensureInitialized() {
    if (!this.db) {
      if (typeof window === 'undefined') {
        throw new Error('CloudBase Database can only be used in browser')
      }
      this.db = getDatabase()
    }
  }

  // 私有 getter
  private get database() {
    this.ensureInitialized()
    return this.db!
  }

  // ============ 用户操作 ============

  async createUser(user: Omit<User, 'id' | 'createdAt' | 'lastLoginAt'>): Promise<User> {
    try {
      const usersCollection = this.database.collection('ai_meeting_users')
      const result = await usersCollection.add({
        ...user,
        createdAt: new Date(),
        lastLoginAt: new Date()
      }) as { id?: string; _id?: string }

      const docId = result.id || result._id || ''

      return {
        ...user,
        id: docId,
        _id: docId,
        createdAt: new Date(),
        lastLoginAt: new Date()
      }
    } catch (error) {
      console.error('Create user failed:', error)
      throw new Error('创建用户失败')
    }
  }

  async getUserByOpenid(openid: string): Promise<User | null> {
    try {
      const usersCollection = this.database.collection('ai_meeting_users')
      const { data } = await usersCollection
        .where({ openid })
        .get()

      if (data.length === 0) {
        return null
      }

      return this.mapToUser(data[0])
    } catch (error) {
      console.error('Get user by openid failed:', error)
      throw new Error('获取用户失败')
    }
  }

  async updateUser(id: string, updates: Partial<User>): Promise<void> {
    try {
      const usersCollection = this.database.collection('ai_meeting_users')
      await usersCollection.doc(id).update(updates)
    } catch (error) {
      console.error('Update user failed:', error)
      throw new Error('更新用户失败')
    }
  }

  // ============ 会议操作 ============

  async createMeeting(meeting: Omit<Meeting, 'id' | 'createdAt' | 'updatedAt'>): Promise<Meeting> {
    try {
      const meetingsCollection = this.database.collection('ai_meeting_meetings')
      const result = await meetingsCollection.add({
        ...meeting,
        createdAt: new Date(),
        updatedAt: new Date()
      }) as { id?: string; _id?: string }

      const docId = result.id || result._id || ''

      return {
        ...meeting,
        id: docId,
        _id: docId,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    } catch (error) {
      console.error('Create meeting failed:', error)
      throw new Error('创建会议失败')
    }
  }

  async getUserMeetings(userId: string): Promise<Meeting[]> {
    try {
      const meetingsCollection = this.database.collection('ai_meeting_meetings')
      const { data } = await meetingsCollection
        .where({ userId })
        .orderBy('createdAt', 'desc')
        .get()

      return data.map(item => this.mapToMeeting(item))
    } catch (error) {
      console.error('Get user meetings failed:', error)
      throw new Error('获取会议列表失败')
    }
  }

  async getMeetingById(id: string): Promise<Meeting | null> {
    try {
      const meetingsCollection = this.database.collection('ai_meeting_meetings')
      const { data } = await meetingsCollection
        .doc(id)
        .get()

      if (!data || data.length === 0) {
        return null
      }

      return this.mapToMeeting(data[0])
    } catch (error) {
      console.error('Get meeting by id failed:', error)
      throw new Error('获取会议详情失败')
    }
  }

  async updateMeeting(id: string, updates: Partial<Meeting>): Promise<void> {
    try {
      const meetingsCollection = this.database.collection('ai_meeting_meetings')
      await meetingsCollection.doc(id).update({
        ...updates,
        updatedAt: new Date()
      })
    } catch (error) {
      console.error('Update meeting failed:', error)
      throw new Error('更新会议失败')
    }
  }

  async deleteMeeting(id: string): Promise<void> {
    try {
      const meetingsCollection = this.database.collection('ai_meeting_meetings')
      await meetingsCollection.doc(id).remove()
    } catch (error) {
      console.error('Delete meeting failed:', error)
      throw new Error('删除会议失败')
    }
  }

  async updateMeetingContent(id: string, content: GeneratedContent): Promise<void> {
    await this.updateMeeting(id, { generatedContent: content })
  }

  // ============ 生成记录操作 ============

  async saveGenerationRecord(record: Omit<GenerationRecord, 'id' | '_id' | 'createdAt'>): Promise<GenerationRecord> {
    try {
      const recordsCollection = this.database.collection('ai_meeting_generations')
      const result = await recordsCollection.add({
        ...record,
        createdAt: new Date()
      }) as { id?: string; _id?: string }

      const docId = result.id || result._id || ''

      return {
        ...record,
        id: docId,
        _id: docId,
        createdAt: new Date()
      }
    } catch (error) {
      console.error('Save generation record failed:', error)
      throw new Error('保存生成记录失败')
    }
  }

  async getGenerationRecords(meetingId: string): Promise<GenerationRecord[]> {
    try {
      const recordsCollection = this.database.collection('ai_meeting_generations')
      const { data } = await recordsCollection
        .where({ meetingId })
        .orderBy('createdAt', 'desc')
        .get()

      return data.map(item => this.mapToGenerationRecord(item))
    } catch (error) {
      console.error('Get generation records failed:', error)
      throw new Error('获取生成记录失败')
    }
  }

  // ============ 辅助方法 ============

  private mapToUser(data: any): User {
    return {
      id: data._id || data.id,
      _id: data._id,
      openid: data.openid,
      email: data.email,
      name: data.name,
      avatar: data.avatar,
      role: data.role || 'user',
      createdAt: data.createdAt,
      lastLoginAt: data.lastLoginAt
    }
  }

  private mapToMeeting(data: any): Meeting {
    return {
      id: data._id || data.id,
      _id: data._id,
      userId: data.userId,
      title: data.title,
      date: data.date,
      location: data.location,
      description: data.description,
      attendees: data.attendees,
      budget: data.budget,
      type: data.type,
      duration: data.duration,
      status: data.status,
      generatedContent: data.generatedContent,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt
    }
  }

  private mapToGenerationRecord(data: any): GenerationRecord {
    return {
      id: data._id || data.id,
      _id: data._id,
      meetingId: data.meetingId,
      type: data.type,
      content: data.content,
      prompt: data.prompt,
      model: data.model,
      tokens: data.tokens,
      createdAt: data.createdAt
    }
  }
}

export default CloudBaseDatabase
