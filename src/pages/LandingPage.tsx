import { useEffect, useRef } from "react";

import { useTerminalStore } from "../stores/useTerminal";
import { usePageTransition } from "../stores/usePageTransition";
import { useNavigate } from "react-router-dom";

import textData from "../texts.json";

function LandingPage() {

  const navigate = useNavigate();
  const {
    isTransitioning,
    completeTransition,
    targetRoute,
  } = usePageTransition();
  const enqueueLine = useTerminalStore((s) => s.enqueueLine);
  const enqueueMultiple = useTerminalStore((s) => s.enqueueMultiple);
  const clearTerminalActives = useTerminalStore((s) => s.clearActives);
  const clearQueue = useTerminalStore((s) => s.clearQueue);
  const onPageLoadText: string[] = textData.onPageLoad;
  const loadText: string = textData.loaded[0];
  const exitText: string = textData.exit[0]
  const greetingText: string = textData.greeting[0]

  const hintIntervalRef = useRef<number | null>(null);

  useEffect(() => {

    const alreadyLoaded = sessionStorage.getItem("pageLoaded");

    if (!alreadyLoaded) {
      sessionStorage.setItem("pageLoaded", "true");
      enqueueMultiple(onPageLoadText);
    }

    enqueueLine("");
    enqueueLine(loadText, "landing");
    startHintInterval();

    return () => {
      clearQueue();
      enqueueLine("");
      enqueueLine(exitText, "landing");
      clearTerminalActives();
      stopHintInterval();
    };
  }, [])

  const startHintInterval = () => {
    if (hintIntervalRef.current !== null) return; // prevent stacking

    hintIntervalRef.current = window.setInterval(() => {
      print();
    }, 5000);

    function print() {
      clearTerminalActives();
      enqueueLine("");
      enqueueLine(">> Tip: Hold to load projects");
    }
  };

  const stopHintInterval = () => {
    if (hintIntervalRef.current === null) return;

    clearInterval(hintIntervalRef.current);
    hintIntervalRef.current = null;
  };

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        stopHintInterval();
      } else {
        startHintInterval();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  // PAGE TRANSITION

  useEffect(() => {
    completeTransition();
  }, [isTransitioning]);

  useEffect(() => {
    if (!isTransitioning && targetRoute) {
      navigate(targetRoute);
    }
  }, [isTransitioning]);

  return (
    <div>

    </div>
  );
}

export default LandingPage;
