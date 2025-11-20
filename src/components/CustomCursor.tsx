import { useEffect, useRef } from "react";
import gsap from "gsap";

function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    // QuickSetter for maximum performance
    const setX = gsap.quickSetter(cursor, "x", "px");
    const setY = gsap.quickSetter(cursor, "y", "px");

    const move = (e: MouseEvent) => {
      setX(e.clientX);
      setY(e.clientY);
    };

    window.addEventListener("mousemove", move);

    return () => window.removeEventListener("mousemove", move);
  }, []);

  return (
    <div
      ref={cursorRef}
      className="customCursor fixed left-0 top-0 w-5 h-5 rounded-full bg-text-highlight pointer-events-none mix-blend-difference"
    />
  );
}

export default CustomCursor;
