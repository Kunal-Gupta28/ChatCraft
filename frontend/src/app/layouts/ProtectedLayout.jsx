import { Outlet } from "react-router-dom";
import UserAuth from "../../auth/UserAuth";

const ProtectedLayout = () => {
  return (
    <UserAuth>
      <Outlet />
    </UserAuth>
  );
};

export default ProtectedLayout;