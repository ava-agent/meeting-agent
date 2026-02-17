// AI 生成 Hook (调用服务端路由)

import { useState, useCallback } from 'react'
import type { AIGenerationResult, GenerationType } from '@/types/ai'
import type { MeetingFormData } from '@/types/meeting'

async function callGenerateAPI(
  type: GenerationType,
  meetingData: MeetingFormData
): Promise<AIGenerationResult> {
  const response = await fetch('/api/ai/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type, meetingData })
  })

  const data = await response.json() as { success: boolean; content?: string; error?: string; usage?: unknown }

  if (!response.ok || !data.success) {
    return {
      success: false,
      content: '',
      error: data.error || 'AI 生成失败'
    }
  }

  return {
    success: true,
    content: data.content || '',
    usage: data.usage as AIGenerationResult['usage']
  }
}

export function useAI() {
  const [isGenerating, setIsGenerating] = useState<Record<string, boolean>>({})
  const [results, setResults] = useState<Record<string, AIGenerationResult>>({})
  const [error, setError] = useState<string | null>(null)

  const generate = useCallback(async (
    type: GenerationType,
    meetingData: MeetingFormData
  ): Promise<AIGenerationResult> => {
    setIsGenerating(prev => ({ ...prev, [type]: true }))
    setError(null)

    try {
      const result = await callGenerateAPI(type, meetingData)
      setResults(prev => ({ ...prev, [type]: result }))

      if (!result.success) {
        setError(result.error || '生成失败')
      }

      return result
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '生成失败'
      setError(errorMessage)
      return { success: false, content: '', error: errorMessage }
    } finally {
      setIsGenerating(prev => ({ ...prev, [type]: false }))
    }
  }, [])

  const generateAll = useCallback(async (
    meetingData: MeetingFormData
  ): Promise<Record<GenerationType, AIGenerationResult>> => {
    const types: GenerationType[] = ['agenda', 'speech', 'poster', 'gifts']
    setIsGenerating({ agenda: true, speech: true, poster: true, gifts: true })
    setError(null)

    try {
      const [agenda, speech, poster, gifts] = await Promise.all(
        types.map(type => callGenerateAPI(type, meetingData))
      )

      const allResults = { agenda, speech, poster, gifts }
      setResults(allResults)

      const failures = types.filter(type => !allResults[type].success)
      if (failures.length > 0) {
        setError(`部分内容生成失败: ${failures.join(', ')}`)
      }

      return allResults
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '批量生成失败'
      setError(errorMessage)
      const failed: AIGenerationResult = { success: false, content: '', error: errorMessage }
      return { agenda: failed, speech: failed, poster: failed, gifts: failed }
    } finally {
      setIsGenerating({ agenda: false, speech: false, poster: false, gifts: false })
    }
  }, [])

  const clearResults = useCallback(() => {
    setResults({})
    setError(null)
  }, [])

  const getResult = useCallback((type: GenerationType): AIGenerationResult | null => {
    return results[type] || null
  }, [results])

  const checkGenerating = useCallback((type?: GenerationType): boolean => {
    if (type) return isGenerating[type] || false
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
