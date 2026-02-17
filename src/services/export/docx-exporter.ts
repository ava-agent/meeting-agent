// Word 导出服务

import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx'
import type { Meeting, GeneratedContent } from '@/types/meeting'

export interface DocxExportOptions {
  includeAgenda?: boolean
  includeSpeech?: boolean
  includeGifts?: boolean
}

export class DocxExporter {
  /**
   * 导出会议为 Word 文档
   */
  async exportMeeting(
    meeting: Meeting,
    content: Record<string, string> | GeneratedContent,
    options: DocxExportOptions = {}
  ): Promise<Blob> {
    const sections: Paragraph[] = []

    // 标题
    sections.push(
      new Paragraph({
        text: meeting.title,
        heading: HeadingLevel.TITLE,
        alignment: AlignmentType.CENTER,
        spacing: { after: 400 }
      })
    )

    // 分隔线
    sections.push(
      new Paragraph({
        children: [
          new TextRun({
            text: ''.padStart(50, '_'),
            color: '2563EB'
          })
        ],
        alignment: AlignmentType.CENTER,
        spacing: { before: 200, after: 400 }
      })
    )

    // 基本信息
    sections.push(
      new Paragraph({
        text: '会议信息',
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 200, after: 200 }
      })
    )

    const basicInfo = [
      { label: '会议日期', value: meeting.date || '待定' },
      { label: '会议地点', value: meeting.location || '待定' },
      { label: '参会人数', value: `${meeting.attendees || '待定'}人` },
      { label: '会议类型', value: this.getMeetingTypeLabel(meeting.type) },
      { label: '会议时长', value: `${meeting.duration || '待定'}小时` },
      { label: '预算范围', value: meeting.budget || '待定' }
    ]

    basicInfo.forEach(info => {
      sections.push(
        new Paragraph({
          children: [
            new TextRun({ text: `${info.label}: `, bold: true }),
            new TextRun(info.value)
          ],
          spacing: { after: 150 }
        })
      )
    })

    sections.push(
      new Paragraph({
        text: '',
        spacing: { after: 400 }
      })
    )

    // 会议议程
    if ((options.includeAgenda !== false) && content.agenda) {
      sections.push(...this.createContentSection('会议议程', content.agenda))
    }

    // 演讲稿
    if ((options.includeSpeech !== false) && content.speech) {
      sections.push(...this.createContentSection('演讲稿', content.speech))
    }

    // 海报设计方案
    if (content.poster) {
      sections.push(...this.createContentSection('海报设计方案', content.poster))
    }

    // 伴手礼建议
    if ((options.includeGifts !== false) && content.gifts) {
      sections.push(...this.createContentSection('伴手礼建议', content.gifts))
    }

    // 页脚
    sections.push(
      new Paragraph({
        children: [
          new TextRun({
            text: '───',
            color: '9CA3AF'
          })
        ],
        alignment: AlignmentType.CENTER,
        spacing: { before: 600 }
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: '由 AI 会议助手生成',
            color: '9CA3AF',
            size: 18
          })
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: 100 }
      })
    )

    const doc = new Document({
      sections: [
        {
          properties: {},
          children: sections
        }
      ]
    })

    return await Packer.toBlob(doc)
  }

  /**
   * 下载 Word 文档
   */
  async download(meeting: Meeting, content: Record<string, string> | GeneratedContent, filename?: string): Promise<void> {
    const blob = await this.exportMeeting(meeting, content)
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename || `${meeting.title}-会议方案.docx`
    link.click()
    URL.revokeObjectURL(url)
  }

  /**
   * 创建内容章节
   */
  private createContentSection(title: string, content: string): Paragraph[] {
    const paragraphs: Paragraph[] = []

    // 章节标题
    paragraphs.push(
      new Paragraph({
        text: title,
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 400, after: 300 }
      })
    )

    // 内容段落
    const lines = content.split('\n').filter(line => line.trim())

    lines.forEach(line => {
      // 检测是否是标题行（包含 emoji 或特殊格式）
      const isTitle = /^[※#━▬─]+|^[📋🎤🎨🎁💡🌟]+/.test(line)

      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: line,
              bold: isTitle,
              ...(isTitle && { size: 28 })
            })
          ],
          spacing: {
            before: isTitle ? 300 : 150,
            after: 150
          },
          ...(isTitle && {
            shading: {
              fill: 'EFF6FF'
            }
          })
        })
      )
    })

    return paragraphs
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
export const docxExporter = new DocxExporter()
export default docxExporter
