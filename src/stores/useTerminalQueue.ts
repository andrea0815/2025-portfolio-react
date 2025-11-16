import { create } from "zustand";

export type Line = {
  id: number;
  text: string;
  input?: string | null;
};

type TerminalQueueStore = {
  queue: Line[];
  lines: Line[];
  actives: Line[];
  enqueueLine: (text: string, input?: string | null) => void;
  enqueueMultiple: (
    lines: string[] | string,
    input?: string[] | string | null
  ) => void;
  dequeue: () => void;
  addVisible: (line: Line) => void;
  clearActives: () => void;
};

export const useTerminalQueue = create<TerminalQueueStore>((set) => ({
  queue: [],
  lines: [],
  actives: [],

  addVisible: (line) =>
    set((state) => ({ lines: [...state.lines, line] })),

  clearActives: () =>
    set(() => ({
      actives: [],
    })),

  enqueueLine: (text, input = null) => {
    const line: Line = {
      id: Date.now() + Math.random(),
      text,
      input,
    };
    set((state) => ({
      queue: [...state.queue, line],
      actives: [...state.actives, line],
    }));
  },

  enqueueMultiple: (lines, input = null) =>
    set((state) => {
      const newLines: Line[] = [];

      if (typeof lines === "string" && Array.isArray(input)) {
        input.forEach((inp) =>
          newLines.push({ id: Date.now() + Math.random(), text: lines, input: inp })
        );
      } else if (Array.isArray(lines) && typeof input === "string") {
        lines.forEach((line) =>
          newLines.push({ id: Date.now() + Math.random(), text: line, input })
        );
      } else if (Array.isArray(lines) && Array.isArray(input)) {
        lines.forEach((line, i) =>
          newLines.push({ id: Date.now() + Math.random(), text: line, input: input[i] })
        );
      } else if (Array.isArray(lines) && input == null) {
        lines.forEach((line) =>
          newLines.push({ id: Date.now() + Math.random(), text: line, input: null })
        );
      }

      return {
        queue: [...state.queue, ...newLines],
        actives: [...state.actives, ...newLines], // 👈 add all to active
      };

    }),

  dequeue: () =>
    set((state) => ({
      queue: state.queue.slice(1),
    })),
}));