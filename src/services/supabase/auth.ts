// Supabase 认证服务

import { supabase } from '@/lib/supabase'
import type { User, LoginCredentials, RegisterData } from '@/types/user'

function mapSupabaseUser(supabaseUser: import('@supabase/supabase-js').User, profile?: Record<string, unknown> | null): User {
  return {
    id: supabaseUser.id,
    email: supabaseUser.email || '',
    name: (profile?.name as string) || (supabaseUser.user_metadata?.name as string) || (supabaseUser.email?.split('@')[0]) || '用户',
    avatar: (profile?.avatar_url as string) || (supabaseUser.user_metadata?.avatar_url as string) || '',
    role: ((profile?.role as string) || 'user') as 'user' | 'admin',
    createdAt: supabaseUser.created_at
  }
}

export class SupabaseAuth {
  async emailLogin(credentials: LoginCredentials): Promise<User> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password
    })

    if (error) {
      if (error.message.includes('Invalid login credentials')) {
        throw new Error('邮箱或密码错误')
      }
      throw new Error(error.message)
    }

    if (!data.user) throw new Error('登录失败')

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single()

    return mapSupabaseUser(data.user, profile)
  }

  async emailRegister(registerData: RegisterData): Promise<User> {
    const { data, error } = await supabase.auth.signUp({
      email: registerData.email,
      password: registerData.password,
      options: {
        data: { name: registerData.name }
      }
    })

    if (error) {
      if (error.message.includes('already registered')) {
        throw new Error('该邮箱已被注册')
      }
      throw new Error(error.message)
    }

    if (!data.user) throw new Error('注册失败')

    // Profile is auto-created by database trigger
    // Upsert to ensure it exists with correct name
    await supabase.from('profiles').upsert({
      id: data.user.id,
      email: registerData.email,
      name: registerData.name
    }, { onConflict: 'id' })

    return mapSupabaseUser(data.user, { name: registerData.name, role: 'user' })
  }

  async anonymousLogin(): Promise<User> {
    const { data, error } = await supabase.auth.signInAnonymously()

    if (error) throw new Error(error.message)
    if (!data.user) throw new Error('匿名登录失败')

    // Create profile for anonymous user
    const anonymousName = `访客_${data.user.id.slice(0, 6)}`
    await supabase.from('profiles').upsert({
      id: data.user.id,
      name: anonymousName
    }, { onConflict: 'id' })

    return mapSupabaseUser(data.user, { name: anonymousName, role: 'user' })
  }

  async logout(): Promise<void> {
    const { error } = await supabase.auth.signOut()
    if (error) throw new Error(error.message)
  }

  async getCurrentUser(): Promise<User | null> {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.user) return null

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single()

    return mapSupabaseUser(session.user, profile)
  }

  async checkAuthState(): Promise<boolean> {
    const { data: { session } } = await supabase.auth.getSession()
    return !!session
  }
}

export const supabaseAuth = new SupabaseAuth()
export default supabaseAuth
