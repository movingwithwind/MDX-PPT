import { NextRequest,NextResponse } from "next/server";
import dns from "dns/promises";
import net from "net";

function isPrivateIP(ip: string) {//私有IP审查
  // IPv4 本地/私有/链路本地
  if (/^(127\.|10\.|192\.168\.|169\.254\.)/.test(ip)) return true;
  // IPv4 172.16.0.0/12 (172.16.* - 172.31.*)
  if (/^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(ip)) return true;
  // IPv6 本地回环/唯一本地/链路本地
  const ipv6 = ip.toLowerCase();
  if (ipv6 === "::1" || ipv6.startsWith("fc") || ipv6.startsWith("fd") || ipv6.startsWith("fe80:")) return true;
  return false;
}

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get("url");
    if(!url) {
        return NextResponse.json({ success: false, message: "Missing url parameter" }, { status: 400 });
    }

    let prasedUrl: URL;

    try {
        prasedUrl = new URL(url);
        const ips = await dns.lookup(prasedUrl.hostname, { all: true });// 解析域名并检查是否为私有 IP 地址
        for (const { address } of ips) {
            if (net.isIP(address) && isPrivateIP(address)) throw new Error("URL resolves to a private IP address");
            }
    } catch (error) {
        return NextResponse.json({ success: false, message: `Invalid URL, error: ${error}` }, { status: 400 });
    }

        // 仅允许 https 协议
    if(!prasedUrl.protocol.startsWith("https")) return NextResponse.json({ success: false, message: "Only https protocol is allowed" }, { status: 400 });

    //超时控制
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    let okForExport = false;
    const originUrl = new URL(request.url).origin;
    const ua = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";


    try{
        const response = await fetch(url, { method: "HEAD", redirect: "error", signal: controller.signal });//配置 error 直接拒绝重定向
        
        const contentType = response.headers.get("content-type");
        const ok= response.ok && contentType && contentType.startsWith("image/");
        if(!ok) throw new Error("URL does not point to an image or is not accessible");
    
        //playwright模拟
        const exportRes = await fetch(url, {
            method: "HEAD", 
            redirect: "error", 
            signal: controller.signal,
            headers: { "User-Agent": ua, "Referer": originUrl }
        });
        okForExport = exportRes.ok && !!exportRes.headers.get("content-type")?.startsWith("image/");
    }catch (error) {
        return NextResponse.json({ success: false, message: `Error fetching URL: ${error}` }, { status: 400 });
    }finally{
        clearTimeout(timeoutId);//无论成功与否都清除超时
    }

    if(!okForExport) return NextResponse.json({ success: false, exportable: false, message: "Image is not accessible for export (playwright check failed)" });

    return NextResponse.json({ success: true, exportable: true, message: "URL is valid and points to an image" });
}