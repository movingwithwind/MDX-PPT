"use client";
import React, { ReactNode, useState, useEffect, useRef,useLayoutEffect,useCallback } from "react";

interface SlideContainerProps {
  children: ReactNode | ReactNode[];
  syncRoom?: string;//隔离
}

export default function SlideContainer({ children, syncRoom = "default" }: SlideContainerProps) {
  const slides = Array.isArray(children) ? children : [children]; // 可能只有一项
  const [ready, setReady] = useState(false);
  const [scale, setScale] = useState(1);
  const [index, setIndex] = useState(0);
  const canvasWidth=parseInt(sessionStorage.getItem("canvasWidth") || "896"); // 初始最小宽度
  const canvasHeight=parseInt(sessionStorage.getItem("canvasHeight") || "720"); // 初始最小高度
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]); // 为每个 slide 创建 ref

  const total = slides.length;
  const initialization = useRef(true); // 用于标记是否是初始加载

  const [focused, setFocused] = useState(() => {
    if (typeof document === "undefined") return true;
    return document.hasFocus();
  });
  const slideKey = `mdx-ppt:ss:${syncRoom}:slide`;

 useEffect(() => {//挂载窗口聚焦监听
    const handleFocus = () => setFocused(true);
    const handleBlur = () => setFocused(false);
    window.addEventListener("focus", handleFocus);
    window.addEventListener("blur", handleBlur);
    return () => {
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("blur", handleBlur);
    };
  }, []);

  useEffect(() => {//仅聚焦窗口可修改localStorage，避免多个窗口互相覆盖数据导致跳转混乱
    if (!focused||initialization.current) return;

    localStorage.setItem(slideKey, String(index + 1));
  }, [focused, index, slideKey]);


  useEffect(() => {//初始加载时根据 localStorage 恢复页面和幻灯片状态
    const savedSlide = localStorage.getItem(slideKey);


    if (savedSlide) {
      const slideNumber = Number(savedSlide);
      if (Number.isFinite(slideNumber)) {
        const clamped = Math.min(total, Math.max(1, slideNumber));
        const targetHash = `#slide-${clamped}`;
        if (window.location.hash !== targetHash) {
          window.location.hash = targetHash;
          setIndex(clamped - 1); // 同步 index 状态
        }
      }
    }
  }, [ total, slideKey]);




  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.storageArea !== localStorage) return;// 只监听 localStorage 变化


      if (event.key === slideKey && event.newValue) {
        const slideNumber = Number(event.newValue);
        if (!Number.isFinite(slideNumber)) return;

        const clamped = Math.min(total, Math.max(1, slideNumber));
        const targetHash = `#slide-${clamped}`;

        if (window.location.hash !== targetHash) {
          setReady(false);
          window.location.hash = targetHash;
        }
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [ total, slideKey]);
 
  // 从 URL hash 中读取幻灯片索引
  useEffect(() => {
    const getIndexFromHash = () => {
      const hash = window.location.hash.substring(1);
      console.log("Current hash:", hash);
      if (hash.startsWith('slide-')) {
        const slideNumber = parseInt(hash.replace('slide-', ''));
        return Math.min(slides.length, Math.max(0, slideNumber));
      }
    };
    if (!window.location.hash) {
      window.location.hash = '#slide-1';
    }
    const handleHashChange = () => {
      const newSlide = getIndexFromHash();
      initialization.current=false;//初始加载完成
      const newIndex = newSlide! - 1;
      setIndex(newIndex);
    };
  
    window.addEventListener('hashchange', handleHashChange);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [slides.length]);

  // 键盘跳转加载
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft" || event.key === "a") {
        event.preventDefault();
        if(index!==0)setReady(false) //切换 slide 前先隐藏，等 ResizeObserver 计算完成后再显示，避免闪烁
        setIndex(prev => {
          const next = Math.max(0, prev - 1);
          window.location.hash = `#slide-${next + 1}`;
          return next;
        });
      } else if (event.key === "ArrowRight" || event.key === "d" || event.key === " ") {
        event.preventDefault();
        if(index!==total-1)setReady(false) //切换 slide 前先隐藏，等 ResizeObserver 计算完成后再显示，避免闪烁
        setIndex(prev => {
          const next = Math.min(total - 1, prev + 1);
          window.location.hash = `#slide-${next + 1}`;
          return next;
        }); // 使用函数，不直接使用 index 的 state
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [total,index]);

  const calcScale = useCallback((w: number, h: number) => {
    return Math.min((canvasWidth / w) * 0.9, (canvasHeight / h) * 0.9, 1);
  }, [canvasWidth, canvasHeight]);

  // 添加 ResizeObserver 监听当前 slide 的内容尺寸，并更新自适应容器
  useLayoutEffect(() => {
    const ref = slideRefs.current[index];//取当前 slide 的 ref
    if (ref) {
      const observer = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const { width: contentWidth, height: contentHeight } = entry.contentRect;
          const currentscale = calcScale(contentWidth, contentHeight);
          setScale(currentscale);
          setReady(true); // 只有当 ResizeObserver 计算完成后才显示内容，避免闪烁
          console.log(`Slide ${index + 1} resized: content (${contentWidth}x${contentHeight}), scale ${currentscale.toFixed(2)}`);
        }
      });
      observer.observe(ref);
      return () => observer.disconnect();
    }
  }, [index, calcScale]);


  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black text-white">
        <div
          className=" flex items-center justify-center w-full h-full"style={{transform: `scale(${scale})`, width: `${canvasWidth}px`, height: `${canvasHeight}px`,visibility: ready ? "visible" : "hidden", }}>
          <div ref={(el) => {slideRefs.current[index] = el;}} className="w-fit h-fit">{slides[index]}</div>
        </div>

      <div className="mt-4 flex items-center gap-4">
        <span className="select-none absolute bottom-2 right-2 text-white text-lg text-xs leading-tight">
          {index + 1} / {total}
        </span>
      </div>
    </div>
  );
}