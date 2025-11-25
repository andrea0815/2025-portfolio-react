import { NavLink, useLocation } from "react-router-dom";
import { usePageTransition } from "../../stores/usePageTransition";
import { useScramble } from "use-scramble";

function Nav() {
    const requestTransition = usePageTransition((s) => s.requestTransition);
    const location = useLocation(); // for checking current path

    const linkClass = ({ isActive }: { isActive: boolean }) =>
        isActive
            ? "text-text-highlight px-4 pt-2 pb-2 border-1 rounded-4xl border-text-highlight"
            : "text-text px-4 pt-2 pb-2 border-1 rounded-4xl border-transparent";

    // const scrambleProps = {
    //     text: currentTarget,
    //     scramble: 4,
    //     speed: 3,
    //     ignore: [" "],
    //     overdrive: true,
    //     range: [33, 47]
    // }

    // const { ref: currentTarget, replay: replayScramble } = useScramble(scrambleProps);

    function handleClick(
        e: React.MouseEvent<HTMLAnchorElement>,
        to: string
    ) {
        e.preventDefault();
        if (location.pathname === to) return;
        // replayScramble();
        requestTransition(to); 
    }

    return (
        <div className="lg:pt-6 pt-4 [grid-area:main] self-start z-50 flex flex-row items-center">
            <div className="flex flex-row px-2 py-2 bg-grayish gap-2 w-fit rounded-4xl">

                <NavLink
                    to="/projects"
                    className={linkClass}
                    onClick={(e) => handleClick(e, "/projects")}
                >
                    &lt;projects&gt;
                </NavLink>

                <NavLink
                    to="/about"
                    className={linkClass}
                    onClick={(e) => handleClick(e, "/about")}
                >
                    &lt;about&gt;
                </NavLink>

            </div>

            <p>
                <span>Creative Computing</span>
            </p>
        </div>
    );
}

export default Nav;
