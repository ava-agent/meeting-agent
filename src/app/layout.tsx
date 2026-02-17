import type { Metadata } from 'next'
import { AntdRegistry } from '@ant-design/nextjs-registry'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import './globals.css'

export const metadata: Metadata = {
  title: 'AI 会议助手 - 智能会议策划平台',
  description: '基于 AI 的会议策划助手，自动生成议程、演讲稿、海报和伴手礼推荐',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://meeting.rxcloud.group'),
  openGraph: {
    title: 'AI 会议助手',
    description: '智能会议策划平台，一键生成议程、演讲稿、海报和伴手礼推荐',
    type: 'website'
  }
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
          <AntdRegistry>
            {children}
          </AntdRegistry>
        </ErrorBoundary>
      </body>
    </html>
  )
}
