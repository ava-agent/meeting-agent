// 常量定义

/**
 * 会议类型选项
 */
export const MEETING_TYPES = [
  { label: '公司会议', value: 'company' },
  { label: '学术会议', value: 'academic' },
  { label: '产品发布会', value: 'product' },
  { label: '培训会议', value: 'training' },
  { label: '社交活动', value: 'social' },
  { label: '其他', value: 'other' }
] as const

/**
 * 会议状态选项
 */
export const MEETING_STATUS = [
  { label: '草稿', value: 'draft' },
  { label: '已完成', value: 'completed' },
  { label: '已发布', value: 'published' }
] as const

/**
 * AI 生成类型
 */
export const GENERATION_TYPES = [
  { label: '会议议程', value: 'agenda', icon: '📋', color: 'blue' },
  { label: '演讲稿', value: 'speech', icon: '🎤', color: 'purple' },
  { label: '海报设计', value: 'poster', icon: '🎨', color: 'green' },
  { label: '伴手礼', value: 'gifts', icon: '🎁', color: 'pink' }
] as const

/**
 * 会议时长选项
 */
export const MEETING_DURATIONS = [
  { label: '0.5小时', value: '0.5' },
  { label: '1小时', value: '1' },
  { label: '1.5小时', value: '1.5' },
  { label: '2小时', value: '2' },
  { label: '3小时', value: '3' },
  { label: '4小时', value: '4' },
  { label: '6小时', value: '6' },
  { label: '全天', value: '8' }
] as const

/**
 * 参会人数选项
 */
export const ATTENDEE_COUNTS = [
  { label: '10人以内', value: '10' },
  { label: '20人', value: '20' },
  { label: '50人', value: '50' },
  { label: '100人', value: '100' },
  { label: '200人', value: '200' },
  { label: '500人', value: '500' },
  { label: '1000人以上', value: '1000' }
] as const

/**
 * 预算范围选项
 */
export const BUDGET_RANGES = [
  { label: '5000元以下', value: '<5000' },
  { label: '5000-10000元', value: '5000-10000' },
  { label: '1-3万元', value: '10000-30000' },
  { label: '3-5万元', value: '30000-50000' },
  { label: '5-10万元', value: '50000-100000' },
  { label: '10万元以上', value: '>100000' }
] as const

/**
 * 导出格式选项
 */
export const EXPORT_FORMATS = [
  { label: 'PDF文档', value: 'pdf', icon: '📄', mimeType: 'application/pdf' },
  { label: 'Word文档', value: 'docx', icon: '📝', mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' },
  { label: '图片', value: 'image', icon: '🖼️', mimeType: 'image/png' }
] as const

/**
 * 应用配置
 */
export const APP_CONFIG = {
  name: 'AI会议助手',
  version: '1.0.0',
  description: '智能会议策划平台，一键生成会议全链路内容',
  author: 'AI创意',
  homepage: 'https://example.com'
} as const

/**
 * API 配置
 */
export const API_CONFIG = {
  timeout: 60000, // 60秒
  maxRetries: 3,
  retryDelay: 1000
} as const

/**
 * 本地存储键名
 */
export const STORAGE_KEYS = {
  USER: 'ai-meeting-user',
  MEETINGS: 'ai-meeting-meetings',
  CURRENT_MEETING: 'ai-meeting-current-meeting',
  SETTINGS: 'ai-meeting-settings'
} as const

/**
 * 路由路径
 */
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  MEETINGS: '/meetings',
  MEETING_DETAIL: (id: string) => `/meetings/${id}`,
  PLANNER: '/planner',
  TEMPLATES: '/templates',
  SETTINGS: '/settings'
} as const

/**
 * 错误消息
 */
export const ERROR_MESSAGES = {
  NETWORK_ERROR: '网络连接失败，请检查网络设置',
  API_ERROR: 'API请求失败，请稍后重试',
  AUTH_ERROR: '登录已过期，请重新登录',
  VALIDATION_ERROR: '请检查输入内容',
  UNKNOWN_ERROR: '发生未知错误，请稍后重试'
} as const

/**
 * 成功消息
 */
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: '登录成功',
  REGISTER_SUCCESS: '注册成功',
  LOGOUT_SUCCESS: '已退出登录',
  CREATE_SUCCESS: '创建成功',
  UPDATE_SUCCESS: '更新成功',
  DELETE_SUCCESS: '删除成功',
  GENERATE_SUCCESS: '生成成功',
  EXPORT_SUCCESS: '导出成功'
} as const
