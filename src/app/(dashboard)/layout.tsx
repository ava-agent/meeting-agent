'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Button, Dropdown, Avatar, Space } from 'antd'
import { LayoutDashboard, CalendarDays, Plus, LogOut, User, type LucideIcon } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

function NavLink({
  icon: Icon,
  label,
  active,
  onClick
}: {
  href?: string
  icon: LucideIcon
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
        active
          ? 'bg-blue-50 text-blue-700'
          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
      }`}
    >
      <Icon size={18} />
      {label}
    </button>
  )
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const { user, isAuthenticated, isLoading, logout } = useAuth()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isLoading, isAuthenticated, router])

  const handleLogout = async () => {
    await logout()
    router.push('/home')
  }

  const userMenuItems = [
    {
      key: 'logout',
      icon: <LogOut size={16} />,
      label: '退出登录',
      onClick: handleLogout
    }
  ]

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">加载中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航栏 */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => router.push('/home')}
            >
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm font-bold">AI</span>
              </div>
              <span className="font-bold text-gray-900 text-lg hidden sm:block">会议助手</span>
            </div>

            {/* 导航链接 */}
            <nav className="flex items-center gap-1">
              <NavLink
                href="/dashboard"
                icon={LayoutDashboard}
                label="控制台"
                active={pathname === '/dashboard'}
                onClick={() => router.push('/dashboard')}
              />
              <NavLink
                href="/meetings"
                icon={CalendarDays}
                label="我的会议"
                active={pathname === '/meetings'}
                onClick={() => router.push('/meetings')}
              />
            </nav>

            {/* 右侧用户区 */}
            <div className="flex items-center gap-3">
              <Button
                type="primary"
                size="small"
                icon={<Plus size={16} />}
                onClick={() => router.push('/planner')}
              >
                新建会议
              </Button>
              <Dropdown
                menu={{ items: userMenuItems }}
                placement="bottomRight"
                trigger={['click']}
              >
                <Space className="cursor-pointer hover:opacity-80">
                  <Avatar
                    size="small"
                    className="bg-gradient-to-br from-blue-500 to-purple-500"
                    icon={<User size={14} />}
                  >
                    {user?.name?.[0]}
                  </Avatar>
                  <span className="text-sm text-gray-700 hidden sm:block max-w-24 truncate">
                    {user?.name || '用户'}
                  </span>
                </Space>
              </Dropdown>
            </div>
          </div>
        </div>
      </header>

      {/* 主内容 */}
      <main>{children}</main>
    </div>
  )
}
