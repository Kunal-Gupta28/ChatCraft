import { Suspense } from "react";
import Loader from "../../components/PageLoader";

const AuthLayout = ({ children }) => {
  return (
    <Suspense fallback={<Loader />}>
      {children}
    </Suspense>
  );
};

export default AuthLayout;