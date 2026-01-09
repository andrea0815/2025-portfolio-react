import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useTerminalStore } from "../stores/useTerminal";
import { usePageTransition } from "../stores/usePageTransition";
import { useFilterStore } from "../stores/useFilter";
import { useCursorStore } from "../stores/useCursorStore";

import textData from "../texts.json";
import ProjectInfoPanel from "../components/ProjectInfoPanel";

function ProjectDetailPage() {

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
  const clearAllFilters = useFilterStore((s) => s.clearAllFilters);
  const currentProject = useFilterStore((s) => s.currentProject);
  const setDisplayText = useCursorStore((s) => s.setDisplayText);


  const loadText: string = textData.loaded[0];
  const exitText: string = textData.exit[0];

  useEffect(() => {

    const rawDate = currentProject?.date;
    const date =
      rawDate instanceof Date
        ? rawDate
        : rawDate
          ? new Date(rawDate)
          : null;
    const formattedDate = date ? formatMonthYear(date) : "date not defined";
    const tools = currentProject?.tools.map((tool: any) => `"${tool.fields.name}"`) || [];

    // enqueueLine("");
    // enqueueLine(loadText, `project: ${currentProject?.title.toUpperCase()}`);
    enqueueLine("");
    enqueueLine(`date: "${formattedDate}"`);
    enqueueLine("");
    enqueueLine("tools:");
    enqueueMultiple(tools ?? []);
    enqueueLine("");
    enqueueLine(`${currentProject?.description}`);

    setDisplayText("back")

    return () => {
      clearQueue();
      enqueueLine("");
      enqueueLine(exitText, `project: ${currentProject?.title.toUpperCase()}`);
      clearTerminalActives();
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

  function formatMonthYear(date: Date): string {
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${month}-${year}`;
  }

  return (
    <>
      <ProjectInfoPanel />
    </>
  );
}

export default ProjectDetailPage;
