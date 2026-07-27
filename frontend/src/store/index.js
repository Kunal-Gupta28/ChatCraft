import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import projectReducer from "./slices/projectSlice";
import editorReducer from "./slices/editorSlice";
import chatReducer from "./slices/chatSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    project: projectReducer,
    editor: editorReducer,
    chat: chatReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Allows non-serializable objects if needed (e.g. WebContainer instance ref)
    }),
});

export default store;
