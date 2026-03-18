"use client"
import React,{ReactNode} from "react"
interface Props{
    children:ReactNode|ReactNode[]
}
export default function SlideContainerPdf({children}:Props){
    const slides=Array.isArray(children)?children:[children];
    return <div className="pdf-export bg-white text-black flex justify-center w-full h-full flex-col gap-2 p-20 prose">
        {slides.map((slide,i)=><section key={i} className="bg-white text-black break-inside-avoid">
        {slide}
        </section>)}
    </div>
}