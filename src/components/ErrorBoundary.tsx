'use client'

import React, { Component, ReactNode } from 'react'
import { Button, Result } from 'antd'
import { Home, RefreshCw } from 'lucide-react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
  }

  handleReload = () => {
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <Result
            status="error"
            title="出现了一些问题"
            subTitle={this.state.error?.message || '页面加载时发生错误，请尝试刷新页面'}
            extra={[
              <Button type="primary" key="reload" icon={<RefreshCw size={16} />} onClick={this.handleReload}>
                刷新页面
              </Button>,
              <Button key="home" icon={<Home size={16} />} onClick={() => (window.location.href = '/')}>
                返回首页
              </Button>
            ]}
          />
        </div>
      )
    }

    return this.props.children
  }
}
