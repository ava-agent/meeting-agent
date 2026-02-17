'use client'

import { ConfigProvider, App as AntdApp } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import theme from '@/lib/antd-theme'
import { StyleProvider } from '@ant-design/cssinjs'

interface AntdConfigProviderProps {
  children: React.ReactNode
}

export function AntdConfigProvider({ children }: AntdConfigProviderProps) {
  return (
    <StyleProvider hashPriority="high">
      <ConfigProvider
        locale={zhCN}
        theme={theme}
        componentSize="middle"
        wave={{ disabled: false }}
      >
        <AntdApp>
          {children}
        </AntdApp>
      </ConfigProvider>
    </StyleProvider>
  )
}


