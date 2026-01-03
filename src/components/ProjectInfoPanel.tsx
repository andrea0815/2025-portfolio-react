import { useEffect, useState } from 'react';
import ScrambleText from "../components/base/ScrambleText";

import { useProjectsStore } from "../stores/useProjects";

import type { ProjectLink } from "../stores/useContentful";
import GalleryLinkButton from './gallery/GalleryLinkButton';

function ProjectInfoPanel() {
    const activeProject = useProjectsStore((s) => s.activeProject);
    const [links, setLinks] = useState<ProjectLink[]>([]);


    useEffect(() => {
        setLinks(activeProject?.links ?? []);
    }, [activeProject]);


    return (
        <div className='flex flex-row flex-wrap-reverse gap-3 text-right align-right justify-end '>
            {links.map((link: ProjectLink, index: number) => (
                <GalleryLinkButton
                    key={index}
                    text={link.buttonText}
                    url={link.url}
                />
            ))}
        </div>
    );
}

export default ProjectInfoPanel;
