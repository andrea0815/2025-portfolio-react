import { useEffect, useState } from "react";

import type { Tag } from "../../stores/useContentful";
import { useTopicStore } from "../../stores/useTopic";
import { useTerminalStore } from "../../stores/useTerminal";

import ScrambleText from '../base/ScrambleText';

type FilterTagProps = {
  tag: Tag;
  onSelect: () => void;
};

function FilterTag({ tag, onSelect }: FilterTagProps) {

  const addFilter = useTopicStore((s) => s.addFilter);
  const removeFilter = useTopicStore((s) => s.removeFilter);
  const currentFilters = useTopicStore((s) => s.currentFilters);
  const enqueueLine = useTerminalStore((s) => s.enqueueLine);
  const clearTerminalActives = useTerminalStore((s) => s.clearActives);
  const clearQueue = useTerminalStore((s) => s.clearQueue);

  const [isActive, setIsActive] = useState(false);

  const classList = isActive ? 'hoverEl ml-3 text-text-highlight' : 'hoverEl ml-3 text-text';

  const handleClick = () => {
    // onSelect();
    toggleFilter();
  }

  const toggleFilter = () => {
    if (!isActive) {
      addFilter(tag);
      // clearQueue();
      // clearTerminalActives();
      enqueueLine(">> applied filter: " + tag.name);
    } else {
      removeFilter(tag);
      // clearQueue();
      // clearTerminalActives();
      enqueueLine(">> removed filter: " + tag.name);
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
