# MDX-PPT

[English](#english) | [中文](#中文)

---

<a name="english"></a>
## English

**MDX-PPT** is an interactive presentation web application built on Next.js 16 and MDX. It empowers developers and tech enthusiasts to write slides using standard Markdown with React components and render them directly in the browser.

### ✨ Features
- **MDX Powered:** Write in Markdown and embed custom React components. Slide pagination is automatically separated by `---`.
- **Code Highlighting:** Integrated with `shiki` and `remark/rehype` for beautiful, VS Code-like coding snippets.
- **AI Assist:** Integrated OpenAI/DeepSeek API support to automatically paginate and enhance lengthy markdown texts.
- **Export to PDF & PPTX:** Use Playwright (Chromium) for high-fidelity PDF exports and `html2canvas` + `pptxgenjs` for PPTX extraction.
- **Responsive Canvas:** Uses `ResizeObserver` for dynamic aspect-ratio scaling to guarantee the layout looks great on any screen.
- **Drag & Drop Uploads:** Directly drag your `.md` or `.mdx` files into the browser.
- **Secure Image Checks:** Built-in SSRF protection against internal/private IP redirections on external images.

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

**MDX-PPT** 是一个基于 Next.js 16 和 MDX 构建的交互式演示文稿 Web 引用。它允许开发者通过标准 Markdown 语法（支持嵌入 React 组件）来编写幻灯片，并在浏览器中直接进行演示。

### ✨ 核心特性
- **MDX 驱动：** 支持 Markdown 语法和自定义 React 组件。通过标准的 `---` 分隔符自动进行幻灯片的分页。
- **代码高亮：** 内置 `shiki` 和 `remark/rehype` 插件链，提供与 VS Code 一致的高保真代码高亮体验。
- **AI 辅助：** 接入 OpenAI/DeepSeek 兼容 API，支持智能长文分页与排版整理。
- **PDF与 PPTX 导出：** 服务端采用基于 Playwright (Chromium) 的无头浏览器技术生成高清晰度 PDF。
- **自适应画布：** 利用 `ResizeObserver` 动态计算内容尺寸并同步缩放，保证大屏和移动端不出现布局溢出。
- **文件拖拽：** 提供直观的拖拽上传交互，即刻在浏览器中预览 `.md` / `.mdx` 文件。
- **安全的图片校验：** 服务端内置严格的 IP 白名单与反重定向机制，防范 SSRF (服务端请求伪造) 攻击。

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
