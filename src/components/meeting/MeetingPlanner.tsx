'use client'

import { useState } from 'react'
import { Button, Card, Steps, Form, Input, Select, message, Spin, Space } from 'antd'
import { ArrowLeft, ArrowRight, Sparkles, CheckCircle, Download } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useMeeting } from '@/hooks/useMeeting'
import { useAI } from '@/hooks/useAI'
import { pdfExporter, docxExporter, imageExporter } from '@/services/export'
import { MEETING_TYPES } from '@/lib/constants'
import type { Meeting, MeetingFormData } from '@/types/meeting'
import type { GenerationType } from '@/types/ai'

const { TextArea } = Input

export function MeetingPlanner() {
  const router = useRouter()
  const [form] = Form.useForm()
  const { createMeeting, updateMeetingContent } = useMeeting()
  const { generate, generateAll, isGenerating, results } = useAI()

  const [currentStep, setCurrentStep] = useState(0)
  const [meetingData, setMeetingData] = useState<Partial<MeetingFormData>>({})
  const [createdMeetingId, setCreatedMeetingId] = useState<string | null>(null)
  const [isCreating, setIsCreating] = useState(false)

  const hasAnyContent = Object.values(results).some(r => r?.content)

  const steps = [
    {
      title: '基本信息',
      description: '填写会议基本信息'
    },
    {
      title: '详细配置',
      description: '设置会议详细参数'
    },
    {
      title: 'AI生成',
      description: 'AI智能生成内容'
    },
    {
      title: '完成',
      description: '查看并导出结果'
    }
  ]

  const contentTypes: Array<{ key: GenerationType; title: string; description: string; icon: string }> = [
    { key: 'agenda', title: '会议议程', description: '自动生成详细的会议议程安排', icon: '📋' },
    { key: 'speech', title: '演讲稿', description: 'AI撰写专业演讲稿内容', icon: '🎤' },
    { key: 'poster', title: '宣传海报', description: '设计精美的会议海报', icon: '🎨' },
    { key: 'gifts', title: '伴手礼', description: '推荐合适的会议伴手礼', icon: '🎁' }
  ]

  const handleNext = async () => {
    try {
      if (currentStep === 0) {
        // 验证第一步
        await form.validateFields(['title', 'date', 'location'])
      } else if (currentStep === 1) {
        // 验证第二步并创建会议
        await form.validateFields()
        const values = await form.getFieldsValue()
        setMeetingData(values)

        // 创建会议记录
        setIsCreating(true)
        const meeting = await createMeeting(values)
        setCreatedMeetingId(meeting._id || null)
        setIsCreating(false)
      }

      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1)
      }
    } catch (error) {
      console.error('验证失败:', error)
    }
  }

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleGenerate = async (type: GenerationType) => {
    if (!meetingData.title) {
      message.warning('请先填写会议基本信息')
      setCurrentStep(0)
      return
    }

    try {
      const result = await generate(type, meetingData as MeetingFormData)

      if (result.success && createdMeetingId) {
        // 保存生成内容到会议记录
        const updatedContent = {
          [type]: result.content
        }
        await updateMeetingContent(createdMeetingId, updatedContent)
        message.success(`${contentTypes.find(t => t.key === type)?.title}生成成功`)
      } else if (!result.success) {
        message.error(result.error || '生成失败')
      }
    } catch (error) {
      message.error('生成失败，请重试')
    }
  }

  const handleGenerateAll = async () => {
    if (!meetingData.title) {
      message.warning('请先填写会议基本信息')
      setCurrentStep(0)
      return
    }

    try {
      const allResults = await generateAll(meetingData as MeetingFormData)

      if (createdMeetingId) {
        const generatedContent: Record<string, string> = {}
        for (const [type, result] of Object.entries(allResults)) {
          if (result.success && result.content) {
            generatedContent[type] = result.content
          }
        }
        if (Object.keys(generatedContent).length > 0) {
          await updateMeetingContent(createdMeetingId, generatedContent)
        }
      }

      const successCount = Object.values(allResults).filter(r => r.success).length
      message.success(`已成功生成 ${successCount}/4 项内容`)
    } catch (error) {
      message.error('批量生成失败，请重试')
    }
  }

  const buildMeetingForExport = (): Meeting => ({
    title: meetingData.title || '',
    date: meetingData.date || '',
    location: meetingData.location || '',
    description: meetingData.description || '',
    attendees: parseInt(meetingData.attendees || '0') || 0,
    budget: meetingData.budget || '',
    type: (meetingData.type as Meeting['type']) || 'other',
    duration: meetingData.duration || '',
    status: 'draft',
    generatedContent: Object.fromEntries(
      Object.entries(results)
        .filter(([_, r]) => r?.content)
        .map(([k, r]) => [k, r.content])
    )
  })

  const handleExportPDF = async () => {
    try {
      const meeting = buildMeetingForExport()
      await pdfExporter.download(meeting, meeting.generatedContent || {})
      message.success('PDF 导出成功')
    } catch (error) {
      message.error('PDF 导出失败')
    }
  }

  const handleExportWord = async () => {
    try {
      const meeting = buildMeetingForExport()
      await docxExporter.download(meeting, meeting.generatedContent || {})
      message.success('Word 导出成功')
    } catch (error) {
      message.error('Word 导出失败')
    }
  }

  const handleExportPoster = async () => {
    try {
      const meeting = buildMeetingForExport()
      await imageExporter.exportMeetingToPoster(meeting)
      message.success('海报导出成功')
    } catch (error) {
      message.error('海报导出失败')
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <Card>
            <h2 className="text-2xl font-bold mb-6">会议基本信息</h2>
            <Form form={form} layout="vertical">
              <Form.Item
                name="title"
                label="会议主题"
                rules={[{ required: true, message: '请输入会议主题' }]}
              >
                <Input placeholder="例如：2024年公司年度战略发布会" size="large" />
              </Form.Item>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Form.Item
                  name="date"
                  label="会议日期"
                  rules={[{ required: true, message: '请选择会议日期' }]}
                >
                  <Input type="date" size="large" />
                </Form.Item>
                <Form.Item
                  name="location"
                  label="会议地点"
                  rules={[{ required: true, message: '请输入会议地点' }]}
                >
                  <Input placeholder="例如：北京国际会议中心" size="large" />
                </Form.Item>
              </div>

              <Form.Item
                name="description"
                label="会议描述"
              >
                <TextArea
                  rows={4}
                  placeholder="请详细描述会议的目的、主要内容、预期成果等..."
                />
              </Form.Item>
            </Form>
          </Card>
        )

      case 1:
        return (
          <Card>
            <h2 className="text-2xl font-bold mb-6">详细配置</h2>
            <Form form={form} layout="vertical">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Form.Item
                  name="attendees"
                  label="预计参会人数"
                >
                  <Input placeholder="例如：100" size="large" />
                </Form.Item>
                <Form.Item
                  name="duration"
                  label="会议时长（小时）"
                >
                  <Input placeholder="例如：4" size="large" />
                </Form.Item>
              </div>

              <Form.Item
                name="type"
                label="会议类型"
                rules={[{ required: true, message: '请选择会议类型' }]}
              >
                <Select placeholder="请选择会议类型" size="large">
                  {MEETING_TYPES.map(type => (
                    <Select.Option key={type.value} value={type.value}>
                      {type.label}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                name="budget"
                label="预算范围"
              >
                <Input placeholder="例如：5-10万" size="large" />
              </Form.Item>
            </Form>
          </Card>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">AI智能内容生成</h2>
              <p className="text-gray-600">点击下方按钮，让AI为您生成专业的会议内容</p>
              <Button
                type="primary"
                size="large"
                icon={<Sparkles size={18} />}
                onClick={handleGenerateAll}
                loading={isGenerating()}
                disabled={!meetingData.title}
                className="mt-4"
              >
                一键生成全部内容
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {contentTypes.map((type) => (
                <Card key={type.key} className="hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="text-4xl">{type.icon}</div>
                      <div>
                        <h3 className="font-bold text-lg">{type.title}</h3>
                        <p className="text-sm text-gray-600">{type.description}</p>
                      </div>
                    </div>
                    <Button
                      type="primary"
                      icon={<Sparkles size={16} />}
                      onClick={() => handleGenerate(type.key)}
                      loading={isGenerating(type.key)}
                      disabled={!meetingData.title}
                    >
                      生成
                    </Button>
                  </div>

                  {results[type.key]?.content && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center text-green-600 mb-2">
                        <CheckCircle size={16} />
                        <span className="ml-2 text-sm font-medium">生成成功</span>
                      </div>
                      <pre className="text-sm whitespace-pre-wrap text-gray-700 max-h-60 overflow-y-auto">
                        {results[type.key].content}
                      </pre>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">会议策划完成</h2>
              <p className="text-gray-600">您的会议方案已生成完毕</p>
            </div>

            <Card>
              <h3 className="text-xl font-bold mb-6">📋 会议概览</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <span className="font-semibold text-gray-700">会议主题：</span>
                    <span className="text-gray-900">{meetingData.title}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">会议日期：</span>
                    <span className="text-gray-900">{meetingData.date || '待定'}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">会议地点：</span>
                    <span className="text-gray-900">{meetingData.location || '待定'}</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <span className="font-semibold text-gray-700">参会人数：</span>
                    <span className="text-gray-900">{meetingData.attendees || '待定'}人</span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">会议时长：</span>
                    <span className="text-gray-900">{meetingData.duration || '待定'}小时</span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">预算范围：</span>
                    <span className="text-gray-900">{meetingData.budget || '待定'}</span>
                  </div>
                </div>
              </div>
            </Card>

            <Card>
              <h3 className="text-lg font-bold mb-4">✅ 已生成内容</h3>
              <div className="space-y-3">
                {contentTypes.map((type) => (
                  <div key={type.key} className="flex items-center justify-between">
                    <span className="text-gray-700">
                      {type.icon} {type.title}
                    </span>
                    {results[type.key]?.content ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <div className="w-5 h-5 border-2 border-gray-300 rounded-full"></div>
                    )}
                  </div>
                ))}
              </div>
            </Card>

            <Card>
              <h3 className="text-lg font-bold mb-4">📥 导出方案</h3>
              <Space size="middle" wrap>
                <Button
                  icon={<Download size={16} />}
                  onClick={handleExportPDF}
                  disabled={!hasAnyContent}
                >
                  导出 PDF
                </Button>
                <Button
                  icon={<Download size={16} />}
                  onClick={handleExportWord}
                  disabled={!hasAnyContent}
                >
                  导出 Word
                </Button>
                <Button
                  icon={<Download size={16} />}
                  onClick={handleExportPoster}
                  disabled={!hasAnyContent}
                >
                  导出海报
                </Button>
              </Space>
            </Card>

            <div className="text-center">
              <Button
                type="primary"
                size="large"
                onClick={() => router.push('/dashboard')}
              >
                返回仪表板
              </Button>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部进度条 */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Steps current={currentStep}>
            {steps.map((step, index) => (
              <Steps.Step key={index} title={step.title} description={step.description} />
            ))}
          </Steps>
        </div>
      </div>

      {/* 主内容 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isCreating ? (
          <div className="flex items-center justify-center py-20">
            <Spin size="large" />
          </div>
        ) : (
          renderStepContent()
        )}
      </div>

      {/* 底部导航 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between">
            <Button
              onClick={handlePrev}
              disabled={currentStep === 0}
              icon={<ArrowLeft size={16} />}
            >
              上一步
            </Button>
            <Button
              type="primary"
              onClick={handleNext}
              disabled={currentStep === steps.length - 1}
              icon={<ArrowRight size={16} />}
            >
              {currentStep === steps.length - 1 ? '完成' : '下一步'}
            </Button>
          </div>
        </div>
      </div>

      {/* 底部留白 */}
      <div className="h-20"></div>
    </div>
  )
}
