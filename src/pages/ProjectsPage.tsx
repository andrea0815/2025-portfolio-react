import { useEffect } from "react";
import { useTerminalQueue } from "../stores/useTerminalQueue";
import terminalData from "../terminal.json";

function ProjectPage() {

  const enqueueLine = useTerminalQueue((s) => s.enqueueLine);
  const clearTerminalActives = useTerminalQueue((s) => s.clearActives);

  const loadText: string = terminalData.loaded[0]


  useEffect(() => {
    enqueueLine("");
    enqueueLine(loadText, "projects");

    return () => {
      clearTerminalActives();
    };
  }, [])

  return (
    <div>
      Project Page
    </div>
  );
}

export default ProjectPage;
