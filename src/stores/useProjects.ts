import { create } from "zustand";

import type { Project } from "./useContentful";

type ProjectsState = {
    activeProject: Project | null,
    setActiveProject: (project: Project) => void,
};

export const useProjectsStore = create<ProjectsState>((set) => ({
    activeProject: null,
    setActiveProject: (project) => set({ activeProject: project })
}));
