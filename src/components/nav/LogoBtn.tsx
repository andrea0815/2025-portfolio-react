import { Link } from "react-router-dom";
import { usePageTransition } from "../../stores/usePageTransition";
import LogoIcon from '../icons/LogoIcon';

function LogoBtn() {

    const {
        isTransitioning,
        registerAnimation,
        finishAnimation,
        completeTransition,
        requestTransition,
        targetRoute,
    } = usePageTransition();

    function handleClick(
        e: React.MouseEvent<HTMLAnchorElement>,
        to: string
    ) {
        e.preventDefault();
        if (location.pathname === to) return;
        requestTransition(to);
    }

    return (
        <Link
            to="/"
            onClick={(e) => handleClick(e, "/")}
            className="md:translate-y-1/4 z-50">
            <LogoIcon />
        </Link>
    );
}

export default LogoBtn;
