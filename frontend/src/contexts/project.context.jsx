import { useSelector, useDispatch } from "react-redux";
import {
  selectProject,
  setProject as setProjectAction,
  updateProjectDetails as updateProjectDetailsAction,
} from "../store/slices/projectSlice";
import { useCallback } from "react";

export const ProjectProvider = ({ children }) => children;

export const useProject = () => {
  const project = useSelector(selectProject);
  const dispatch = useDispatch();

  const setProject = useCallback(
    (projectData) => {
      dispatch(setProjectAction(projectData));
    },
    [dispatch]
  );

  const updateProjectDetails = useCallback(
    (details) => {
      dispatch(updateProjectDetailsAction(details));
    },
    [dispatch]
  );

  return { project, setProject, updateProjectDetails };
};
