import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ScrambleText from "../components/base/ScrambleText";

import { useContentful } from "../stores/useContentful";
import { useTerminalStore } from "../stores/useTerminal";
import { usePageTransition } from "../stores/usePageTransition";
import { useTopicStore } from "../stores/useTopic";

import textData from "../texts.json";

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
  const clearAllFilters = useTopicStore((s) => s.clearAllFilters);


  const loadText: string = textData.loaded[0];
  const exitText: string = textData.exit[0];

  useEffect(() => {
    enqueueLine("");
    enqueueLine(loadText, "projects");


    // if (projects) {
    //   clearTerminalActives();
    //   enqueueLine("");

    //   for (const project of projects) {
    //     enqueueLine(project.title);
    //   }
    // }

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
      clearAllFilters();
      navigate(targetRoute);
    }
  }, [isTransitioning]);

  return (
    <>
    </>
  );
}

export default ProjectPage;
