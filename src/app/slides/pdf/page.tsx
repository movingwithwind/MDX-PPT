//playwright调用，生成pdf专用页面
"use client"
import { useSyncExternalStore } from "react";
import { MDXRemote } from "next-mdx-remote";
import SlideImg from "@/components/SlideImg";
import SlideContainerPdf from "./Slide-container-pdf"
import SlideLink from "@/components/SlideLink";
interface MdxPreview {
  compiledSource: string;
  scope: Record<string, unknown>;
  frontmatter: Record<string, unknown>;
}

let cachedRaw: string | null = null;
let cachedParsed: MdxPreview | null = null;//存储prase结果，避免重复解析同一数据

function readMdxPreview(): MdxPreview | null {
  if (typeof window === "undefined") return null;
  const raw = sessionStorage.getItem("mdx-preview");
  if (!raw) {
    cachedRaw = null;
    cachedParsed = null;
    return null;
  }
  if (raw === cachedRaw) {
    return cachedParsed;
  }
  try {
    const parsed = JSON.parse(raw) as MdxPreview;
    cachedRaw = raw;
    cachedParsed = parsed;
    return parsed;
  } catch {
    cachedRaw = raw;
    cachedParsed = null;
    return null;
  }
}

export default function PdfPage(){
    const mdx = useSyncExternalStore(//避免hydration mismatch问题
      () => () => {},
      readMdxPreview,
      () => null
    );
    if(!mdx) return <div className="min-h-screen bg-white" />//类型收窄
    return<><MDXRemote
      {...mdx}
      scope={{ ...mdx?.scope }}
      components={{ SlideContainer: SlideContainerPdf, img: SlideImg, a: SlideLink }}
    />
    </>
}