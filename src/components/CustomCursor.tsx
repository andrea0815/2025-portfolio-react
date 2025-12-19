import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useLocation } from "react-router-dom";

import { usePageTransition } from "../stores/usePageTransition";

function CustomCursor() {
  
  const requestTransition = usePageTransition((s) => s.requestTransition);

  const location = useLocation();
  const isLanding = location.pathname === "/";

  const isLandingRef = useRef(isLanding);
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);
  const releasedRef = useRef(false);


  useEffect(() => {
    const cursor = cursorRef.current;
    const ring = ringRef.current;

    if (!cursor || !ring) return;

    // position both cursor + ring
    const setX = gsap.quickSetter(cursor, "x", "px");
    const setY = gsap.quickSetter(cursor, "y", "px");
    const setXRing = gsap.quickSetter(ring, "x", "px");
    const setYRing = gsap.quickSetter(ring, "y", "px");

    const move = (e: MouseEvent) => {
      setX(e.clientX);
      setY(e.clientY);
      setXRing(e.clientX);
      setYRing(e.clientY);
    };

    // hover grow/shrink (optional)
    const grow = () => {
      gsap.to(cursor, { scale: 3, duration: 0.25, ease: "power3.out" });
    };

    const shrink = () => {
      gsap.to(cursor, { scale: 1, duration: 0.25, ease: "power3.out" });
    };

    const pressTween = gsap.to(cursor, {
      scale: 5,
      duration: 2,
      ease: "power3.out",
      paused: true,
      onComplete: () => {
        // navigate only if still holding
        if (!releasedRef.current) {
          requestTransition("/projects");
          handleUp();
        }
      }
    });

    const handleDown = () => {
      if (!isLandingRef.current) return;
      releasedRef.current = false;
      gsap.to(ring, { opacity: 0.4, duration: 0.2, ease: "power1.out" });
      pressTween.timeScale(1).play();
    };

    const handleUp = () => {
      releasedRef.current = true;
      gsap.to(ring, { opacity: 0, duration: 0.5, ease: "power2.out" });
      pressTween.timeScale(2).reverse();
    };

    // Listeners
    document.addEventListener("mousemove", move);
    document.addEventListener("mousedown", handleDown);
    document.addEventListener("mouseup", handleUp);

    const attachListeners = (nodes: NodeListOf<Element>) => {
      nodes.forEach((el) => {
        el.addEventListener("mouseenter", grow);
        el.addEventListener("mouseleave", shrink);
      });
    };

    const detachListeners = (nodes: NodeListOf<Element>) => {
      nodes.forEach((el) => {
        el.removeEventListener("mouseenter", grow);
        el.removeEventListener("mouseleave", shrink);
      });
    };

    let hoverEls = document.querySelectorAll(".hoverEl");
    attachListeners(hoverEls);

    const observer = new MutationObserver(() => {
      const newEls = document.querySelectorAll(".hoverEl");

      detachListeners(hoverEls);
      attachListeners(newEls);

      hoverEls = newEls;
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });



    return () => {
      document.removeEventListener("mousemove", move);
      document.removeEventListener("mousedown", handleDown);
      document.removeEventListener("mouseup", handleUp);
      detachListeners(hoverEls);
      observer.disconnect();
      pressTween.kill();
    };
  }, []);

  useEffect(() => {
    isLandingRef.current = isLanding;
  }, [isLanding]);

  return (
    <>
      <div
        ref={cursorRef}
        className="cursorDot fixed z-[999999] w-4 h-4 left-0 top-0
        -translate-x-1/2 -translate-y-1/2 bg-cursor
        rounded-full pointer-events-none mix-blend-difference"
      ></div>

      <div
        ref={ringRef}
        className="cursorRing fixed z-[999998] w-[75px] h-[75px] left-0 top-0
  -translate-x-1/2 -translate-y-1/2 border border-white-20
  rounded-full opacity-0 pointer-events-none"
      ></div>
    </>
  );
}

export default CustomCursor;
