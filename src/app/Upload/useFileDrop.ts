"use client"
import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
export const useFileDrop = (isaiassisting = false) => {
    const router = useRouter();
    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    
    const handleDragEnter = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(true)
      }, [])
    
    const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
    }, [])
    
    const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
}, [])

    const uploadFile = useCallback((file: File, isaiassisting: boolean) => {
        setIsUploading(true)
        return fileUpload(file, isaiassisting||false, (data) => {
            if (data?.mdx) {
                sessionStorage.setItem("mdx-preview", JSON.stringify(data.mdx))
                if (data.fileId) {
                    sessionStorage.setItem("uploaded-file-id", data.fileId)
                }
                sessionStorage.setItem("canvasWidth", "896")
                sessionStorage.setItem("canvasHeight", "720")
                setIsDragging(false)
                setIsUploading(false)
                router.push("/slides/slide")
            }
        }).catch(() => {
            setIsUploading(false)
        })
    }, [router])

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(false)
        const files = e.dataTransfer.files
        if(!files.length||files.length===0) return
        const file = files[0]
        if(!file.name.endsWith(".md") && !file.name.endsWith(".mdx")){
            toast.warning("请上传.md或.mdx文件");
            return
        }
        uploadFile(file, isaiassisting)
    }, [uploadFile, isaiassisting])

    return {
        isDragging,
        isUploading,
        setIsUploading,    
        bind: {
            onDragEnter: handleDragEnter,
            onDragOver: handleDragOver,
            onDragLeave: handleDragLeave,
            onDrop: handleDrop,
        },
        uploadFile,
    }
}

export const fileUpload = (
    file: File,
    isaiassisting=false,
    onSuccess?: (data: { fileId?: string; mdx?: { compiledSource: string; scope: Record<string, unknown>; frontmatter: Record<string, unknown> } }) => void
): Promise<void> => {
    return new Promise((resolve, reject) => {
        const formData = new FormData()
        formData.append("file", file)
        if (isaiassisting) {
            formData.append("isaiassisting", isaiassisting.toString())
        }
        fetch("/api/Upload", {
            method: "POST",
            body: formData,
        })
            .then(async (res) => {
                const text = await res.text()
                if (!res.ok) {
                    throw new Error(`上传失败: ${res.status} ${text || res.statusText}`)
                }
                if (!text || !text.trim()) {
                    throw new Error("服务器返回空响应")
                }
                try {
                    return JSON.parse(text)
                } catch {
                    throw new Error(`响应格式错误，非 JSON: ${text.slice(0, 100)}`)
                }
            })
            .then((data) => {
                if (data.success && data.mdx) {
                    onSuccess?.(data)
                    resolve()
                } else {
                    console.error("上传或解析失败", data)
                    reject(new Error("上传失败"))
                }
            })
            .catch((err) => {
                console.error("上传失败", err)
                toast.error(err instanceof Error ? err.message : "上传失败，请重试")
                reject(err)
            })
    })
}