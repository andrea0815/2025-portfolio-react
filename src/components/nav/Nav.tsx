import { NavLink, useLocation } from "react-router-dom";
import { useEffect, useRef } from "react";
import gsap from "gsap";

import { usePageTransition } from "../../stores/usePageTransition";

import NavSide from "./NavSide";
import ScrambleText from "../base/ScrambleText";

function Nav() {
    const location = useLocation();
    const isLanding = location.pathname === "/";
    const requestTransition = usePageTransition((s) => s.requestTransition);

    const navRef = useRef<HTMLElement>(null);

    const linkClass = ({ isActive }: { isActive: boolean }) =>
        isActive
            ? "text-text-highlight flex flex-row px-4 pt-2 pb-2 border-1 rounded-4xl border-text-highlight"
            : "text-text px-4 pt-2 flex flex-row pb-2 border-1 rounded-4xl border-transparent";

    function handleClick(
        e: React.MouseEvent<HTMLAnchorElement>,
        to: string
    ) {
        e.preventDefault();
        if (location.pathname === to) return;
        requestTransition(to);
    }

    // animate on path change
    useEffect(() => {
        const el = navRef.current;
        if (!el) return;

        if (isLanding) {
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
                ease: "power2.out",
                pointerEvents: "auto"
            });
        }
    }, [isLanding]);

    return (
        <nav
            ref={navRef}
            className="lg:pt-6 pt-4 [grid-area:main] self-start z-50 flex flex-row flex-wrap items-center opacity-0"
        >
            <div className=" hoverEl flex flex-row px-2 py-2 bg-grayish gap-2 w-fit rounded-4xl">

                <NavLink
                    to="/projects"
                    className={linkClass}
                    onClick={(e) => handleClick(e, "/projects")}
                >
                    &lt;<ScrambleText text="projects" />&gt;
                </NavLink>

                <NavLink
                    to="/about"
                    className={linkClass}
                    onClick={(e) => handleClick(e, "/about")}
                >
                    &lt;<ScrambleText text="about" />&gt;
                </NavLink>

            </div>

            <NavSide parentRef={navRef} />
        </nav>
    );
}

export default Nav;
