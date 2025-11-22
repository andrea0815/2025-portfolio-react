import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";


export type Line = {
  id: number;
  text: string;
  animateNow: boolean;
  input?: string | null;
};

type TerminalQueueStore = {
  queue: Line[];
  lineCounter: number;
  isProcessing: boolean;
  clearActiveSignal: number,

  setProcessing: (value: boolean) => void;
  enqueueLine: (text: string, input?: string | null) => void;
  enqueueMultiple: (
    lines: string[] | string,
    input?: string[] | string | null
  ) => void;
  dequeue: () => void;
  clearActives: () => void;
};

export const useTerminalQueue = create(
  subscribeWithSelector<TerminalQueueStore>((set, get) => ({
    queue: [],
    actives: [],
    lineCounter: 0,
    isProcessing: false,
    clearActiveSignal: 0,

    clearActives: () =>
      set(state => ({
        clearActiveSignal: state.clearActiveSignal + 1
      })),

    setProcessing: (value) => set(() => ({ isProcessing: value })),


    enqueueLine: (text, input = null) => {
      const nextId = get().lineCounter + 1;      
      
      const resolved = text.includes("BLANK") && input
      ? text.replace("BLANK", input)
      : text;
      
      const line: Line = {
        id: nextId,
        text: resolved,
        animateNow: true,
        input: null,
      };

      set((state) => ({
        lineCounter: nextId,
        queue: [...state.queue, line],
      }));
    },

    enqueueMultiple: (lines, input = null) => {
      const newLines: Line[] = [];
      let counter = get().lineCounter;

      if (typeof lines === "string" && Array.isArray(input)) {
        input.forEach((inp) =>
          newLines.push({
            id: ++counter,
            animateNow: true,
            text: lines,
            input: inp,
          })
        );
      } else if (Array.isArray(lines) && typeof input === "string") {
        lines.forEach((line) =>
          newLines.push({
            id: ++counter,
            animateNow: true,
            text: line,
            input: input,
          })
        );
      } else if (Array.isArray(lines) && Array.isArray(input)) {
        lines.forEach((line, i) =>
          newLines.push({
            id: ++counter,
            animateNow: true,
            text: line,
            input: input[i],
          })
        );
      } else if (Array.isArray(lines) && input == null) {
        lines.forEach((line) =>
          newLines.push({
            id: ++counter,
            animateNow: true,
            text: line,
            input: null,
          })
        );
      }

      set((state) => ({
        lineCounter: counter,
        queue: [...state.queue, ...newLines],
      }));
    },

    dequeue: () =>
      set((state) => ({
        queue: state.queue.slice(1),
      })),
  })));
