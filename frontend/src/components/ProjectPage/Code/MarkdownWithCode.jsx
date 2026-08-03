import { memo, useCallback, useEffect, useRef } from "react";
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

const MarkdownWithCode = ({ code, onChange, fileName, remoteCursors = [], onCursorChange }) => {
  const editorRef = useRef(null);
  const monacoRef = useRef(null);
  const cursorListenerRef = useRef(null);
  const decorationIdsRef = useRef([]);
  const handleChange = useCallback(
    (val) => {
      onChange(val || "");
    },
    [onChange]
  );

  const applyRemoteCursors = useCallback(() => {
    const editor = editorRef.current;
    const monaco = monacoRef.current;
    const model = editor?.getModel();
    if (!editor || !monaco || !model) return;

    const decorations = remoteCursors.map((presence) => {
      const lineNumber = Math.min(
        Math.max(1, Number(presence.cursor?.lineNumber) || 1),
        model.getLineCount(),
      );
      const column = Math.min(
        Math.max(1, Number(presence.cursor?.column) || 1),
        model.getLineMaxColumn(lineNumber),
      );
      const colorIndex = Number(presence.colorIndex) || 0;

      return {
        range: new monaco.Range(lineNumber, column, lineNumber, column),
        options: {
          inlineClassName: `collaborator-cursor collaborator-cursor-${colorIndex}`,
          after: {
            content: ` ${presence.username || "Collaborator"}`,
            inlineClassName: `collaborator-cursor-label collaborator-cursor-label-${colorIndex}`,
          },
        },
      };
    });

    decorationIdsRef.current = editor.deltaDecorations(
      decorationIdsRef.current,
      decorations,
    );
  }, [remoteCursors]);

  const handleMount = useCallback((editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;
    cursorListenerRef.current?.dispose();
    cursorListenerRef.current = editor.onDidChangeCursorPosition((event) => {
      onCursorChange?.({
        lineNumber: event.position.lineNumber,
        column: event.position.column,
      });
    });
    applyRemoteCursors();
  }, [applyRemoteCursors, onCursorChange]);

  useEffect(() => {
    applyRemoteCursors();
  }, [applyRemoteCursors, code]);

  useEffect(
    () => () => {
      cursorListenerRef.current?.dispose();
      if (editorRef.current) {
        editorRef.current.deltaDecorations(decorationIdsRef.current, []);
      }
    },
    [],
  );

  return (
    <Editor
      height="100%"
      value={code}
      onChange={handleChange}
      theme="vs-dark"
      language={getLanguage(fileName)}
      options={MONACO_OPTIONS}
      onMount={handleMount}
    />
  );
};

export default memo(MarkdownWithCode);
