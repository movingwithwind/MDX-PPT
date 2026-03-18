import { NextRequest, NextResponse } from "next/server";
import { readdir,readFile } from "fs/promises";
import { chromium } from "playwright";
import path from "path";
import { serialize } from "next-mdx-remote/serialize";

interface MdxPayload {
    compiledSource: string;
    scope: Record<string, unknown>;
    frontmatter: Record<string, unknown>;
    slidecount?: number;
}


async function findFileById(fileId: string): Promise<string | null> {//根据 fileId 查找对应的文件路径
    const dirPath = path.join(process.cwd(), ".data", "uploads");
    const files = await readdir(dirPath);
    const hit = files.find((f) => f.startsWith(`${fileId}.`));
    if (!hit) return null;
    return path.join(dirPath, hit);
}

async function readCompiledById(fileId: string): Promise<MdxPayload | null> {//根据 fileId 查找对应的已解析 JSON 文件
    const compiledPath = path.join(process.cwd(), ".data", "compiled", `${fileId}.json`);
    try {
        const json = await readFile(compiledPath, "utf8");
        return JSON.parse(json) as MdxPayload;
    } catch {
        return null;
    }
}

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const fileId = searchParams.get("fileId");
    if (!fileId) {
        return NextResponse.json({ success: false, error: "Missing fileId" }, { status: 400 });
    }
      const filePath = await findFileById(fileId);
    if (!filePath) {
        return NextResponse.json({ success: false, error: "fileId not found" }, { status: 404 });
    }

    let mdx = await readCompiledById(fileId);
    if (!mdx) {
        // 兼容历史数据：若未命中已解析缓存则回退为临时序列化
        const source = await readFile(filePath, "utf8");
        const serialized = await serialize(source);
        mdx = {
            compiledSource: serialized.compiledSource,
            scope: serialized.scope ?? {},
            frontmatter: serialized.frontmatter ?? {},
        };
    }

    const browser = await chromium.launch({ headless: true });//playwright生成pdf
     try {
        const context = await browser.newContext();
        const page = await context.newPage();

        await page.addInitScript((payload: MdxPayload) => {
        sessionStorage.setItem("mdx-preview", JSON.stringify(payload));
        }, { compiledSource: mdx.compiledSource, scope: mdx.scope, frontmatter: mdx.frontmatter, slidecount: mdx.slidecount });

        const origin = new URL(request.url).origin;
        await page.goto(`${origin}/slides/pdf`, { waitUntil: "networkidle" });
        await page.waitForTimeout(300);//等待页面渲染稳定，避免出现空白页

        const pdf = await page.pdf({
        format: "A4",
        landscape: true,
        printBackground: true,
        preferCSSPageSize: true,
        });

        return new NextResponse(new Uint8Array(pdf), {
        headers: {
            "Content-Type": "application/pdf",  
            "Content-Disposition": `attachment; filename="presentation.pdf"`,
        },
        });
    }catch{
        return NextResponse.json({ success: false, error: "Failed to generate PDF" }, { status: 500 });
    } finally {
    await browser.close();
  }
}