# AI 会议助手 (Meeting Assistant)

> 一站式 AI 驱动的会议策划平台，一键生成议程、演讲稿、海报和伴手礼推荐

**在线体验**: https://meeting.rxcloud.group

## 功能特性

- **AI 内容生成** - 议程、演讲稿、海报设计方案、伴手礼推荐（GLM-4-flash）
- **用户认证** - 邮箱注册/登录、匿名体验（Supabase Auth）
- **会议管理** - 创建、编辑、删除、归档（Supabase PostgreSQL + RLS）
- **多格式导出** - PDF、Word、图片
- **响应式设计** - 完整移动端支持

## 技术栈

| 层级 | 技术 |
|------|------|
| 前端框架 | Next.js 14 (App Router) |
| UI 组件库 | Ant Design 5.x + Tailwind CSS |
| 状态管理 | Zustand 4.x (localStorage 持久化) |
| 数据库 | Supabase PostgreSQL (RLS 行级安全) |
| 认证 | Supabase Auth (邮箱 + 匿名登录) |
| AI 模型 | Zhipu GLM-4-flash (服务端调用) |
| 语言 | TypeScript 5.x |
| 测试 | Vitest + @testing-library/react |
| 部署 | Vercel |

## 快速开始

### 1. 克隆并安装依赖

```bash
git clone https://github.com/ava-agent/meeting-agent.git
cd meeting-agent
npm install
```

### 2. 配置环境变量

复制示例文件并填写实际值：

```bash
cp .env.example .env.local
```

编辑 `.env.local`：

```env
# Supabase 配置 (必填)
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# GLM API Key (服务端私有，必填)
# 获取地址: https://open.bigmodel.cn/
GLM_API_KEY=your_glm_api_key

# 应用地址
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

> **安全说明**: `GLM_API_KEY` 不加 `NEXT_PUBLIC_` 前缀，仅在服务端 API Route 中使用，不会暴露给浏览器。

### 3. 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3000

## 常用命令

```bash
npm run dev          # 开发服务器
npm run build        # 生产构建
npm run start        # 启动生产服务器
npm run lint         # ESLint 检查
npm run lint:fix     # ESLint 自动修复
npm run type-check   # TypeScript 类型检查
npm run format       # Prettier 格式化
npm run test         # 运行测试
npm run test:coverage # 测试覆盖率
```

## 项目结构

```
src/
├── app/
│   ├── (auth)/          # 登录/注册页面
│   ├── (dashboard)/     # 控制台和会议列表
│   ├── api/
│   │   └── ai/generate/ # 服务端 AI 生成路由 (GLM 代理)
│   ├── home/            # 首页
│   └── planner/         # 4 步会议策划向导
├── components/
│   ├── auth/            # 登录/注册表单
│   ├── meeting/         # 会议策划器、详情
│   └── pages/           # 页面级组件
├── hooks/
│   ├── useAuth.ts       # 认证状态管理
│   ├── useMeeting.ts    # 会议 CRUD 操作
│   └── useAI.ts         # AI 生成 (调用 /api/ai/generate)
├── services/
│   ├── supabase/        # Supabase auth + database 服务
│   └── ai/              # 提示词模板、AI 服务接口
├── lib/
│   ├── supabase.ts      # Supabase 客户端初始化
│   ├── store.ts         # Zustand 全局状态
│   └── utils.ts         # 工具函数
└── types/               # TypeScript 类型定义
```

## Supabase 数据库结构

```sql
-- 用户配置文件 (关联 auth.users)
profiles (id, email, name, avatar_url, role, created_at, updated_at)

-- 会议记录
meetings (id, user_id, title, date, location, description,
          attendees, budget, type, duration, status,
          generated_content, created_at, updated_at)

-- AI 生成日志
ai_generations (id, meeting_id, user_id, type, content,
                prompt, model, tokens, created_at)
```

所有表均启用 RLS（行级安全策略），用户只能访问自己的数据。

## 部署到 Vercel

### 方式一：Vercel 控制台

1. 前往 [Vercel Dashboard](https://vercel.com/dashboard)
2. 导入 `https://github.com/ava-agent/meeting-agent`
3. 在 **Settings → Environment Variables** 添加：
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `GLM_API_KEY`
   - `NEXT_PUBLIC_APP_URL` = `https://meeting.rxcloud.group`
4. 点击 **Deploy**

### 方式二：Vercel CLI

```bash
# 安装 CLI
npm i -g vercel

# 部署
vercel --prod
```

### 自定义域名

在 Vercel 控制台 **Settings → Domains** 添加 `meeting.rxcloud.group`，然后在 DNS 提供商处添加对应 CNAME 记录。

## Supabase 配置

### 初始化数据库

数据库迁移通过 Supabase MCP 已执行。如需重新初始化，在 Supabase SQL Editor 运行 `migrations/` 目录下的 SQL 文件。

### 开启匿名登录

在 Supabase Dashboard → **Authentication → Providers** 中开启 **Anonymous sign-ins**。

## AI 生成架构

```
浏览器 → useAI.ts → POST /api/ai/generate → GLM API
                          (服务端路由)
                     [GLM_API_KEY 仅在此处使用]
```

AI 生成通过 Next.js API Route 代理，API Key 永远不会暴露到客户端。

## 测试

```bash
# 运行所有测试
npm run test

# 查看覆盖率报告
npm run test:coverage
```

测试覆盖率要求：
- 语句覆盖率 ≥ 80%
- 函数覆盖率 ≥ 80%
- 分支覆盖率 ≥ 70%

## 环境要求

- Node.js >= 18.0.0
- npm >= 9.0.0

## License

MIT
