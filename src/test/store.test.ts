import { describe, it, expect, beforeEach } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import { useAppStore, useUser, useMeetings, useCurrentMeeting, useLoading, useSidebar } from '@/lib/store'
import type { Meeting } from '@/types/meeting'
import type { User } from '@/types/user'

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => { store[key] = value },
    removeItem: (key: string) => { delete store[key] },
    clear: () => { store = {} },
  }
})()

Object.defineProperty(globalThis, 'localStorage', {
  value: localStorageMock,
  writable: true,
})

const mockUser: User = {
  id: 'user-1',
  name: 'testuser',
  email: 'test@example.com',
  role: 'user',
}

const mockMeeting: Meeting = {
  id: 'meeting-1',
  title: '产品发布会',
  date: '2024-06-15',
  location: '北京国际会议中心',
  description: '2024年产品发布会',
  attendees: 100,
  duration: '2',
  type: 'product',
  budget: '50000-100000',
  status: 'draft',
}

describe('useAppStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    useAppStore.setState({
      user: null,
      isAuthenticated: false,
      meetings: [],
      currentMeeting: null,
      loading: false,
      sidebarOpen: false,
    })
    localStorageMock.clear()
  })

  describe('user state', () => {
    it('initializes with null user', () => {
      const { result } = renderHook(() => useAppStore())
      expect(result.current.user).toBeNull()
    })

    it('sets user correctly', () => {
      const { result } = renderHook(() => useAppStore())

      act(() => {
        result.current.setUser(mockUser)
      })

      expect(result.current.user).toEqual(mockUser)
    })

    it('clears user when set to null', () => {
      const { result } = renderHook(() => useAppStore())

      act(() => {
        result.current.setUser(mockUser)
      })
      act(() => {
        result.current.setUser(null)
      })

      expect(result.current.user).toBeNull()
    })
  })

  describe('authentication state', () => {
    it('initializes as not authenticated', () => {
      const { result } = renderHook(() => useAppStore())
      expect(result.current.isAuthenticated).toBe(false)
    })

    it('sets authenticated to true', () => {
      const { result } = renderHook(() => useAppStore())

      act(() => {
        result.current.setAuthenticated(true)
      })

      expect(result.current.isAuthenticated).toBe(true)
    })

    it('sets authenticated to false', () => {
      const { result } = renderHook(() => useAppStore())

      act(() => {
        result.current.setAuthenticated(true)
        result.current.setAuthenticated(false)
      })

      expect(result.current.isAuthenticated).toBe(false)
    })
  })

  describe('meetings state', () => {
    it('initializes with empty meetings array', () => {
      const { result } = renderHook(() => useAppStore())
      expect(result.current.meetings).toEqual([])
    })

    it('sets meetings list', () => {
      const { result } = renderHook(() => useAppStore())

      act(() => {
        result.current.setMeetings([mockMeeting])
      })

      expect(result.current.meetings).toHaveLength(1)
      expect(result.current.meetings[0]).toEqual(mockMeeting)
    })

    it('adds a meeting', () => {
      const { result } = renderHook(() => useAppStore())

      act(() => {
        result.current.addMeeting(mockMeeting)
      })

      expect(result.current.meetings).toHaveLength(1)
      expect(result.current.meetings[0].id).toBe('meeting-1')
    })

    it('adds multiple meetings', () => {
      const { result } = renderHook(() => useAppStore())
      const meeting2: Meeting = { ...mockMeeting, id: 'meeting-2', title: '年会', date: '2024-12-31' }

      act(() => {
        result.current.addMeeting(mockMeeting)
        result.current.addMeeting(meeting2)
      })

      expect(result.current.meetings).toHaveLength(2)
    })

    it('updates a meeting', () => {
      const { result } = renderHook(() => useAppStore())

      act(() => {
        result.current.setMeetings([mockMeeting])
      })

      act(() => {
        result.current.updateMeeting('meeting-1', { title: '更新后的标题' })
      })

      expect(result.current.meetings[0].title).toBe('更新后的标题')
    })

    it('updates currentMeeting when it matches the updated id', () => {
      const { result } = renderHook(() => useAppStore())

      act(() => {
        result.current.setMeetings([mockMeeting])
        result.current.setCurrentMeeting(mockMeeting)
      })

      act(() => {
        result.current.updateMeeting('meeting-1', { title: '新标题' })
      })

      expect(result.current.currentMeeting?.title).toBe('新标题')
    })

    it('does not change currentMeeting when updating different meeting', () => {
      const { result } = renderHook(() => useAppStore())
      const meeting2: Meeting = { ...mockMeeting, id: 'meeting-2', title: '另一个会议', date: '2024-12-31' }

      act(() => {
        result.current.setMeetings([mockMeeting, meeting2])
        result.current.setCurrentMeeting(mockMeeting)
      })

      act(() => {
        result.current.updateMeeting('meeting-2', { title: '修改' })
      })

      expect(result.current.currentMeeting?.title).toBe('产品发布会')
    })

    it('deletes a meeting', () => {
      const { result } = renderHook(() => useAppStore())

      act(() => {
        result.current.setMeetings([mockMeeting])
      })

      act(() => {
        result.current.deleteMeeting('meeting-1')
      })

      expect(result.current.meetings).toHaveLength(0)
    })

    it('clears currentMeeting when it is deleted', () => {
      const { result } = renderHook(() => useAppStore())

      act(() => {
        result.current.setMeetings([mockMeeting])
        result.current.setCurrentMeeting(mockMeeting)
      })

      act(() => {
        result.current.deleteMeeting('meeting-1')
      })

      expect(result.current.currentMeeting).toBeNull()
    })

    it('deletes only the target meeting', () => {
      const { result } = renderHook(() => useAppStore())
      const meeting2: Meeting = { ...mockMeeting, id: 'meeting-2', title: '年会', date: '2024-12-31' }

      act(() => {
        result.current.setMeetings([mockMeeting, meeting2])
      })

      act(() => {
        result.current.deleteMeeting('meeting-1')
      })

      expect(result.current.meetings).toHaveLength(1)
      expect(result.current.meetings[0].id).toBe('meeting-2')
    })
  })

  describe('currentMeeting state', () => {
    it('initializes as null', () => {
      const { result } = renderHook(() => useAppStore())
      expect(result.current.currentMeeting).toBeNull()
    })

    it('sets current meeting', () => {
      const { result } = renderHook(() => useAppStore())

      act(() => {
        result.current.setCurrentMeeting(mockMeeting)
      })

      expect(result.current.currentMeeting).toEqual(mockMeeting)
    })

    it('clears current meeting', () => {
      const { result } = renderHook(() => useAppStore())

      act(() => {
        result.current.setCurrentMeeting(mockMeeting)
        result.current.setCurrentMeeting(null)
      })

      expect(result.current.currentMeeting).toBeNull()
    })
  })

  describe('loading state', () => {
    it('initializes as false', () => {
      const { result } = renderHook(() => useAppStore())
      expect(result.current.loading).toBe(false)
    })

    it('sets loading to true', () => {
      const { result } = renderHook(() => useAppStore())

      act(() => {
        result.current.setLoading(true)
      })

      expect(result.current.loading).toBe(true)
    })

    it('sets loading back to false', () => {
      const { result } = renderHook(() => useAppStore())

      act(() => {
        result.current.setLoading(true)
        result.current.setLoading(false)
      })

      expect(result.current.loading).toBe(false)
    })
  })

  describe('sidebar state', () => {
    it('initializes as closed', () => {
      const { result } = renderHook(() => useAppStore())
      expect(result.current.sidebarOpen).toBe(false)
    })

    it('toggles sidebar open', () => {
      const { result } = renderHook(() => useAppStore())

      act(() => {
        result.current.toggleSidebar()
      })

      expect(result.current.sidebarOpen).toBe(true)
    })

    it('toggles sidebar closed again', () => {
      const { result } = renderHook(() => useAppStore())

      act(() => {
        result.current.toggleSidebar()
        result.current.toggleSidebar()
      })

      expect(result.current.sidebarOpen).toBe(false)
    })
  })
})

