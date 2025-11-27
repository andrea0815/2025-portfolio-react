import textData from "../../texts.json";
import SectionTags from "./SectionTags";


function NavSide() {

    const sectionTags: string[] = textData.sections;
    console.log(sectionTags);


    return (
        <>
            <span className="mx-3">&gt;&gt;</span>
            <span className="mx-2">&#123;</span>
            <SectionTags />
            <span className="mx-3">&#125;</span>
            <span className="mx-3">&gt;&gt;</span>
        </>
    );
}

export default NavSide;
