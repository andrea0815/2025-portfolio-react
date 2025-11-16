import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import gsap from "gsap";


function Heading() {

  const location = useLocation();
  const isHome = location.pathname === "/";
  const aboutTexts = ["hello :)", "hi :)", "heey :)", "heyho :)"];
  const homeTexts = ["creative developer", "illustrator", "writer", "graphic designer"];

  const [textList, setTextList] = useState<string[]>(isHome ? homeTexts : aboutTexts);
  const [textIndex, setTextIndex] = useState<number>(0);
  const [text, setText] = useState<string>(textList[textIndex]);

  useEffect(() => {
    // runs automatically when `isAbout` changes
    setTextList(isHome ? homeTexts : aboutTexts);
  }, [isHome]);

  const handleClick = (): void => {
    const newIndex = (textIndex + 1) % textList.length;
    gsap.to(".heading", {
      duration: 1,
      ease: "linear",
      scrambleText: {
        text: textList[newIndex],
        chars: "!+?%[$_:]#-{/*}",
      }
    });
    setTextIndex(newIndex);
  };

  return (
    <div className='[grid-area:main] flex justify-center items-center z-10 pointer-events-none'>
      <h1 onClick={handleClick} className='text-heading font-serif text-[7vw] text-center mix-blend-difference  pointer-events-auto'>&#123; 
        <span className="heading font-serif text-heading text-[7vw]">
          {text}
        </span>
         &#125;
      </h1>
      {/* <canvas className='canvas-heading bg-yellow pointer-events-auto w-full h-1/2'></canvas> */}
    </div>
  );
}

export default Heading;
