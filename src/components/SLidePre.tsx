import { useRef } from "react";
import { toast } from "sonner";
type Props = React.ComponentPropsWithoutRef<"pre">;

export default function SlidePre({children,className,...rest}:Props){ 
   const preRef = useRef<HTMLPreElement>(null);

   function handleCopy() {
        if (typeof window === "undefined") return;
        const text = preRef.current?.textContent || "";
        navigator.clipboard.writeText(text).then(() => {
            toast.success("复制成功");
        });
    }
   return <div className="reative flex justify-center group cursor-pointer" onClick={handleCopy}>
        <pre {...rest} className={`${className} overflow-x-auto`} ref={preRef}>
            {children}
        </pre>
    </div>
}