describe('exported selector hooks', () => {
  beforeEach(() => {
    useAppStore.setState({
      user: null,
      isAuthenticated: false,
      meetings: [],
      currentMeeting: null,
      loading: false,
      sidebarOpen: false,
    })
  })

  it('useUser returns null initially', () => {
    const { result } = renderHook(() => useUser())
    expect(result.current).toBeNull()
  })

  it('useUser returns user after set', () => {
    act(() => {
      useAppStore.getState().setUser(mockUser)
    })
    const { result } = renderHook(() => useUser())
    expect(result.current).toEqual(mockUser)
  })

  it('useMeetings returns empty array initially', () => {
    const { result } = renderHook(() => useMeetings())
    expect(result.current).toEqual([])
  })

  it('useMeetings returns meetings after set', () => {
    act(() => {
      useAppStore.getState().setMeetings([mockMeeting])
    })
    const { result } = renderHook(() => useMeetings())
    expect(result.current).toHaveLength(1)
  })

  it('useCurrentMeeting returns null initially', () => {
    const { result } = renderHook(() => useCurrentMeeting())
    expect(result.current).toBeNull()
  })

  it('useCurrentMeeting returns meeting after set', () => {
    act(() => {
      useAppStore.getState().setCurrentMeeting(mockMeeting)
    })
    const { result } = renderHook(() => useCurrentMeeting())
    expect(result.current).toEqual(mockMeeting)
  })

  it('useLoading returns false initially', () => {
    const { result } = renderHook(() => useLoading())
    expect(result.current).toBe(false)
  })

  it('useLoading returns true after set', () => {
    act(() => {
      useAppStore.getState().setLoading(true)
    })
    const { result } = renderHook(() => useLoading())
    expect(result.current).toBe(true)
  })

  it('useSidebar returns false initially', () => {
    const { result } = renderHook(() => useSidebar())
    expect(result.current).toBe(false)
  })

  it('useSidebar returns true after toggle', () => {
    act(() => {
      useAppStore.getState().toggleSidebar()
    })
    const { result } = renderHook(() => useSidebar())
    expect(result.current).toBe(true)
  })
})
