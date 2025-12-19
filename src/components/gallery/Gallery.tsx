import { useEffect, useRef } from 'react';
import { useLocation } from "react-router-dom";
import gsap from "gsap";

import { useContentful } from "../../stores/useContentful";
import { useTerminalStore } from "../../stores/useTerminal";

import GalleryItem from './GalleryItem';

function Gallery() {
  const projects = useContentful((s) => s.projects);

  const enqueueLine = useTerminalStore((s) => s.enqueueLine);
  const clearTerminalActives = useTerminalStore((s) => s.clearActives);
  const clearQueue = useTerminalStore((s) => s.clearQueue);

  const location = useLocation();
  const isProjects = location.pathname === "/projects";

  const displayProjects = projects;
  const galleryRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);


  // animate on path change
  useEffect(() => {
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
        delay: 0.5,
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

    const onScroll = () => {
      const scrollTop = scrollEl.scrollTop;
      const maxScroll =
        scrollEl.scrollHeight - scrollEl.clientHeight;        
        
        // 1️⃣ vertical scroll → 0..1
        const progress =
        maxScroll === 0 ? 0 : scrollTop / maxScroll;
        
      // 2️⃣ move gallery horizontally
      const maxX =
        track.scrollWidth - window.innerWidth;

      const x = -maxX * progress;
      gsap.set(track, { x });

      // 3️⃣ homogeneous active item effect
      const viewportCenter = 2 * window.innerWidth / 3;

      items.forEach((item) => {
        const rect = item.getBoundingClientRect();
        const itemCenter = rect.left + rect.width / 2;

        const distance = Math.abs(
          viewportCenter - itemCenter
        );

        // tweak this to control softness
        const maxDistance = 500;

        const t =
          1 - Math.min(distance / maxDistance, 1);

        const scale = 0.55 + 0.45 * t;
        const opacity = 0.15 + 0.85 * t;

        gsap.set(item, { scale, opacity });
      });
    };

    // initial state
    onScroll();

    scrollEl.addEventListener("scroll", onScroll);
    window.addEventListener("resize", onScroll);

    return () => {
      scrollEl.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <section ref={scrollRef} className='fixed h-screen w-screen select-none overflow-y-scroll no-scrollbar'>

      <div ref={galleryRef} className='w-full fixed -z-20 flex top-1/2 -translate-y-1/2 overflow-x-auto overflow-y-hidden items-center  snap-x snap-mandatory scroll-pr-8 no-scrollbar'>
        <div className='flex flex-row items-end gap-5 flex-nowrap pl-[50vw] pr-8 h-[50dvh]'>
          <div className='w-[50dvh]'></div>
          {displayProjects.map((project, index) => (
            <GalleryItem
              key={index}
              project={project}
            />
          ))}
          <div className='w-[50dvh]'></div>
        </div>
      </div>

      <div className='scroll-container h-[1000dvh] select-auto text-white'></div>
    </section>
  );
}

export default Gallery;
