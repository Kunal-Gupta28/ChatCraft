import { memo, useCallback } from "react";
import Editor from "@monaco-editor/react";

const MONACO_OPTIONS = {
  minimap: { enabled: false },
  fontSize: 14,
  wordWrap: "on",
  automaticLayout: true,
};

const getLanguage = (fileName) => {
  if (!fileName) return "plaintext";
  const ext = fileName.split(".").pop().toLowerCase();
  return (
    {
      js: "javascript",
      jsx: "javascript",
      ts: "typescript",
      tsx: "typescript",
      html: "html",
      css: "css",
      json: "json",
      md: "markdown",
    }[ext] || "plaintext"
  );
};

const MarkdownWithCode = ({ code, onChange, fileName }) => {
  const handleChange = useCallback(
    (val) => {
      onChange(val || "");
    },
    [onChange]
  );

  return (
    <Editor
      height="100%"
      value={code}
      onChange={handleChange}
      theme="vs-dark"
      language={getLanguage(fileName)}
      options={MONACO_OPTIONS}
    />
  );
};

export default memo(MarkdownWithCode);