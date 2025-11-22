import { useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { useUser } from '../contexts/user.context';

const UserAuth = () => {
  const navigate = useNavigate();
  const { user } = useUser(); 
  const token = localStorage.getItem('token');

  // navigate to login page if either token or user is missing 
  // it will check it again and again whenever value of token, user and naivagate changes.
  useEffect(() => {
    if (!token || !user) {
      navigate('/login', { replace: true });
    }
  }, [token, user, navigate]);

  // if token and user are missing then return null
  if (!token || !user) return null;

  // outlet is a kind of placeholder were children will take place
  return <Outlet />;
};

export default UserAuth;
