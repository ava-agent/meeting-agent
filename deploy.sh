#!/bin/bash

# AI Meeting Web - CloudBase Deployment Script
# 一站式会议助手 - CloudBase 部署脚本

set -e

echo "🚀 开始部署 AI 会议助手到 CloudBase..."

# 颜色定义
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 检查环境变量
echo -e "${YELLOW}📋 检查环境变量...${NC}"

if [ ! -f ".env.local" ]; then
    echo -e "${RED}❌ 未找到 .env.local 文件${NC}"
    echo "请先创建 .env.local 文件并配置必要的环境变量"
    exit 1
fi

# 加载环境变量
export $(cat .env.local | grep -v '^#' | xargs)

# 构建生产版本
echo -e "${YELLOW}🔨 构建生产版本...${NC}"
npm run build

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ 构建失败${NC}"
    exit 1
fi

echo -e "${GREEN}✅ 构建成功${NC}"

# 检查是否安装了 CloudBase CLI
if ! command -v tcb &> /dev/null; then
    echo -e "${YELLOW}📦 安装 CloudBase CLI...${NC}"
    npm install -g @cloudbase/cli
fi

# 部署到 CloudBase
echo -e "${YELLOW}📤 部署到 CloudBase 静态托管...${NC}"

# 使用 CloudBase CLI 部署静态文件
if [ -d "out" ]; then
    echo -e "${GREEN}✅ 静态文件已准备好${NC}"
    echo "请使用以下命令手动部署："
    echo ""
    echo -e "${YELLOW}tcb hosting deploy out/${NC}"
    echo ""
    echo "或者访问 CloudBase 控制台进行部署："
    echo "https://console.cloud.tencent.com/tcb"
else
    echo -e "${RED}❌ 未找到 out 目录${NC}"
    exit 1
fi

echo -e "${GREEN}✅ 部署准备完成！${NC}"
echo ""
echo "📝 部署步骤："
echo "1. 访问 CloudBase 控制台: https://console.cloud.tencent.com/tcb"
echo "2. 选择环境: ai-native-2gknzsob14f42138"
echo "3. 进入「静态网站托管」"
echo "4. 上传 out/ 目录中的所有文件"
echo ""
echo "🌐 部署后访问地址:"
echo "https://ai-native-2gknzsob14f42138-1255322707.tcloudbaseapp.com/"
