import { useEffect } from "react";
import { useTerminalQueue } from "../stores/useTerminalQueue";
import textData from "../texts.json";
import { usePageTransition } from "../stores/usePageTransition";
import { useNavigate } from "react-router-dom";
import ScrambleText from "../components/base/scrambleText";

function ProjectPage() {

  const navigate = useNavigate();
  const {
    isTransitioning,
    registerAnimation,
    finishAnimation,
    completeTransition,
    targetRoute,
  } = usePageTransition();

  const enqueueLine = useTerminalQueue((s) => s.enqueueLine);
  const clearTerminalActives = useTerminalQueue((s) => s.clearActives);

  const loadText: string = textData.loaded[0];
  const exitText: string = textData.exit[0];

  useEffect(() => {
    enqueueLine("");
    enqueueLine(loadText, "projects");

    return () => {
      enqueueLine("");
      enqueueLine(exitText, "projects");
      clearTerminalActives();
    };
  }, [])

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
      <ScrambleText text="projects page"></ScrambleText>
      Project Page
    </div>
  );
}

export default ProjectPage;
