import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import gsap from "gsap";

import { useTerminalStore } from "../../stores/useTerminal";
import { useProjectsStore } from "../../stores/useProjects";
import type { Tag, Project } from "../../stores/useContentful";
import { useFilteredProjects } from "../../hooks/useFilteredProjects";

import GalleryItem from "./GalleryItem";

function Gallery() {
  const enqueueLine = useTerminalStore((s) => s.enqueueLine);
  const clearTerminalActives = useTerminalStore((s) => s.clearActives);
  const clearQueue = useTerminalStore((s) => s.clearQueue);
  const setActiveProject = useProjectsStore((s) => s.setActiveProject);

  const location = useLocation();
  const isProjects = location.pathname.startsWith("/projects");

  const displayProjects = useFilteredProjects();

  const [scrollEnabled, setScrollEnabled] = useState<boolean>(isProjects);

  const galleryRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const centersRef = useRef<number[]>([]);
  const rightsRef = useRef<number[]>([]);
  const activeIndexRef = useRef<number>(-1);
  const idleTimerRef = useRef<number | null>(null);
  const didInitRef = useRef(false);

  // ref only for GSAP/timers (avoids stale closures)
  const displayProjectsRef = useRef<Project[]>(displayProjects);
  useEffect(() => {
    displayProjectsRef.current = displayProjects;
  }, [displayProjects]);

  const SCROLL_HEIGHT = displayProjects.length * 100;
  const FOKUS_OFFSET_RIGHT = true ? 100 : 60; // padding in px 

  // animate on path change
  useEffect(() => {
    setScrollEnabled(isProjects);

    const el = galleryRef.current;
    if (!el) return;

    gsap.to(el, {
      opacity: isProjects ? 1 : 0,
      duration: 0.6,
      delay: isProjects ? 1 : 0,
      ease: "power2.out",
      pointerEvents: isProjects ? "auto" : "none",
    });
  }, [isProjects]);

  // rebind scroll logic when the DOM list changes
  useLayoutEffect(() => {
    didInitRef.current = false;

    const scrollEl = scrollRef.current;
    const galleryEl = galleryRef.current;
    if (!scrollEl || !galleryEl) return;

    const track = galleryEl.querySelector(".flex.flex-row") as HTMLDivElement | null;
    const items = Array.from(galleryEl.querySelectorAll<HTMLElement>(".gallery-item"));
    if (!track || items.length === 0) return;

    computeCenters(items);

    const xTo = gsap.quickTo(track, "x", { duration: 0.25, ease: "power2.out" });

    const onScroll = () => {
      const vh = scrollEl.clientHeight; // viewport height
      const raw = scrollEl.scrollTop / vh; // raw scroll position in "dvh" units

      const activeIndex = Math.round(raw);
      checkActiveIndexAndHandleProject(activeIndex);

      const i0 = Math.floor(raw); // current index
      const i1 = Math.min(items.length - 1, i0 + 1); // next index
      const t = raw - i0; // interpolation factor between i0 and i1

      const heroX = window.innerWidth - FOKUS_OFFSET_RIGHT - items[0].offsetWidth / 2;

      const centers = centersRef.current; // all item position centers
      const c0 = centers[Math.max(0, Math.min(items.length - 1, i0))]; // center of current item
      const c1 = centers[i1]; // center of next item
      const activeCenter = c0 + (c1 - c0) * t;

      let x = heroX - activeCenter;

      const minX = window.innerWidth - track.scrollWidth;
      x = Math.max(minX, Math.min(0, x));

      // ✅ critical: apply instantly on first run so rects are correct
      if (!didInitRef.current) {
        gsap.set(track, { x });
        didInitRef.current = true;
      } else {
        xTo(x);
      }

      items.forEach((item) => {
        const rect = item.getBoundingClientRect();
        const itemCenter = rect.left + rect.width / 2;

        const distance = Math.abs(heroX - itemCenter);
        const maxDistance = window.innerWidth / 3;
        const u = 1 - Math.min(distance / maxDistance, 1);

        gsap.set(item, { scale: 0.75 + 0.25 * u, opacity: 0.15 + 0.85 * u });
      });
    };

    onScroll();

    const onScrollResize = () => {
      computeCenters(items);
      onScroll();
    };

    scrollEl.addEventListener("scroll", onScroll);
    window.addEventListener("resize", onScrollResize);

    return () => {
      scrollEl.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScrollResize);
    };
  }, [displayProjects.length]);

  const checkActiveIndexAndHandleProject = (activeIndex: number) => {

    if (activeIndex === activeIndexRef.current) return;
    activeIndexRef.current = activeIndex;

    if (idleTimerRef.current) {
      window.clearTimeout(idleTimerRef.current);
      idleTimerRef.current = null;
    }

    idleTimerRef.current = window.setTimeout(() => {
      if (!isProjects) return;

      const project = displayProjectsRef.current[activeIndex];
      if (!project) return;

      printProjectInfo(project);
      setActiveProject(project);
    }, 1000);
  };

  const printProjectInfo = (project: Project) => {
    const title = project.title?.toUpperCase() ?? "UNTITLED";
    const subtitle = project.subtitle ?? "undefined";

    // if your tags are entry-like:
    const newTags: Tag[] =
      project.tags
        ?.map((t: any) => ({ name: t.fields?.name }))
        .filter((t: Tag) => Boolean(t.name)) ?? [];

    const tags = newTags.map((t) => `&lt;${t.name}&gt;`).join(" ") || "no tags";

    clearQueue();
    clearTerminalActives();
    enqueueLine("");
    enqueueLine(`title: ${title}`);
    enqueueLine(`type: ${subtitle.toLowerCase()}`);
    enqueueLine("");
    enqueueLine(tags);
  };

  const computeCenters = (items: HTMLElement[]) => {
    centersRef.current = items.map((el) => el.offsetLeft + el.offsetWidth / 2);
  };

  const computeRights = (items: HTMLElement[]) => {
    rightsRef.current = items.map((el) => el.offsetLeft + el.offsetWidth);
  };

  return (
    <section
      ref={scrollRef}
      className={`fixed h-screen w-screen select-none ${scrollEnabled ? "overflow-y-scroll" : "overflow-y-hidden"
        } snap-y snap-mandatory no-scrollbar mix-blend-difference`}
    >
      <div
        ref={galleryRef}
        className="w-full fixed -z-20 flex top-1/2 -translate-y-1/2 overflow-x-auto items-center no-scrollbar"
      >
        <div className="flex flex-row items-end lg:gap-5 flex-nowrap pl-[80vw] pr-8">
          {displayProjects.map((project) => (
            <GalleryItem
              key={(project as any).id ?? project.title} // replace with real stable id
              project={project}
            />
          ))}
          <div className="w-[80dvw] lg:w-[65dvh]" />
        </div>
      </div>

      <div
        className="scroll-container select-auto flex flex-col text-white snap-y snap-mandatory"
        style={{ height: `${SCROLL_HEIGHT}dvh` }}
      >
        {displayProjects.map((_, index) => (
          <div key={index} className="h-dvh snap-start" />
        ))}
      </div>
    </section>
  );
}

export default Gallery;
