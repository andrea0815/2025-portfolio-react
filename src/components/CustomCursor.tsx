import { useEffect, useRef } from "react";
import gsap from "gsap";

function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    // fast GSAP setters
    const setX = gsap.quickSetter(cursor, "x", "px");
    const setY = gsap.quickSetter(cursor, "y", "px");

    const move = (e: MouseEvent) => {
      setX(e.clientX);
      setY(e.clientY);
    };

    const grow = () => {
      gsap.to(cursor, { scale: 2, duration: 0.25, ease: "power3.out" });
    };

    const shrink = () => {
      gsap.to(cursor, { scale: 1, duration: 0.25, ease: "power3.out" });
    };

    // main mouse listeners
    document.addEventListener("mousemove", move);

    // handle hover elements
    const hoverEls = document.querySelectorAll<HTMLElement>(".hoverEl");

    hoverEls.forEach((el) => {
      el.addEventListener("mouseenter", grow);
      el.addEventListener("mouseleave", shrink);
    });

    return () => {
      document.removeEventListener("mousemove", move);

      hoverEls.forEach((el) => {
        el.removeEventListener("mouseenter", grow);
        el.removeEventListener("mouseleave", shrink);
      });
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className="customCursor fixed z-[999999] w-4 h-4 left-0 top-0
                 -translate-x-1/2 -translate-y-1/2 bg-cursor
                 rounded-full pointer-events-none mix-blend-difference drop-shadow-2xl"
    ></div>
  );
}

export default CustomCursor;
