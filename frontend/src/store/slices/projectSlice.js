import { createSlice } from "@reduxjs/toolkit";

const projectSlice = createSlice({
  name: "project",
  initialState: {
    project: null,
  },
  reducers: {
    setProject: (state, action) => {
      state.project = action.payload;
    },
    updateProjectDetails: (state, action) => {
      if (state.project) {
        state.project = { ...state.project, ...action.payload };
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
