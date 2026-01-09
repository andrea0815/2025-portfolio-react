import { useLocation } from "react-router-dom";
import { usePageTransition } from "../../stores/usePageTransition";
import CursorLoader from "./CursorLoader";
import { useCursorUpdates } from "./useCursorUpdates";

function CustomCursor() {
  const requestTransition = usePageTransition((s) => s.requestTransition);

  const location = useLocation();
  const isLanding = location.pathname === "/";

  const { isTouch, cursorRef, loaderRef } = useCursorUpdates({
    isLanding,
    requestTransition,
    hoverSelector: ".hoverEl",
    targetRoute: "/projects",
  });

  const cursorText = "click";

  return (
    <>
      {!isTouch && (
        <>
          <div
            ref={cursorRef}
            className="cursorDot fixed z-[999999] w-7 h-7 left-0 top-0 scale-25
            -translate-x-1/2 -translate-y-1/2 bg-cursor
            rounded-full pointer-events-none mix-blend-difference 
            flex justify-center items-center 
            font-sans font-bold uppercase text-center text-transparent leading-[1.2em]"
          >
            {cursorText}
          </div>
        </>
      )}

      <CursorLoader ref={loaderRef} />
    </>
  );
}

export default CustomCursor;