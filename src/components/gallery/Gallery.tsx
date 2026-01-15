import { useEffect, useRef, useState, useLayoutEffect } from "react";
import { useMatch } from "react-router-dom";

import { useContentful } from "../../stores/useContentful";
import { useTerminalStore } from "../../stores/useTerminal";
import { useFilterStore } from "../../stores/useFilter";
import { useFilteredProjects } from "../../hooks/useFilteredProjects";
import { usePageTransition } from "../../stores/usePageTransition";
import { useGsapScrollGallery } from "./useGsapScrollGallery";
import { useIdleCurrentProject } from "./UseIdleCurrentProject";
import { useGalleryDisplayItems } from "./useGalleryDisplayItems";

import type { Tag, Project } from "../../stores/useContentful";

import GalleryScroller from "./GalleryScroller";
import GalleryHorizontalSlider from "./GalleryHorizontalSlider";

function Gallery() {

  const allProjects = useContentful((s) => s.projects);
  const enqueueLine = useTerminalStore((s) => s.enqueueLine);
  const clearTerminalActives = useTerminalStore((s) => s.clearActives);
  const clearQueue = useTerminalStore((s) => s.clearQueue);
  const setCurrentProject = useFilterStore((s) => s.setCurrentProject);
  const currentProject = useFilterStore((s) => s.currentProject);
  const isTransitioning = usePageTransition((s) => s.isTransitioning);

  const isProjects = !!useMatch("/projects/*");
  const isDetailPage = !!useMatch("/projects/:slug");
  const scrollEnabled = isProjects;

  const filteredProjects = useFilteredProjects();

  const galleryRef = useRef<HTMLDivElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const lastScrollPosition = useRef<number>(0);

  const IDLE_SELECT_MS = 800;
  const FOKUS_OFFSET_RIGHT = true ? 100 : 60; // padding in px 
  const SCALE_MIN = 0.75;
  const SCALE_RANGE = 0.25;
  const OPACITY_MIN = 0.15;
  const OPACITY_RANGE = 0.85;

  useEffect(() => {
    if (!isProjects) return;

    // when we are on the list page (not detail), restore
    if (!isDetailPage) {
      scrollRef.current?.scrollTo({
        top: lastScrollPosition.current,
        behavior: "smooth",
      });
      checkIfTopScrollPosition(lastScrollPosition.current);
    } else {
      // on detail page, go to top
      scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });


      checkIfTopScrollPosition(lastScrollPosition.current === 0 ? 0 : 1);
    }
  }, [isDetailPage, isProjects]);

  useLayoutEffect(() => {
    if (!isProjects) return;
    if (!isTransitioning) return;

    if (!isDetailPage) {
      lastScrollPosition.current = scrollRef.current?.scrollTop ?? 0;
    }
  }, [isTransitioning])

  const { items: sliderItems, activeProject } = useGalleryDisplayItems(
    filteredProjects,
    allProjects
  );

  const setIndex = useIdleCurrentProject<Project>({
    enabled: isProjects,
    delayMs: IDLE_SELECT_MS,
    getItem: (index) => {
      if (isDetailPage) return activeProject ?? undefined;
      return filteredProjects[index];
    },
    onIdleSelect: (project) => {
      if (!isDetailPage) {
        printProjectInfo(project);
        setCurrentProject(project);
      }
    },
  });

  useGsapScrollGallery({
    enabled: isProjects, // example: disable animation on detail page
    itemsKey: sliderItems.length,
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
    const tags = derivedTags.map((t) => `<${t.name}>`).join(" ") || "no tags";

    clearQueue();
    clearTerminalActives();
    enqueueLine("");
    enqueueLine(`title: ${title}`);
    enqueueLine(`type: ${subtitle.toLowerCase()}`);
    enqueueLine("");
    enqueueLine(tags);
  };

  const checkIfTopScrollPosition = (scrollPosition: number) => {
    if (scrollPosition === 0) {
      setTimeout(() => {
        const vh = window.visualViewport?.height ?? window.innerHeight; // ≈ 100dvh
        scrollRef.current?.scrollTo({
          top: vh,
          behavior: "smooth",
        });
      }, 1000)
    }
  }

  return (
    <section
      ref={scrollRef}
      className={`fixed h-screen w-screen select-none snap-y snap-mandatory no-scrollbar mix-blend-difference
        ${scrollEnabled ? "overflow-y-scroll" : "overflow-y-hidden"}
        ${isProjects ? "pointer-events-auto" : "pointer-events-none"} `}
    >

      <GalleryHorizontalSlider
        galleryRef={galleryRef}
        items={sliderItems}
      />

      <GalleryScroller
        scrollRef={scrollRef}
        displayProjectsCount={sliderItems.length}
      />
    </section>
  );
}

export default Gallery;
