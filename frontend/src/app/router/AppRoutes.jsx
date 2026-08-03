import { Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";

// import pages
import Landingpage from "../../pages/Landing";
import FeaturesPage from "../../pages/FeaturesPage";
import HowItWorksPage from "../../pages/HowItWorksPage";
import ArchitecturePage from "../../pages/ArchitecturePage";
import SecurityPage from "../../pages/SecurityPage";
import LoginPage from "../../pages/auth/LoginPage";
import SignupPage from "../../pages/auth/SignupPage";
import ForgotPasswordPage from "../../pages/auth/ForgotPasswordPage";
import NotFound from "../../pages/NotFound";

// lazy import
const Home = lazy(() => import("../../pages/Home"));
const Project = lazy(() => import("../../pages/Project"));

// loader & error boundary
import Loader from "../../components/PageLoader";
import ComponentLoader from "../../components/LoadingAnimation";
import ErrorBoundary from "../../components/ErrorBoundary";

// layout 
import ProtectedLayout from "../layouts/ProtectedLayout";
import ProjectLayout from "../layouts/ProjectLayout";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Landing / Marketing Routes */}
      <Route
        path="/"
        element={
          <ErrorBoundary>
            <Landingpage />
          </ErrorBoundary>
        }
      />
      <Route
        path="/features"
        element={
          <ErrorBoundary>
            <FeaturesPage />
          </ErrorBoundary>
        }
      />
      <Route
        path="/how-it-works"
        element={
          <ErrorBoundary>
            <HowItWorksPage />
          </ErrorBoundary>
        }
      />
      <Route
        path="/architecture"
        element={
          <ErrorBoundary>
            <ArchitecturePage />
          </ErrorBoundary>
        }
      />
      <Route
        path="/security"
        element={
          <ErrorBoundary>
            <SecurityPage />
          </ErrorBoundary>
        }
      />

      {/* Auth Routes */}
      <Route
        path="/auth/login"
        element={
          <ErrorBoundary>
            <LoginPage />
          </ErrorBoundary>
        }
      />
      <Route
        path="/auth/signup"
        element={
          <ErrorBoundary>
            <SignupPage />
          </ErrorBoundary>
        }
      />
      <Route
        path="/auth/forgot-password"
        element={
          <ErrorBoundary>
            <ForgotPasswordPage />
          </ErrorBoundary>
        }
      />

      {/* Protected Application Routes */}
      <Route element={<ProtectedLayout />}>
        <Route
          path="/dashboard"
          element={
            <ErrorBoundary>
              <Suspense fallback={<Loader />}>
                <Home />
              </Suspense>
            </ErrorBoundary>
          }
        />

        <Route path="/home" element={<Navigate to="/dashboard" replace />} />

        <Route
          path="/project/:projectId"
          element={
            <ErrorBoundary>
              <Suspense fallback={<ComponentLoader />}>
                <ProjectLayout>
                  <Project />
                </ProjectLayout>
              </Suspense>
            </ErrorBoundary>
          }
        />
      </Route>

      {/* Catch-all Not Found Route */}
      <Route
        path="*"
        element={
          <ErrorBoundary>
            <NotFound />
          </ErrorBoundary>
        }
      />
    </Routes>
  );
};

export default AppRoutes;