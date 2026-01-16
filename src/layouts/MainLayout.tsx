import { Outlet } from "react-router-dom";
import { usePageTransition } from "../stores/usePageTransition";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

import ThemeBtn from '../components/nav/ThemeBtn';
import LogoBtn from '../components/nav/LogoBtn';

import Nav from "../components/nav/Nav";
import Heading from "../components/Heading";
import SocialList from "../components/SocialList";
import Terminal from "../components/Terminal";
import CustomCursor from "../components/cursor/CustomCursor";
import Gallery from "../components/gallery/Gallery";
import GalleryNav from "../components/gallery/GalleryNav";


function MainLayout() {

    const navigate = useNavigate();
    const setNavigateFn = usePageTransition((s) => s.setNavigateFn);

    useEffect(() => {
        setNavigateFn(navigate);
    }, []);

    return (
        <>
            <div
                className="
                    fixed h-full w-full 
                    grid 
                    grid-cols-[var(--spacing-4)_1fr_var(--spacing-4)]
                    md:grid-cols-[var(--spacing-8)_1fr_var(--spacing-8)]
                    lg:grid-cols-[var(--spacing-8)_1fr_var(--spacing-8)]
                    grid-rows-[100dvh]            
                    [grid-template-areas:'sidebar_main_social']
                ">
                <div className="[grid-area:sidebar] hidden md:flex flex-col justify-between items-center md:py-6">
                    <LogoBtn />
                    <GalleryNav />
                    <ThemeBtn />
                </div>

                <div className="[grid-area:main] self-end flex flex-col md:flex-row gap-4 md:gap-6 md:items-stretch lg:justify-start justify-end md:pb-6 pb-4 min-h-0 h-full">
                    <div className="md:flex-2 flex items-end max-h-[42%] md:max-h-full overflow-hidden">
                        <div className="w-full h-full overflow-hidden flex items-end">
                            <Terminal />
                        </div>
                    </div>

                    <div className="md:flex-1 flex md:items-end justify-start md:justify-end min-h-0">
                        <Outlet />
                    </div>
                </div>

                <Nav />
                <Heading />
                <Gallery />

                <div className="[grid-area:social] hidden md:flex flex-col items-center lg:py-6 py-4">
                    <SocialList />
                </div>
            </div>
            <CustomCursor />
        </>


    );
}

export default MainLayout;
