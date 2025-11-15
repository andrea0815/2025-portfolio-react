import Icon from "./Icon"

function LogoIcon() {
    return (
        <Icon size={30}>
            <svg
                className="text-text"
                fill="currentColor"
                stroke="currentColor"
                strokeWidth="0"
                id="Layer_2" xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 50 50">
                <path d="M13,44.4L0,31.1l1.8-1.9,11.1,11.4,12-12.3,12,12.3,11.1-11.4,1.8,1.9-13,13.3-12-12.3-12,12.3Z" />
                <path d="M43,25.9L25,7.4,7.1,25.7l-1.8-1.9L25,3.6l19.9,20.4-1.8,1.9Z" />
            </svg>
        </Icon>
    );
}

export default LogoIcon;
