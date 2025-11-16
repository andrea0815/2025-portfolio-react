import { Outlet, useLocation } from "react-router-dom";
import ThemeBtn from '../components/ThemeBtn';
import LogoBtn from '../components/LogoBtn';


import Nav from "../components/Nav";
import SocialList from "../components/SocialList";
import Terminal from "../components/Terminal";

function MainLayout() {

    const location = useLocation();
    const isHome = location.pathname === "/";

    return (
        <>
            <div
                className="
    fixed h-full w-full 
    grid 
    grid-cols-[var(--spacing-7)_1fr_var(--spacing-7)]
    lg:grid-cols-[var(--spacing-8)_1fr_var(--spacing-8)]
    grid-rows-[100dvh]            
    [grid-template-areas:'sidebar_main_social']
  "
            >
                <div className="[grid-area:sidebar] flex flex-col justify-between items-center lg:py-6 py-4">
                    <LogoBtn />
                    <ThemeBtn />
                </div>

                <div className="[grid-area:main] flex flex-col md:flex-row gap-6 md:items-stretch lg:pb-6 pb-4 min-h-0 h-full">
                    <div className="flex-1 flex items-end min-h-0 overflow-hidden">
                        <div className="w-full h-full overflow-hidden flex items-end">
                            <Terminal />
                        </div>
                    </div>

                    <div className="flex-1 flex items-end md:justify-end min-h-0 overflow-hidden">
                        <Outlet />
                    </div>
                </div>

                {!isHome && <Nav />}

                <div className="[grid-area:social] flex flex-col items-center lg:py-6 py-4">
                    <SocialList />
                </div>
            </div>

        </>

    );
}

export default MainLayout;
