import { createContext, useContext, useState, useCallback, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  selectFileTree,
  setFileTree as setFileTreeAction,
} from "../store/slices/editorSlice";

const CodeEditorContext = createContext(null);

let globalWebContainer = null;

export const getWebContainerInstance = () => globalWebContainer;
export const setWebContainerInstance = (instance) => {
  globalWebContainer = instance;
};

export const CodeEditorProvider = ({ children }) => {
  const fileTree = useSelector(selectFileTree);
  const dispatch = useDispatch();
  const [activeSuggestion, setActiveSuggestion] = useState(null);

  const setFileTree = useCallback(
    (tree) => {
      dispatch(setFileTreeAction(tree));
    },
    [dispatch]
  );

  const setWebContainer = useCallback((container) => {
    setWebContainerInstance(container);
  }, []);

  const value = useMemo(
    () => ({
      fileTree,
      setFileTree,
      webContainer: globalWebContainer,
      setWebContainer,
      activeSuggestion,
      setActiveSuggestion,
    }),
    [fileTree, setFileTree, setWebContainer, activeSuggestion]
  );

  return (
    <CodeEditorContext.Provider value={value}>
      {children}
    </CodeEditorContext.Provider>
  );
};

export const useCodeEditor = () => {
  const context = useContext(CodeEditorContext);
  if (context) return context;

  // Fallback if accessed outside provider
  const fileTree = useSelector(selectFileTree);
  return {
    fileTree,
    setFileTree: () => {},
    webContainer: globalWebContainer,
    setWebContainer: () => {},
    activeSuggestion: null,
    setActiveSuggestion: () => {},
  };
};