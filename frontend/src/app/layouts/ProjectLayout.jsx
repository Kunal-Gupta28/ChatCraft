import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import ComponentLoader from "../../components/LoadingAnimation";
import { ProjectProvider } from "../../contexts/project.context";
import ProjectProviders from "../providers/ProjectProviders";

const ProjectLayout = ({ children }) => {
  return (
    <Suspense fallback={<ComponentLoader />}>
      <ProjectProviders>
        <ProjectProvider>
          {children || <Outlet />}
        </ProjectProvider>
      </ProjectProviders>
    </Suspense>
  );
};

export default ProjectLayout;