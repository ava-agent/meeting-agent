// 认证 Hook

import { useState, useEffect } from 'react'
import { cloudbaseAuth } from '@/services/cloudbase'
import type { User, LoginCredentials, RegisterData } from '@/types/user'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // 初始化：检查登录状态
  useEffect(() => {
    checkAuthState()
  }, [])

  const checkAuthState = async () => {
    setIsLoading(true)
    try {
      const currentUser = await cloudbaseAuth.getCurrentUser()
      setUser(currentUser)
      setIsAuthenticated(!!currentUser)
    } catch (error) {
      console.error('检查登录状态失败:', error)
      setUser(null)
      setIsAuthenticated(false)
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (credentials: LoginCredentials): Promise<User> => {
    setIsLoading(true)
    try {
      const loggedInUser = await cloudbaseAuth.emailLogin(credentials)
      setUser(loggedInUser)
      setIsAuthenticated(true)
      return loggedInUser
    } catch (error) {
      setIsLoading(false)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (data: RegisterData): Promise<User> => {
    setIsLoading(true)
    try {
      const newUser = await cloudbaseAuth.emailRegister(data)
      setUser(newUser)
      setIsAuthenticated(true)
      return newUser
    } catch (error) {
      setIsLoading(false)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    setIsLoading(true)
    try {
      await cloudbaseAuth.logout()
      setUser(null)
      setIsAuthenticated(false)
    } catch (error) {
      console.error('登出失败:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const anonymousLogin = async (): Promise<User> => {
    setIsLoading(true)
    try {
      const anonUser = await cloudbaseAuth.anonymousLogin()
      setUser(anonUser)
      setIsAuthenticated(true)
      return anonUser
    } catch (error) {
      setIsLoading(false)
      throw error
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
