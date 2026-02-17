// 会议操作 Hook (Supabase)

import { useState, useCallback } from 'react'
import { supabaseDB } from '@/services/supabase'
import { useAppStore } from '@/lib/store'
import type { Meeting, MeetingFormData, GeneratedContent } from '@/types/meeting'

export function useMeeting() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { user, meetings, setMeetings, addMeeting, updateMeeting, deleteMeeting: deleteMeetingFromStore } = useAppStore()

  const createMeeting = useCallback(async (data: MeetingFormData): Promise<Meeting> => {
    setIsLoading(true)
    setError(null)

    try {
      if (!user?.id) throw new Error('请先登录')

      const newMeeting: Omit<Meeting, 'id' | 'createdAt' | 'updatedAt'> = {
        userId: user.id,
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

      const createdMeeting = await supabaseDB.createMeeting(newMeeting)
      addMeeting(createdMeeting)
      return createdMeeting
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '创建会议失败'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }, [user, addMeeting])

  const updateMeetingData = useCallback(async (id: string, updates: Partial<Meeting>): Promise<void> => {
    setIsLoading(true)
    setError(null)

    try {
      await supabaseDB.updateMeeting(id, updates)
      updateMeeting(id, { ...updates, updatedAt: new Date() })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '更新会议失败'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }, [updateMeeting])

  const updateMeetingContent = useCallback(async (id: string, content: GeneratedContent): Promise<void> => {
    setIsLoading(true)
    setError(null)

    try {
      await supabaseDB.updateMeetingContent(id, content)
      updateMeeting(id, { generatedContent: content, status: 'completed', updatedAt: new Date() })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '更新内容失败'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }, [updateMeeting])

  const deleteMeeting = useCallback(async (id: string): Promise<void> => {
    setIsLoading(true)
    setError(null)

    try {
      await supabaseDB.deleteMeeting(id)
      deleteMeetingFromStore(id)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '删除会议失败'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }, [deleteMeetingFromStore])

  const loadMeetings = useCallback(async () => {
    if (!user?.id) return

    setIsLoading(true)
    setError(null)

    try {
      const userMeetings = await supabaseDB.getUserMeetings(user.id)
      setMeetings(userMeetings)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '加载会议列表失败'
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }, [user, setMeetings])

  const getMeeting = useCallback(async (id: string): Promise<Meeting | null> => {
    setIsLoading(true)
    setError(null)

    try {
      return await supabaseDB.getMeetingById(id)
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
