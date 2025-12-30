import { useEffect, useState } from 'react';
import ScrambleText from "../components/base/ScrambleText";

import { useProjectsStore } from "../stores/useProjects";
import { usePageTransition } from "../stores/usePageTransition";

import type { Tag } from "../stores/useContentful";

function ProjectInfoPanel() {
    const activeProject = useProjectsStore((s) => s.activeProject);
    const [tags, setTags] = useState<Tag[]>([]);

    useEffect(() => {
        console.log(activeProject);
        
        setTags(activeProject ? activeProject.tags : []);
    }, [activeProject]);

    return (
        <div>
            {tags.map((tag: Tag, index: number) => (
                <div key={index}>
                    <ScrambleText text={tag.name} />
                </div>
            ))}
        </div>
    );
}

export default ProjectInfoPanel;
