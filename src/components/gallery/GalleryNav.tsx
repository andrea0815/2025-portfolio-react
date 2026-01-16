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
import { useMediaQuery } from "../../hooks/useMediaQuery";

function GalleryNav() {
  const isProjects = !!useMatch("/projects/*");

  

  return (
    <div>
      GalleryNav
    </div>
  );
}

export default GalleryNav;
