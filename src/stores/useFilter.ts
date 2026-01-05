import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { Topic } from "./useContentful";
import type { Tag } from "./useContentful";
import type { Project } from "./useContentful";

interface FilterStore {
    currentProjects: Project[];
    setCurrentProjects: (projects: Project[]) => void;

    currentProject: Project | null,
    setCurrentProject: (project: Project) => void,

    currentTopic: Topic | null;
    setCurrentTopic: (topic: Topic) => void;

    currentFilters: Tag[];
    addFilter: (filter: Tag) => void;
    removeFilter: (filter: Tag) => void;
    clearAllFilters: () => void;

    filterByTopic: (topic: Topic, projects: Project[]) => Project[],
    filterByTags: (tags: Tag[], projects: Project[]) => Project[]
}

export const useFilterStore = create<FilterStore>()(
    persist(
        (set, get) => ({
            currentProjects: [],
            currentTopic: null,
            currentFilters: [],
            currentProject: null,
            
            setCurrentProjects: (projects) => {
                set({ currentProjects: projects });
            },

            setCurrentProject: (project) => set({ currentProject: project }),

            setCurrentTopic: (topic) => {
                set({ currentTopic: topic });
            },

            addFilter: (filter) => {
                set({
                    currentFilters: [...get().currentFilters, filter],
                });
            },

            removeFilter: (filter) => {
                set({
                    currentFilters: get().currentFilters.filter(
                        (f) => f.name !== filter.name // FIX HERE
                    ),
                });
            },
            clearAllFilters: () => {
                set({ currentFilters: [] });
            },

            filterByTopic: (topic, projects) => {
                const newProjects = projects.filter((project) => { });
                return newProjects;
            },

            filterByTags: (tags, projects) => {
                const newProjects = projects.filter((project) => { });
                return newProjects;
            },
        }),
        {
            name: "topic-store",
        }
    )
);

