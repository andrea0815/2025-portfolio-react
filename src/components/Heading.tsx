import { useLocation } from "react-router-dom";
import { useState, useRef, useEffect, useCallback } from "react";
import { useScramble } from "use-scramble";
import { SplitText } from "gsap/SplitText";
import gsap from "gsap";


function Heading() {
  const location = useLocation();
  const isHome = location.pathname === "/";
  const aboutTexts = ["hello :)", "hi :)", "heey :)", "heyho :)"];
  const homeTexts = ["creative developer", "illustrator", "writer", "graphic designer"];

  const [textList, setTextList] = useState<string[]>(isHome ? homeTexts : aboutTexts);
  const [textIndex, setTextIndex] = useState<number>(0);

  useEffect(() => {
    setTextList(isHome ? homeTexts : aboutTexts);
    setTextIndex(0);
  }, [isHome]);

  const containerRef = useRef<HTMLHeadingElement | null>(null);

  // hook usage
  const { ref: scrambleRef, replay: scrambleReplay } = useScramble({
    text: textList[textIndex],
    scramble: 4,       // number of times each char is randomized
    speed: 0.6,        // animation speed
    ignore: [" "],
    range: [33, 47],
    playOnMount: false, // so it does *not* auto start on mount
    overdrive: false
  });

  const handleClick = useCallback(() => {
    const newIndex = (textIndex + 1) % textList.length;
    setTextIndex(newIndex);

    // update the hook with new text and trigger it
    scrambleReplay();
  }, [textIndex, textList, scrambleReplay]);

  useEffect(() => {

    gsap.to(".header *", {
      "--wght": 900,
      duration: 2,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true
    });
  }, []);


  return (
    <div className='[grid-area:main] flex font-serif justify-center items-center z-10 pointer-events-none'>
      <h1
        ref={containerRef}
        onClick={handleClick}
        className='heading text-heading font-serif text-[7vw] text-center mix-blend-difference pointer-events-auto'
      >&#123;

        <span
          ref={scrambleRef}
          onMouseOver={scrambleReplay}
          className="heading__text font-serif text-heading text-[7vw]"
        >
          {textList[textIndex]}
        </span>

        &#125;
      </h1>
    </div>
  );
}

export default Heading;
