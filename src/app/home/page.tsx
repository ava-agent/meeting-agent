import { Metadata } from 'next'
import { HomePage } from '@/components/pages/HomePage'

export const metadata: Metadata = {
  title: '首页 - AI会议助手',
  description: '基于AI技术的会议助手，一站式解决您的会议策划需求',
}

export default function Page() {
  return <HomePage />
}