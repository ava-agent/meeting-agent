// 会议操作 Hook

import { useState, useCallback } from 'react'
import { cloudbaseDB } from '@/services/cloudbase'
import { useAppStore } from '@/lib/store'
import type { Meeting, MeetingFormData, GeneratedContent } from '@/types/meeting'

export function useMeeting() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { user, meetings, setMeetings, addMeeting, updateMeeting, deleteMeeting: deleteMeetingFromStore } = useAppStore()

  // 创建会议
  const createMeeting = useCallback(async (data: MeetingFormData): Promise<Meeting> => {
    setIsLoading(true)
    setError(null)

    try {
      const newMeeting: Omit<Meeting, 'id' | 'createdAt' | 'updatedAt'> = {
        userId: user?.id || 'local',
        title: data.title,
        date: data.date,
        location: data.location,
        description: data.description,
        attendees: parseInt(data.attendees) || 0,
        budget: data.budget,
        type: data.type,
        duration: data.duration,
        status: 'draft'
      }

      const createdMeeting = await cloudbaseDB.createMeeting(newMeeting)
      addMeeting(createdMeeting as any)

      return createdMeeting
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '创建会议失败'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }, [user, addMeeting])

  // 更新会议
  const updateMeetingData = useCallback(async (id: string, updates: Partial<Meeting>): Promise<void> => {
    setIsLoading(true)
    setError(null)

    try {
      // Convert Date fields to proper format for update
      const updateData = {
        ...updates,
        updatedAt: new Date()
      }
      await cloudbaseDB.updateMeeting(id, updateData)
      updateMeeting(id, updateData)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '更新会议失败'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }, [updateMeeting])

  // 更新会议生成内容
  const updateMeetingContent = useCallback(async (id: string, content: GeneratedContent): Promise<void> => {
    setIsLoading(true)
    setError(null)

    try {
      await cloudbaseDB.updateMeetingContent(id, content)
      updateMeeting(id, { generatedContent: content, updatedAt: new Date() })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '更新内容失败'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }, [updateMeeting])

  // 删除会议
  const deleteMeeting = useCallback(async (id: string): Promise<void> => {
    setIsLoading(true)
    setError(null)

    try {
      await cloudbaseDB.deleteMeeting(id)
      deleteMeetingFromStore(id)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '删除会议失败'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }, [deleteMeetingFromStore])

  // 加载用户会议列表
  const loadMeetings = useCallback(async () => {
    if (!user) return

    setIsLoading(true)
    setError(null)

    try {
      const userMeetings = await cloudbaseDB.getUserMeetings(user.id || 'local')
      setMeetings(userMeetings)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '加载会议列表失败'
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }, [user, setMeetings])

  // 获取会议详情
  const getMeeting = useCallback(async (id: string): Promise<Meeting | null> => {
    setIsLoading(true)
    setError(null)

    try {
      const meeting = await cloudbaseDB.getMeetingById(id)
      return meeting
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '获取会议详情失败'
      setError(errorMessage)
      return null
    } finally {
      setIsLoading(false)
    }
  }, [])

  return {
    isLoading,
    error,
    meetings,
    createMeeting,
    updateMeetingData,
    updateMeetingContent,
    deleteMeeting,
    loadMeetings,
    getMeeting
  }
}
