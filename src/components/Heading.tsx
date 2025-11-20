import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/all";
import { useGSAP } from '@gsap/react';


function Heading() {

  const location = useLocation();
  const isHome = location.pathname === "/";
  const aboutTexts = ["hello :)", "hi :)", "heey :)", "heyho :)"];
  const homeTexts = ["creative developer", "illustrator", "writer", "graphic designer"];

  const [textList, setTextList] = useState<string[]>(isHome ? homeTexts : aboutTexts);
  const [currentText, setSetCurrentText] = useState<string[]>(isHome ? homeTexts : aboutTexts);
  const [textIndex, setTextIndex] = useState<number>(0);
  // const [text, setText] = useState<string>(textList[textIndex]);

  useEffect(() => {
    // runs automatically when `isAbout` changes
    setTextList(isHome ? homeTexts : aboutTexts);
  }, [isHome]);

  const handleClick = (): void => {
    const newIndex = (textIndex + 1) % textList.length;
    gsap.to(".heading__text", {
      duration: 1,
      ease: "linear",
      scrambleText: {
        text: textList[newIndex],
        chars: "!+?%[$_:]#-{/*}",
      },
      onComplete: () => {
        variableAnimation();
      }
    });
    setTextIndex(newIndex);
  };

  useGSAP(() => {
    variableAnimation();
  })

  function variableAnimation(): void {
    const split = new SplitText(".heading", { type: "chars" });

    split.chars.forEach((char, i) => {
      gsap.to(char, {
        fontVariationSettings: "'wght' 900",
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
        delay: i * 0.07 // the magic part: each char is offset forever
      });
    });
  }

  return (
    <div className='[grid-area:main] flex justify-center items-center z-10 pointer-events-none'>
      <h1 onClick={handleClick} className='heading text-heading font-serif text-[7vw] text-center mix-blend-difference  pointer-events-auto'>
        <span className="font-serif text-heading text-[7vw]">
          &#123;
        </span>
        <span className="heading__text font-serif text-heading text-[7vw]" data-text={currentText}>
          Creative Developer
        </span>
        <span className="font-serif text-heading text-[7vw]">
          &#125;
        </span>
      </h1>
      {/* <canvas className='canvas-heading bg-yellow pointer-events-auto w-full h-1/2'></canvas> */}
    </div>
  );
}

export default Heading;
