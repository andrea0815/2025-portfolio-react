import gsap from 'gsap';
import { SplitText } from "gsap/all";

// @ts-ignore
import { ScrambleTextPlugin } from "gsap/all";
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider
} from "react-router-dom";

gsap.registerPlugin(ScrambleTextPlugin, SplitText);

// Page imports
import MainLayout from "./layouts/MainLayout";
import LandingPage from "./pages/LandingPage";
import ProjectsPage from "./pages/ProjectsPage";
import AboutPage from "./pages/AboutPage";
import PageNotFound from "./pages/PageNotFound";

function App() {

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<MainLayout />}>
        <Route index element={<LandingPage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="*" element={<PageNotFound />} />
      </Route>
    )
  )

  return <RouterProvider router={router} />;
}

export default App;
