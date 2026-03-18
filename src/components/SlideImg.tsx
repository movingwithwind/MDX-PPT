"use client";
import Image from 'next/image';
import {toast} from "sonner"
import { useLayoutEffect, useState } from 'react';

type Props = {
  src?: string;
  alt?: string;
};

const checkedUrls = new Map<string, boolean>();

export default function SlideImage({ src = '', alt = '' }: Props) {
  const [ready, setReady] = useState(false);
  const url=encodeURIComponent(src)

  async function checkImg() {

    try {
      const res = await fetch(`/api/check-img?url=${url}`);
      const data = await res.json();
      if(data.success) {
        setReady(true);
        checkedUrls.set(src, true);// 将结果缓存到 Map 中
      }
      else throw new Error(data.message);
      if(!data.exportable) sessionStorage.setItem("hasUnexportableImage", "true");// 如果图片不可导出，设置 sessionStorage 标记
    } catch (error) {
      checkedUrls.set(src, false);// 将结果缓存到 Map 中
      // 如果当前是 PDF 导出页面，就不弹 toast
      const isPdfMode = typeof window !== 'undefined' && window.location.pathname.includes('/pdf');
      if (!isPdfMode) toast.error(`Abnormal image detected: ${error}`);
    }
  }

  useLayoutEffect(() => {
    if(src&&!checkedUrls.has(src)) checkImg();
    if(src&&checkedUrls.get(src)) setReady(true);// 如果之前检查过且结果是成功的，直接设置 ready 为 true
  },[])
  
  return (
    !ready ? (
      <span className="flex justify-center my-8">
        <span 
          className="block bg-neutral-800 animate-pulse rounded-xl" 
          style={{ width: 500, height: 300 }} 
        />
      </span>
    ) : (
      <span className="flex justify-center my-8">
        <Image
          src={src}
          alt={alt}
          width={500}
          height={300}
          className="rounded-xl"
        />
      </span>
    )
  );
}