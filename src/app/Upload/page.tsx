import Dropclient from "./Dropclient";
export default function DropPreviewLayout() {
  return (
    <div className="relative flex min-h-screen flex-col bg-neutral-950 text-neutral-100">
      
      {/* 顶部栏 */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-neutral-800">
        <div className="text-lg font-semibold tracking-tight">
          mdx-ppt
        </div>
        <div className="text-sm text-neutral-400">
          Drag & Preview
        </div>
      </header>

      {/* 中央内容区域 */}
      <Dropclient />

      {/* 底部说明 */}
      <footer className="border-t border-neutral-800 px-6 py-4 text-xs text-neutral-500 text-center">
        This version accepts .md/.mdx documents only. Image assets are not supported yet. Files are processed temporarily on the server and cleaned up periodically.
      </footer>
    </div>
  )
}