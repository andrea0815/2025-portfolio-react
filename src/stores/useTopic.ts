import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { Topic } from "./useContentful";
import type { Tag } from "./useContentful";
import type { Project } from "./useContentful";

interface TopicStore {
    currentTopic: Topic;
    setCurrentTopic: (topic: Topic) => void;

    currentFilters: Tag[];
    addFilter: (filter: Tag) => void;
    removeFilter: (filter: Tag) => void;
    clearAllFilters: () => void;
}

export const useTopicStore = create<TopicStore>()(
    persist(
        (set, get) => ({
            currentTopic: { name: "undefined", tags: [] },
            currentFilters: [],

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
            }
        }),
        {
            name: "topic-store",
        }
    )
);

