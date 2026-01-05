import { create } from "zustand";

import type { Project } from "./useContentful";

type ProjectsState = {
    currentProject: Project | null,
    setCurrentProject: (project: Project) => void,
   
};

export const useFilterStore = create<ProjectsState>((set) => ({
    currentProject: null,
    setCurrentProject: (project) => set({ currentProject: project }),
}));
