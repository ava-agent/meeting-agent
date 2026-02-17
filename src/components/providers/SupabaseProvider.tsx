'use client'

// Supabase Provider - 初始化 Supabase 认证监听
// 不需要显式初始化，Supabase 客户端会自动处理会话

export function SupabaseProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
