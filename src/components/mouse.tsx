"use client";

import { useEffect, useRef } from "react";

export const Mouse = () => {
  const cursorInnerRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mouse = mouseRef.current;
    const cursor = cursorRef.current;
    const cursorInner = cursorInnerRef.current;

    if (!cursorInner || !cursor || !mouse) return;

    document.addEventListener("mousemove", (ev) => {
      cursorInner.style.transform = `translate3d(calc(${ev.clientX}px - 50%), calc(${ev.clientY}px - 50%), 0)`;
      cursor.style.transform = `translate3d(calc(${ev.clientX}px - 50%), calc(${ev.clientY}px - 50%), 0)`;
    });

    document.addEventListener("mousedown", () => {
      cursorInner.style.width = "48px";
      cursorInner.style.height = "48px";
    });
    document.addEventListener("mouseup", () => {
      cursorInner.style.width = "20px";
      cursorInner.style.height = "20px";
    });

    document.addEventListener("mouseleave", () => {
      mouse.style.opacity = "0";
    });
    document.addEventListener("mouseenter", () => {
      mouse.style.opacity = "1";
    });

    return () => {
      document.removeEventListener("mousemove", () => {});
      document.removeEventListener("mousedown", () => {});
      document.removeEventListener("mouseup", () => {});
      document.removeEventListener("mouseleave", () => {});
      document.removeEventListener("mouseenter", () => {});
    };
  }, []);

  return (
    <div aria-hidden ref={mouseRef} className="max-md:hidden">
      <div
        aria-hidden
        ref={cursorInnerRef}
        className="w-5 h-5 rounded-full mouse-utils z-50 top-0 left-0 bg-zinc-100/30 fixed translate-x-2/3 translate-y-2/3 pointer-events-none transition-[width,height,opacity]"
      />
      <div
        aria-hidden
        ref={cursorRef}
        className="w-12 h-12 rounded-full border-solid mouse-utils border-zinc-100 border-[1px] fixed pointer-events-none transition-all duration-[50ms] top-0 left-0"
      />
    </div>
  );
};
