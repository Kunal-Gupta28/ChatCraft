import { Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";

// Direct static imports for instant marketing & auth page rendering (no black screen or suspense flickering)
import Landingpage from "../../pages/Landing";
import FeaturesPage from "../../pages/FeaturesPage";
import HowItWorksPage from "../../pages/HowItWorksPage";
import ArchitecturePage from "../../pages/ArchitecturePage";
import SecurityPage from "../../pages/SecurityPage";
import LoginPage from "../../pages/auth/LoginPage";
import SignupPage from "../../pages/auth/SignupPage";
import ForgotPasswordPage from "../../pages/auth/ForgotPasswordPage";
import NotFound from "../../pages/NotFound";

// Lazy-loaded application workspace routes
const Home = lazy(() => import("../../pages/Home"));
const Project = lazy(() => import("../../pages/Project"));

// Loaders & Error Boundary
import ComponentLoader from "../../components/LoadingAnimation";
import ErrorBoundary from "../../components/ErrorBoundary";
import ProtectedLayout from "../layouts/ProtectedLayout";
import ProjectLayout from "../layouts/ProjectLayout";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Instant Marketing & Public Routes */}
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

      {/* Instant Authentication Routes */}
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

      {/* Protected Application Workspace Routes */}
      <Route element={<ProtectedLayout />}>
        <Route
          path="/dashboard"
          element={
            <ErrorBoundary>
              <Suspense fallback={<ComponentLoader />}>
                <Home />
              </Suspense>
            </ErrorBoundary>
          }
        />
        <Route element={<ProjectLayout />}>
          <Route
            path="/project/:projectId"
            element={
              <ErrorBoundary>
                <Suspense fallback={<ComponentLoader />}>
                  <Project />
                </Suspense>
              </ErrorBoundary>
            }
          />
        </Route>
      </Route>

      {/* Fallback & Redirects */}
      <Route path="/home" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;