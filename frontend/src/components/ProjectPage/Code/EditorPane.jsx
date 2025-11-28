import MarkdownWithCode from "./MarkdownWithCode";

const EditorPane = ({ activeFile, code, updateCode }) => {

  // if active file is not present then show text
  if (!activeFile)
    return (
      <p className="text-center text-gray-400 pt-8 italic">
        Select a file to view
      </p>
    );

  return (
    <div className="flex-1 h-full overflow-y-auto">
      <MarkdownWithCode
        fileName={activeFile}
        code={code}
        onChange={(val) => updateCode(activeFile, val)}
      />
    </div>
  );
};

export default EditorPane;