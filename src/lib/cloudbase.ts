// CloudBase SDK 初始化模块

import cloudbase from '@cloudbase/js-sdk'

let appInstance: cloudbase.app.App | null = null

/**
 * 初始化 CloudBase 应用
 * 确保只初始化一次
 */
export function initCloudBase() {
  if (appInstance) {
    return appInstance
  }

  const envId = process.env.NEXT_PUBLIC_CLOUDBASE_ENV_ID

  if (!envId) {
    console.error('NEXT_PUBLIC_CLOUDBASE_ENV_ID is not configured')
    throw new Error('CloudBase environment ID is required')
  }

  appInstance = cloudbase.init({
    env: envId
  })

  return appInstance
}

/**
 * 获取 CloudBase 应用实例
 */
export function getCloudBaseApp() {
  if (!appInstance) {
    return initCloudBase()
  }
  return appInstance
}

/**
 * 获取数据库实例
 */
export function getDatabase() {
  const app = getCloudBaseApp()
  return app.database()
}

/**
 * 获取认证实例
 */
export function getAuth() {
  const app = getCloudBaseApp()
  return app.auth()
}
