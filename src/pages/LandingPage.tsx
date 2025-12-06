import { useEffect, useRef } from "react";
import { useTerminalStore } from "../stores/useTerminal";
import textData from "../texts.json";
import { NavLink } from "react-router-dom";
import { usePageTransition } from "../stores/usePageTransition";
import { useNavigate } from "react-router-dom";

function LandingPage() {

  const firstLoad = useRef(true);

  const navigate = useNavigate();
  const {
    isTransitioning,
    registerAnimation,
    finishAnimation,
    completeTransition,
    requestTransition,
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

  useEffect(() => {

    const alreadyLoaded = sessionStorage.getItem("pageLoaded");

    console.log(() => {alreadyLoaded ? true : false});
    
    if (!alreadyLoaded) {
      sessionStorage.setItem("pageLoaded", "true");
      enqueueMultiple(onPageLoadText);
    }

    enqueueLine("");
    enqueueLine(loadText, "landing");
    enqueueLine("");
    enqueueLine(greetingText, "creative developer");

    return () => {
      clearQueue();
      enqueueLine("");
      enqueueLine(exitText, "landing");
      clearTerminalActives();
    };
  }, [])

  function handleClick(
    e: React.MouseEvent<HTMLAnchorElement>,
    to: string
  ) {
    e.preventDefault();
    if (location.pathname === to) return;
    // replayScramble();
    requestTransition(to);
  }

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
      Landing Page
      <NavLink
        to="/projects"
        onClick={(e) => handleClick(e, "/projects")}
      >&lt;projects&gt;</NavLink>
    </div>
  );
}

export default LandingPage;
