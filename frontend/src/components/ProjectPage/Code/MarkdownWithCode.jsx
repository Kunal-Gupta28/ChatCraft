import Editor from "@monaco-editor/react";

const MarkdownWithCode = ({ code, onChange, fileName }) => {

  // get file with its extention by using filetree
  const getLanguage = () => {
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

  return (
    <Editor
      height="100%"
      value={code}
      onChange={(val) => onChange(val || "")}
      theme="vs-dark"
      language={getLanguage()}
      options={{
        minimap: { enabled: false },
        fontSize: 14,
        wordWrap: "on",
        automaticLayout: true,
      }}
    />
  );
};

export default MarkdownWithCode;