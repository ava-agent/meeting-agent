import { create } from 'zustand'
import { devtools, persist, createJSONStorage } from 'zustand/middleware'
import type { Meeting } from '@/types/meeting'
import type { User } from '@/types/user'

// 全局状态接口
interface AppState {
  // 用户状态
  user: User | null
  isAuthenticated: boolean

  // 会议状态
  meetings: Meeting[]
  currentMeeting: Meeting | null

  // UI状态
  loading: boolean
  sidebarOpen: boolean

  // 操作方法
  setUser: (user: User | null) => void
  setAuthenticated: (authenticated: boolean) => void
  setMeetings: (meetings: Meeting[]) => void
  addMeeting: (meeting: Meeting) => void
  updateMeeting: (id: string, updates: Partial<Meeting>) => void
  deleteMeeting: (id: string) => void
  setCurrentMeeting: (meeting: Meeting | null) => void
  setLoading: (loading: boolean) => void
  toggleSidebar: () => void
}

// 创建Zustand store
export const useAppStore = create<AppState>()(
  devtools(
    persist(
      (set) => ({
        // 初始状态
        user: null,
        isAuthenticated: false,
        meetings: [],
        currentMeeting: null,
        loading: false,
        sidebarOpen: false,

        // 用户相关方法
        setUser: (user) => set({ user }),
        setAuthenticated: (authenticated) => set({ isAuthenticated: authenticated }),

        // 会议相关方法
        setMeetings: (meetings) => set({ meetings }),

        addMeeting: (meeting) =>
          set((state) => ({
            meetings: [...state.meetings, meeting],
          })),

        updateMeeting: (id, updates) =>
          set((state) => ({
            meetings: state.meetings.map((meeting) =>
              meeting.id === id ? { ...meeting, ...updates, updatedAt: new Date() } : meeting
            ),
            currentMeeting:
              state.currentMeeting?.id === id
                ? { ...state.currentMeeting, ...updates, updatedAt: new Date() }
                : state.currentMeeting,
          })),

        deleteMeeting: (id) =>
          set((state) => ({
            meetings: state.meetings.filter((meeting) => meeting.id !== id),
            currentMeeting: state.currentMeeting?.id === id ? null : state.currentMeeting,
          })),

        setCurrentMeeting: (meeting) => set({ currentMeeting: meeting }),

        // UI相关方法
        setLoading: (loading) => set({ loading }),
        toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      }),
      {
        name: 'ai-meeting-store',
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({
          user: state.user,
          isAuthenticated: state.isAuthenticated,
          meetings: state.meetings,
          sidebarOpen: state.sidebarOpen,
        }),
      }
    ),
    {
      name: 'ai-meeting-store',
    }
  )
)

// 导出的hooks
export const useUser = () => useAppStore((state) => state.user)
export const useMeetings = () => useAppStore((state) => state.meetings)
export const useCurrentMeeting = () => useAppStore((state) => state.currentMeeting)
export const useLoading = () => useAppStore((state) => state.loading)
export const useSidebar = () => useAppStore((state) => state.sidebarOpen)

