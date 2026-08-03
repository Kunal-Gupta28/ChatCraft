import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  messages: [],
  inputMessage: "",
  isSending: false,
  sendError: "",
};

const cleanMsg = (m) => {
  if (!m) return m;
  try {
    return JSON.parse(JSON.stringify(m));
  } catch {
    return { ...m };
  }
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setMessages: (state, action) => {
      const incoming = Array.isArray(action.payload) ? action.payload : [];
      state.messages = incoming.map(cleanMsg);
    },
    addMessage: (state, action) => {
      const incoming = cleanMsg(action.payload);
      if (!incoming) return;

      const idKey = incoming._id || incoming.id;
      const key = idKey
        ? String(idKey)
        : `${incoming.senderId || incoming.senderName}-${new Date(incoming.createdAt || 0).getTime()}`;

      const exists = state.messages.some((m) => {
        const mIdKey = m._id || m.id;
        const mKey = mIdKey
          ? String(mIdKey)
          : `${m.senderId || m.senderName}-${new Date(m.createdAt || 0).getTime()}`;
        return mKey === key;
      });

      if (!exists) {
        state.messages.push(incoming);
        state.messages.sort(
          (a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0)
        );
      }
    },
    updateMessage: (state, action) => {
      const { id, message } = action.payload;
      if (id === undefined || id === null) return;
      const idStr = String(id);
      const target = state.messages.find(
        (m) => String(m._id ?? m.id ?? "") === idStr
      );
      if (target) {
        target.message = message;
        target.isEdited = true;
      }
    },
    deleteMessage: (state, action) => {
      const id = action.payload;
      if (id === undefined || id === null) return;
      const idStr = String(id);
      const index = state.messages.findIndex(
        (m) => String(m._id ?? m.id ?? "") === idStr
      );
      if (index !== -1) {
        state.messages.splice(index, 1);
      }
    },
    togglePinMessage: (state, action) => {
      const { id, isPinned } = action.payload || {};
      if (id === undefined || id === null) return;
      const idStr = String(id);
      const target = state.messages.find(
        (m) => String(m._id ?? m.id ?? "") === idStr
      );
      if (target) {
        target.isPinned = isPinned ?? !target.isPinned;
      }
    },
    toggleReaction: (state, action) => {
      const { id, reactions } = action.payload || {};
      if (id === undefined || id === null) return;
      const idStr = String(id);
      const target = state.messages.find(
        (m) => String(m._id ?? m.id ?? "") === idStr
      );
      if (target) {
        target.reactions = Array.isArray(reactions) ? reactions : [];
      }
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
  togglePinMessage,
  toggleReaction,
  setInputMessage,
  setIsSending,
  setSendError,
  resetChat,
} = chatSlice.actions;

export const selectMessages = (state) => state?.chat?.messages || [];
export const selectInputMessage = (state) => state?.chat?.inputMessage || "";
export const selectIsSending = (state) => Boolean(state?.chat?.isSending);
export const selectSendError = (state) => state?.chat?.sendError || "";

export default chatSlice.reducer;
