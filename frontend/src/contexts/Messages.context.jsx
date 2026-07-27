import { useSelector, useDispatch } from "react-redux";
import {
  selectMessages,
  setMessages as setMessagesAction,
  addMessage as addMessageAction,
} from "../store/slices/chatSlice";
import { useCallback } from "react";

export const MessagesProvider = ({ children }) => children;

export const useMessages = () => {
  const messages = useSelector(selectMessages);
  const dispatch = useDispatch();

  const setMessages = useCallback(
    (val) => {
      if (typeof val === "function") {
        dispatch((_, getState) => {
          const current = getState().chat.messages;
          const next = val(current);
          dispatch(setMessagesAction(next));
        });
      } else {
        dispatch(setMessagesAction(val));
      }
    },
    [dispatch]
  );

  const addMessage = useCallback(
    (msg) => {
      dispatch(addMessageAction(msg));
    },
    [dispatch]
  );

  return { messages, setMessages, addMessage };
};