'use client'

import { Button, Card, Typography, Row, Col, Space, Avatar } from 'antd'
import { Sparkles, FileText, Image, Calendar, Gift, Users, CheckCircle, Star } from 'lucide-react'

const { Title, Paragraph } = Typography

export function HomePage() {
  const features = [
    {
      icon: Sparkles,
      title: 'AI智能生成',
      description: '基于先进AI技术，一键生成专业级会议内容',
      color: 'text-purple-600'
    },
    {
      icon: FileText,
      title: '全链路策划',
      description: '从会议主题到执行细节，全程AI辅助策划',
      color: 'text-blue-600'
    },
    {
      icon: Image,
      title: '创意海报设计',
      description: '自动生成精美会议海报，支持多种风格定制',
      color: 'text-green-600'
    },
    {
      icon: Calendar,
      title: '智能议程安排',
      description: 'AI优化会议流程，确保时间安排合理高效',
      color: 'text-orange-600'
    },
    {
      icon: Gift,
      title: '伴手礼推荐',
      description: '智能推荐适合的会议伴手礼，提升参会体验',
      color: 'text-pink-600'
    },
    {
      icon: Users,
      title: '团队协作',
      description: '支持多人实时协作编辑，高效团队配合',
      color: 'text-indigo-600'
    }
  ]

  const testimonials = [
    {
      name: '李经理',
      company: '科技有限公司',
      content: '使用这个工具后，我们的年会策划时间从一个月缩短到一周，效果还更好！',
      rating: 5,
      avatar: '李'
    },
    {
      name: '王总监',
      company: '教育集团',
      content: 'AI生成的演讲稿非常专业，帮我们节省了大量时间和精力。',
      rating: 5,
      avatar: '王'
    },
    {
      name: '张老师',
      company: '大学',
      content: '毕业典礼的策划变得如此简单，学生们都很满意。',
      rating: 5,
      avatar: '张'
    }
  ]

  const stats = [
    { number: '10,000+', label: '成功会议' },
    { number: '50,000+', label: '活跃用户' },
    { number: '95%', label: '用户满意度' },
    { number: '80%', label: '时间节省' }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="hero-gradient text-white section-padding">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="text-center animate-fade-in">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-8">
              <Sparkles className="h-5 w-5 mr-2" size={20} />
              <span className="text-sm font-medium">AI驱动的会议策划专家</span>
            </div>

            <Title level={1} className="text-5xl md:text-7xl font-bold mb-6 leading-tight !text-white">
              让会议策划变得
              <br />
              <span className="text-yellow-300">简单而高效</span>
            </Title>

            <Paragraph className="text-xl md:text-2xl text-blue-100 mb-12 max-w-4xl mx-auto leading-relaxed">
              基于AI技术的会议助手，一站式解决您的会议策划需求。
              从海报设计到演讲稿撰写，从议程安排到伴手礼准备，让专业会议策划触手可及。
            </Paragraph>

            <Space size="large" className="mb-12">
              <Button
                type="primary"
                size="large"
                className="bg-white text-primary-600 hover:bg-gray-50 font-bold text-lg px-10 py-6 rounded-2xl h-auto border-none"
              >
                🚀 免费开始使用
              </Button>
              <Button
                ghost
                size="large"
                className="text-lg px-10 py-6 rounded-2xl h-auto border-2 border-white text-white hover:bg-white hover:text-primary-600"
              >
                📋 浏览模板
              </Button>
            </Space>

            {/* Trust indicators */}
            <Row gutter={24} className="justify-center">
              <Col>
                <Space>
                  <CheckCircle className="h-5 w-5 text-green-400" size={20} />
                  <span className="text-blue-100">无需下载，立即使用</span>
                </Space>
              </Col>
              <Col>
                <Space>
                  <CheckCircle className="h-5 w-5 text-green-400" size={20} />
                  <span className="text-blue-100">7天免费试用</span>
                </Space>
              </Col>
              <Col>
                <Space>
                  <CheckCircle className="h-5 w-5 text-green-400" size={20} />
                  <span className="text-blue-100">专业AI支持</span>
                </Space>
              </Col>
            </Row>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto container-padding">
          <Row gutter={[32, 32]} justify="center">
            {stats.map((stat, index) => (
              <Col key={index} xs={12} md={6}>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-gradient mb-2">{stat.number}</div>
                  <div className="text-gray-600 font-medium">{stat.label}</div>
                </div>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-padding gradient-bg">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="text-center mb-20">
            <Title level={2} className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              强大的AI功能，专业的会议策划
            </Title>
            <Paragraph className="text-xl text-gray-600 max-w-3xl mx-auto">
              从创意构思到实际执行，我们的AI助手全程为您提供专业支持，让会议策划变得前所未有的简单
            </Paragraph>
          </div>

          <Row gutter={[24, 24]}>
            {features.map((feature, index) => (
              <Col key={index} xs={24} md={12} lg={8}>
                <div>
                  <Card className="card-hover text-center h-full group" hoverable>
                    <div className="flex justify-center mb-6">
                      <div className={`p-4 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 group-hover:scale-110 transition-transform duration-300`}>
                        <feature.icon className={`h-12 w-12 ${feature.color}`} size={48} />
                      </div>
                    </div>
                    <Title level={3} className="text-xl font-bold text-gray-900 mb-3">
                      {feature.title}
                    </Title>
                    <Paragraph className="text-gray-600 leading-relaxed">
                      {feature.description}
                    </Paragraph>
                  </Card>
                </div>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="text-center mb-16">
            <Title level={2} className="text-4xl font-bold text-gray-900 mb-4">
              用户好评如潮
            </Title>
            <Paragraph className="text-xl text-gray-600">
              数千用户已选择我们，会议策划从未如此简单
            </Paragraph>
          </div>

          <Row gutter={[24, 24]}>
            {testimonials.map((testimonial, index) => (
              <Col key={index} xs={24} md={8}>
                <div>
                  <Card className="card-hover h-full">
                    <div className="flex mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 text-yellow-400 fill-current inline" size={20} />
                      ))}
                    </div>
                    <Paragraph className="text-gray-700 mb-6 italic h-16">
                      &ldquo;{testimonial.content}&rdquo;
                    </Paragraph>
                    <div className="flex items-center">
                      <Avatar className="bg-gradient-to-br from-primary-500 to-secondary-500 mr-3">
                        {testimonial.avatar}
                      </Avatar>
                      <div>
                        <div className="font-semibold text-gray-900">{testimonial.name}</div>
                        <div className="text-sm text-gray-500">{testimonial.company}</div>
                      </div>
                    </div>
                  </Card>
                </div>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* CTA Section */}
      <section className="hero-gradient py-20">
        <div className="max-w-4xl mx-auto text-center container-padding">
          <div>
            <Title level={2} className="text-4xl md:text-5xl font-bold text-white mb-6">
              准备开始您的下一次会议了吗？
            </Title>
            <Paragraph className="text-xl text-blue-100 mb-12 max-w-2xl mx-auto">
              加入数千名成功使用会议助手的专业人士，让AI帮您创造完美的会议体验
            </Paragraph>

            <Space size="large">
              <Button
                type="primary"
                size="large"
                className="bg-white text-primary-600 hover:bg-gray-50 font-bold text-lg px-12 py-6 rounded-2xl h-auto"
              >
                🎯 立即注册，免费体验
              </Button>
              <Button
                ghost
                size="large"
                className="text-lg px-12 py-6 rounded-2xl h-auto border-2 border-white text-white hover:bg-white hover:text-primary-600"
              >
                ✨ 快速体验
              </Button>
            </Space>

            <Paragraph className="text-blue-200 mt-6 text-sm">
              无需信用卡，注册即享7天免费试用
            </Paragraph>
          </div>
        </div>
      </section>
    </div>
  )
}
