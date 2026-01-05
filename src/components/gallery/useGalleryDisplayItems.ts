import { useMemo } from "react";
import { useMatch } from "react-router-dom";

import type { Project } from "../../stores/useContentful";
import type { SliderAssetItem } from "./galleryTypes";

function safeArray<T>(v: T[] | null | undefined): T[] {
    return Array.isArray(v) ? v : [];
}

function projectId(p: Project): string {
    return (p as any).id ?? p.slug ?? p.title;
}

function projectMeta(p: Project) {
    return {
        slug: String(p.slug ?? ""),
        title: String(p.title ?? ""),
    };
}

export function useGalleryDisplayItems(
    filteredProjects: Project[],
    allProjects: Project[]
): { items: SliderAssetItem[]; activeProject: Project | null } {

    const match = useMatch("/projects/:slug");
    const slug = match?.params.slug;

    return useMemo(() => {
        // INDEX PAGE: show ONLY thumbnails as assets
        if (!slug) {
            const items: SliderAssetItem[] = filteredProjects
                .filter((p) => p.thumbnail != null)
                .map((p) => ({
                    kind: "asset" as const,
                    id: `${projectId(p)}:thumb`,
                    asset: p.thumbnail,
                    project: projectMeta(p),
                    role: "thumbnail" as const,
                }));

            return { activeProject: null, items };
        }

        // DETAIL PAGE: thumbnail first, then gallery assets for ONE project
        const project =
            allProjects.find((p) => p.slug === slug) ??
            filteredProjects.find((p) => p.slug === slug) ??
            null;

        if (!project) {
            // fallback to index thumbnails
            const items: SliderAssetItem[] = filteredProjects
                .filter((p) => p.thumbnail != null)
                .map((p) => ({
                    kind: "asset" as const,
                    id: `${projectId(p)}:thumb`,
                    asset: p.thumbnail,
                    project: projectMeta(p),
                    role: "thumbnail" as const,
                }));

            return { activeProject: null, items };
        }

        const meta = projectMeta(project);
        const galleryAssets = safeArray((project as any).gallery);

        const items: SliderAssetItem[] = [
            {
                kind: "asset" as const,
                id: `${projectId(project)}:thumb`,
                asset: project.thumbnail,
                project: meta,
                role: "thumbnail" as const,
            },
            ...galleryAssets.map((asset, idx) => ({
                kind: "asset" as const,
                id: `${projectId(project)}:g:${idx}`,
                asset,
                project: meta,
                role: "gallery" as const,
            })),
        ];

        return { activeProject: project, items };
    }, [filteredProjects, allProjects, slug]);
}
