import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useTerminalStore } from "../stores/useTerminal";
import { usePageTransition } from "../stores/usePageTransition";
import { useFilterStore } from "../stores/useFilter";
import { useCursorStore } from "../stores/useCursorStore";

import textData from "../texts.json";
import PortraitImage from "../components/PortraitImage";

function AboutPage() {

  const navigate = useNavigate();
  const {
    isTransitioning,
    targetRoute,
  } = usePageTransition();

  const enqueueLine = useTerminalStore(s => s.enqueueLine);
  const clearTerminalActives = useTerminalStore(s => s.clearActives);
  const clearQueue = useTerminalStore((s) => s.clearQueue);
  const clearAllFilters = useFilterStore((s) => s.clearAllFilters);
  const setDisplayText = useCursorStore((s) => s.setDisplayText);

  // Initial load effect
  useEffect(() => {
    enqueueLine("");
    enqueueLine(textData.loaded[0], "about");

    setDisplayText("")

    return () => {
      clearQueue();
      enqueueLine("");
      enqueueLine(textData.exit[0], "about");
      clearTerminalActives();
    };
  }, []);

  // ON ANIMATION FINISH, NAVIGATE
  useEffect(() => {
    if (!isTransitioning && targetRoute) {
      clearAllFilters();
      navigate(targetRoute);
    }
  }, [isTransitioning]);

  return (
    <div className="w-full h-full flex justify-center items-center">
      <PortraitImage />
    </div>
  );
}


export default AboutPage;
