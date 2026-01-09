import { useLocation } from "react-router-dom";

type CursorLoaderProps = {
    ref: React.Ref<HTMLDivElement | null>
}

function CursorLoader({ ref }: CursorLoaderProps) {

    const location = useLocation();
    const isLanding = location.pathname === "/";

    return (
        <div
            ref={ref}
            className={`fixed bottom-[0px] left-0 w-screen opacity-0 h-2 bg-loader scale-x-0 
                ${isLanding ? "origin-left" : "origin-right"}
                `}
        ></div>
    );
}

export default CursorLoader;
