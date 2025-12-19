import { useState, useRef, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { useScramble } from "use-scramble";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

import { useTerminalStore } from "../stores/useTerminal";
import { useTopicStore } from "../stores/useTopic";
import { useContentful } from "../stores/useContentful";

import textData from "../texts.json";


function Heading() {
  // stores
  const enqueueLine = useTerminalStore((s) => s.enqueueLine);
  const clearActives = useTerminalStore((s) => s.clearActives);
  const setCurrentTopic = useTopicStore((s) => s.setCurrentTopic);

  // navigation logic
  const location = useLocation();
  const isLanding = location.pathname === "/";
  const isProjects = location.pathname === "/projects";
  const isAbout = location.pathname === "/about";

  const currentTopic = useTopicStore((s) => s.currentTopic);

  // Array Lists
  const topics = useContentful((s) => s.topics);
  const landingTexts = topics?.map((t) => t.name) || [];
  const aboutHeading = textData.aboutHeading;

  // states
  const [hasMounted, setHasMounted] = useState(false);
  const [currentTextList, setCurrentTextList] = useState<string[]>(isLanding ? landingTexts : aboutHeading.map(t => t.heading));
  const [textIndex, setTextIndex] = useState<number>(0);

  // naviagtion logic
  useEffect(() => {
    if (isLanding) {
      setCurrentTextList(landingTexts)
    } else if (isAbout) {
      setCurrentTextList(aboutHeading.map(t => t.heading))
    }
    setTextIndex(0);
  }, [isLanding, isProjects]);

  // animation and scramble logic
  const containerRef = useRef<HTMLHeadingElement | null>(null);
  const { ref: scrambleRef, replay } = useScramble({
    text: currentTextList[textIndex],
    scramble: 4,
    speed: 0.5,
    ignore: [" "],
    playOnMount: false,
    overflow: true,
  });


  useGSAP(() => {
    const el = containerRef.current;
    if (!el) return;

    if (!isProjects) {

      const tl = gsap.timeline();

      tl.from(el, {
        ease: "power1.inOut",
        delay: 0.5,
        duration: 1,
        opacity: 0,
      })
      tl.add(() => {
        replay();
      }, "+=0.2");

    } else {
      el.style.opacity = "0";
    }
  }, []);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    if (!hasMounted) return;

    if (isProjects) {
      // fade out
      gsap.to(el, {
        opacity: 0,
        duration: 1,
        ease: "power2.out",
        pointerEvents: "none"
      });
    } else {
      // fade in
      gsap.to(el, {
        opacity: 1,
        duration: 1,
        ease: "power2.out",
        pointerEvents: "auto"
      });
    }
  }, [isProjects]);

  useEffect(() => {
    if (!isAbout) return;
    enqueueLine(aboutHeading[textIndex].text, currentTextList[0]);
  }, [isAbout])

  const handleClick = useCallback(() => {
    if (!isProjects) {

      clearActives();

      const newIndex = (textIndex + 1) % currentTextList.length;
      setTextIndex(newIndex);

      // if current section is landing, update the new topic
      if (isLanding) {
        setCurrentTopic(topics[newIndex]);
      }

      replay();
      isAbout ? enqueueLine(aboutHeading[newIndex].text, currentTextList[newIndex]) : enqueueLine(textData.greeting[0], currentTextList[newIndex]);
    }
  }, [textIndex, currentTextList]);

  useEffect(() => {
    if (!isLanding || !currentTopic) return;

    const newIndex = landingTexts.findIndex(t => t === currentTopic.name);
    if (newIndex !== -1) setTextIndex(newIndex);
  }, [currentTopic, isLanding, landingTexts]);


  return (
    <div className='[grid-area:main] flex justify-center items-center z-10 pointer-events-none mix-blend-difference'>
      <h1
        ref={containerRef}
        onClick={handleClick}
        className='heading hoverEl text-heading font-serif text-[7vw] text-center pointer-events-auto'
      >&#123; <span
        ref={scrambleRef}
        className="heading__text text-inherit font-[inherit] [font-size:inherit]">
          {isLanding
            ? currentTopic?.name || ""
            : currentTextList[textIndex]}
        </span> &#125;
      </h1>
    </div>
  );
}

export default Heading;
