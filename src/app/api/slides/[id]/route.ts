import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";
import { serialize } from "next-mdx-remote/serialize";

interface MdxPayload {
  compiledSource: string;
  scope: Record<string, unknown>;
  frontmatter: Record<string, unknown>;
}

function normalizeSlideId(rawId: string): string {
  const cleaned = rawId.startsWith("slide-") ? rawId.slice("slide-".length) : rawId;
  return /^\d+$/.test(cleaned) ? cleaned : "1";
}

async function readSlideSource(slideId: string): Promise<string | null> {
  const filePath = path.join(process.cwd(), ".data", "slidemdxs", `slides-${slideId}.mdx`);
  try {
    return await readFile(filePath, "utf8");
  } catch {
    return null;
  }
}

async function compileMdx(source: string): Promise<MdxPayload> {
  const remarkGfmModule = await import("remark-gfm");
  const remarkSlideModule = await import("../../../../components/remark-slide.cjs");
  const rehypeShikiModule = await import("@shikijs/rehype");

  const remarkGfm = (remarkGfmModule as { default?: CallableFunction }).default ?? remarkGfmModule;
  const remarkSlide = (remarkSlideModule as { default?: CallableFunction }).default ?? remarkSlideModule;
  const rehypeShiki = (rehypeShikiModule as { default?: CallableFunction }).default ?? rehypeShikiModule;

  const mdx = await serialize(source, {
    mdxOptions: {
      remarkPlugins: [remarkGfm as never, remarkSlide as never],
      rehypePlugins: [[rehypeShiki as never, { theme: "dracula" }]],
    },
  });

  return {
    compiledSource: mdx.compiledSource,
    scope: mdx.scope ?? {},
    frontmatter: mdx.frontmatter ?? {},
  };
}

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const normalizedId = normalizeSlideId(id);

  const source = (await readSlideSource(normalizedId));
  if (!source) {
    return NextResponse.json(
      { success: false, error: "No slide files available, please upload and save to the server first" },
      { status: 404 }
    );
  }

  try {
    const mdx = await compileMdx(source);
    return NextResponse.json({ success: true, mdx });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to compile slide";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
