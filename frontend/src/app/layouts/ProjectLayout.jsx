import { Suspense } from "react";
import ComponentLoader from "../../components/LoadingAnimation";
import { ProjectProvider } from "../../contexts/project.context";
import ProjectProviders from "../providers/ProjectProviders";

const ProjectLayout = ({ children }) => {
  return (
    <Suspense fallback={<ComponentLoader />}>
      <ProjectProviders>
        <ProjectProvider>
          {children}
        </ProjectProvider>
      </ProjectProviders>
    </Suspense>
  );
};

export default ProjectLayout;