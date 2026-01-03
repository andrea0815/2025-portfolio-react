import { Route, createBrowserRouter, createRoutesFromElements, RouterProvider } from "react-router-dom";
import { useEffect } from "react";
import { ScrambleTextPlugin, SplitText, ScrollTrigger } from "gsap/all";
// @ts-ignore
import gsap from 'gsap';

// stores
import { useContentful } from "./stores/useContentful";
import { useFilterStore } from "./stores/useFilter";

// Page imports
import MainLayout from "./layouts/MainLayout";
import LandingPage from "./pages/LandingPage";
import ProjectsPage from "./pages/ProjectsPage";
import AboutPage from "./pages/AboutPage";
import PageNotFound from "./pages/PageNotFound";
import ProjectDetailPage from "./pages/ProjectDetailPage";

// register GSAP plugins
gsap.registerPlugin(ScrambleTextPlugin, SplitText, ScrollTrigger);

function App() {
  const fetchAll = useContentful((s) => s.fetchAll);
  const loading = useContentful((s) => s.loading);
  const error = useContentful((s) => s.error);
  const topics = useContentful((s) => s.topics);

  const setCurrentTopic = useFilterStore((s) => s.setCurrentTopic);

  useEffect(() => {
    fetchAll();
  }, []);

  // Set default current topic AFTER Contentful is loaded
  useEffect(() => {
    if (!loading && topics && topics.length > 0) {
      setCurrentTopic(topics[1]); // or whatever you want the default to be      
    }
  }, [loading, topics]);

  // Wait for Contentful BEFORE rendering router
  if (loading) {
    return <div className="p-6 text-center">Loading content…</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-500">Error loading content.</div>;
  }

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<MainLayout />}>
        <Route index element={<LandingPage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/projects/*" element={<ProjectDetailPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="*" element={<PageNotFound />} />
      </Route>
    )
  );

  return <RouterProvider router={router} />;
}

export default App;
