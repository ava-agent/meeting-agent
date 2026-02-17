'use client'

import { useEffect } from 'react'
import { Card, Row, Col, Button, Space, Typography, Statistic, Empty } from 'antd'
import { Plus, Calendar, Clock, Users, Sparkles } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { useMeeting } from '@/hooks/useMeeting'

const { Title } = Typography

export function Dashboard() {
  const router = useRouter()
  const { user, isLoading: authLoading } = useAuth()
  const { meetings, loadMeetings } = useMeeting()

  useEffect(() => {
    if (user) {
      loadMeetings()
    }
  }, [user, loadMeetings])

  const recentMeetings = meetings.slice(0, 6)

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">加载中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部欢迎区 */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-between">
            <div>
              <Title level={2} className="!text-white !mb-2">
                欢迎回来，{user?.name || '用户'}！
              </Title>
              <p className="text-blue-100">
                今天也要高效策划会议哦
              </p>
            </div>
            <Button
              type="primary"
              size="large"
              icon={<Sparkles size={20} />}
              onClick={() => router.push('/planner')}
              className="bg-white text-blue-600 hover:bg-gray-50"
            >
              创建新会议
            </Button>
          </div>
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        <Row gutter={[16, 16]}>
          <Col xs={12} md={6}>
            <Card>
              <Statistic
                title="总会议数"
                value={meetings.length}
                prefix={<Calendar className="text-blue-600" size={20} />}
                valueStyle={{ color: '#2563eb' }}
              />
            </Card>
          </Col>
          <Col xs={12} md={6}>
            <Card>
              <Statistic
                title="草稿"
                value={meetings.filter(m => m.status === 'draft').length}
                prefix={<Clock className="text-orange-600" size={20} />}
                valueStyle={{ color: '#ea580c' }}
              />
            </Card>
          </Col>
          <Col xs={12} md={6}>
            <Card>
              <Statistic
                title="已完成"
                value={meetings.filter(m => m.status === 'completed').length}
                prefix={<Users className="text-green-600" size={20} />}
                valueStyle={{ color: '#16a34a' }}
              />
            </Card>
          </Col>
          <Col xs={12} md={6}>
            <Card>
              <Statistic
                title="已发布"
                value={meetings.filter(m => m.status === 'published').length}
                prefix={<Sparkles className="text-purple-600" size={20} />}
                valueStyle={{ color: '#9333ea' }}
              />
            </Card>
          </Col>
        </Row>
      </div>

      {/* 最近会议 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card
          title="最近会议"
          extra={
            <Button
              type="link"
              onClick={() => router.push('/meetings')}
            >
              查看全部
            </Button>
          }
        >
          {recentMeetings.length === 0 ? (
            <Empty
              description="暂无会议记录"
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
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recentMeetings.map((meeting) => (
                <Card
                  key={meeting?.id || 'temp'}
                  size="small"
                  className="hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => router.push(`/meetings/${meeting?.id || ''}`)}
                >
                  <div className="font-semibold text-lg mb-2 truncate">
                    {meeting.title}
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div className="flex items-center">
                      <Calendar size={14} className="mr-2" />
                      {meeting.date || '待定'}
                    </div>
                    <div className="flex items-center">
                      <Users size={14} className="mr-2" />
                      {meeting.attendees || '待定'}人
                    </div>
                  </div>
                  <div className="mt-3">
                    <span className={`inline-block px-2 py-1 rounded text-xs ${
                      meeting.status === 'draft' ? 'bg-orange-100 text-orange-700' :
                      meeting.status === 'completed' ? 'bg-green-100 text-green-700' :
                      'bg-purple-100 text-purple-700'
                    }`}>
                      {meeting.status === 'draft' ? '草稿' :
                       meeting.status === 'completed' ? '已完成' : '已发布'}
                    </span>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* 快速操作 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <Card title="快速开始">
          <Space size="middle" wrap>
            <Button
              size="large"
              icon={<Plus size={18} />}
              onClick={() => router.push('/planner')}
            >
              创建新会议
            </Button>
            <Button
              size="large"
              onClick={() => router.push('/meetings')}
            >
              历史会议
            </Button>
            <Button
              size="large"
              onClick={() => router.push('/meetings')}
            >
              查看全部会议
            </Button>
          </Space>
        </Card>
      </div>
    </div>
  )
}
