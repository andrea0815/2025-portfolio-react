import { useEffect, useRef, useCallback } from "react";

export type UseIdleActiveProjectsArgs<T> = {
    enabled: boolean;
    delayMs?: number;
    getItem: (index: number) => T | undefined;
    onIdleSelect: (item: T, index: number) => void;
}

export function useIdleActiveProject<T>({
    enabled,
    delayMs = 1000,
    getItem,
    onIdleSelect,
}: UseIdleActiveProjectsArgs<T>) {

    const activeIndexRef = useRef<number | null>(null);
    const timerRef = useRef<number | null>(null);

    const setIndex = useCallback(
        (index: number) => {
            if (index === activeIndexRef.current) return;
            activeIndexRef.current = index;

            if (timerRef.current) {
                window.clearTimeout(timerRef.current);
                timerRef.current = null;
            }

            timerRef.current = window.setTimeout(() => {
                if (!enabled) return;
                const item = getItem(index);
                if (!item) return;
                onIdleSelect(item, index);
            }, delayMs);
        },
        [delayMs, enabled, getItem, onIdleSelect]
    );

    // cleanup on unmount
    useEffect(() => {
        return () => {
            if (timerRef.current) window.clearTimeout(timerRef.current);
        }
    }, [])

    return setIndex;
}