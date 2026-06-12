import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import { useUser } from "../contexts/user.context";

const useAuthMutation = (mutationFn) => {
  const navigate = useNavigate();
  const { setUser } = useUser();

  return useMutation({
    mutationFn,

    onSuccess: (data) => {
      setUser(data.user);
      localStorage.setItem("token", data.token);
      navigate("/home");
    },
  });
};

export default useAuthMutation;