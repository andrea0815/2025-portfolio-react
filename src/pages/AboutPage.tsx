import { useEffect } from "react";
import { useTerminalQueue } from "../stores/useTerminalQueue";
import terminalData from "../terminal.json";
function AboutPage() {

  const enqueueLine = useTerminalQueue((s) => s.enqueueLine);

  const loadText: string = terminalData.loaded[0]

  useEffect(() => {
    enqueueLine("");
    enqueueLine(loadText, "about");
  }, [])

  return (
    <div className='flex items-end'>
      <p>i come from Vienna and after my graphic design education i did a degree in Creative Computing to enhance my coding skills. mostly, i design and develop websites or apps, but i also love to illustrate or do photography. simply put  – i love to learn new skills and tools.</p>
    </div>
  );
}

export default AboutPage;
