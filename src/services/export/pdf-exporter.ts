// PDF 导出服务

import jsPDF from 'jspdf'
import type { Meeting, GeneratedContent } from '@/types/meeting'

export interface ExportOptions {
  includeAgenda?: boolean
  includeSpeech?: boolean
  includeGifts?: boolean
}

export class PDFExporter {
  /**
   * 导出会议为 PDF
   */
  async exportMeeting(
    meeting: Meeting,
    content: Record<string, string> | GeneratedContent,
    options: ExportOptions = {}
  ): Promise<Blob> {
    const doc = new jsPDF()

    let yPosition = 20
    const pageHeight = doc.internal.pageSize.height
    const margin = 20
    const contentWidth = doc.internal.pageSize.width - margin * 2

    // 标题
    doc.setFontSize(20)
    doc.setFont('helvetica', 'bold')
    doc.text(meeting.title, margin, yPosition, { maxWidth: contentWidth })
    yPosition += 15

    // 基本信息
    doc.setFontSize(12)
    doc.setFont('helvetica', 'normal')

    const basicInfo = [
      `会议日期: ${meeting.date || '待定'}`,
      `会议地点: ${meeting.location || '待定'}`,
      `参会人数: ${meeting.attendees || '待定'}人`,
      `会议类型: ${this.getMeetingTypeLabel(meeting.type)}`,
      `会议时长: ${meeting.duration || '待定'}小时`
    ]

    basicInfo.forEach(info => {
      doc.text(info, margin, yPosition)
      yPosition += 8
    })

    yPosition += 10

    // 添加分隔线
    doc.setLineWidth(0.5)
    doc.line(margin, yPosition, doc.internal.pageSize.width - margin, yPosition)
    yPosition += 15

    // 会议议程
    if ((options.includeAgenda !== false) && content.agenda) {
      yPosition = this.addSection(doc, '会议议程', content.agenda, yPosition, margin, contentWidth, pageHeight)
    }

    // 演讲稿
    if ((options.includeSpeech !== false) && content.speech) {
      yPosition = this.addSection(doc, '演讲稿', content.speech, yPosition, margin, contentWidth, pageHeight)
    }

    // 海报设计
    if (content.poster) {
      yPosition = this.addSection(doc, '海报设计方案', content.poster, yPosition, margin, contentWidth, pageHeight)
    }

    // 伴手礼建议
    if ((options.includeGifts !== false) && content.gifts) {
      yPosition = this.addSection(doc, '伴手礼建议', content.gifts, yPosition, margin, contentWidth, pageHeight)
    }

    // 添加页脚
    const pageCount = doc.getNumberOfPages()
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i)
      doc.setFontSize(10)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(128, 128, 128)
      doc.text(
        `由 AI 会议助手生成 - 第 ${i} / ${pageCount} 页`,
        doc.internal.pageSize.width / 2,
        pageHeight - 10,
        { align: 'center' }
      )
    }

    return doc.output('blob')
  }

  /**
   * 下载 PDF 文件
   */
  async download(meeting: Meeting, content: Record<string, string> | GeneratedContent, filename?: string): Promise<void> {
    const blob = await this.exportMeeting(meeting, content)
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename || `${meeting.title}-会议方案.pdf`
    link.click()
    URL.revokeObjectURL(url)
  }

  /**
   * 添加章节内容
   */
  private addSection(
    doc: jsPDF,
    title: string,
    content: string,
    yPosition: number,
    margin: number,
    contentWidth: number,
    pageHeight: number
  ): number {
    // 检查是否需要新页面
    if (yPosition > pageHeight - 40) {
      doc.addPage()
      yPosition = 20
    }

    // 章节标题
    doc.setFontSize(16)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(37, 99, 235) // 蓝色
    doc.text(title, margin, yPosition)
    yPosition += 10

    // 恢复默认字体
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(0, 0, 0)

    // 处理内容（保留换行和格式）
    const lines = doc.splitTextToSize(content, contentWidth)

    for (const line of lines) {
      // 检查是否需要新页面
      if (yPosition > pageHeight - 20) {
        doc.addPage()
        yPosition = 20
      }
      doc.text(line, margin, yPosition)
      yPosition += 6
    }

    return yPosition + 10
  }

  /**
   * 获取会议类型标签
   */
  private getMeetingTypeLabel(type: string): string {
    const labels: Record<string, string> = {
      company: '公司会议',
      academic: '学术会议',
      product: '产品发布会',
      training: '培训会议',
      social: '社交活动',
      other: '其他'
    }
    return labels[type] || type
  }
}

// 导出单例实例
export const pdfExporter = new PDFExporter()
export default pdfExporter
