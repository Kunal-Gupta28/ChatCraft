import { createContext, useContext, useState } from "react";

const CodeEditorContext = createContext();

export const CodeEditorProvider = ({ children }) => {
  const [fileTree, setFileTree] = useState(null);
  const [webContainer, setWebContainer] = useState(null);

  return (
    <CodeEditorContext.Provider
      value={{
        fileTree,
        setFileTree,
        webContainer,
        setWebContainer,
      }}
    >
      {children}
    </CodeEditorContext.Provider>
  );
};

export const useCodeEditor = () => useContext(CodeEditorContext);