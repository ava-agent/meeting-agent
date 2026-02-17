'use client'

import { useState } from 'react'
import { Form, Input, Button, Checkbox, message } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import type { LoginCredentials } from '@/types/user'

export function LoginForm() {
  const [form] = Form.useForm()
  const router = useRouter()
  const { login, anonymousLogin, isLoading } = useAuth()
  const [autoLogin, setAutoLogin] = useState(false)

  const onFinish = async (values: LoginCredentials) => {
    try {
      await login(values)
      message.success('登录成功')

      if (autoLogin) {
        localStorage.setItem('rememberLogin', 'true')
      }

      router.push('/dashboard')
    } catch (error) {
      message.error(error instanceof Error ? error.message : '登录失败')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Logo和标题 */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl mb-4">
              <span className="text-3xl">🤖</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">AI 会议助手</h1>
            <p className="text-gray-500 mt-2">智能会议策划平台</p>
          </div>

          {/* 登录表单 */}
          <Form
            form={form}
            name="login"
            onFinish={onFinish}
            size="large"
            layout="vertical"
          >
            <Form.Item
              name="email"
              rules={[
                { required: true, message: '请输入邮箱' },
                { type: 'email', message: '请输入有效的邮箱地址' }
              ]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="邮箱"
                autoComplete="email"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                { required: true, message: '请输入密码' },
                { min: 6, message: '密码至少6位' }
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="密码"
                autoComplete="current-password"
              />
            </Form.Item>

            <Form.Item>
              <div className="flex items-center justify-between">
                <Checkbox checked={autoLogin} onChange={(e) => setAutoLogin(e.target.checked)}>
                  记住登录状态
                </Checkbox>
                <a href="#" className="text-sm text-blue-600 hover:text-blue-700">
                  忘记密码？
                </a>
              </div>
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={isLoading}
                block
                className="h-12 text-base font-semibold"
              >
                登录
              </Button>
            </Form.Item>
          </Form>

          {/* 分隔线 */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">或</span>
            </div>
          </div>

          {/* 匿名登录 */}
          <div className="space-y-3">
            <Button
              block
              className="h-12"
              onClick={async () => {
                try {
                  await anonymousLogin()
                  message.success('匿名登录成功')
                  router.push('/dashboard')
                } catch (error) {
                  message.error('登录失败，请重试')
                }
              }}
            >
              匿名体验
            </Button>
          </div>

          {/* 注册链接 */}
          <p className="text-center text-gray-500 mt-6">
            还没有账号？
            <a href="/register" className="text-blue-600 hover:text-blue-700 font-semibold ml-1">
              立即注册
            </a>
          </p>
        </div>

        {/* 版权信息 */}
        <p className="text-center text-gray-400 text-sm mt-6">
          © 2026 AI 会议助手. All rights reserved.
        </p>
      </div>
    </div>
  )
}
