import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { checkAuthStatus } from '@/state/features/authSlice';

const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    // Check authentication status when the app loads
    dispatch(checkAuthStatus());
  }, [dispatch]);

  return children;
};

export default AuthProvider;