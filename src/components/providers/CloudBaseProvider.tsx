'use client'

import { useEffect } from 'react'
import { initCloudBase } from '@/lib/cloudbase'

export function CloudBaseProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // 初始化 CloudBase
    try {
      initCloudBase()
    } catch (error) {
      console.error('Failed to initialize CloudBase:', error)
    }
  }, [])

  return <>{children}</>
}
