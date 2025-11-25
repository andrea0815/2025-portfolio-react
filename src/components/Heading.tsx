import { useLocation } from "react-router-dom";
import { useState, useRef, useEffect, useCallback } from "react";
import { useScramble } from "use-scramble";
import { useTerminalQueue } from "../stores/useTerminalQueue";
import textData from "../texts.json";
// import { ScrambleTextPlugin } from "gsap/all";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";


function Heading() {
  const location = useLocation();
  const isHome = location.pathname === "/";
  const aboutTexts = ["hello :)", "hi :)", "heey :)", "heyho :)"];
  const homeTexts = textData.sections;

  const enqueueLine = useTerminalQueue((s) => s.enqueueLine);
  const clearActives = useTerminalQueue((s) => s.clearActives);

  const [textList, setTextList] = useState<string[]>(isHome ? homeTexts : aboutTexts);
  const [textIndex, setTextIndex] = useState<number>(0);

  useEffect(() => {
    setTextList(isHome ? homeTexts : aboutTexts);
    setTextIndex(0);
  }, [isHome]);

  const containerRef = useRef<HTMLHeadingElement | null>(null);

  const { ref: scrambleRef, replay } = useScramble({
    text: textList[textIndex],
    scramble: 4,
    speed: 1,
    ignore: [" "],
    playOnMount: false,
    overflow: false,
  });

  useGSAP(() => {
    const tl = gsap.timeline();

    tl.from(".heading", {
      ease: "power1.inOut",
      delay: 0.5,
      duration: 0.5,
      opacity: 0,
    })
    tl.add(() => {
      replay();
    }, "+=0.2");
  }, []);

  const handleClick = useCallback(() => {
    clearActives();

    const newIndex = (textIndex + 1) % textList.length;
    setTextIndex(newIndex);

    replay();

    enqueueLine(textData.greeting[0], textList[newIndex]);
  }, [textIndex, textList]);


  return (
    <div className='[grid-area:main] flex justify-center items-center z-10 pointer-events-none mix-blend-difference'>
      <h1
        ref={containerRef}
        onClick={handleClick}
        className='heading text-heading font-serif text-[7vw] text-center  pointer-events-auto'
      >&#123; <span
        ref={scrambleRef}
        className="heading__text text-inherit font-[inherit] [font-size:inherit]">
          {textList[textIndex]}
        </span> &#125;
      </h1>
    </div>
  );
}

export default Heading;
