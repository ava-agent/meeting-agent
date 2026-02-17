// CloudBase 服务统一导出（真实实现）
import { CloudBaseDatabase } from './database'
import { CloudBaseAuth } from './auth'

// 延迟初始化：只在浏览器中创建实例
let dbInstance: CloudBaseDatabase | null = null
let authInstance: CloudBaseAuth | null = null

// 获取数据库实例
export function getCloudBaseDB() {
  if (!dbInstance) {
    if (typeof window === 'undefined') {
      throw new Error('CloudBase services can only be used in the browser')
    }
    dbInstance = new CloudBaseDatabase()
  }
  return dbInstance
}

// 获取认证实例
export function getCloudBaseAuth() {
  if (!authInstance) {
    if (typeof window === 'undefined') {
      throw new Error('CloudBase services can only be used in the browser')
    }
    authInstance = new CloudBaseAuth()
  }
  return authInstance
}

// 向后兼容的导出（已废弃，建议使用上面的 getter 函数）
export const cloudbaseDB = typeof window !== 'undefined' ? new CloudBaseDatabase() : null as any
export const cloudbaseAuth = typeof window !== 'undefined' ? new CloudBaseAuth() : null as any

// 默认导出
const cloudbaseServices = {
  db: cloudbaseDB,
  auth: cloudbaseAuth
}
export default cloudbaseServices
