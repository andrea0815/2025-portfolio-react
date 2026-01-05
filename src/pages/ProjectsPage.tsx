import { useEffect, useRef } from "react";
import { useNavigate, useMatch } from "react-router-dom";

import { useTerminalStore } from "../stores/useTerminal";
import { usePageTransition } from "../stores/usePageTransition";
import { useFilterStore } from "../stores/useFilter";

import textData from "../texts.json";
import ProjectInfoPanel from "../components/ProjectInfoPanel";

function ProjectPage() {

  const isDetailPage = !!useMatch("/projects/:slug");

  const navigate = useNavigate();
  const {
    isTransitioning,
    completeTransition,
    targetRoute,
  } = usePageTransition();
  const targetRouteRef = useRef<string | null>(targetRoute);

  const enqueueLine = useTerminalStore((s) => s.enqueueLine);
  const clearTerminalActives = useTerminalStore((s) => s.clearActives);
  const clearQueue = useTerminalStore((s) => s.clearQueue);
  const clearAllFilters = useFilterStore((s) => s.clearAllFilters);


  const loadText: string = textData.loaded[0];
  const exitText: string = textData.exit[0];

  useEffect(() => {
    targetRouteRef.current = targetRoute;
  }, [targetRoute]);

  useEffect(() => {
    enqueueLine("");
    enqueueLine(loadText, "projects");

    return () => {
      const tr = targetRouteRef.current;
      if (!tr) return;

      if (!tr.startsWith("/projects/")) {
        clearQueue();
        enqueueLine("");
        enqueueLine(exitText, "projects");
        clearTerminalActives();
      }
    };
  }, [])

  // PAGE TRANSITION

  useEffect(() => {
    completeTransition();
  }, [isTransitioning]);

  useEffect(() => {
    if (!isTransitioning && targetRoute) {
      if (!targetRoute.startsWith("/projects")) clearAllFilters();
      navigate(targetRoute);
    }
  }, [isTransitioning]);

  return (
    <>
      <ProjectInfoPanel />
    </>
  );
}

export default ProjectPage;
