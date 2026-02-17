// 图片导出服务

import type { Meeting } from '@/types/meeting'

export class ImageExporter {
  /**
   * 导出元素为图片
   */
  async exportElementToImage(element: HTMLElement, filename: string): Promise<void> {
    // 动态导入 html2canvas
    const html2canvas = (await import('html2canvas')).default

    const canvas = await html2canvas(element, {
      scale: 2, // 高清导出
      backgroundColor: '#ffffff',
      logging: false,
      useCORS: true
    })

    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `${filename}.png`
        link.click()
        URL.revokeObjectURL(url)
      }
    })
  }

  /**
   * 生成并下载海报
   */
  async exportMeetingToPoster(meeting: Meeting, _content?: Record<string, string>): Promise<void> {
    // 创建临时DOM元素用于生成海报
    const container = document.createElement('div')
    const width = 794 // A3 宽度 (300 DPI)
    const height = 1123 // A3 高度

    container.style.width = `${width}px`
    container.style.height = `${height}px`
    container.style.padding = '40px'
    container.style.position = 'fixed'
    container.style.left = '-9999px'
    container.style.top = '0'
    container.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    container.style.fontFamily = 'Arial, sans-serif'

    const getEmoji = (type: string) => {
      const emojis: Record<string, string> = {
        company: '💼',
        academic: '🎓',
        product: '🚀',
        training: '📚',
        social: '🎉',
        other: '📅'
      }
      return emojis[type] || '📅'
    }

    container.innerHTML = `
      <div style="background: white; border-radius: 20px; padding: 60px; height: calc(100% - 80px); box-shadow: 0 20px 60px rgba(0,0,0,0.3); display: flex; flex-direction: column;">
        <div style="text-align: center; margin-bottom: 40px;">
          <div style="font-size: 72px; margin-bottom: 20px;">${getEmoji(meeting.type)}</div>
          <h1 style="font-size: 48px; color: #2563eb; margin: 0; line-height: 1.3;">${meeting.title}</h1>
        </div>
        <div style="border-top: 3px solid #2563eb; margin: 20px 0;"></div>
        <div style="flex: 1;">
          <p style="font-size: 24px; color: #6b7280; margin: 20px 0;">📅 ${meeting.date || '待定'}</p>
          <p style="font-size: 24px; color: #6b7280; margin: 20px 0;">📍 ${meeting.location || '待定'}</p>
          <p style="font-size: 20px; color: #9ca3af; margin: 40px 0; line-height: 1.8; white-space: pre-wrap;">${meeting.description || '精彩即将呈现...'}</p>
        </div>
        <div style="margin-top: auto;">
          <div style="background: linear-gradient(135deg, #2563eb, #7c3aed); color: white; padding: 20px; border-radius: 12px; text-align: center;">
            <p style="font-size: 18px; margin: 0;">AI 会议助手 · 智能策划</p>
          </div>
        </div>
      </div>
    `

    document.body.appendChild(container)

    try {
      await this.exportElementToImage(container, `${meeting.title}-海报`)
    } finally {
      document.body.removeChild(container)
    }
  }

  /**
   * 导出内容卡片为图片
   */
  async exportContentCard(title: string, content: string, filename: string): Promise<void> {
    const container = document.createElement('div')
    container.style.width = '600px'
    container.style.padding = '40px'
    container.style.position = 'fixed'
    container.style.left = '-9999px'
    container.style.top = '0'
    container.style.background = 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
    container.style.fontFamily = 'Arial, sans-serif'

    container.innerHTML = `
      <div style="background: white; border-radius: 16px; padding: 40px; box-shadow: 0 10px 40px rgba(0,0,0,0.1);">
        <h2 style="font-size: 32px; color: #2563eb; margin: 0 0 20px 0; border-bottom: 3px solid #2563eb; padding-bottom: 15px;">${title}</h2>
        <div style="font-size: 16px; color: #374151; line-height: 1.8; white-space: pre-wrap;">${content}</div>
      </div>
    `

    document.body.appendChild(container)

    try {
      await this.exportElementToImage(container, filename)
    } finally {
      document.body.removeChild(container)
    }
  }
}

// 导出单例实例
export const imageExporter = new ImageExporter()
export default imageExporter
