import type { ThemeConfig } from 'antd'

const theme: ThemeConfig = {
  token: {
    // 基础颜色
    colorPrimary: '#2563eb',
    colorSuccess: '#16a34a',
    colorWarning: '#ca8a04',
    colorError: '#dc2626',
    colorInfo: '#0891b2',

    // 字体
    fontFamily: 'var(--font-inter), -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',

    // 圆角
    borderRadius: 12,

    // 阴影
    boxShadow: '0 4px 25px rgba(0, 0, 0, 0.12)',

    // 间距
    padding: 16,
    paddingLG: 24,

    // 字体大小
    fontSize: 14,
    fontSizeLG: 16,
  },
  components: {
    Button: {
      borderRadius: 12,
      fontWeight: 600,
    },
    Card: {
      borderRadius: 16,
    },
    Input: {
      borderRadius: 12,
    },
    Modal: {
      borderRadius: 20,
    },
  },
}

export default theme
