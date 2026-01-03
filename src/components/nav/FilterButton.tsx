import { useLocation } from "react-router-dom";

import { useFilterStore } from "../../stores/useFilter";

import FilterTag from "./FilterTag";

type FilterButtonProps = {
    showAll: boolean;
    setShowAll: React.Dispatch<React.SetStateAction<boolean>>;
}

function FilterButton({ showAll, setShowAll }: FilterButtonProps) {
    const location = useLocation();
    const isProjects = location.pathname.startsWith("/projects");

    const clearAllFilters = useFilterStore((s) => s.clearAllFilters); // the true "current" topic

    function toggleFilterVisibility() {
        setShowAll((prev) => !prev);
        clearAllFilters();
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
