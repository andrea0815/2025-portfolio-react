import { useEffect } from "react";
import { useTerminalQueue } from "../stores/useTerminalQueue";
import terminalData from "../terminal.json";
import { NavLink } from "react-router-dom";


function LandingPage() {

  const enqueueLine = useTerminalQueue((s) => s.enqueueLine);

  useEffect(() => {
    for (let index = 0; index < 20; index++) {
      enqueueLine("");
    }
    enqueueLine(terminalData.greeting[0], "creative developer");
  }, [])

  return (
    <div>
      Landing Page
      <NavLink to="/projects">&lt;projects&gt;</NavLink>

    </div>
  );
}

export default LandingPage;
