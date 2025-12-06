import FilterTags from "./FilterTags";
import TopicTags from "./TopicTags";


function NavSide() {

    return (
        <>
            <span className="mx-3">&gt;&gt;</span>
            <span className="mx-2">&#123;</span>
            <TopicTags />
            <span className="mx-3">&#125;</span>
            <span className="mx-3">&gt;&gt;</span>
            <FilterTags />
        </>
    );
}

export default NavSide;
