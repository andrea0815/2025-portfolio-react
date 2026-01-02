import { useEffect, useRef, useState } from 'react';
import { useLocation } from "react-router-dom";
import gsap from "gsap";

import { useContentful } from "../../stores/useContentful";
import { useTerminalStore } from "../../stores/useTerminal";
import { useProjectsStore } from "../../stores/useProjects";

import type { Tag } from "../../stores/useContentful";

import GalleryItem from './GalleryItem';

function Gallery() {
  const projects = useContentful((s) => s.projects);
  const SCROLL_HEIGHT = projects.length * 100; // in vh

  const enqueueLine = useTerminalStore((s) => s.enqueueLine);
  const clearTerminalActives = useTerminalStore((s) => s.clearActives);
  const clearQueue = useTerminalStore((s) => s.clearQueue);
  const setActiveProject = useProjectsStore((s) => s.setActiveProject);

  const location = useLocation();
  const isProjects = location.pathname === "/projects";

  const displayProjects = projects;
  const galleryRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const centersRef = useRef<number[]>([]);
  const activeIndexRef = useRef<number>(-1);
  const idleTimerRef = useRef<number | null>(null);

  const [scrollEnabled, setScrollEnabled] = useState<boolean>(isProjects);

  // animate on path change
  useEffect(() => {

    setScrollEnabled(isProjects); // enable or disable scroll based on path

    const el = galleryRef.current;
    
    if (!el) return;

    if (!isProjects) {
      // fade out
      gsap.to(el, {
        opacity: 0,
        duration: 0.6,
        ease: "power2.out",
        pointerEvents: "none"
      });
    } else {
      // fade in
      gsap.to(el, {
        opacity: 1,
        duration: 0.6,
        delay: 1,
        ease: "power2.out",
        pointerEvents: "auto"
      });
    }
  }, [isProjects]);

  useEffect(() => {
    const scrollEl = scrollRef.current;
    const galleryEl = galleryRef.current;
    if (!scrollEl || !galleryEl) return;


    const track = galleryEl.querySelector(
      ".flex.flex-row"
    ) as HTMLDivElement;

    const items = Array.from(
      galleryEl.querySelectorAll<HTMLElement>(".gallery-item")
    );

    if (!track || items.length === 0) return;

    computeCenters(items);

    const xTo = gsap.quickTo(track, "x", { duration: 0.25, ease: "power2.out" });

    const onScroll = () => {
      const vh = scrollEl.clientHeight;
      const raw = scrollEl.scrollTop / vh;

      const activeIndex = Math.round(raw);
      // if we entered a new container item
      checkActiveIndexAndHandleProject(activeIndex);

      const i0 = Math.floor(raw);
      const i1 = Math.min(items.length - 1, i0 + 1);
      const t = raw - i0;

      const heroX = (1 * window.innerWidth) / 2;     // your “max” position

      const centers = centersRef.current;
      const c0 = centers[Math.max(0, Math.min(items.length - 1, i0))];
      const c1 = centers[i1];

      // interpolate the target center smoothly
      const activeCenter = c0 + (c1 - c0) * t;

      let x = heroX - activeCenter;

      // clamp
      const minX = window.innerWidth - track.scrollWidth;
      const maxX = 0;
      x = Math.max(minX, Math.min(maxX, x));

      xTo(x);

      // keep your distance-based emphasis (also smooth)
      items.forEach((item) => {
        const rect = item.getBoundingClientRect();
        const itemCenter = rect.left + rect.width / 2;

        const distance = Math.abs(heroX - itemCenter);
        const maxDistance = window.innerWidth / 2; // in pixels
        const u = 1 - Math.min(distance / maxDistance, 1);

        gsap.set(item, {
          scale: 0.55 + 0.45 * u,
          opacity: 0.05 + 0.85 * u,
        });
      });
    };

    // initial state
    onScroll();

    const onScrollResize = () => {
      computeCenters(items);
      onScroll();
    }

    scrollEl.addEventListener("scroll", onScroll);
    window.addEventListener("resize", onScrollResize);

    return () => {
      scrollEl.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScrollResize);
    };
  }, []);

  const checkActiveIndexAndHandleProject = (activeIndex: number) => {
    if (activeIndex !== activeIndexRef.current) {
      activeIndexRef.current = activeIndex;

      // kill previous idle timer
      if (idleTimerRef.current) {
        window.clearTimeout(idleTimerRef.current);
        idleTimerRef.current = null;
      }

      // start a new one: if no new item entered for 1s, print
      idleTimerRef.current = window.setTimeout(() => {
        if (!displayProjects[activeIndex] && isProjects) return;

        const project = displayProjects[activeIndex];
        printProjectInfo(project);
        setActiveProject(project);

      }, 1000);
    }
  }

  const printProjectInfo = (project: any) => {
    const title: string = project?.title.toUpperCase() || "untitled";
    const subtitle: string = project?.subtitle || "undefined";
    const newTags: Tag[] =
      project?.tags
        ?.map((t: any) => ({ name: t.fields?.name }))
        .filter((t: Tag) => Boolean(t.name)) ?? [];
    const tags: string = newTags.map((t) => ("&lt;" + t.name + "&gt;")).join(" ") || "no tags";

    clearQueue();
    clearTerminalActives();
    enqueueLine("");
    enqueueLine(`title: ${title.toUpperCase()}`);
    enqueueLine(`type: ${subtitle.toLowerCase()}`);
    enqueueLine("");
    enqueueLine(tags);
  }

  const computeCenters = (items: HTMLElement[]) => {
    centersRef.current = items.map((el) => el.offsetLeft + el.offsetWidth / 2);
  };

  return (
    <section ref={scrollRef} className={`fixed h-screen w-screen select-none ${scrollEnabled ? "overflow-y-scroll" : "overflow-y-hidden"} snap-y snap-mandatory  no-scrollbar mix-blend-difference`}>

      <div ref={galleryRef} className='w-full fixed -z-20 flex top-1/2 -translate-y-1/2 overflow-x-auto items-center no-scrollbar'>
        <div className='flex flex-row items-end gap-2 lg:gap-5 flex-nowrap pl-[50vw] pr-8'>
          {displayProjects.map((project, index) => (
            <GalleryItem
              key={index}
              project={project}
            />
          ))}
          <div className='w-[80dvw] lg:w-[65dvh]'></div>
        </div>
      </div>

      <div
        className="scroll-container select-auto flex flex-col text-white snap-y snap-mandatory"
        style={{ height: `${SCROLL_HEIGHT}dvh` }}>
        {displayProjects.map((projects, index) => (
          <div key={index} className="h-dvh snap-start"></div>
        ))}
      </div>
    </section>
  );
}

export default Gallery;
