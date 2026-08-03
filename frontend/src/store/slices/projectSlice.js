import { createSlice } from "@reduxjs/toolkit";

const cleanObj = (obj) => {
  if (!obj || typeof obj !== "object") return obj;
  try {
    return JSON.parse(JSON.stringify(obj));
  } catch {
    return { ...obj };
  }
};

const projectSlice = createSlice({
  name: "project",
  initialState: {
    project: null,
  },
  reducers: {
    setProject: (state, action) => {
      state.project = cleanObj(action.payload);
    },
    updateProjectDetails: (state, action) => {
      if (state.project) {
        state.project = cleanObj({ ...state.project, ...action.payload });
      }
    },
    clearProject: (state) => {
      state.project = null;
    },
  },
});

export const { setProject, updateProjectDetails, clearProject } = projectSlice.actions;
export const selectProject = (state) => state.project.project;
export default projectSlice.reducer;
