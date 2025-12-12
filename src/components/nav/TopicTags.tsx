import { useMemo, Fragment, useState, useEffect } from "react";

import { useContentful } from "../../stores/useContentful";
import { useTopicStore } from "../../stores/useTopic";
import { useTerminalStore } from "../../stores/useTerminal";

import TopicTag from "./TopicTag";

import type { Topic } from "../../stores/useContentful";

function TopicTags() {

    // stores
    const topics = useContentful((s) => s.topics);
    const currentTopic = useTopicStore((s) => s.currentTopic);
    const setCurrentTopic = useTopicStore((s) => s.setCurrentTopic);
    const clearAllFilters = useTopicStore((s) => s.clearAllFilters);
    const enqueueLine = useTerminalStore((s) => s.enqueueLine);
    const clearTerminalActives = useTerminalStore((s) => s.clearActives);
    const clearQueue = useTerminalStore((s) => s.clearQueue);


    const [showAll, setShowAll] = useState(false);

    function reorderArray(tagArray: Topic[], currentTag: string) {
        const index = tagArray.findIndex((t) => t.name === currentTag);
        if (index === -1) return tagArray;

        return [
            tagArray[index],
            ...tagArray.slice(0, index),
            ...tagArray.slice(index + 1),
        ];
    }

    // Always reorder based on latest topics and selected topic
    const reorderedTopics = useMemo(() => {
        if (!topics || !currentTopic) return topics;
        return reorderArray(topics, currentTopic.name);
    }, [topics, currentTopic]);

    function handleClick(topic: Topic) {
        if (!currentTopic) return;

        if (topic.name === currentTopic.name) {
            setShowAll((prev) => !prev);
        } else {
            setCurrentTopic(topic);

            clearQueue();
            clearTerminalActives();
            enqueueLine("");
            enqueueLine(">> changed to " + topic.name);

            clearAllFilters();
            setShowAll(false);
        }
    }

    const visibleTopics = showAll
        ? reorderedTopics
        : reorderedTopics?.filter((t) => t.name === currentTopic?.name);

    return (
        <>
            {visibleTopics?.map((topic, i) => (
                <Fragment key={topic.name}>
                    <TopicTag
                        text={topic.name}
                        isCurrent={topic.name === currentTopic?.name}
                        onSelect={() => handleClick(topic)}
                    />
                    {i !== visibleTopics.length - 1 && <span className="topicEl">,</span>}
                </Fragment>
            ))}
        </>
    );
}

export default TopicTags;
