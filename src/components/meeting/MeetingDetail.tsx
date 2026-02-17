'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, Button, Tabs, Tag, Space, message, Modal } from 'antd'
import {
  ArrowLeft, Edit, Download, Share2, Trash2,
  FileText, Mic, Image as ImageIcon, Gift
} from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import { useMeeting } from '@/hooks/useMeeting'
import { pdfExporter, docxExporter, imageExporter } from '@/services/export'
import type { Meeting } from '@/types/meeting'

export function MeetingDetail() {
  const params = useParams()
  const router = useRouter()
  const { getMeeting, deleteMeeting } = useMeeting()
  const [meeting, setMeeting] = useState<Meeting | null>(null)
  const [loading, setLoading] = useState(true)
  const [exportModalVisible, setExportModalVisible] = useState(false)

  useEffect(() => {
    const loadMeeting = async () => {
      if (!params.id) return

      setLoading(true)
      try {
        const data = await getMeeting(params.id as string)
        setMeeting(data)
      } catch (error) {
        message.error('加载会议详情失败')
      } finally {
        setLoading(false)
      }
    }

    loadMeeting()
  }, [params.id, getMeeting])

  if (!params.id) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-600 mb-4">参数错误</p>
          <Button onClick={() => router.back()}>返回</Button>
        </div>
      </div>
    )
  }

  const handleDelete = async () => {
    if (!meeting?.id && !meeting?._id) return

    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这个会议吗？此操作不可恢复。',
      okText: '删除',
      okType: 'danger',
      onOk: async () => {
        await deleteMeeting(meeting.id || meeting._id!)
        message.success('删除成功')
        router.push('/dashboard')
      }
    })
  }

  const handleExportPDF = async () => {
    if (!meeting) return

    try {
      const content = meeting.generatedContent || {}
      await pdfExporter.download(meeting, content as Record<string, string>)
      message.success('PDF导出成功')
      setExportModalVisible(false)
    } catch (error) {
      message.error('导出失败')
    }
  }

  const handleExportWord = async () => {
    if (!meeting) return

    try {
      const content = meeting.generatedContent || {}
      await docxExporter.download(meeting, content as Record<string, string>)
      message.success('Word导出成功')
      setExportModalVisible(false)
    } catch (error) {
      message.error('导出失败')
    }
  }

  const handleExportPoster = async () => {
    if (!meeting) return

    try {
      await imageExporter.exportMeetingToPoster(meeting)
      message.success('海报导出成功')
      setExportModalVisible(false)
    } catch (error) {
      message.error('导出失败')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">加载中...</p>
        </div>
      </div>
    )
  }

  if (!meeting) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-600 mb-4">会议不存在</p>
          <Button onClick={() => router.back()}>返回</Button>
        </div>
      </div>
    )
  }

  const content = meeting.generatedContent || {}

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'orange'
      case 'completed': return 'green'
      case 'published': return 'purple'
      default: return 'default'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'draft': return '草稿'
      case 'completed': return '已完成'
      case 'published': return '已发布'
      default: return status
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航 */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Space>
              <Button
                icon={<ArrowLeft size={18} />}
                onClick={() => router.back()}
              >
                返回
              </Button>
              <Tag color={getStatusColor(meeting.status)}>
                {getStatusLabel(meeting.status)}
              </Tag>
            </Space>
            <Space>
              <Button
                icon={<Edit size={18} />}
                onClick={() => router.push(`/planner?id=${meeting.id || meeting._id}`)}
              >
                编辑
              </Button>
              <Button
                icon={<Download size={18} />}
                onClick={() => setExportModalVisible(true)}
              >
                导出
              </Button>
              <Button
                icon={<Share2 size={18} />}
              >
                分享
              </Button>
              <Button
                danger
                icon={<Trash2 size={18} />}
                onClick={handleDelete}
              >
                删除
              </Button>
            </Space>
          </div>
        </div>
      </div>

      {/* 主内容 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 会议标题 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{meeting.title}</h1>
          <div className="flex flex-wrap gap-4 text-gray-600">
            <span>📅 {meeting.date || '日期待定'}</span>
            <span>📍 {meeting.location || '地点待定'}</span>
            <span>👥 {meeting.attendees || '待定'}人</span>
            <span>⏱️ {meeting.duration || '待定'}小时</span>
          </div>
        </div>

        {/* 内容标签页 */}
        <Card>
          <Tabs
            defaultActiveKey="agenda"
            items={[
              {
                key: 'agenda',
                label: (
                  <span className="flex items-center">
                    <FileText size={16} className="mr-2" />
                    会议议程
                  </span>
                ),
                children: content.agenda ? (
                  <div className="prose max-w-none">
                    <ReactMarkdown skipHtml={true}>{content.agenda}</ReactMarkdown>
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-400">
                    <FileText size={48} className="mx-auto mb-4 opacity-50" aria-hidden="true" />
                    <p>暂无议程内容</p>
                    <Button type="primary" className="mt-4" onClick={() => router.push('/planner')}>
                      生成议程
                    </Button>
                  </div>
                )
              },
              {
                key: 'speech',
                label: (
                  <span className="flex items-center">
                    <Mic size={16} className="mr-2" />
                    演讲稿
                  </span>
                ),
                children: content.speech ? (
                  <div className="prose max-w-none">
                    <ReactMarkdown skipHtml={true}>{content.speech}</ReactMarkdown>
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-400">
                    <Mic size={48} className="mx-auto mb-4 opacity-50" aria-hidden="true" />
                    <p>暂无演讲稿内容</p>
                    <Button type="primary" className="mt-4" onClick={() => router.push('/planner')}>
                      生成演讲稿
                    </Button>
                  </div>
                )
              },
              {
                key: 'poster',
                label: (
                  <span className="flex items-center">
                    <ImageIcon size={16} className="mr-2" aria-label="海报设计" />
                    海报设计
                  </span>
                ),
                children: content.poster ? (
                  <div className="prose max-w-none">
                    <ReactMarkdown skipHtml={true}>{content.poster}</ReactMarkdown>
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-400">
                    <ImageIcon size={48} className="mx-auto mb-4 opacity-50" aria-hidden="true" />
                    <p>暂无海报设计方案</p>
                    <Button type="primary" className="mt-4" onClick={() => router.push('/planner')}>
                      生成海报
                    </Button>
                  </div>
                )
              },
              {
                key: 'gifts',
                label: (
                  <span className="flex items-center">
                    <Gift size={16} className="mr-2" aria-label="伴手礼" />
                    伴手礼
                  </span>
                ),
                children: content.gifts ? (
                  <div className="prose max-w-none">
                    <ReactMarkdown skipHtml={true}>{content.gifts}</ReactMarkdown>
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-400">
                    <Gift size={48} className="mx-auto mb-4 opacity-50" aria-hidden="true" />
                    <p>暂无伴手礼建议</p>
                    <Button type="primary" className="mt-4" onClick={() => router.push('/planner')}>
                      生成伴手礼
                    </Button>
                  </div>
                )
              }
            ]}
          />
        </Card>
      </div>

      {/* 导出模态框 */}
      <Modal
        title="导出会议方案"
        open={exportModalVisible}
        onCancel={() => setExportModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setExportModalVisible(false)}>
            取消
          </Button>
        ]}
      >
        <div className="space-y-4">
          <Button
            block
            icon={<Download size={18} />}
            onClick={handleExportPDF}
          >
            导出为 PDF
          </Button>
          <Button
            block
            icon={<Download size={18} />}
            onClick={handleExportWord}
          >
            导出为 Word
          </Button>
          <Button
            block
            icon={<Download size={18} />}
            onClick={handleExportPoster}
          >
            导出为海报
          </Button>
        </div>
      </Modal>
    </div>
  )
}
