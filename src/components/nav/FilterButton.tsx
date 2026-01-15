import { useLocation } from "react-router-dom";

import { useFilterStore } from "../../stores/useFilter";
import { useTerminalStore } from "../../stores/useTerminal";


import FilterTag from "./FilterTag";

type FilterButtonProps = {
    showAll: boolean;
    setShowAll: React.Dispatch<React.SetStateAction<boolean>>;
}

function FilterButton({ showAll, setShowAll }: FilterButtonProps) {
    const location = useLocation();
    const isProjects = location.pathname.startsWith("/projects");

    const clearAllFilters = useFilterStore((s) => s.clearAllFilters); // the true "current" topic
    const enqueueLine = useTerminalStore((s) => s.enqueueLine);
    const clearTerminalActives = useTerminalStore((s) => s.clearActives);


    function toggleFilterVisibility() {
        setShowAll(prev => {
            const next = !prev;

            if (!next) {
                clearAllFilters();
                clearTerminalActives();
                enqueueLine(`>> all filters removed`);
            }

            return next;
        });
    }

    const filterButtonText = showAll || !isProjects ? "X" : "filters";

    return (
        <>
            {isProjects &&
                <FilterTag
                    tag={{ name: filterButtonText }}
                    onSelect={() => { toggleFilterVisibility() }}
                    isProjectTag={false}
                    isFilterButton={true}
                />
            }
        </>
    );
}

export default FilterButton;
