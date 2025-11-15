import { Link } from "react-router-dom";


import LogoIcon from './icons/LogoIcon';

function ThemeBtn() {

    return (
        <Link to="/" className="translate-y-1/4">
            <LogoIcon />
        </Link>
    );
}

export default ThemeBtn;
