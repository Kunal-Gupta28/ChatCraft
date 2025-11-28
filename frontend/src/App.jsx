import { BrowserRouter, Routes, Route } from "react-router-dom";
import React, { Suspense } from "react";
import Landingpage from "./pages/Landingpage";

// Lazy-loaded pages (code splitting)
const Register = React.lazy(() => import("./pages/Register"));
const Login = React.lazy(() => import("./pages/Login"));
const Home = React.lazy(() => import("./pages/Home"));
const Project = React.lazy(() => import("./pages/Project"));
const NotFound = React.lazy(() => import("./components/NotFound"));

// Authentication
import UserAuth from "./auth/UserAuth";

// Loading animation
import Loader from "./components/LoadingAnimation";

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

            {/* Lazy-loaded + public */}
            <Route
              path="/register"
              element={
                <Suspense fallback={<Loader />}>
                  <Register />
                </Suspense>
              }
            />

            <Route
              path="/login"
              element={
                <Suspense fallback={<Loader />}>
                  <Login />
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
                  <Suspense fallback={<Loader />}>
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
