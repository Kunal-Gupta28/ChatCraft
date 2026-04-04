import { useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { useUser } from '../contexts/user.context';

const UserAuth = () => {
  const navigate = useNavigate();
  const { user } = useUser(); 
  useEffect(() => {
    if ( !user) {
      navigate('/auth/login', { replace: true });
    }
  }, [ user, navigate]);

  if (!user) return null;

  return <Outlet />;
};

export default UserAuth;
