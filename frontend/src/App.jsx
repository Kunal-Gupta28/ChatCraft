import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Lazy-loaded pages (code splitting)
import Landingpage from "./pages/Landing";
const AuthPage = lazy(() => import("./pages/Auth"));
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
import { ChatProvider } from "./contexts/chat.context";
import { MessagesProvider } from "./contexts/Messages.context";
import { CodeEditorProvider } from "./contexts/codeEditor.context";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 10,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <ProjectProvider>
          <MessagesProvider>
            <BrowserRouter>
              <Routes>
                {/* Landing page */}
                <Route path="/" element={<Landingpage />} />

                {/* Auth */}
                <Route
                  path="/auth/:type"
                  element={
                    <Suspense fallback={<Loader />}>
                      <AuthPage />
                    </Suspense>
                  }
                />

                {/* Protected Routes */}
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
                    path="/project/:projectId"
                    element={
                      <ChatProvider>
                        <CodeEditorProvider>
                          <Suspense fallback={<ComponentLoader />}>
                            <Project />
                          </Suspense>
                        </CodeEditorProvider>
                      </ChatProvider>
                    }
                  />
                </Route>

                {/* Not Found (IMPORTANT: outside UserAuth) */}
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
          </MessagesProvider>
        </ProjectProvider>
      </UserProvider>
    </QueryClientProvider>
  );
};

export default App;
