// 认证 Hook (Supabase)

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { supabaseAuth } from '@/services/supabase'
import { useAppStore } from '@/lib/store'
import type { User, LoginCredentials, RegisterData } from '@/types/user'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const { setUser: setStoreUser, setAuthenticated } = useAppStore()

  useEffect(() => {
    // 初始化：先检查访客会话
    const guestStored = typeof window !== 'undefined' ? localStorage.getItem('guest_user') : null

    // 初始化：获取当前会话
    supabaseAuth.getCurrentUser().then((currentUser) => {
      if (currentUser) {
        setUser(currentUser)
        setIsAuthenticated(true)
        setStoreUser(currentUser)
        setAuthenticated(true)
      } else if (guestStored) {
        const guestUser = JSON.parse(guestStored) as User
        setUser(guestUser)
        setIsAuthenticated(true)
        setStoreUser(guestUser)
        setAuthenticated(true)
      }
      setIsLoading(false)
    }).catch(() => {
      if (guestStored) {
        const guestUser = JSON.parse(guestStored) as User
        setUser(guestUser)
        setIsAuthenticated(true)
        setStoreUser(guestUser)
        setAuthenticated(true)
      }
      setIsLoading(false)
    })

    // 监听 Supabase 认证状态变化
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        setUser(null)
        setIsAuthenticated(false)
        setStoreUser(null)
        setAuthenticated(false)
      } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        const currentUser = await supabaseAuth.getCurrentUser()
        setUser(currentUser)
        setIsAuthenticated(!!currentUser)
        setStoreUser(currentUser)
        setAuthenticated(!!currentUser)
      }
    })

    return () => subscription.unsubscribe()
  }, [setStoreUser, setAuthenticated])

  const login = async (credentials: LoginCredentials): Promise<User> => {
    setIsLoading(true)
    try {
      const loggedInUser = await supabaseAuth.emailLogin(credentials)
      setUser(loggedInUser)
      setIsAuthenticated(true)
      setStoreUser(loggedInUser)
      setAuthenticated(true)
      return loggedInUser
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (data: RegisterData): Promise<User> => {
    setIsLoading(true)
    try {
      const newUser = await supabaseAuth.emailRegister(data)
      setUser(newUser)
      setIsAuthenticated(true)
      setStoreUser(newUser)
      setAuthenticated(true)
      return newUser
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    setIsLoading(true)
    try {
      await supabaseAuth.logout().catch(() => {})
      if (typeof window !== 'undefined') {
        localStorage.removeItem('guest_user')
      }
      setUser(null)
      setIsAuthenticated(false)
      setStoreUser(null)
      setAuthenticated(false)
    } catch (error) {
      console.error('登出失败:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // 访客模式：本地会话，无需 Supabase 注册
  const anonymousLogin = async (): Promise<User> => {
    setIsLoading(true)
    try {
      const stored = typeof window !== 'undefined' ? localStorage.getItem('guest_user') : null
      const guestUser: User = stored
        ? JSON.parse(stored) as User
        : { id: `guest_${Date.now()}`, name: '访客', role: 'user', email: '' }

      if (!stored) {
        localStorage.setItem('guest_user', JSON.stringify(guestUser))
      }

      setUser(guestUser)
      setIsAuthenticated(true)
      setStoreUser(guestUser)
      setAuthenticated(true)
      return guestUser
    } finally {
      setIsLoading(false)
    }
  }

  const checkAuthState = async () => {
    setIsLoading(true)
    try {
      const currentUser = await supabaseAuth.getCurrentUser()
      setUser(currentUser)
      setIsAuthenticated(!!currentUser)
    } catch {
      setUser(null)
      setIsAuthenticated(false)
    } finally {
      setIsLoading(false)
    }
  }

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    anonymousLogin,
    checkAuthState
  }
}
