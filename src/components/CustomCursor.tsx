import { useEffect, useRef } from "react";
import gsap from "gsap";

function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    // setters for fast movement updates
    const setX = gsap.quickSetter(cursor, "x", "px");
    const setY = gsap.quickSetter(cursor, "y", "px");

    const move = (e: MouseEvent) => {      
      setX(e.clientX);
      setY(e.clientY);
    };

    // show/hide handlers
    const hideCursor = () => {
      gsap.to(cursor, { opacity: 0, duration: 0.2 });
    };

    const showCursor = () => {
      gsap.to(cursor, { opacity: 1, duration: 0.2 });
    };

    document.addEventListener("mousemove", move);
    document.addEventListener("mouseleave", hideCursor);
    document.addEventListener("mouseenter", showCursor);

    return () => {
      document.removeEventListener("mousemove", move);
      document.removeEventListener("mouseleave", hideCursor);
      document.removeEventListener("mouseenter", showCursor);
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className="customCursor fixed w-4 h-4 left-0 top-0 bg-text-highlight rounded-full pointer-events-none aspect-square mix-blend-difference flex justify-center items-center text-center"
    >
      Hold to load
    </div>
  );

}

export default CustomCursor;
