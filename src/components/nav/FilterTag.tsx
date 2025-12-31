import { useEffect, useState } from "react";
import ScrambleText from '../base/ScrambleText';

import { useTopicStore } from "../../stores/useTopic";
import { useTerminalStore } from "../../stores/useTerminal";
import { useContentful } from "../../stores/useContentful";

import type { Tag } from "../../stores/useContentful";
import type { Tool } from "../../stores/useContentful";


import textData from "../../texts.json";

type FilterTagProps = {
  tag: Tag;
  isProjectTag: boolean;
  onSelect: () => void;
};

function FilterTag({ tag, isProjectTag, onSelect }: FilterTagProps) {

  const tools: Tool[] = useContentful((s) => s.tools);

  const addFilter = useTopicStore((s) => s.addFilter);
  const removeFilter = useTopicStore((s) => s.removeFilter);
  const clearAllFilters = useTopicStore((s) => s.clearAllFilters);
  const currentFilters = useTopicStore((s) => s.currentFilters);

  const enqueueLine = useTerminalStore((s) => s.enqueueLine);
  const enqueueMultiple = useTerminalStore((s) => s.enqueueMultiple);
  const clearTerminalActives = useTerminalStore((s) => s.clearActives);
  const clearQueue = useTerminalStore((s) => s.clearQueue);

  const workExperienceText = textData.workExperience;
  const educationText = textData.education;
  const toolsText = tools;
  const meText = textData.aboutMe[0];
  const aboutTags = textData.aboutTags;

  const [isActive, setIsActive] = useState(false);

  const classList = isActive ? 'hoverEl ml-3 text-text-highlight flex flex-row' : 'hoverEl ml-3 text-text flex flex-row';

  const handleClick = () => {
    onSelect();
    clearQueue();
    clearTerminalActives();
    if (isProjectTag) {
      handleProjectsClick();
    } else {
      handleAboutClick();
    }
  }

  const handleProjectsClick = () => {
    if (!isActive) {
      addFilter(tag);
      enqueueLine(`>> applied filter: &lt;${tag.name}&gt;`);
    } else {
      removeFilter(tag);
      enqueueLine(`>> removed filter: &lt;${tag.name}&gt;`);
    }
  }

  const handleAboutClick = () => {
    if (!isActive) {
      clearAllFilters();
      addFilter(tag);
      enqueueLine("");

      if (tag.name === aboutTags[0].name) {
        enqueueLine(meText);
      } else if (tag.name === aboutTags[1].name) {
        enqueueLine(`>> my education`);
        enqueueLine("");
        enqueueMultiple(educationText);
      } else if (tag.name === aboutTags[2].name) {
        enqueueLine(`>> my work experience`);
        enqueueLine("");
        enqueueMultiple(workExperienceText);
      } else if (tag.name === aboutTags[3].name) {
        enqueueLine(`>> tools i work with`);
        enqueueLine("");
        const toolNames = toolsText.map((tool) => `${tool.name}`);
        enqueueMultiple(toolNames);
      }
    }
  }

  useEffect(() => {
    currentFilters.find((f) => f.name === tag.name) ? setIsActive(true) : setIsActive(false);
  }, [currentFilters])

  return (
    <a onClick={handleClick} className={classList}>
      <span className="text-inherit">&lt;</span>
      <ScrambleText text={tag.name} />
      <span className="text-inherit">&gt;</span>
    </a>
  );
}

export default FilterTag;
