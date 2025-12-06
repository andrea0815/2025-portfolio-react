import { Fragment, useEffect, useState } from "react";
import { useTopicStore } from "../../stores/useTopic";

import type { Tag } from "../../stores/useContentful";

import FilterTag from "./FilterTag";

function FilterTags() {

    const currentTopic = useTopicStore((s) => s.currentTopic); // the true "current" topic
    const [tagArray, setTagArray] = useState<Tag[]>(currentTopic.tags); // array for this component

    const [showAll, setShowAll] = useState(false); // indicates if all topics are shown or only the current one

    useEffect(() => {
        setTagArray(currentTopic.tags);
    }, [currentTopic]);

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
    //     ? tagArray // show everything
    //     : [{name: "filter"}]; // show only selected
    const visibleTags = tagArray; // show only selected

    return (
        <>
            {visibleTags?.map((tag: Tag) => (
                <Fragment key={tag.name}>
                    <FilterTag
                        tag={tag}
                        onSelect={() => handleClick(tag.name)}
                    />
                </Fragment>
            ))}
        </>
    );
}

export default FilterTags;
