import { useEffect, useState, useRef } from "react";
import { useTerminalQueue } from "../stores/useTerminalQueue";
import textData from "../texts.json";
import { useScramble } from "use-scramble";
import { usePageTransition } from "../stores/usePageTransition";
import { useNavigate } from "react-router-dom";


function AboutPage() {

  const navigate = useNavigate();
  const {
    isTransitioning,
    registerAnimation,
    finishAnimation,
    targetRoute,
  } = usePageTransition();

  const enqueueLine = useTerminalQueue(s => s.enqueueLine);
  const clearTerminalActives = useTerminalQueue(s => s.clearActives);

  const aboutText =
    "i come from Vienna and after my graphic design education i did a degree in Creative Computing to enhance my coding skills. mostly, i design and develop websites or apps, but i also love to illustrate or do photography. simply put – i love to learn new skills and tools.";

  const [output, setOutput] = useState(aboutText);

  // --- GUARDS ---
  const exitStarted = useRef(false);
  const animationFinished = useRef(false);

  const { ref: scrambleRef, replay: replayScramble } = useScramble({
    text: output,
    scramble: 4,
    speed: 3,
    ignore: [" "],
    overdrive: true,
    range: [33, 47],
    onAnimationEnd: () => {
      if (!exitStarted.current) return;     // ignore initial animation
      if (animationFinished.current) return;

      animationFinished.current = true;
      finishAnimation();                     // call once
    },
  });

  // Initial load effect
  useEffect(() => {
    enqueueLine("");
    enqueueLine(textData.loaded[0], "about");

    replayScramble();

    return () => {
      enqueueLine("");
      enqueueLine(textData.exit[0], "about");
      clearTerminalActives();
    };
  }, []);

  // PAGE TRANSITION

  useEffect(() => {
    if (!isTransitioning || exitStarted.current) return;

    exitStarted.current = true;

    registerAnimation();            // only once

    setOutput("");                  // start exit
    replayScramble();

  }, [isTransitioning]);

  // Navigation when finished
  useEffect(() => {
    if (!isTransitioning && targetRoute) {
      navigate(targetRoute);
    }
  }, [isTransitioning]);

  return (
    <div className="w-full">
      <p ref={scrambleRef}></p>
    </div>
  );
}


export default AboutPage;
