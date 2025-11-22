import { useEffect } from "react";
import { useTerminalQueue } from "../stores/useTerminalQueue";
import textData from "../texts.json";
import { NavLink } from "react-router-dom";

function LandingPage() {

  const enqueueLine = useTerminalQueue((s) => s.enqueueLine);
  const enqueueMultiple = useTerminalQueue((s) => s.enqueueMultiple);
  const clearTerminalActives = useTerminalQueue((s) => s.clearActives);
  const loadText: string = textData.loaded[0];
  const exitText: string = textData.exit[0]

  useEffect(() => {
    enqueueLine("");
    enqueueLine(loadText, "landing");
    enqueueLine("");
    enqueueLine(textData.greeting[0], "creative developer");

    return () => {
      enqueueLine("");
      enqueueLine(exitText, "landing");
      clearTerminalActives();
    };
  }, [])



  return (
    <div>
      Landing Page
      <NavLink to="/projects">&lt;projects&gt;</NavLink>
    </div>
  );
}

export default LandingPage;
