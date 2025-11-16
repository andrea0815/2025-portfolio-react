import gsap from "gsap";
import { useEffect, useRef } from "react";
import { useTerminalQueue } from "../stores/useTerminalQueue";
import { useGSAP } from "@gsap/react";
import terminalData from "../terminal.json";

function AboutPage() {

  const aboutText = useRef<HTMLParagraphElement | null>(null);

  const enqueueLine = useTerminalQueue((s) => s.enqueueLine);
  const clearTerminalActives = useTerminalQueue((s) => s.clearActives);


  const loadText: string = terminalData.loaded[0]
  const exitText: string = terminalData.exit[0]

  useEffect(() => {
    enqueueLine("");
    enqueueLine(loadText, "about");

    return () => {
      enqueueLine("");
      enqueueLine(exitText, "about");
      clearTerminalActives();
    };
  }, [])

  useGSAP(
    () => {
      if (!aboutText.current) return;

      const originalText: string = aboutText.current.innerHTML;

      gsap.fromTo(
        aboutText.current,
        {
          scrambleText: { text: "" },
        },
        {
          duration: 5,
          ease: "linear",
          scrambleText: {
            text: originalText,
            chars: "!+?%[$_:]#-{/*}",
          },
        }
      );
    },
    { dependencies: [], scope: aboutText } // best practice
  );


  return (
    <div className='flex items-end'>
      <p ref={aboutText}>i come from Vienna and after my graphic design education i did a degree in Creative Computing to enhance my coding skills. mostly, i design and develop websites or apps, but i also love to illustrate or do photography. simply put  – i love to learn new skills and tools.</p>
    </div>
  );
}

export default AboutPage;
