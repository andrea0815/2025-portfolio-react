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
        console.log(currentTopic);

        setProjectTagArray(currentTopic.tags);
    }, [currentTopic]);

    useEffect(() => {
        setTagArray(isProjects ? projectTagArray : aboutTagArray);
    }, [isProjects, projectTagArray, aboutTagArray]);

    function handleClick(tagName: string) {
        if (tagName === "filter") {
            // clicking on the current topic toggles visibility
            setShowAll((prev) => !prev);
        } else {
            // clicking on another topic selects it
            setShowAll(false); // collapse again
        }
    }

    // const visibleTags = showAll
    //     ? projectTagArray // show everything
    //     : [{name: "filter"}]; // show only selected
    const visibleTags = tagArray; // show only selected

    return (
        <>
            {visibleTags?.map((tag: Tag) => (
                <Fragment key={tag.name}>
                    <FilterTag
                        tag={tag}
                        onSelect={() => handleClick(tag.name)}
                        isProjectTag={isProjects}
                    />
                </Fragment>
            ))}
        </>
    );
}

export default FilterTags;
