'use client'

import { Form, Input, Button, message } from 'antd'
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import type { RegisterData } from '@/types/user'

export function RegisterForm() {
  const [form] = Form.useForm()
  const router = useRouter()
  const { register, isLoading } = useAuth()

  const onFinish = async (values: RegisterData & { confirmPassword: string }) => {
    if (values.password !== values.confirmPassword) {
      message.error('两次输入的密码不一致')
      return
    }

    try {
      await register({
        email: values.email,
        password: values.password,
        name: values.name
      })
      message.success('注册成功')
      router.push('/dashboard')
    } catch (error) {
      message.error(error instanceof Error ? error.message : '注册失败')
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
            <h1 className="text-2xl font-bold text-gray-900">创建账号</h1>
            <p className="text-gray-500 mt-2">加入AI会议助手</p>
          </div>

          {/* 注册表单 */}
          <Form
            form={form}
            name="register"
            onFinish={onFinish}
            size="large"
            layout="vertical"
          >
            <Form.Item
              name="name"
              rules={[
                { required: true, message: '请输入用户名' },
                { min: 2, message: '用户名至少2个字符' }
              ]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="用户名"
                autoComplete="name"
              />
            </Form.Item>

            <Form.Item
              name="email"
              rules={[
                { required: true, message: '请输入邮箱' },
                { type: 'email', message: '请输入有效的邮箱地址' }
              ]}
            >
              <Input
                prefix={<MailOutlined />}
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
                autoComplete="new-password"
              />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              dependencies={['password']}
              rules={[
                { required: true, message: '请确认密码' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve()
                    }
                    return Promise.reject(new Error('两次输入的密码不一致'))
                  }
                })
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="确认密码"
                autoComplete="new-password"
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={isLoading}
                block
                className="h-12 text-base font-semibold"
              >
                注册
              </Button>
            </Form.Item>
          </Form>

          {/* 服务条款 */}
          <p className="text-xs text-gray-400 text-center">
            注册即表示您同意我们的
            <a href="#" className="text-blue-600 hover:text-blue-700">服务条款</a>
            和
            <a href="#" className="text-blue-600 hover:text-blue-700">隐私政策</a>
          </p>

          {/* 登录链接 */}
          <p className="text-center text-gray-500 mt-6">
            已有账号？
            <a href="/login" className="text-blue-600 hover:text-blue-700 font-semibold ml-1">
              立即登录
            </a>
          </p>
        </div>

        {/* 版权信息 */}
        <p className="text-center text-gray-400 text-sm mt-6">
          © 2024 AI 会议助手. All rights reserved.
        </p>
      </div>
    </div>
  )
}
