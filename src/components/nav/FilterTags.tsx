import FilterTag from "./FilterTag";
import textData from "../../texts.json";
import { Fragment } from "react";

function FilterTags() {
    const filterTags: string[] = textData.sections;

    return (
        <>
            {filterTags.map((tag, index) => (

                <Fragment key={index}>
                    <FilterTag text={tag} />
                    {index !== filterTags.length - 1 && <span>,</span>}
                </Fragment>

            ))}
        </>
    );
}

export default FilterTags;