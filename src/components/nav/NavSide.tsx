import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import gsap from "gsap";

import FilterTags from "./FilterTags";
import TopicTags from "./TopicTags";

type NavSideProps = {
  parentRef?: React.RefObject<HTMLElement | null>;
};

function NavSide({ parentRef }: NavSideProps) {
  const location = useLocation();
  const isProjects = location.pathname === "/projects";

  // Helper: animate visible topicEls
  const animateShow = () => {
    if (!parentRef?.current) return;

    const els = parentRef.current.querySelectorAll(".topicEl");

    gsap.set(els, { display: "flex" });

    gsap.to(els, {
      opacity: 1,
      duration: 0.3,
      ease: "power2.out",
      stagger: 0.04,
    });
  };

  const animateHide = () => {
    if (!parentRef?.current) return;

    const els = parentRef.current.querySelectorAll(".topicEl");

    gsap.to(els, {
      opacity: 0,
      duration: 0.3,
      ease: "power2.out",
      onComplete: () => {
        gsap.set(els, { display: "none" });
      },
    });
  };

  // Trigger animation whenever route changes OR TopicTags content changes
  useEffect(() => {
    if (!parentRef?.current) return;

    // Wait a tick for TopicTags DOM updates to finish
    setTimeout(() => {
      if (isProjects) animateShow();
      else animateHide();
    }, 0);
  }, [isProjects]); // If TopicTags changes visually, Nav re-renders → effect runs again

  return (
    <>
      <span className="topicEl mx-3">&gt;&gt;</span>
      <span className="topicEl mx-2">&#123;</span>

      <TopicTags />

      <span className="topicEl mx-3">&#125;</span>
      <span className="mx-3">&gt;&gt;</span>

      <FilterTags />
    </>
  );
}

export default NavSide;
