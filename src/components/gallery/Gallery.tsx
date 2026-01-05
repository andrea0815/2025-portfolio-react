import { useEffect, useRef } from "react";
import { useMatch } from "react-router-dom";

import { useTerminalStore } from "../../stores/useTerminal";
import { useProjectsStore } from "../../stores/useProjects";
import { useFilteredProjects } from "../../hooks/useFilteredProjects";
import { usePageTransition } from "../../stores/usePageTransition";
import { useGsapScrollGallery } from "./useGsapScrollGallery";
import { useIdleActiveProject } from "./UseIdleActiveProject";

import type { Tag, Project } from "../../stores/useContentful";

import GalleryScroller from "./GalleryScroller";
import GalleryHorizontalSlider from "./GalleryHorizontalSlider";

function Gallery() {
  const enqueueLine = useTerminalStore((s) => s.enqueueLine);
  const clearTerminalActives = useTerminalStore((s) => s.clearActives);
  const clearQueue = useTerminalStore((s) => s.clearQueue);
  const setActiveProject = useProjectsStore((s) => s.setActiveProject);
  const activeProject = useProjectsStore((s) => s.activeProject);
  const requestTransition = usePageTransition((s) => s.requestTransition);

  const isProjects = !!useMatch("/projects/*");
  const isDetailPage = !!useMatch("/projects/:slug");
  const scrollEnabled = isProjects;

  const displayProjects = useFilteredProjects();
  
  const galleryRef = useRef<HTMLDivElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  // ref only for GSAP/timers (avoids stale closures)
  const displayProjectsRef = useRef<Project[]>(displayProjects);
  useEffect(() => {
    displayProjectsRef.current = displayProjects;
  }, [displayProjects]);

  const IDLE_SELECT_MS = 1000;
  const FOKUS_OFFSET_RIGHT = true ? 100 : 60; // padding in px 
  const SCALE_MIN = 0.75;
  const SCALE_RANGE = 0.25;
  const OPACITY_MIN = 0.15;
  const OPACITY_RANGE = 0.85;

  const setIndex = useIdleActiveProject<Project>({
    enabled: isProjects,
    delayMs: IDLE_SELECT_MS,
    getItem: (index) => displayProjects[index],
    onIdleSelect: (project) => {
      printProjectInfo(project);
      setActiveProject(project);
    },
  });

  useGsapScrollGallery({
    enabled: isProjects && !isDetailPage, // example: disable animation on detail page
    scrollRef,
    galleryRef,
    fokusOffsetRight: FOKUS_OFFSET_RIGHT,
    scaleMin: SCALE_MIN,
    scaleRange: SCALE_RANGE,
    opacityMin: OPACITY_MIN,
    opacityRange: OPACITY_RANGE,
    onActiveIndex: setIndex,
  });

  const printProjectInfo = (project: Project) => {
    const title = project.title?.toUpperCase() ?? "UNTITLED";
    const subtitle = project.subtitle ?? "undefined";
    const derivedTags: Tag[] =
      project.tags
        ?.map((t: any) => ({ name: t.fields?.name }))
        .filter((t: Tag) => Boolean(t.name)) ?? [];
    const tags = derivedTags.map((t) => `&lt;${t.name}&gt;`).join(" ") || "no tags";

    clearQueue();
    clearTerminalActives();
    enqueueLine("");
    enqueueLine(`title: ${title}`);
    enqueueLine(`type: ${subtitle.toLowerCase()}`);
    enqueueLine("");
    enqueueLine(tags);
  };

  const handleClick = () => {
    const link = !isDetailPage ? `/projects/${activeProject?.slug ?? ""}` : `/projects`
    console.log(link);
    requestTransition(link);
  }

  return (
    <section
      ref={scrollRef}
      onClick={handleClick}
      className={`fixed h-screen w-screen select-none ${scrollEnabled ? "overflow-y-scroll" : "overflow-y-hidden"
        } snap-y snap-mandatory no-scrollbar mix-blend-difference`}
    >

      <GalleryHorizontalSlider
        galleryRef={galleryRef}
        displayProjects={displayProjects}
      />

      <GalleryScroller
        scrollRef={scrollRef}
        displayProjects={displayProjects}
      />
    </section>
  );
}

export default Gallery;
