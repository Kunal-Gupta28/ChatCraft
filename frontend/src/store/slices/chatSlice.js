import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  messages: [],
  inputMessage: "",
  isSending: false,
  sendError: "",
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setMessages: (state, action) => {
      state.messages = Array.isArray(action.payload) ? action.payload : [];
    },
    addMessage: (state, action) => {
      const incoming = action.payload;
      if (!incoming) return;

      const key = incoming._id
        ? String(incoming._id)
        : `${incoming.senderName}-${incoming.createdAt}-${incoming.message}`;
      
      const exists = state.messages.some((m) => {
        const mKey = m._id ? String(m._id) : `${m.senderName}-${m.createdAt}-${m.message}`;
        return mKey === key;
      });

      if (!exists) {
        const updated = [...state.messages, incoming];
        updated.sort(
          (a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0)
        );
        state.messages = updated;
      }
    },
    updateMessage: (state, action) => {
      const { id, message } = action.payload;
      state.messages = state.messages.map((m) => {
        if (String(m._id) === String(id) || String(m.id) === String(id)) {
          return { ...m, message, isEdited: true };
        }
        return m;
      });
    },
    deleteMessage: (state, action) => {
      const id = action.payload;
      state.messages = state.messages.filter(
        (m) => String(m._id) !== String(id) && String(m.id) !== String(id)
      );
    },
    setInputMessage: (state, action) => {
      const val = action.payload;
      state.inputMessage = typeof val === "function" ? String(val(state.inputMessage || "") || "") : String(val ?? "");
    },
    setIsSending: (state, action) => {
      state.isSending = action.payload;
    },
    setSendError: (state, action) => {
      state.sendError = action.payload;
    },
    resetChat: () => initialState,
  },
});

export const {
  setMessages,
  addMessage,
  updateMessage,
  deleteMessage,
  setInputMessage,
  setIsSending,
  setSendError,
  resetChat,
} = chatSlice.actions;

export const selectMessages = (state) => state.chat.messages || [];
export const selectInputMessage = (state) => state.chat.inputMessage || "";
export const selectIsSending = (state) => state.chat.isSending;
export const selectSendError = (state) => state.chat.sendError;

export default chatSlice.reducer;
