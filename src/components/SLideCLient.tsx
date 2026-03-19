"use client";

import { useEffect, useState } from "react";
import { MDXRemote } from "next-mdx-remote";
import SlideContainerSS from "./SlideContainerSS";
import SlidePre from "./SLidePre";
import SlideImg from './SlideImg';
import SlideLink from "./SlideLink";

type Props = { slideId: string };

interface MdxPayload {
  compiledSource: string;
  scope: Record<string, unknown>;
  frontmatter: Record<string, unknown>;
}

export default function SlideClient({ slideId = "1" }: Props) {
  const [mdx, setMdx] = useState<MdxPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadSlide() {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/slides/${encodeURIComponent(slideId)}`);
        const data = await response.json();

        if (!response.ok || !data?.success || !data?.mdx) {
          throw new Error(data?.error ?? "获取幻灯片失败");
        }

        if (!isMounted) return;
        setMdx(data.mdx as MdxPayload);
      } catch (err) {
        if (!isMounted) return;
        setMdx(null);
        setError(err instanceof Error ? err.message : "加载失败");
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    void loadSlide();

    return () => {
      isMounted = false;
    };
  }, [slideId]);

  const syncRoom = `slide-${slideId}`;

  if (loading) {
    return <div className="text-zinc-300">加载中...</div>;
  }

  if (!mdx) {
    return <div className="text-red-400">{error ?? "未找到可用幻灯片"}</div>;
  }

  return (
    <div className="flex-1 flex items-center justify-center bg-black dark:bg-black">
      <div className="w-full max-w-4xl prose dark:prose-invert text-white">
        <MDXRemote
          {...mdx}
          scope={{ ...mdx.scope }}
          components={{
            SlideContainer: (props) => <SlideContainerSS {...props} syncRoom={syncRoom} />,
            img: SlideImg,
            a: SlideLink,
            pre: SlidePre,
          }}
        />
      </div>
    </div>
  );
}