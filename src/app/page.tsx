import Link from "next/link";
import ParticleBackground from "../components/ParticleBackground";

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white font-sans">
      <ParticleBackground />
      <main className="relative z-10 mx-auto max-w-3xl px-6 py-16 flex w-full min-h-screen">
        <div className="flex flex-col  justify-center">
          <h1 className="text-4xl font-bold tracking-tight text-white">
            MDX PPT
          </h1>
          <p className="mt-2 text-lg text-zinc-200">
            基于 MDX 的演示文稿项目
          </p>

          <section className="mt-12 space-y-4 text-zinc-200">
            <h2 className="text-xl font-semibold text-white">
              项目介绍
            </h2>
            <p className="leading-relaxed">
              MDX PPT 是一个使用 Next.js 和 MDX 构建的演示文稿应用。你可以用 Markdown 语法编写幻灯片内容，支持代码高亮、图片和自定义组件，通过 <code className="rounded-md bg-zinc-800 px-2 py-1 text-zinc-100">---</code> 分隔符划分每一页。
            </p>
          </section>

          <section className="mt-10">
            <h2 className="text-xl font-semibold text-white">
              技术特性
            </h2>
            <ul className="mt-4 space-y-2 text-zinc-200">
              <li className="flex items-center gap-2">
                <span className="text-emerald-500">•</span>
                MDX：Markdown + JSX，支持 React 组件
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-500">•</span>
                Shiki：基于 VS Code 主题的代码高亮
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-500">•</span>
                Remark / Rehype：可扩展的 Markdown 处理管道
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-500">•</span>
                Next.js 16：App Router、动态导入
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-500">•</span>
                Playwright + Chromium：服务端无头浏览器渲染，直接导出可下载 PDF
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-500">•</span>
                html2canvas + PptxGenJS：基于页面截图批量生成 PPTX 幻灯片
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-500">•</span>
                DeepSeek（OpenAI SDK 兼容调用）：接入 AI 辅助分页与文稿整理
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-500">•</span>
                ResizeObserver 自适应缩放：根据内容尺寸自动缩放画布，减少溢出和闪烁
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-500">•</span>
                双存储策略：原始 Markdown 与编译后的 MDX Payload 同时保存，导出更快更稳定
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-500">•</span>
                next-mdx-remote + remark/rehype + Shiki：统一预览与导出的渲染管线与代码高亮
              </li>
            </ul>
          </section>

          <div className="mt-14">
            <Link
              href="/Upload"
              className="inline-flex items-center gap-2 select-none cursor-pointer bg-white/10 hover:bg-white/20 text-white font-semibold px-5 py-2 rounded-lg shadow transition-all duration-150 text-base tracking-wide z-10"
            >
              开始演示
              <span aria-hidden className="select-none">→</span>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
