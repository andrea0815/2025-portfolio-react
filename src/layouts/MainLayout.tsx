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
            <div className="h-full w-full fixed py-6 
            grid 
            grid-cols-[var(--spacing-7)_1fr_var(--spacing-7)] 
            lg:grid-cols-[var(--spacing-8)_1fr_var(--spacing-8)] 
            [grid-template-areas:'sidebar_main_social']
            ">
                <div className="[grid-area:sidebar] flex flex-col justify-between items-center">
                    <LogoBtn />
                    <ThemeBtn />
                </div>
                <div className="[grid-area:main] flex justify-end items-end">
                    <Outlet />
                </div>
                <Terminal />
                {!isHome && <Nav />}
                <div className="[grid-area:social] flex flex-col items-center">
                    <SocialList />
                </div>
            </div>
        </>

    );
}

export default MainLayout;
