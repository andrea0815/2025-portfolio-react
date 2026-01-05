import { useEffect, useState } from "react";
import { memo } from "react";
import { useScramble } from "use-scramble";
import { useTerminalStore } from "../stores/useTerminal";
import textData from "../texts.json";

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
    const [staticText, setStaticText] = useState<string>(textData.static[0]);
    const [isActive, setIsActive] = useState(true);

    const { ref: outputRef, replay } = useScramble({
        text,
        scramble: 3,
        speed: 1,
        overdrive: false,

        onAnimationEnd() {
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

            if (window.innerWidth < 1200) {
                setStaticText(textData.static[1]);
            } else {
                setStaticText(textData.static[0]);
            }
        }

        updateStaticText();
        window.addEventListener("resize", updateStaticText);
        return () => window.removeEventListener("resize", updateStaticText);
    }, []);

    useEffect(() => {
        const unsub = useTerminalStore.subscribe(
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
                className={`output opacity-100 ${isActive ? "active" : ""}`}
            ></span>
        </span>
    );
}

export default memo(TerminalLine);
