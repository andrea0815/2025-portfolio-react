import { useEffect } from "react";
import { useTerminalQueue } from "../stores/useTerminalQueue";
import terminalData from "../terminal.json";
import { NavLink } from "react-router-dom";


function LandingPage() {

  const enqueueLine = useTerminalQueue((s) => s.enqueueLine);
  const enqueueMultiple = useTerminalQueue((s) => s.enqueueMultiple);
  const clearTerminalActives = useTerminalQueue((s) => s.clearActives);
  const landingText: string[] = terminalData.landing;
  const exitText: string = terminalData.exit[0]

  useEffect(() => {
    enqueueMultiple(landingText);
    setTimeout(() => {
      enqueueLine(terminalData.greeting[0], "creative developer");
    }, 2000)

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
