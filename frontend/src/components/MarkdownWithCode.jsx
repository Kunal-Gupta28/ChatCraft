import Editor from "@monaco-editor/react";

const MarkdownWithCode = ({ code, onChange, fileName }) => {
  const getLanguage = () => {
    if (!fileName) return "plaintext";
    const ext = fileName.split(".").pop().toLowerCase();

    const languages = {
      js: "javascript",
      jsx: "javascript",
      ts: "typescript",
      tsx: "typescript",
      html: "html",
      css: "css",
      json: "json",
      md: "markdown",
      markdown: "markdown",
      yaml: "yaml",
      yml: "yaml",
      env: "plaintext",
      gitignore: "plaintext",
    };

    return languages[ext] || "plaintext";
  };

  return (
    <div className="h-full w-full">
      <Editor
        height="100%"
        language={getLanguage()}
        theme="vs-dark"
        value={code}
        onChange={(value) => onChange(value)}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          fontFamily: "JetBrains Mono, monospace",
          automaticLayout: true,
          scrollBeyondLastLine: false,
          wordWrap: "on",
          roundedSelection: true,
          smoothScrolling: true,
          tabSize: 2,
        }}
      />
    </div>
  );
};

export default MarkdownWithCode;
