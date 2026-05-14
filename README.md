# MDX-PPT

[English](#english) | [中文](#中文)

---

<a name="english"></a>
## English

**MDX-PPT** is a lightweight, modern tool built on Next.js 16 and MDX that instantly converts Markdown into playable slides. It focuses on fast authoring and quick delivery: import Markdown, get a live slide preview, and export production-quality PDFs without heavy setup.

### ✨ Key Capabilities
- **Instant Slides from Markdown:** Drop or paste standard Markdown/MDX and get slides generated automatically.
- **Live Preview & Sync Scroll:** Real-time preview with synchronized scrolling between editor and slide view for quick editing and review.
- **High‑Quality Code Highlighting:** Beautiful code rendering via `shiki` and `remark/rehype` integrations.
- **High‑Fidelity PDF Export:** Produce print-ready PDFs using Playwright (Chromium) for consistent, high-quality output.
- **MDX Extensibility:** Embed React components inside slides when you need interactive bits or custom UI.
- **Lightweight Workflow:** Designed for fast, ad‑hoc presentations — minimal config, no heavy slide frameworks.
- **Drag & Drop Upload:** Quickly import `.md` / `.mdx` files and start presenting.

### 🚀 Getting Started

1. **Install Dependencies:**
   ```bash
   npm install
   # or yarn / pnpm / bun
   ```

2. **Environment Variables:**
   Create a `.env.local` file and add the following:
   ```env
   OPENAI_API_KEY=your_api_key_here
   OPENAI_API_BASE_URL=https://api.openai.com/v1
   AI_MODEL=deepseek-chat
   SYSTEM_PROMPT="Your system prompt for pagination"
   CLEANUP_MAX_AGE_HOURS=24
   ```

3. **Run the Development Server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the application.

### 📂 Directory Structure Highlights
- `src/app/Upload`: Drag-and-drop file upload feature.
- `src/app/slides`: Presentation playground and PDF generation views.
- `src/app/api`: Serverless endpoints for file uploads, AI translation, PDF generation, and SSRF secure image parsing.
- `.data/`: Temporary storage for uploaded MDX and parsed JSON payloads.

---

<a name="中文"></a>
## 中文

**MDX-PPT** 是一个基于 Next.js 16 与 MDX 的轻量化幻灯片工具，旨在将 Markdown 快速转换为可播放的演示稿。它强调快速、简单的制作流程：导入 Markdown 即时预览，同步滚动编辑，支持高质量代码高亮与 PDF 输出，适合制作快速、轻量化的演示文稿。

### ✨ 主要能力
- **Markdown 一键成片：** 导入或粘贴标准 Markdown/MDX 即可自动生成幻灯片。
- **实时预览与同步滚动：** 编辑器与幻灯片视图实时同步，修改即见效果，提升演示准备效率。
- **高保真代码高亮：** 通过 `shiki` 与 `remark/rehype` 提供接近 VS Code 的代码展示效果。
- **高质量 PDF 导出：** 使用 Playwright (Chromium) 生成可打印的高保真 PDF。
- **MDX 扩展性：** 支持在幻灯片中嵌入 React 组件，实现交互或自定义内容。
- **轻量化工作流：** 最小配置即可使用，适合快速制作和现场演示。
- **拖拽导入：** 支持直接拖入 `.md` / `.mdx` 文件快速开始。

### 🚀 快速开始

1. **安装依赖：**
   ```bash
   npm install
   # 推荐使用 pnpm
   ```

2. **配置环境变量：**
   在根目录下创建 `.env.local` 文件，并填入以下配置：
   ```env
   OPENAI_API_KEY=你的_API_KEY
   OPENAI_API_BASE_URL=https://api.openai.com/v1
   AI_MODEL=deepseek-chat
   SYSTEM_PROMPT="你的AI辅助分页系统提示词"
   CLEANUP_MAX_AGE_HOURS=24
   ```

3. **启动开发服务器：**
   ```bash
   npm run dev
   ```
   访问 [http://localhost:3000](http://localhost:3000) 开始使用首页面板。

### 📂 目录结构说明
- `src/app/Upload`：拖拽上传核心页面及逻辑。
- `src/app/slides`：演示文稿播放主页、PDF 专用渲染路由。
- `src/app/api`：支撑业务的后端路由，包括文件流解析、AI 通信、PDF 无头浏览器控制及图片安全性拉取。
- `.data/`：本地开发时存放上传源码与 JSON 编译产物的临时目录。
