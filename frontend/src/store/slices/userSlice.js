import { createSlice } from "@reduxjs/toolkit";

const getInitialUser = () => {
  try {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  } catch (error) {
    console.error("Failed to parse stored user:", error);
    return null;
  }
};

const cleanObj = (obj) => {
  if (!obj || typeof obj !== "object") return obj;
  try {
    return JSON.parse(JSON.stringify(obj));
  } catch {
    return { ...obj };
  }
};

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: getInitialUser(),
  },
  reducers: {
    setUser: (state, action) => {
      state.user = cleanObj(action.payload);
      if (action.payload) {
        localStorage.setItem("user", JSON.stringify(action.payload));
      } else {
        localStorage.removeItem("user");
      }
    },
    clearUser: (state) => {
      state.user = null;
      localStorage.removeItem("user");
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export const selectUser = (state) => state.user.user;
export default userSlice.reducer;
