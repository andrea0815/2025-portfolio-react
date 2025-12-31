import { useEffect, useState } from 'react';
import ScrambleText from "../components/base/ScrambleText";

import { useProjectsStore } from "../stores/useProjects";

import type { Tag } from "../stores/useContentful";

function ProjectInfoPanel() {
    const activeProject = useProjectsStore((s) => s.activeProject);
    const [tags, setTags] = useState<Tag[]>([]);

    // useEffect(() => {
    //     const newTags: Tag[] =
    //         activeProject?.tags
    //             ?.map((t: any) => ({ name: t.fields?.name }))
    //             .filter((t: Tag) => Boolean(t.name)) ?? [];

    //     setTags(newTags);
    // }, [activeProject]);


    return (
        <div className='flex flex-row flex-wrap-reverse gap-3 text-right hover:text-highlight align-right justify-end '>
            {tags.map((tag: Tag, index: number) => (
                <ScrambleText
                    key={index}
                    text={"&lt;" + tag.name + "&gt;"}
                />
            ))}
        </div>
    );
}

export default ProjectInfoPanel;
