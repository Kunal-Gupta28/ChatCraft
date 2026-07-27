import { useSelector, useDispatch } from "react-redux";
import { selectUser, setUser as setUserAction } from "../store/slices/userSlice";
import { useCallback } from "react";

export const UserProvider = ({ children }) => children;

export const useUser = () => {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();

  const setUser = useCallback(
    (userData) => {
      if (typeof userData === "function") {
        const nextUser = userData(user);
        dispatch(setUserAction(nextUser));
      } else {
        dispatch(setUserAction(userData));
      }
    },
    [dispatch, user]
  );

  return { user, setUser };
};