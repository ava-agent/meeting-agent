# CloudBase 部署指南

本文档说明如何将 AI 会议助手部署到腾讯云 CloudBase 平台。

## 前置要求

1. **Node.js 环境**: >= 18.0.0
2. **CloudBase 账号**: [腾讯云 CloudBase](https://console.cloud.tencent.com/tcb)
3. **CloudBase 环境**: `ai-native-2gknzsob14f42138` (ap-shanghai)

## 环境配置

创建 `.env.local` 文件并配置以下环境变量：

```env
# 智谱AI API密钥（可选，用于AI内容生成）
NEXT_PUBLIC_GLM_API_KEY=your_glm_api_key

# CloudBase环境ID（必需）
NEXT_PUBLIC_CLOUDBASE_ENV_ID=ai-native-2gknzsob14f42138

# 微信应用ID（可选，用于微信登录）
NEXT_PUBLIC_WECHAT_APP_ID=

# 应用URL（可选）
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 部署步骤

### 方式一：使用 CloudBase 控制台（推荐）

1. **构建静态文件**
   ```bash
   npm run build
   ```
   构建产物位于 `out/` 目录。

2. **访问 CloudBase 控制台**
   - URL: https://console.cloud.tencent.com/tcb
   - 选择环境: `ai-native-2gknzsob14f42138`

3. **进入静态网站托管**
   - 在左侧菜单选择「静态网站托管」
   - 点击「文件管理」

4. **上传文件**
   - 将 `out/` 目录下的所有文件上传
   - 或使用 CLI 工具部署

### 方式二：使用 CloudBase CLI

1. **安装 CLI**
   ```bash
   npm install -g @cloudbase/cli
   ```

2. **登录 CloudBase**
   ```bash
   tcb login
   ```

3. **部署静态文件**
   ```bash
   cd ai-meeting-web-next
   tcb hosting deploy out/
   ```

### 部署脚本

项目提供了自动化部署脚本：

- **Windows**: `deploy.bat`
- **Linux/Mac**: `deploy.sh`

```bash
# Windows
deploy.bat

# Linux/Mac
chmod +x deploy.sh
./deploy.sh
```

## 验证部署

部署完成后，访问以下地址验证：

```
https://ai-native-2gknzsob14f42138-1255322707.tcloudbaseapp.com/
```

## 数据库配置

首次访问时，需要确保 CloudBase 数据库已创建以下集合：

1. **ai_meeting_users** - 用户数据
2. **ai_meeting_meetings** - 会议数据
3. **ai_meeting_generations** - AI生成记录

### 数据库权限规则

```json
{
  "read": "auth.uid != null",
  "write": "auth.uid != null"
}
```

## 安全配置

1. **域名配置**: 建议配置自定义域名
2. **HTTPS**: CloudBase 自动提供 HTTPS
3. **访问控制**: 可配置 IP 白名单

## 故障排除

### 构建失败
- 检查 Node.js 版本
- 清除缓存: `rm -rf .next out`
- 重新安装依赖: `npm install`

### 部署失败
- 检查网络连接
- 验证 CloudBase 账号状态
- 查看控制台错误日志

### 运行时错误
- 检查浏览器控制台
- 验证环境变量配置
- 确认 CloudBase 数据库权限

## 监控和日志

- **CloudBase 控制台**: 查看访问日志
- **云开发控制台**: 监控数据库操作
- **前端监控**: 检查浏览器 Console

## 更新部署

修改代码后，重新执行部署步骤：

```bash
npm run build
tcb hosting deploy out/
```
