import { NextResponse } from "next/server";
import { readdir, stat, unlink } from "fs/promises";
import path from "path";

// 超过此时长（毫秒）的文件会被删除，默认 24 小时，可通过环境变量调整
const MAX_AGE_MS =
  (Number(process.env.CLEANUP_MAX_AGE_HOURS ?? 24)) * 60 * 60 * 1000;

const TARGET_DIRS = [
  path.join(process.cwd(), ".data", "uploads"),
  path.join(process.cwd(), ".data", "compiled"),
];

async function cleanDir(dir: string, now: number): Promise<number> {
  let deleted = 0;
  let files: string[];
  try {
    files = await readdir(dir);
  } catch {
    return 0; // 目录不存在或无法访问，跳出函数
  }
  for (const file of files) {
    const filePath = path.join(dir, file);
    try {
      const s = await stat(filePath);
      if (now - s.mtimeMs > MAX_AGE_MS) {
        await unlink(filePath);
        deleted++;
      }
    } catch {
      // 单个文件失败不中断其他文件
    }
  }
  return deleted;
}

export async function GET() {
  const now = Date.now();
  let total = 0;
  for (const dir of TARGET_DIRS) {
    total += await cleanDir(dir, now);
  }
  return NextResponse.json({ success: true, deleted: total });
}