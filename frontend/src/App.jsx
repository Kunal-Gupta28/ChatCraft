import { BrowserRouter, Routes, Route } from "react-router-dom";
import React, { Suspense } from "react";

// Lazy-loaded pages (code splitting)
const Landingpage = React.lazy(() => import("./pages/Landingpage"));
const Register = React.lazy(() => import("./pages/Register"));
const Login = React.lazy(() => import("./pages/Login"));
const Home = React.lazy(() => import("./pages/Home"));
const Project = React.lazy(() => import("./pages/Project"));
const NotFound = React.lazy(() => import("./components/NotFound"));

// Authentication 
import UserAuth from "./auth/UserAuth";

// loading animtion 
import Loader from "./components/LoadingAnimation";

// Context API
import { UserProvider } from "./contexts/user.context";
import { ProjectProvider } from "./contexts/project.context";

const App = () => {
  return (
    // Global User Context
    <UserProvider>

      {/* Global Project Context */}
      <ProjectProvider>

        {/* Router Wrapper */}
        <BrowserRouter>

          {/* Suspense fallback for lazy-loaded components */}
          <Suspense fallback={<Loader/>}>

            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Landingpage />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />

              {/* Protected Routes (User must be authenticated) */}
              <Route element={<UserAuth />}>
                <Route path="/home" element={<Home />} />
                <Route path="/project" element={<Project />} />
              </Route>

              {/* 404 Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>

          </Suspense>
        </BrowserRouter>
      </ProjectProvider>
    </UserProvider>
  );
};

export default App;
