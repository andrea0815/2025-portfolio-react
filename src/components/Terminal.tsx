import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import terminalData from "../terminal.json";
import { useTerminalQueue } from "../stores/useTerminalQueue";
import { useScramble } from "use-scramble";


export default function Terminal() {
    const terminalRef = useRef<HTMLParagraphElement | null>(null);

    // visible lines in the terminal
    const lines = useTerminalQueue((s) => s.lines);
    const addVisible = useTerminalQueue((s) => s.addVisible);

    // queue from zustand
    const queue = useTerminalQueue((s) => s.queue);
    const dequeue = useTerminalQueue((s) => s.dequeue);

    // actives from zustand
    const actives = useTerminalQueue((s) => s.actives);


    // static prefix
    const [staticText, setStaticText] = useState<string>(terminalData.static[0]);

    function animateLastLine(tl: gsap.core.Timeline) {
        const lineEls = terminalRef.current?.querySelectorAll(".line");
        if (!lineEls || lineEls.length === 0) return;

        const last = lineEls[lineEls.length - 1];
        const staticEl = last.querySelector(".static") as HTMLElement | null;
        const outputEl = last.querySelector(".output") as HTMLElement | null;

        if (!staticEl || !outputEl) return;

        const finalText = outputEl.getAttribute("data-final-text") ?? "";

        tl.to(staticEl, { opacity: 1, duration: 0 });

        tl.to(outputEl, {
            duration: 0.3,
            ease: "linear",
            scrambleText: {
                text: finalText,
                oldClass: "c",
                newClass: "",
                chars: "!+?%[$_:]#-{/*}",
            },
        });
    }

    // 👉 SEQUENCING: Process the queue one-by-one
    useEffect(() => {
        if (queue.length === 0) return;

        const nextLine = queue[0];
        addVisible(nextLine);

        requestAnimationFrame(() => {
            const tl = gsap.timeline({
                onComplete() {
                    dequeue();
                },
            });

            animateLastLine(tl);
        });
    }, [queue, dequeue]);

    useEffect(() => {
        function updateStaticText() {
            if (window.innerWidth < 640) {
                setStaticText(terminalData.static[1]);
            } else {
                setStaticText(terminalData.static[0]);
            }
        }

        updateStaticText();
        window.addEventListener("resize", updateStaticText);
        return () => window.removeEventListener("resize", updateStaticText);
    }, []);

    return (
        <div className="flex flex-1 items-end self-end mix-blend-difference">
            <p
                ref={terminalRef}
                className="terminal w-fit flex flex-col leading-[1.2em]"
            >
                {lines.map((line) => {
                    const resolved =
                        line.text.includes("BLANK") && line.input
                            ? line.text.replace("BLANK", line.input)
                            : line.text;

                    const isActive = actives.some((a) => a.id === line.id);


                    return (
                        <span key={line.id} className="line grid grid-cols-[auto_1fr] gap-2">
                            <span className="static opacity-0 flex-shrink-0">{staticText}</span>
                            <span
                                className={`output break-all opacity-100 ${isActive ? "active" : ""}`}
                                data-final-text={resolved}
                            ></span>
                        </span>
                    );
                })}
            </p>
        </div>
    );
}
