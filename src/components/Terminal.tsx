import { useState, useEffect, useRef } from "react";
import type { Line } from "../stores/useTerminal";
import { useTerminalStore } from "../stores/useTerminal";
import TerminalLine from "../components/TerminalLine";

export default function Terminal() {
    const terminalRef = useRef<HTMLParagraphElement | null>(null);

    // Local states so Terminal re-renders ONLY when these change.
    const [queue, setQueue] = useState<Line[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);

    // The currently visible lines (immutable list)
    const [lines, setLines] = useState<Line[]>([]);

    // A registry of done-callbacks
    const doneCallbacks = useRef<Map<number, () => void>>(new Map());

    // ---------------------------------------
    // SUBSCRIPTIONS (no re-renders of Terminal)
    // ---------------------------------------
    useEffect(() => {
        const unsubQueue = useTerminalStore.subscribe(
            (s) => s.queue,
            (val) => setQueue(val)
        );

        const unsubProcessing = useTerminalStore.subscribe(
            (s) => s.isProcessing,
            (val) => setIsProcessing(val)
        );

        return () => {
            unsubQueue();
            unsubProcessing();
        };
    }, []);

    // Store actions (safe to select directly, no rerender risk)
    const dequeue = useTerminalStore.getState().dequeue;
    const setProcessingAction = useTerminalStore.getState().setProcessing;

    // ---------------------------------------
    // PROCESS QUEUE
    // ---------------------------------------
    useEffect(() => {
        if (queue.length === 0) return;
        if (isProcessing) return;

        const nextLine = queue[0];

        // Update visible lines without re-rendering older TerminalLines
        setLines((prev) => {
            const stablePrev = prev.map((l) => ({
                ...l,
                animateNow: false, // all older lines do NOT animate
            }));

            const newLine: Line = {
                ...nextLine,
                animateNow: true,
            };

            return [...stablePrev, newLine];
        });

        // Mark as processing in store (does not trigger rerender)
        setProcessingAction(true);

        // Wait for TerminalLine to signal completion
        const donePromise = new Promise<void>((resolve) => {
            doneCallbacks.current.set(nextLine.id, resolve);
        });

        // Run after DOM is ready
        requestAnimationFrame(async () => {
            await donePromise;
            dequeue();
            setProcessingAction(false);
        });
    }, [queue, isProcessing]);

    return (
        <div className="flex flex-1 items-end self-end mix-blend-difference">
            <p ref={terminalRef} className="terminal w-fit flex flex-col leading-[1.2em]">
                {lines.map((line) => (
                    <TerminalLine
                        key={line.id}
                        text={line.text}
                        animateNow={line.animateNow}
                        onDone={() => {
                            const cb = doneCallbacks.current.get(line.id);
                            cb?.();
                            doneCallbacks.current.delete(line.id);
                        }}
                    />
                ))}
            </p>
        </div>
    );
}
