import { useMatch } from "react-router-dom";

import ScrambleText from './base/ScrambleText';
import { usePageTransition } from "../stores/usePageTransition";
import { useFilterStore } from "../stores/useFilter";

function ProjectDetailBtn() {

    const requestTransition = usePageTransition((s) => s.requestTransition);
    const currentProject = useFilterStore((s) => s.currentProject);

    const isDetailPage = !!useMatch("/projects/:slug");

    const buttonText = isDetailPage ? "back" : "details";
    const scrambleKey = currentProject?.slug ?? "no-project";

    const handleClick = () => {
        if (!isDetailPage) {
            requestTransition(`/projects/${currentProject?.slug ?? ""}`);
            return;
        }

        requestTransition("/projects");
    };

    return (
        <span
            onClick={handleClick}
            className='hoverEl px-4 pt-2 pb-2 border border-text  hover:border-text-highlight rounded-4xl z-50'
        >
            <ScrambleText
                key={scrambleKey}
                text={buttonText}
            />
        </span>
    );
}

export default ProjectDetailBtn;
