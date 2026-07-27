import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  fileTree: null,
  openFiles: [],
  activeFile: null,
  code: "",
  modifiedFiles: {},
  openFolders: {},
  iframeUrl: null,
  activeTab: "code",
  isRunning: false,
  runError: "",
};

const editorSlice = createSlice({
  name: "editor",
  initialState,
  reducers: {
    setFileTree: (state, action) => {
      state.fileTree = action.payload;
    },
    setOpenFiles: (state, action) => {
      state.openFiles = action.payload;
    },
    openFile: (state, action) => {
      const filePath = action.payload;
      if (!state.openFiles.includes(filePath)) {
        state.openFiles.push(filePath);
      }
      state.activeFile = filePath;
    },
    closeFile: (state, action) => {
      const filePath = action.payload;
      state.openFiles = state.openFiles.filter((f) => f !== filePath);
      if (state.activeFile === filePath) {
        state.activeFile = state.openFiles[0] || null;
      }
    },
    setActiveFile: (state, action) => {
      state.activeFile = action.payload;
    },
    setCode: (state, action) => {
      state.code = action.payload;
    },
    setModifiedFiles: (state, action) => {
      state.modifiedFiles = action.payload;
    },
    updateModifiedFile: (state, action) => {
      const { path, contents } = action.payload;
      state.modifiedFiles[path] = contents;
    },
    toggleFolder: (state, action) => {
      const path = action.payload;
      state.openFolders[path] = !state.openFolders[path];
    },
    setOpenFolders: (state, action) => {
      state.openFolders = action.payload;
    },
    setIframeUrl: (state, action) => {
      state.iframeUrl = action.payload;
    },
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
    },
    setIsRunning: (state, action) => {
      state.isRunning = action.payload;
    },
    setRunError: (state, action) => {
      state.runError = action.payload;
    },
    resetEditor: () => initialState,
  },
});

export const {
  setFileTree,
  setOpenFiles,
  openFile,
  closeFile,
  setActiveFile,
  setCode,
  setModifiedFiles,
  updateModifiedFile,
  toggleFolder,
  setOpenFolders,
  setIframeUrl,
  setActiveTab,
  setIsRunning,
  setRunError,
  resetEditor,
} = editorSlice.actions;

export const selectFileTree = (state) => state.editor.fileTree;
export const selectOpenFiles = (state) => state.editor.openFiles;
export const selectActiveFile = (state) => state.editor.activeFile;
export const selectCode = (state) => state.editor.code;
export const selectModifiedFiles = (state) => state.editor.modifiedFiles;
export const selectOpenFolders = (state) => state.editor.openFolders;
export const selectIframeUrl = (state) => state.editor.iframeUrl;
export const selectActiveTab = (state) => state.editor.activeTab;
export const selectIsRunning = (state) => state.editor.isRunning;
export const selectRunError = (state) => state.editor.runError;

export default editorSlice.reducer;
