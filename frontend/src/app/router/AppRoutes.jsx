import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";

// import page
import Landingpage from "../../pages/Landing";
import LoginPage from "../../pages/auth/LoginPage";
import SignupPage from "../../pages/auth/SignupPage";
import NotFound from "../../pages/NotFound";

// lazy import
const Home = lazy(() => import("../../pages/Home"));
const Project = lazy(() => import("../../pages/Project"));

// loader
import Loader from "../../components/PageLoader";
import ComponentLoader from "../../components/LoadingAnimation";

// layout 
import ProtectedLayout from "../layouts/ProtectedLayout";
import ProjectLayout from "../layouts/ProjectLayout";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Landingpage />} />

      <Route path="/auth/login" element={<LoginPage />} />

      <Route path="/auth/signup" element={<SignupPage />} />

      <Route element={<ProtectedLayout />}>
        <Route
          path="/home"
          element={
            <Suspense fallback={<Loader />}>
              <Home />
            </Suspense>
          }
        />

        <Route
          path="/project/:projectId"
          element={
            <Suspense fallback={<ComponentLoader />}>
              <ProjectLayout>
                <Project />
              </ProjectLayout>
            </Suspense>
          }
        />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;