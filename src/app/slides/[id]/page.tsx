"use client";

import SlideClient from "@/components/SLideCLient";
import { useParams } from "next/navigation";
import { toast } from "sonner";


export default function SlideDynamicPage() {
  const params = useParams<{ id: string }>();
  const rawId = params?.id ?? "1";
  const slideId = rawId.startsWith("slide-") ? rawId.replace("slide-", "") : rawId;
  function shaerLink() {
    const url = new URL(window.location.href);
    navigator.clipboard.writeText(url.toString()).then(() => {
      toast.success("链接已复制到剪贴板");
    });
  } 
  return (
    <div className="flex min-h-screen items-center justify-center bg-black font-sans">
      <div className="absolute top-4 right-4  justify-center items-center flex flex-col gap-3">
        <button className="select-none cursor-pointer bg-zinc-900 hover:bg-zinc-800 text-zinc-700 font-semibold rounded-lg shadow transition-all duration-150 text-base tracking-wide z-10 w-32 h-10 flex items-center justify-center" style={{ letterSpacing: "0.03em" }} onClick={shaerLink}>
          分享链接
        </button>
      </div>
      <SlideClient slideId={slideId} />
    </div>
  );
}