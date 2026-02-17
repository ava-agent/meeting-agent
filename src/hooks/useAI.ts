// AI 生成 Hook

import { useState, useCallback } from 'react'
import { aiService } from '@/services/ai'
import type { AIGenerationResult, GenerationType } from '@/types/ai'
import type { MeetingFormData } from '@/types/meeting'

export function useAI() {
  const [isGenerating, setIsGenerating] = useState<Record<string, boolean>>({})
  const [results, setResults] = useState<Record<string, AIGenerationResult>>({})
  const [error, setError] = useState<string | null>(null)

  // 生成单个内容
  const generate = useCallback(async (
    type: GenerationType,
    meetingData: MeetingFormData
  ): Promise<AIGenerationResult> => {
    setIsGenerating(prev => ({ ...prev, [type]: true }))
    setError(null)

    try {
      const result = await aiService.generateContent({
        type,
        meetingData: {
          title: meetingData.title,
          date: meetingData.date,
          location: meetingData.location,
          description: meetingData.description,
          attendees: meetingData.attendees,
          budget: meetingData.budget,
          type: meetingData.type,
          duration: meetingData.duration
        }
      })

      setResults(prev => ({ ...prev, [type]: result }))

      if (!result.success) {
        setError(result.error || '生成失败')
      }

      return result
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '生成失败'
      setError(errorMessage)
      return {
        success: false,
        content: '',
        error: errorMessage
      }
    } finally {
      setIsGenerating(prev => ({ ...prev, [type]: false }))
    }
  }, [])

  // 批量生成所有内容
  const generateAll = useCallback(async (
    meetingData: MeetingFormData
  ): Promise<Record<GenerationType, AIGenerationResult>> => {
    setIsGenerating({
      agenda: true,
      speech: true,
      poster: true,
      gifts: true
    })
    setError(null)

    try {
      const allResults = await aiService.generateAllContent({
        title: meetingData.title,
        date: meetingData.date,
        location: meetingData.location,
        description: meetingData.description,
        attendees: meetingData.attendees,
        budget: meetingData.budget,
        type: meetingData.type,
        duration: meetingData.duration
      })

      setResults(allResults)

      // 检查是否有失败的项目
      const failures = Object.entries(allResults)
        .filter(([_, result]) => !result.success)
        .map(([type, _]) => type)

      if (failures.length > 0) {
        setError(`部分内容生成失败: ${failures.join(', ')}`)
      }

      return allResults
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '批量生成失败'
      setError(errorMessage)

      // 返回失败结果
      return {
        agenda: { success: false, content: '', error: errorMessage },
        speech: { success: false, content: '', error: errorMessage },
        poster: { success: false, content: '', error: errorMessage },
        gifts: { success: false, content: '', error: errorMessage }
      }
    } finally {
      setIsGenerating({
        agenda: false,
        speech: false,
        poster: false,
        gifts: false
      })
    }
  }, [])

  // 清空结果
  const clearResults = useCallback(() => {
    setResults({})
    setError(null)
  }, [])

  // 获取单个结果
  const getResult = useCallback((type: GenerationType): AIGenerationResult | null => {
    return results[type] || null
  }, [results])

  // 检查是否正在生成
  const checkGenerating = useCallback((type?: GenerationType): boolean => {
    if (type) {
      return isGenerating[type] || false
    }
    return Object.values(isGenerating).some(v => v)
  }, [isGenerating])

  return {
    isGenerating: checkGenerating,
    results,
    error,
    generate,
    generateAll,
    clearResults,
    getResult
  }
}
