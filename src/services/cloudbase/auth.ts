// CloudBase 认证服务（真实实现）

import type { User, LoginCredentials, RegisterData } from '@/types/user'
import { getAuth, getDatabase } from '@/lib/cloudbase'

export class CloudBaseAuth {
  private db: ReturnType<typeof getDatabase> | null = null
  private auth: ReturnType<typeof getAuth> | null = null

  // 私有方法：确保已初始化
  private ensureInitialized() {
    if (!this.db || !this.auth) {
      if (typeof window === 'undefined') {
        throw new Error('CloudBase Auth can only be used in the browser')
      }
      this.db = getDatabase()
      this.auth = getAuth()
    }
  }

  // 私有 getter
  private get database() {
    this.ensureInitialized()
    return this.db!
  }

  private get authInstance() {
    this.ensureInitialized()
    return this.auth!
  }

  // 邮箱登录（使用匿名登录 + 手动创建用户）
  async emailLogin(credentials: LoginCredentials): Promise<User> {
    try {
      // 使用匿名登录
      const authProvider = (this.authInstance as any).anonymousAuthProvider?.()
      const signInResult = authProvider ? await authProvider.signIn() : await (this.authInstance as any).signInAnonymously()
      const uid = signInResult?.user?.uid || signInResult?.uid || ''

      // 查询用户是否存在
      const usersCollection = this.database.collection('ai_meeting_users')
      const { data } = await usersCollection
        .where({ email: credentials.email })
        .get()

      if (data.length > 0) {
        // 更新最后登录时间
        await usersCollection.doc(data[0]._id).update({
          lastLoginAt: new Date()
        })

        return this.mapToUser(data[0])
      }

      // 用户不存在，创建新用户
      const newUser: Omit<User, 'id' | '_id'> = {
        openid: uid,
        email: credentials.email,
        name: credentials.email.split('@')[0],
        role: 'user',
        createdAt: new Date(),
        lastLoginAt: new Date()
      }

      const result = await usersCollection.add(newUser) as { id?: string; _id?: string }
      const docId = result.id || result._id || ''

      return {
        ...newUser,
        id: docId,
        _id: docId
      }
    } catch (error) {
      console.error('Login failed:', error)
      throw new Error('登录失败，请重试')
    }
  }

  // 邮箱注册
  async emailRegister(data: RegisterData): Promise<User> {
    try {
      // 使用匿名登录
      const authProvider = (this.authInstance as any).anonymousAuthProvider?.()
      const signInResult = authProvider ? await authProvider.signIn() : await (this.authInstance as any).signInAnonymously()
      const uid = signInResult?.user?.uid || signInResult?.uid || ''

      // 检查邮箱是否已存在
      const usersCollection = this.database.collection('ai_meeting_users')
      const { data: existingUsers } = await usersCollection
        .where({ email: data.email })
        .get()

      if (existingUsers.length > 0) {
        throw new Error('该邮箱已被注册')
      }

      // 创建新用户
      const newUser: Omit<User, 'id' | '_id'> = {
        openid: uid,
        email: data.email,
        name: data.name,
        role: 'user',
        createdAt: new Date(),
        lastLoginAt: new Date()
      }

      const result = await usersCollection.add(newUser) as { id?: string; _id?: string }
      const docId = result.id || result._id || ''

      return {
        ...newUser,
        id: docId,
        _id: docId
      }
    } catch (error) {
      console.error('Registration failed:', error)
      throw error instanceof Error ? error : new Error('注册失败，请重试')
    }
  }

  // 微信登录（暂不实现）
  async wechatLogin(): Promise<User> {
    throw new Error('微信登录功能暂未开放')
  }

  // 匿名登录
  async anonymousLogin(): Promise<User> {
    try {
      const authProvider = (this.authInstance as any).anonymousAuthProvider?.()
      const signInResult = authProvider ? await authProvider.signIn() : await (this.authInstance as any).signInAnonymously()
      const uid = signInResult?.user?.uid || signInResult?.uid || ''

      return {
        id: uid,
        openid: uid,
        name: '匿名用户',
        role: 'user',
        createdAt: new Date(),
        lastLoginAt: new Date()
      }
    } catch (error) {
      console.error('Anonymous login failed:', error)
      throw new Error('匿名登录失败，请重试')
    }
  }

  // 登出
  async logout(): Promise<void> {
    try {
      await this.authInstance.signOut()
      localStorage.removeItem('currentUser')
    } catch (error) {
      console.error('Logout failed:', error)
      throw new Error('登出失败，请重试')
    }
  }

  // 获取当前登录用户
  async getCurrentUser(): Promise<User | null> {
    try {
      const loginState = await this.authInstance.getLoginState()

      if (!loginState) {
        return null
      }

      const usersCollection = this.database.collection('ai_meeting_users')
      const { data } = await usersCollection
        .where({ openid: loginState.user.uid })
        .get()

      if (data.length === 0) {
        return null
      }

      return this.mapToUser(data[0])
    } catch (error) {
      console.error('Get current user failed:', error)
      return null
    }
  }

  // 检查登录状态
  async checkAuthState(): Promise<boolean> {
    try {
      const loginState = await this.authInstance.getLoginState()
      return loginState !== null
    } catch (error) {
      return false
    }
  }

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
}

export default CloudBaseAuth
