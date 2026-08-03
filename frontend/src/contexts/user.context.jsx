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
        dispatch((_, getState) => {
          const currentUser = getState().user.user;
          const nextUser = userData(currentUser);
          dispatch(setUserAction(nextUser));
        });
      } else {
        dispatch(setUserAction(userData));
      }
    },
    [dispatch]
  );

  return { user, setUser };
};