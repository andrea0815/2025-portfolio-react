import { useMemo } from "react";

import { useContentful } from "../stores/useContentful";
import { useFilterStore } from "../stores/useFilter";

import type { Project, Tag } from "../stores/useContentful";

export const useFilteredProjects = (): Project[] => {
  const projects = useContentful((s) => s.projects);
  const currentTopic = useFilterStore((s) => s.currentTopic);
  const currentFilters = useFilterStore((s) => s.currentFilters);
  const currentProjects = useFilterStore((s) => s.currentProjects);
  const setCurrentProjects = useFilterStore((s) => s.setCurrentProjects);

  const isProject = (p: Project | null | undefined): p is Project => p != null;

  return useMemo(() => {
    let out = (projects ?? []).filter(isProject);

    if (currentTopic?.name) {
      out = out.filter((p) => projectHasTopic(p, currentTopic.name));
    }

    if (currentFilters.length > 0) {
      const names = new Set(currentFilters.map((t: Tag) => t.name));
      out = out.filter((p) => projectHasAnyTag(p, names));
    }

    out = sortProjectsByDate(out);

    return out;
  }, [projects, currentTopic, currentFilters]);
};

// HELPER FUNCTIONS

const projectHasTopic = (project: Project, topicName: string): boolean => {
  const topic = (project as any).topics;
  if (!topic) return false;

  // support topics as single object or array, and entry-like shapes
  if (Array.isArray(topic)) {
    return topic.some((t) => getTagName(t) === topicName || String((t as any)?.fields?.name ?? "") === topicName);
  }
  return getTagName(topic) === topicName || String((topic as any)?.fields?.name ?? "") === topicName;
};

const projectHasAnyTag = (project: Project, filterNames: Set<string>): boolean => {
  const tags = (project as any).tags;
  if (!Array.isArray(tags) || filterNames.size === 0) return true;

  return tags.some((t) => filterNames.has(getTagName(t)));
};

const getTagName = (t: unknown): string => {
  // supports Tag objects OR Contentful entry-like tags
  if (typeof t === "object" && t !== null) {
    if ("name" in t) return String((t as any).name ?? "");
    if ("fields" in t) return String((t as any).fields?.name ?? "");
  }
  return "";
};

const sortProjectsByDate = (projects: readonly Project[]): Project[] => {
  return [...projects].sort((a, b) => b.date.getTime() - a.date.getTime());
};

