// 用户相关类型定义

export type UserRole = 'user' | 'admin'

export interface User {
  id?: string
  _id?: string
  openid?: string
  email?: string
  name: string
  avatar?: string
  role: UserRole
  createdAt?: Date | string
  lastLoginAt?: Date | string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  password: string
  name: string
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
}
