import { ReactNode, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from '../services/store';
import { getUser, authChecked } from '../services/slices/authSlice';

type ProtectedRouteProps = {
  children: ReactNode;
  onlyUnAuth?: boolean;
};

export const ProtectedRoute = ({
  children,
  onlyUnAuth
}: ProtectedRouteProps) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { user, isAuthChecked } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!isAuthChecked) {
      dispatch(getUser()).finally(() => {
        dispatch(authChecked());
      });
    }
  }, [dispatch, isAuthChecked]);

  if (!isAuthChecked) {
    return null;
  }

  if (onlyUnAuth && user) {
    const from = location.state?.from || { pathname: '/' };
    return <Navigate to={from} />;
  }

  if (!onlyUnAuth && !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};