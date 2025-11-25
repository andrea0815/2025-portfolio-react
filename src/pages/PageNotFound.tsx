import { usePageTransition } from "../stores/usePageTransition";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";


function PageNotFound() {

  const navigate = useNavigate();
  const {
    isTransitioning,
    registerAnimation,
    finishAnimation,
    completeTransition,
    targetRoute,
  } = usePageTransition();

  useEffect(() => {
    completeTransition();
  }, [isTransitioning]);

  useEffect(() => {
    if (!isTransitioning && targetRoute) {
      navigate(targetRoute);
    }
  }, [isTransitioning]);
  
  return (
    <div>
      Page not found.
    </div>
  );
}

export default PageNotFound;
