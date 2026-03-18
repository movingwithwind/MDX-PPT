import html2canvas from "html2canvas";
import PptxGenJS from "pptxgenjs";
function sleep(ms: number) {
    return new Promise((r) => setTimeout(r, ms));
  }
  
  async function waitFonts() {
    if (document.fonts?.ready) {
      await document.fonts.ready;
    }
  }
  
  async function waitImages(root: HTMLElement) {
    const imgs = Array.from(root.querySelectorAll("img"));
    await Promise.all(
      imgs.map(
        (img) =>
          img.complete
            ? Promise.resolve()
            : new Promise<void>((resolve) => {
                img.onload = () => resolve();
                img.onerror = () => resolve();
              })
      )
    );
  }

  export async function exportToPptx(options: { slideCount: number }) {
    try{
        const canvas=document.querySelector("#slide-canvas") as HTMLElement;
        if(!canvas) throw new Error("截图失败，未找到画布")
        await sleep(120);//等待字体等信息加载
        const pptx = new PptxGenJS();
        pptx.layout="LAYOUT_WIDE";
        const slide_w=13.333,slide_h=7.5//设置宽高;
        for (let i = 1; i <= options.slideCount; i++) {
            window.location.hash = `#slide-${i}`;
            //等待图片等资源渲染
            await sleep(120);
            await waitImages(canvas);
            //截图
            const pptxCanvas = await html2canvas(canvas, {
                backgroundColor: "#000000",
                scale: 3, // 想更清晰可用 3（但更慢更大）
                useCORS: true, // 如果图片跨域，需服务端允许 CORS
                logging: false,
            });
            //转换为图片
            const dataURL = pptxCanvas.toDataURL("image/png");
            //新开一页添加图片
            const slide = pptx.addSlide();
            slide.addImage({
                path: dataURL,
                x: 0,
                y: 0,
                w: slide_w,
                h: slide_h,
            });
        }
        //返回首页
        window.location.hash = "#slide-1";
        //写入文件保存
        await pptx.writeFile({ fileName: "slides.pptx" });
    }catch(e){
        alert(e)
    }
  }