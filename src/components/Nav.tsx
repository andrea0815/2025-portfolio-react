import { NavLink } from "react-router-dom";

function Nav() {

    const linkClass = ({ isActive }: { isActive: boolean }) => isActive
        ? "text-text-highlight px-4 pt-2 pb-2 border-1 rounded-4xl border-text-highlight"
        : "text-text  px-4 pt-2 pb-2 border-1 rounded-4xl border-transparent";

    return (<>
        <div className="lg:pt-6 pt-4 [grid-area:main] self-start z-50">
            <div className=' flex flex-row px-2 py-2 bg-grayish gap-2 w-fit rounded-4xl'>
                <NavLink to="/projects" className={linkClass}>&lt;projects&gt;</NavLink>
                <NavLink to="/about" className={linkClass}>&lt;about&gt;</NavLink>
            </div>

            <p>
                <span>Creative Computing</span>
            </p>
        </div>


    </>
    );
}

export default Nav;
