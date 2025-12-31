import { Fragment, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import { useTopicStore } from "../../stores/useTopic";
import textData from "../../texts.json";

import type { Tag } from "../../stores/useContentful";

import FilterTag from "./FilterTag";

function FilterTags() {

    // navigation
    const location = useLocation();
    const isProjects = location.pathname === "/projects";

    // stores
    const currentTopic = useTopicStore((s) => s.currentTopic); // the true "current" topic
    const aboutTags = textData.aboutTags as Tag[]; // the true "current" topic

    const [projectTagArray, setProjectTagArray] = useState<Tag[]>(currentTopic.tags); // array for this component
    const [aboutTagArray, setAboutTagArray] = useState<Tag[]>(aboutTags); // array for this component
    const [tagArray, setTagArray] = useState<Tag[]>(isProjects ? projectTagArray : aboutTagArray); // array for this component
    const [showAll, setShowAll] = useState(false); // indicates if all topics are shown or only the current one

    useEffect(() => {
        if (!isProjects) {
            setShowAll(true);
        };
    })

    useEffect(() => {
        setProjectTagArray(currentTopic.tags);
    }, [currentTopic]);

    useEffect(() => {
        // set correct tag array and filter tag visibility based on current path
        setTagArray(isProjects ? projectTagArray : aboutTagArray);
        setShowAll(!isProjects); 
    }, [isProjects, projectTagArray, aboutTagArray]);

    function toggleFilterVisibility() {
        setShowAll((prev) => !prev);
    }

    const visibleTags = showAll
        ? tagArray
        : [];
    const filterButtonText = showAll || !isProjects ? "X" : "filters";

    return (
        <>
            {visibleTags?.map((tag: Tag) => (
                <Fragment key={tag.name}>
                    <FilterTag
                        tag={tag}
                        onSelect={() => { }}
                        isProjectTag={isProjects}
                    />
                </Fragment>
            ))}
            {isProjects &&
                <FilterTag
                    tag={{ name: filterButtonText }}
                    onSelect={() => { toggleFilterVisibility() }}
                    isProjectTag={false}
                />
            }
        </>
    );
}

export default FilterTags;
