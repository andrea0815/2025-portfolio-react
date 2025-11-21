import { useEffect, useState } from "react";
import { memo } from "react";
import { useScramble } from "use-scramble";
import terminalData from "../terminal.json";
import type { Line } from "../stores/useTerminalQueue";
import { useTerminalQueue } from "../stores/useTerminalQueue";
import { shallow } from "zustand/shallow";


type LineProps = {
    text: string;
    animateNow: boolean
    onDone: () => void;
};

function TerminalLine({
    text,
    animateNow,
    onDone,
}: LineProps) {

    const [hasAnimated, setHasAnimated] = useState(false);
    const [staticText, setStaticText] = useState<string>(terminalData.static[0]);

    const clearSignal = useTerminalQueue(s => s.clearActiveSignal);

    const [isActive, setIsActive] = useState(true);

    const { ref: outputRef, replay } = useScramble({
        text,
        scramble: 4,
        speed: 0.7,
        overdrive: true,

        onAnimationStart() {
            console.log("Scramble started:", text);
        },

        onAnimationEnd() {
            console.log("Scramble ended:", text);
            setHasAnimated(true);
            onDone();
        }
    });

    useEffect(() => {
        if (!animateNow) return;
        if (hasAnimated) return;

        replay();
    }, [animateNow, hasAnimated]);

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

    useEffect(() => {
        const unsub = useTerminalQueue.subscribe(
            s => s.clearActiveSignal,
            () => {
                setIsActive(false);
            }
        );
        return () => unsub();
    }, []);

    return (
        <span className="line grid grid-cols-[auto_1fr] gap-2">
            <span className="static flex-shrink-0">{staticText}</span>
            <span
                ref={outputRef}
                className={`output break-all opacity-100 ${isActive ? "active" : ""}`}
            ></span>
        </span>
    );
}

export default memo(TerminalLine);
