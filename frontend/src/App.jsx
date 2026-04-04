import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
// Lazy-loaded pages (code splitting)
import Landingpage from "./pages/Landingpage";
const AuthPage = lazy(() => import("./pages/AuthPage"));
const Home = lazy(() => import("./pages/Home"));
const Project = lazy(() => import("./pages/Project"));
const NotFound = lazy(() => import("./components/NotFound"));

// Authentication
import Loader from "./components/PageLoader";
import ComponentLoader from "./components/LoadingAnimation";
import UserAuth from "./auth/UserAuth";

// Context API
import { UserProvider } from "./contexts/user.context";
import { ProjectProvider } from "./contexts/project.context";

const App = () => {
  return (
    <UserProvider>
      <ProjectProvider>
        <BrowserRouter>
          <Routes>
            {/* Landing page loads immediately */}
            <Route path="/" element={<Landingpage />} />

            {/* auth route */}
            <Route
              path="/auth/:type"
              element={
                <Suspense fallback={<Loader />}>
                  <AuthPage />
                </Suspense>
              }
            />

            {/* Protected + lazy-loaded */}
            <Route element={<UserAuth />}>
              <Route
                path="/home"
                element={
                  <Suspense fallback={<Loader />}>
                    <Home />
                  </Suspense>
                }
              />

              <Route
                path="/project"
                element={
                  <Suspense fallback={<ComponentLoader />}>
                    <Project />
                  </Suspense>
                }
              />
            </Route>

            {/* Not Found */}
            <Route
              path="*"
              element={
                <Suspense fallback={<Loader />}>
                  <NotFound />
                </Suspense>
              }
            />
          </Routes>
        </BrowserRouter>
      </ProjectProvider>
    </UserProvider>
  );
};

export default App;
