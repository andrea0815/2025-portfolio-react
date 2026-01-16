import { useEffect, useRef, useState } from "react";
import { memo } from "react";
import gsap from "gsap";
import SplitText from "gsap/SplitText";
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

    const outputRef = useRef<HTMLSpanElement | null>(null);
    const splitRef = useRef<SplitText | null>(null);
    const tweenRef = useRef<gsap.core.Tween | gsap.core.Timeline | null>(null);

    const replay = () => {
        if (!outputRef.current) return;

        const text = outputRef.current.textContent ?? "";
        const isLongText = text.length > 60;
        const STAGGER = isLongText ? 0.05 : 0.09;
        const DURATION = isLongText ? 0.05 : 0.15;

        // cleanup
        tweenRef.current?.kill();
        splitRef.current?.revert();

        gsap.set(outputRef.current, { opacity: 1 });

        splitRef.current = new SplitText(outputRef.current, { type: "words" });
        const words = splitRef.current.words;

        const finish = () => {
            splitRef.current?.revert();
            splitRef.current = null;
            tweenRef.current = null;

            setHasAnimated(true);
            onDone();
        };

        // no words, just run a dummy animation
        if (!words?.length) {
            tweenRef.current = gsap.delayedCall(DURATION, finish);
            return;
        }

        gsap.set(words, { opacity: 0.3, y: 0 });

        tweenRef.current = gsap.to(words, {
            opacity: 1,
            y: 0,
            duration: DURATION,
            delay: 0.1,
            ease: "power1.inOut",
            stagger: STAGGER,
            onComplete: finish,
        });
    };


    useEffect(() => {
        return () => {
            tweenRef.current?.kill();
            splitRef.current?.revert();
        };
    }, []);



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
        <span className="line grid grid-cols-[auto_1fr] gap-2 no-select ">
            <span className="static flex-shrink-0">{staticText}</span>
            <span
                ref={outputRef}
                className={`output whitespace-pre-line ${isActive ? "active" : ""}`}
            >{text}</span>
        </span>
    );
}

export default memo(TerminalLine);
