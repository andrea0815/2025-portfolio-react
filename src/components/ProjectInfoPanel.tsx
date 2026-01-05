import { useEffect, useState } from 'react';
import ScrambleText from "../components/base/ScrambleText";

import { useFilterStore } from "../stores/useFilter";

import type { ProjectLink } from "../stores/useContentful";
import GalleryLinkButton from './gallery/GalleryLinkButton';

function ProjectInfoPanel() {
    const currentProject = useFilterStore((s) => s.currentProject);
    const [links, setLinks] = useState<ProjectLink[]>([]);


    useEffect(() => {
        setLinks(currentProject?.links ?? []);
    }, [currentProject]);


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
