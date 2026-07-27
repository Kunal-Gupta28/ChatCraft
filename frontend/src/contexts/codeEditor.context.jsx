import { useSelector, useDispatch } from "react-redux";
import {
  selectFileTree,
  setFileTree as setFileTreeAction,
} from "../store/slices/editorSlice";
import { useCallback } from "react";

let globalWebContainer = null;

export const getWebContainerInstance = () => globalWebContainer;
export const setWebContainerInstance = (instance) => {
  globalWebContainer = instance;
};

export const CodeEditorProvider = ({ children }) => children;

export const useCodeEditor = () => {
  const fileTree = useSelector(selectFileTree);
  const dispatch = useDispatch();

  const setFileTree = useCallback(
    (tree) => {
      dispatch(setFileTreeAction(tree));
    },
    [dispatch]
  );

  const setWebContainer = useCallback((container) => {
    setWebContainerInstance(container);
  }, []);

  return {
    fileTree,
    setFileTree,
    webContainer: globalWebContainer,
    setWebContainer,
  };
};