"use client";

import {  useEffect, useState } from "react";
import { toast } from "sonner";
import { MDXRemote } from "next-mdx-remote";
import Link from "next/link";
import SlideContainer from "@/components/SlideContainerCS";
import SlideImg from "@/components/SlideImg";
import SlideLink from "@/components/SlideLink";
import { useRouter } from "next/navigation";
import SlidePre from "@/components/SLidePre";

interface MdxPreview {
  compiledSource: string;
  scope: Record<string, unknown>;
  frontmatter: Record<string, unknown>;
}

export default function SlidePreviewPage() {
  const [mdx, setMdx] = useState<MdxPreview | null>(null);
  const [canvasWidth, setCanvasWidth] = useState(896);
  const [canvasHeight, setCanvasHeight] = useState(720);
 
  const router = useRouter();
 
  useEffect(() => {
    const rawCanvasWidth = sessionStorage.getItem("canvasWidth");
    const rawCanvasHeight = sessionStorage.getItem("canvasHeight");
    const parsedCanvasWidth = rawCanvasWidth ? parseInt(rawCanvasWidth, 10) : 896;
    const parsedCanvasHeight = rawCanvasHeight ? parseInt(rawCanvasHeight, 10) : 720;

    setCanvasWidth(Number.isFinite(parsedCanvasWidth) ? parsedCanvasWidth : 896);
    setCanvasHeight(Number.isFinite(parsedCanvasHeight) ? parsedCanvasHeight : 720);

    const raw = sessionStorage.getItem("mdx-preview");
    if (raw && raw.trim()) {
      try {
        const parsed = JSON.parse(raw) as MdxPreview;
        if (parsed?.compiledSource) {
          setMdx(parsed);
        }
      } catch {
        setMdx(null);
      }
    }
  }, []);

    async function Uploadfile() {
      const fileId = sessionStorage.getItem("uploaded-file-id");
      if (!fileId) {
        toast.error("没有找到要上传的文件，无法上传");
        return;
      }
      try {
        const ISuploaded = sessionStorage.getItem("uploaded");
        if(ISuploaded&&ISuploaded === "true"){
          toast.warning("文件已上传至服务端，请勿重复上传");
          return;
        }
        const response = await fetch(`/api/transation?fileId=${fileId}`);
        if (!response.ok) {
          throw new Error(`服务器返回 ${response.status}`);
        }
        const data = await response.json();
        if (data.success) {
          toast.success(`文件上传成功，已保存为 ${data.path},请访问/slides/${data.slideId} 查看`);
          sessionStorage.setItem("uploaded", String(true));
        } else {
          throw new Error(data.error || "未知错误");
        }
      }catch (err) {
        toast.error("上传失败，请稍后再试");
        console.error("Upload error:", err);
      }
    }
     async function exportPdf() {
      const exportableFlag = sessionStorage.getItem("hasUnexportableImage");
      if (exportableFlag === "true") {
        toast.error("检测到有异常图片，可能导致 PDF 导出失败，请检查图片链接是否正确或图片是否可访问");
        return;
      }
      const fileId = sessionStorage.getItem("uploaded-file-id");
      if (!fileId) {
        toast.error("没有找到上传的文件，无法导出 PDF");
        return;
      }
      try {
        const response = await fetch(`/api/export-pdf?fileId=${fileId}`);
        if (!response.ok) {
          throw new Error(`服务器返回 ${response.status}`);
        }

          const blob = await response.blob();
          const objectUrl = URL.createObjectURL(blob);

          const contentDisposition = response.headers.get("content-disposition") || "";
          const fileNameMatch = contentDisposition.match(/filename="?([^";]+)"?/i);
          const fileName = fileNameMatch?.[1] || `presentation-${fileId}.pdf`;

          const link = document.createElement("a");
          link.href = objectUrl;
          link.download = fileName;
          document.body.appendChild(link);
          link.click();
          link.remove();
          URL.revokeObjectURL(objectUrl);
      } catch (err) {
        toast.error("导出 PDF 失败，请稍后再试");
        console.error("Export PDF error:", err);
      }
    }

  if (mdx === null) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-black font-sans text-white">
        <p className="text-neutral-400">请先上传 .md 或 .mdx 文件进行预览</p>
        <Link
          href="/Upload"
          className="mt-4 text-emerald-400 underline hover:text-emerald-300"
        >
          前往上传
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="absolute top-4 right-4  justify-center items-center flex flex-col gap-3">
        <button className="select-none cursor-pointer bg-zinc-900 hover:bg-zinc-800 text-zinc-700 font-semibold rounded-lg shadow transition-all duration-150 text-base tracking-wide z-10 w-32 h-10 flex items-center justify-center" style={{ letterSpacing: "0.03em" }} onClick={exportPdf}>Pdf导出</button>
        <button className="select-none cursor-pointer bg-zinc-900 hover:bg-zinc-800 text-zinc-700 font-semibold rounded-lg shadow transition-all duration-150 text-base tracking-wide z-10 w-32 h-10 flex items-center justify-center" style={{ letterSpacing: "0.03em" }} onClick={Uploadfile}>上传服务端</button>
        <button className="select-none cursor-pointer bg-zinc-900 hover:bg-zinc-800 text-zinc-700 font-semibold rounded-lg shadow transition-all duration-150 text-base tracking-wide z-10 w-32 h-10 flex items-center justify-center" style={{ letterSpacing: "0.03em" }} onClick={() => router.push("/Upload")}>重新上传</button>      
      </div>
        <div className="flex min-h-screen items-center justify-center bg-black font-sans relative">
          <div className="w-full  prose prose-invert dark:prose-invert text-white flex items-center bg-black" id="slide-canvas" style={{width: canvasWidth,height: canvasHeight,background: "black"}}>{/* 默认导出截图画布 */}
            <MDXRemote {...mdx} scope={{ ...mdx.scope}} components={{ SlideContainer, img: SlideImg,a:SlideLink,pre: SlidePre }}/>{/* mdx文件渲染解析 */}
          </div>
        </div>
    </>
  );
}
