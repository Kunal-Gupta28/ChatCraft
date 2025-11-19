import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landingpage from "./pages/Landingpage";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Project from "./pages/Project";
import UserAuth from "./auth/UserAuth";
import NotFound from "./components/NotFound";

// context api
import { UserProvider } from "./contexts/user.context";
import { ProjectProvider } from "./contexts/project.context";

const App = () => {
  return (
    <UserProvider>
      <ProjectProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landingpage />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/home"
              element={
                <UserAuth>
                  <Home />
                </UserAuth>
              }
            />
            <Route
              path="/project"
              element={
                <UserAuth>
                  <Project />
                </UserAuth>
              }
            />
            <Route path="/logout" />

            {/* 404 Page */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </ProjectProvider>
    </UserProvider>
  );
};

export default App;
