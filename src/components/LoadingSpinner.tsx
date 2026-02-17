'use client'

import { Spin } from 'antd'
import type { ReactNode } from 'react'

interface LoadingSpinnerProps {
  size?: 'small' | 'default' | 'large'
  tip?: string
  fullScreen?: boolean
  children?: ReactNode
}

export function LoadingSpinner({
  size = 'default',
  tip = '加载中...',
  fullScreen = false,
  children
}: LoadingSpinnerProps) {
  const spinner = <Spin size={size} tip={tip} />

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-50">
        <Spin size="large" tip={tip} />
      </div>
    )
  }

  if (children) {
    return (
      <div className="flex items-center justify-center py-12">
        {spinner}
      </div>
    )
  }

  return spinner
}
