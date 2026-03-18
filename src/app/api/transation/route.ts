
import {NextRequest, NextResponse} from "next/server";
import { readdir,  copyFile, mkdir } from "fs/promises";
import  path  from "path";

async function findFileById(fileId: string): Promise<string | null> {//根据 fileId 查找对应的文件路径
    const dirPath = path.join(process.cwd(), ".data", "uploads");
    const files = await readdir(dirPath);
    const hit = files.find((f) => f.startsWith(`${fileId}.`));
    if (!hit) return null;
    return path.join(dirPath, hit);
}
async function nextSlideId(): Promise<number> {
    const slideDir = path.join(process.cwd(), ".data", "slidemdxs");
    let files: string[]=[];
    try {
        files = await readdir(slideDir);
    } catch {
        return 1; // 目录不存在时从 1 开始
    }
    const ids = files
        .map((f) => {
            const match = f.match(/^slides-(\d+)\.mdx$/);
            return match ? parseInt(match[1], 10) : null;
        })
        .filter((id): id is number => id !== null);
    return ids.length > 0 ? Math.max(...ids) + 1 : 1;
}

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const fileId = searchParams.get("fileId");
    if(!fileId){
        return NextResponse.json({ success: false, error: "Missing fileId" }, { status: 400 });
    }
    const filePath = await findFileById(fileId);
    if (!filePath) {
        return NextResponse.json({ success: false, error: "fileId not found" }, { status: 404 });
    }
     const slideDir = path.join(process.cwd(), ".data", "slidemdxs");
    await mkdir(slideDir, { recursive: true });

    const newId = await nextSlideId();
    const destPath = path.join(slideDir, `slides-${newId}.mdx`);

    await copyFile(filePath, destPath);

    return NextResponse.json({ success: true, slideId: newId, path: `slides-${newId}.mdx` });
}