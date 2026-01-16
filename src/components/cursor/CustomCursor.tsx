import { useEffect, useLayoutEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import gsap from "gsap";

import { usePageTransition } from "../../stores/usePageTransition";
import { useCursorStore } from "../../stores/useCursorStore";
import { useCursorUpdates } from "./useCursorUpdates";

import CursorLoader from "./CursorLoader";
import CursorText from "./CursorText";

function CustomCursor() {
  const requestTransition = usePageTransition((s) => s.requestTransition);

  const location = useLocation();
  const isLanding = location.pathname === "/";

  const textRef = useRef(null)

  const { isTouch, cursorRef, loaderRef, pointRef } = useCursorUpdates({
    isLanding,
    requestTransition,
    hoverSelector: ".hoverEl",
    targetRoute: "/projects",
  });


  return (
    <>
      {!isTouch && (
        <>
          <div
            ref={cursorRef}
            className="cursorDot fixed z-[999999] left-0 top-0 
            -translate-x-1/2 -translate-y-1/2 pointer-events-none mix-blend-difference 
            flex justify-center items-center 
            font-sans font-bold uppercase text-center leading-[1.2em]"
          >

            <div
              ref={pointRef}
              className="w-7 h-7 bg-cursor rounded-full  scale-25 relative"
            >
              {/* <div className="absolute top-1/2 left-1/2 -translate-1/2 flex flex-col justify-center items-center gap-5">
                <p className=" text-9xl rotate-90"> &lt;</p>
                <p className="text-9xl rotate-90"> &gt;</p>
              </div> */}
            </div>

            <CursorText
              textRef={textRef}
            />

          </div>
        </>
      )}


      <CursorLoader ref={loaderRef} />


    </>
  );
}

export default CustomCursor;