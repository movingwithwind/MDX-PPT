"use client"
import { useState } from "react";
import { useFileDrop } from "./useFileDrop";
import { toast } from "sonner";
export default function DropPreviewLayout() {
  const [isaiassisting, setIsaiassisting] = useState(false) //是否启用AI辅助分页，默认不开启
  const { isDragging,isUploading, bind, uploadFile } = useFileDrop(isaiassisting)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && (file.name.endsWith(".md") || file.name.endsWith(".mdx"))) {
      uploadFile(file, isaiassisting)
    } else if (file) {
      toast.error("请上传.md或.mdx文件");
    }
  }
  return (
    <>
      <main className="flex flex-1 items-center justify-center px-6  select-none relative flex-col gap-4" {...bind} > 
        <input type="file" accept=".md,.mdx" onChange={handleFileUpload} className="hidden"/>       
          <div
            className={`
              relative w-full max-w-2xl rounded-2xl border-2 border-dashed
              p-16 text-center transition-all duration-300 cursor-pointer
              ${isDragging 
                ? "border-blue-500 bg-blue-500/10 scale-[1.02]" 
                : "border-neutral-700 hover:border-neutral-500"}
            `}
            onClick={isUploading?()=>{}:() => document.querySelector("input")?.click()}
          >
            {isUploading ? <div className="absolute inset-0 flex items-center justify-center">Uploading</div>:
              <div className="space-y-6">
              {/* 图标 */}
              <div className="mx-auto h-14 w-14 rounded-full bg-neutral-800 flex items-center justify-center text-2xl">
                📄
              </div>
              {/* 主文案 */}
              <div>
                <h2 className="text-2xl font-semibold">
                  Drop your Markdown file
                </h2>
                <p className="mt-2 text-sm text-neutral-400">
                  This version supports plain .md/.mdx documents only. Image assets are not supported yet.
                </p>
              </div>
              {/* 提示按钮 */}
              <div className="text-xs text-neutral-500">
                or click to select a file
              </div>
            </div>}
          </div>
            <div className="  cursor-pointer   text-xs text-neutral-500">
                <input type="checkbox" id="ai-assist" className="mr-1" checked={isaiassisting}  onChange={()=>setIsaiassisting(!isaiassisting)}/> AI Assist (coming soon)
             </div>
      </main>
    </>
  )
}