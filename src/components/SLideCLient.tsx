"use client";

import type { MDXProps } from "mdx/types";
import dynamic from "next/dynamic";
import SlideContainerSS from "./SlideContainerSS";
import SlidePre from "./SLidePre";
import SlideImg from './SlideImg';
import SlideLink from "./SlideLink";

type Props = { slideId: string };

export default function SlideClient({ slideId = "1" }: Props) {
  const SlideContent = dynamic<MDXProps>(
    () =>
      import(`../../.data/slidemdxs/slides-${slideId}.mdx`).catch(() =>
        import("../../.data/slidemdxs/slides-1.mdx")
      ),
    {
      ssr: false,
      loading: () => <div>加载中...</div>,
    }
  );
  const syncRoom = `slide-${slideId}`;

  return (
    <div className="flex-1 flex items-center justify-center bg-black dark:bg-black">
      <div className="w-full max-w-4xl prose dark:prose-invert text-white">
        <SlideContent components={{ SlideContainer: (props) => <SlideContainerSS {...props} syncRoom={syncRoom} />, img: SlideImg ,a: SlideLink,pre: SlidePre }} />
      </div>
    </div>
  );
}