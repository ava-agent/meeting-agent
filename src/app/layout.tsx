import type { Metadata } from 'next'
import { AntdRegistry } from '@ant-design/nextjs-registry'
import { CloudBaseProvider } from '@/components/providers/CloudBaseProvider'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import './globals.css'

export const metadata: Metadata = {
  title: 'AI 会议助手 - 智能会议策划平台',
  description: '基于 AI 的会议策划助手，自动生成议程、演讲稿、海报和伴手礼推荐',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body>
        <ErrorBoundary>
          <CloudBaseProvider>
            <AntdRegistry>
              {children}
            </AntdRegistry>
          </CloudBaseProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}
