import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

import terminalData from "../terminal.json";

type Line = {
  id: number;
  text: string;
  input?: string | null;
};

function Terminal() {
  const terminalRef = useRef<HTMLParagraphElement | null>(null);

  const [staticText, setStaticText] = useState<string>(terminalData.static[0]);
  const [lines, setLines] = useState<Line[]>([]);

  // Add a line to state instead of creating DOM manually
  function addLine(text: string, input: string | null = null) {
    setLines((prev) => [
      ...prev,
      { id: Date.now() + Math.random(), text, input },
    ]);
  }

  function addMultipleLines(
    lines: string[] | string,
    inputs?: string[] | string | null
  ) {
    if (typeof lines === "string" && Array.isArray(inputs)) {
      inputs.forEach((inp) => addLine(lines, inp));
    } else if (Array.isArray(lines) && typeof inputs === "string") {
      lines.forEach((line) => addLine(line, inputs));
    } else if (Array.isArray(lines) && Array.isArray(inputs)) {
      lines.forEach((line, i) => addLine(line, inputs[i]));
    } else if (Array.isArray(lines) && inputs === null) {
      lines.forEach((line) => addLine(line, null));
    }
  }

  // Initial load
  useEffect(() => {
    addLine(terminalData.greeting[0], "illustrator");
    addLine(terminalData.greeting[0], "creative developer");
    addMultipleLines(terminalData.workExperience);

    // Handle static text switching
    const updateStatic = () => {
      if (window.innerWidth < 640) {
        setStaticText(terminalData.static[1]);
      } else {
        setStaticText(terminalData.static[0]);
      }
    };

    updateStatic();
    window.addEventListener("resize", updateStatic);

    return () => window.removeEventListener("resize", updateStatic);
  }, []);

  // Animate every time lines change
  useGSAP(
    () => {
      const elements = terminalRef.current?.querySelectorAll(".output") ?? [];

      elements.forEach((el) => {
        const text = el.getAttribute("data-final-text") ?? "";

        gsap.to(el, {
          duration: 2,
          scrambleText: { text, chars: "!?%$_:[]{}/#*" },
        });
      });
    },
    { dependencies: [lines] }
  );

  return (
    <div className="[grid-area:main] self-end mix-blend-difference">
      <p ref={terminalRef} className="terminal w-fit flex flex-col leading-[1.2em]">
        {lines.map((line) => {
          const resolved = line.text.includes("BLANK") && line.input
            ? line.text.replace("BLANK", line.input)
            : line.text;

          return (
            <span key={line.id} className="line">
              <span className="static">{staticText}</span>
              <span className="output" data-final-text={resolved}></span>
            </span>
          );
        })}
      </p>
    </div>
  );
}

export default Terminal;
