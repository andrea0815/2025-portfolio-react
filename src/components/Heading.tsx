import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useScramble } from "use-scramble";

import { useTerminalStore } from "../stores/useTerminal";
import { useFilterStore } from "../stores/useFilter";
import { useContentful } from "../stores/useContentful";

import textData from "../texts.json";


type HeadingMode = "landing" | "about" | "projects" | "other";

function Heading() {
  // stores
  const enqueueLine = useTerminalStore((s) => s.enqueueLine);
  const clearActives = useTerminalStore((s) => s.clearActives);
  const setCurrentTopic = useFilterStore((s) => s.setCurrentTopic);
  const currentTopic = useFilterStore((s) => s.currentTopic);

  // routing
  const location = useLocation();

  const mode: HeadingMode = useMemo(() => {
    const path = location.pathname;
    if (path === "/") return "landing";
    if (path.startsWith("/projects")) return "projects";
    if (path === "/about") return "about";
    return "other";
  }, [location.pathname]);

  const isProjects = mode === "projects";
  const isLanding = mode === "landing";
  const isAbout = mode === "about";

  // content
  const topics = useContentful((s) => s.topics) ?? [];
  const aboutHeading = textData.aboutHeading;

  /**
   * This list is what you cycle through when clicking the heading.
   * Important: it's derived from mode + data, so useMemo (not useState).
   */
  const textList: string[] = useMemo(() => {
    if (isLanding) return topics.map((t) => t.jobDescription);
    if (isAbout) return aboutHeading.map((t) => t.heading);
    return [];
  }, [isLanding, isAbout, topics, aboutHeading]);

  // index state
  const [textIndex, setTextIndex] = useState<number>(0);

  // when section changes, reset index
  useEffect(() => {
    setTextIndex(0);
  }, [mode]);

  /**
   * Display text inside the scramble span.
   * - landing: show currentTopic.jobDescription
   * - about: show the current heading
   */
  const displayText: string = useMemo(() => {
    if (isLanding) return currentTopic?.jobDescription ?? "";
    // fallback to "" if list is empty or index out of bounds
    return textList[textIndex] ?? "";
  }, [isLanding, currentTopic, textList, textIndex]);

  // refs
  const containerRef = useRef<HTMLHeadingElement | null>(null);
  const didIntroRef = useRef(false);


  // scramble
  const { ref: scrambleRef, replay } = useScramble({
    text: displayText,
    scramble: 4,
    speed: 0.5,
    ignore: [" "],
    playOnMount: false,
    overflow: true,
  });

  /**
   * Route-driven visibility:
   * projects => fade out + disable
   * otherwise => fade in + enable
   */
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    gsap.killTweensOf(el);

    // always ensure we have a known base state
    // (only do the hard reset once, on the very first run)
    if (!didIntroRef.current) {
      gsap.set(el, { opacity: 0, pointerEvents: "none" });
    }

    if (isProjects) {
      // fade out immediately on route changes
      gsap.to(el, {
        opacity: 0,
        duration: 1,
        ease: "power2.out",
        overwrite: "auto",
        onComplete: () => {
          el.style.pointerEvents = "none";
        },
      });
      return;
    }

    // fade in
    gsap.to(el, {
      opacity: 1,
      delay: 1,          // ✅ 2s only on very first intro
      duration: 1,
      ease: "power1.out",
      overwrite: "auto",
      onStart: () => {
        el.style.pointerEvents = "auto";
      },
      onComplete: () => {
        if (didIntroRef.current) {
          handleClick();
        }
        didIntroRef.current = true; // ✅ intro completed once
      },
    });
  }, [isProjects]);

  /**
   * About page: enqueue the current about text when entering about
   * and when the index changes.
   */
  useEffect(() => {
    if (!isAbout) return;

    const item = aboutHeading[textIndex];
    if (!item) return;

    enqueueLine(item.text, item.heading);
  }, [isAbout, textIndex, aboutHeading, enqueueLine]);

  /**
   * Landing: keep index in sync with currentTopic.
   * (Fixes your jobDescription vs name mismatch.)
   */
  useEffect(() => {
    if (!isLanding || !currentTopic) return;

    const idx = topics.findIndex((t) => t.jobDescription === currentTopic.jobDescription);
    if (idx >= 0) setTextIndex(idx);
  }, [isLanding, currentTopic, topics]);

  const handleClick = useCallback(() => {
    if (isProjects) return;
    if (textList.length === 0) return;

    clearActives();

    const nextIndex = (textIndex + 1) % textList.length;
    setTextIndex(nextIndex);

    if (isLanding) {
      const nextTopic = topics[nextIndex];
      if (nextTopic) setCurrentTopic(nextTopic);

      // terminal
      enqueueLine(textData.greeting[0], nextTopic?.jobDescription ?? "");
    } else if (isAbout) {
      const next = aboutHeading[nextIndex];
      if (next) enqueueLine(next.text, next.heading);
    } else {
      // optional: any default behavior for other pages
      enqueueLine(textData.greeting[0], textList[nextIndex] ?? "");
    }

    replay();
  }, [
    isProjects,
    textList,
    textIndex,
    isLanding,
    isAbout,
    topics,
    aboutHeading,
    clearActives,
    setCurrentTopic,
    enqueueLine,
    replay,
  ]);

  return (
    <div className="[grid-area:main] flex justify-center items-center z-10 pointer-events-none mix-blend-difference">
      <h1
        ref={containerRef}
        onClick={handleClick}
        className="heading hoverEl text-heading font-serif text-[7vw] text-center pointer-events-auto"
      >
        &#123;{" "}
        <span
          ref={scrambleRef}
          className="heading__text text-inherit font-[inherit] [font-size:inherit]"
        >
          {displayText}
        </span>{" "}
        &#125;
      </h1>
    </div>
  );
}

export default Heading;
