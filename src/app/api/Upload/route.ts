import { NextRequest, NextResponse } from "next/server";
import { serialize } from "next-mdx-remote/serialize";
import OpenAI from "openai";
import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";

interface StoredMdxPayload {
  compiledSource: string;
  scope: Record<string, unknown>;
  frontmatter: Record<string, unknown>;
  slidecount: number;
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_API_BASE_URL,
});

const AI_MODEL = process.env.AI_MODEL ?? "deepseek-chat";

const SYSTEM_PROMPT = process.env.SYSTEM_PROMPT ;//系统提示语

/**
 * 调用 AI 对 Markdown 内容进行智能分页
 */
async function aiPaginate(source: string): Promise<string> {
  const response = await openai.chat.completions.create({
    model: AI_MODEL,
    messages: [
      { role: "system", content: SYSTEM_PROMPT ?? "" },
      { role: "user", content: source },
    ],
    temperature: 0.3,
  });

  const result = response.choices[0]?.message?.content?.trim();
  if (!result) {
    throw new Error("AI 返回空内容");
  }
  return result;
}

export async function POST(request: NextRequest) {
  void fetch(new URL("/api/cleanup", request.url));
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const isaiassisting = formData.get("isaiassisting")?.toString()||false;
    if (!file) {
      return NextResponse.json({ success: false, error: "No file uploaded" }, { status: 400 });
    }
    let source = await file.text();
    const originalSource = source;
    // 生成唯一文件 ID 和安全的文件路径
    const fileId = randomUUID();
    const safeExt = path.extname(file.name) || ".mdx";
    const uploadDir = path.join(process.cwd(), ".data", "uploads");
    await mkdir(uploadDir, { recursive: true });
    const filePath = path.join(uploadDir, `${fileId}${safeExt}`);
    await writeFile(filePath, originalSource, "utf8");

    // 默认调用 AI 辅助分页
    if (isaiassisting) {
      try {
        source = await aiPaginate(source);
      } catch (aiError) {
        console.warn("AI 分页失败，使用原始内容：", aiError);
      }
    }
    
    const remarkGfmModule = await import("remark-gfm");
    const remarkSlideModule = await import("../../../components/remark-slide.cjs");//配合remark-slide文件格式解析
    const rehypeShikiModule = await import("@shikijs/rehype");//导入使用next-mdx-remote解析
    const remarkGfm = (remarkGfmModule as { default?: CallableFunction }).default ?? remarkGfmModule;
    const remarkSlide = (remarkSlideModule as { default?: CallableFunction }).default ?? remarkSlideModule;
    const rehypeShiki = (rehypeShikiModule as { default?: CallableFunction }).default ?? rehypeShikiModule;//获取默认导出成员

    const mdx = await serialize(source, {
    mdxOptions: {
      remarkPlugins: [remarkGfm as never, remarkSlide as never],//采用构建时同款解析方式
      rehypePlugins: [[rehypeShiki as never, { theme: "dracula" }]],
      },
    });
    const slideCount = mdx.compiledSource.match(/id:\s*"slide-\d+"/g)?.length ?? 0;//获取slide数量
    const compiledDir = path.join(process.cwd(), ".data", "compiled");
    await mkdir(compiledDir, { recursive: true });
    const compiledPath = path.join(compiledDir, `${fileId}.json`);
    const payload: StoredMdxPayload = {
      compiledSource: mdx.compiledSource,
      scope: mdx.scope ?? {},
      frontmatter: mdx.frontmatter ?? {},
      slidecount: slideCount,
    };
    await writeFile(compiledPath, JSON.stringify(payload), "utf8");

    return NextResponse.json({
      success: true,
      fileId,
      mdx: payload,//mdx运行时变量传入
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "MDX 解析失败";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}