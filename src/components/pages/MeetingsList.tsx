'use client'

import { useEffect, useState } from 'react'
import { Card, Row, Col, Button, Tag, Empty, Input, Select, Space, Modal, Tabs, Divider, message } from 'antd'
import { Search, Plus, Calendar, Users, Filter, Eye, Download, Edit, Trash2, FileText, FileImage, Gift } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useMeeting } from '@/hooks/useMeeting'
import { MEETING_STATUS, MEETING_TYPES } from '@/lib/constants'
import { pdfExporter, docxExporter } from '@/services/export'
import ReactMarkdown from 'react-markdown'
import type { Meeting } from '@/types/meeting'

const { Search: SearchInput } = Input

export function MeetingsList() {
  const router = useRouter()
  const { meetings, loadMeetings, deleteMeeting, getMeeting } = useMeeting()
  const [filteredMeetings, setFilteredMeetings] = useState<Meeting[]>([])
  const [searchText, setSearchText] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [detailModalVisible, setDetailModalVisible] = useState(false)
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null)
  const [exporting, setExporting] = useState(false)

  useEffect(() => {
    loadMeetings()
  }, [loadMeetings])

  useEffect(() => {
    let filtered = meetings

    if (searchText) {
      filtered = filtered.filter(m =>
        m.title.toLowerCase().includes(searchText.toLowerCase()) ||
        m.location?.toLowerCase().includes(searchText.toLowerCase())
      )
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(m => m.status === statusFilter)
    }

    setFilteredMeetings(filtered as Meeting[])
  }, [meetings, searchText, statusFilter])

  const handleDelete = async (id: string) => {
    if (confirm('确定要删除这个会议吗？')) {
      await deleteMeeting(id)
    }
  }

  const handleViewDetail = async (meeting: Meeting) => {
    const fullMeeting = await getMeeting(meeting.id || meeting._id!)
    setSelectedMeeting(fullMeeting || meeting)
    setDetailModalVisible(true)
  }

  const handleEdit = (meeting: Meeting) => {
    setDetailModalVisible(false)
    router.push(`/planner?id=${meeting.id || meeting._id}`)
  }

  const handleExportPDF = async () => {
    if (!selectedMeeting) return
    setExporting(true)
    try {
      await pdfExporter.download(selectedMeeting, selectedMeeting.generatedContent || {})
      message.success('PDF 导出成功')
    } catch (error) {
      message.error('PDF 导出失败')
    } finally {
      setExporting(false)
    }
  }

  const handleExportWord = async () => {
    if (!selectedMeeting) return
    setExporting(true)
    try {
      await docxExporter.download(selectedMeeting, selectedMeeting.generatedContent || {})
      message.success('Word 导出成功')
    } catch (error) {
      message.error('Word 导出失败')
    } finally {
      setExporting(false)
    }
  }

  const getMeetingTypeLabel = (type: string) => {
    const found = MEETING_TYPES.find(t => t.value === type)
    return found?.label || type
  }

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

  const content = selectedMeeting?.generatedContent || {}

  const detailTabItems = [
    {
      key: 'agenda',
      label: (
        <span>
          <FileText size={16} className="mr-1" />
          会议议程
        </span>
      ),
      children: content.agenda ? (
        <div className="prose max-w-none">
          <ReactMarkdown skipHtml={true}>{content.agenda}</ReactMarkdown>
        </div>
      ) : (
        <Empty description="暂无议程内容" />
      )
    },
    {
      key: 'speech',
      label: (
        <span>
          <FileText size={16} className="mr-1" />
          演讲稿
        </span>
      ),
      children: content.speech ? (
        <div className="prose max-w-none">
          <ReactMarkdown skipHtml={true}>{content.speech}</ReactMarkdown>
        </div>
      ) : (
        <Empty description="暂无演讲稿内容" />
      )
    },
    {
      key: 'poster',
      label: (
        <span>
          <FileImage size={16} className="mr-1" />
          海报设计
        </span>
      ),
      children: content.poster ? (
        <div className="prose max-w-none">
          <ReactMarkdown skipHtml={true}>{content.poster}</ReactMarkdown>
        </div>
      ) : (
        <Empty description="暂无海报设计方案" />
      )
    },
    {
      key: 'gifts',
      label: (
        <span>
          <Gift size={16} className="mr-1" />
          伴手礼
        </span>
      ),
      children: content.gifts ? (
        <div className="prose max-w-none">
          <ReactMarkdown skipHtml={true}>{content.gifts}</ReactMarkdown>
        </div>
      ) : (
        <Empty description="暂无伴手礼建议" />
      )
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部操作栏 */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex-1 max-w-xl">
              <SearchInput
                placeholder="搜索会议..."
                prefix={<Search size={18} />}
                size="large"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                allowClear
              />
            </div>
            <Space>
              <Select
                placeholder="筛选状态"
                style={{ width: 120 }}
                value={statusFilter}
                onChange={setStatusFilter}
              >
                <Select.Option value="all">全部状态</Select.Option>
                {MEETING_STATUS.map(status => (
                  <Select.Option key={status.value} value={status.value}>
                    {status.label}
                  </Select.Option>
                ))}
              </Select>
              <Button
                type="primary"
                icon={<Plus size={18} />}
                onClick={() => router.push('/planner')}
              >
                新建会议
              </Button>
            </Space>
          </div>
        </div>
      </div>

      {/* 会议列表 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredMeetings.length === 0 ? (
          <Card>
            <Empty
              description={searchText || statusFilter !== 'all' ? '没有找到匹配的会议' : '暂无会议记录'}
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            >
              <Button
                type="primary"
                icon={<Plus size={16} />}
                onClick={() => router.push('/planner')}
              >
                创建第一个会议
              </Button>
            </Empty>
          </Card>
        ) : (
          <Row gutter={[16, 16]}>
            {filteredMeetings.map((meeting) => (
              <Col key={meeting.id || meeting._id} xs={24} sm={12} lg={8}>
                <Card
                  hoverable
                  className="h-full"
                  actions={[
                    <Button
                      key="view"
                      type="link"
                      icon={<Eye size={16} />}
                      onClick={(e) => {
                        e.stopPropagation()
                        handleViewDetail(meeting)
                      }}
                    >
                      查看详情
                    </Button>,
                    <Button
                      key="edit"
                      type="link"
                      icon={<Edit size={16} />}
                      onClick={(e) => {
                        e.stopPropagation()
                        handleEdit(meeting)
                      }}
                    >
                      编辑
                    </Button>,
                    <Button
                      key="delete"
                      type="link"
                      danger
                      icon={<Trash2 size={16} />}
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDelete(meeting.id || meeting._id!)
                      }}
                    >
                      删除
                    </Button>
                  ]}
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <h3 className="font-semibold text-lg flex-1 line-clamp-2">
                        {meeting.title}
                      </h3>
                      <Tag color={getStatusColor(meeting.status)}>
                        {getStatusLabel(meeting.status)}
                      </Tag>
                    </div>

                    <div className="text-sm text-gray-600 space-y-2">
                      <div className="flex items-center">
                        <Calendar size={14} className="mr-2 flex-shrink-0" />
                        <span>{meeting.date || '日期待定'}</span>
                      </div>
                      <div className="flex items-center">
                        <Users size={14} className="mr-2 flex-shrink-0" />
                        <span>{meeting.attendees || '待定'}人</span>
                      </div>
                      <div className="flex items-center">
                        <Filter size={14} className="mr-2 flex-shrink-0" />
                        <span className="text-xs">{getMeetingTypeLabel(meeting.type)}</span>
                      </div>
                    </div>

                    <div className="pt-3 border-t">
                      <span className="text-xs text-gray-400">
                        {meeting.createdAt ? new Date(meeting.createdAt).toLocaleDateString() : ''}
                      </span>
                    </div>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </div>

      {/* 会议详情模态框 */}
      <Modal
        title={selectedMeeting?.title}
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        width={900}
        footer={[
          <Button key="close" onClick={() => setDetailModalVisible(false)}>
            关闭
          </Button>,
          <Button
            key="edit"
            icon={<Edit size={16} />}
            onClick={() => selectedMeeting && handleEdit(selectedMeeting)}
          >
            编辑
          </Button>,
          <Button
            key="pdf"
            icon={<Download size={16} />}
            onClick={handleExportPDF}
            loading={exporting}
            disabled={!content.agenda && !content.speech && !content.gifts}
          >
            导出 PDF
          </Button>,
          <Button
            key="word"
            icon={<Download size={16} />}
            onClick={handleExportWord}
            loading={exporting}
            disabled={!content.agenda && !content.speech && !content.gifts}
          >
            导出 Word
          </Button>
        ]}
      >
        {selectedMeeting && (
          <div>
            {/* 基本信息 */}
            <Divider orientation="left">会议信息</Divider>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
              <div>
                <span className="text-gray-500">日期：</span>
                <span className="ml-2">{selectedMeeting.date || '待定'}</span>
              </div>
              <div>
                <span className="text-gray-500">地点：</span>
                <span className="ml-2">{selectedMeeting.location || '待定'}</span>
              </div>
              <div>
                <span className="text-gray-500">人数：</span>
                <span className="ml-2">{selectedMeeting.attendees || '待定'}人</span>
              </div>
              <div>
                <span className="text-gray-500">时长：</span>
                <span className="ml-2">{selectedMeeting.duration || '待定'}小时</span>
              </div>
              <div>
                <span className="text-gray-500">预算：</span>
                <span className="ml-2">{selectedMeeting.budget || '待定'}</span>
              </div>
              <div>
                <span className="text-gray-500">类型：</span>
                <span className="ml-2">{getMeetingTypeLabel(selectedMeeting.type)}</span>
              </div>
            </div>

            {selectedMeeting.description && (
              <div className="mb-4">
                <span className="text-gray-500">描述：</span>
                <p className="mt-1">{selectedMeeting.description}</p>
              </div>
            )}

            {/* AI 生成内容 */}
            <Divider orientation="left">AI 生成内容</Divider>
            <Tabs items={detailTabItems} />
          </div>
        )}
      </Modal>
    </div>
  )
}
