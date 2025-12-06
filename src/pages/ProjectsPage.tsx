import { useEffect } from "react";
import { useTerminalStore } from "../stores/useTerminal";
import textData from "../texts.json";
import { usePageTransition } from "../stores/usePageTransition";
import { useNavigate } from "react-router-dom";
import { useContentful } from "../stores/useContentful";
import ScrambleText from "../components/base/ScrambleText";

function ProjectPage() {

  const navigate = useNavigate();
  const {
    isTransitioning,
    registerAnimation,
    finishAnimation,
    completeTransition,
    targetRoute,
  } = usePageTransition();
  const projects = useContentful((s) => s.projects);

  const enqueueLine = useTerminalStore((s) => s.enqueueLine);
  const clearTerminalActives = useTerminalStore((s) => s.clearActives);
  const clearQueue = useTerminalStore((s) => s.clearQueue);

  const loadText: string = textData.loaded[0];
  const exitText: string = textData.exit[0];

  useEffect(() => {
    enqueueLine("");
    enqueueLine(loadText, "projects");


    if (projects) {
      clearTerminalActives();
      enqueueLine(">> load projects");
      enqueueLine("");

      for (const project of projects) {
        enqueueLine(project.title);
      }
    }

    return () => {
      clearQueue();
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
