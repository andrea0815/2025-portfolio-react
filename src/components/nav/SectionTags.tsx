import SectionTag from "./SectionTag";
import textData from "../../texts.json";
import { Fragment } from "react";

function SectionTags() {
    const sectionTags: string[] = textData.sections;

    return (
        <>
            {sectionTags.map((tag, index) => (

                <Fragment key={index}>
                    <SectionTag text={tag} />
                    {index !== sectionTags.length - 1 && <span>,</span>}
                </Fragment>

            ))}
        </>
    );
}

export default SectionTags;
