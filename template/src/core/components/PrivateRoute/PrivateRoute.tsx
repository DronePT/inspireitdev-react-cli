import { Navigate, useLocation } from 'react-router-dom';

interface PrivateRouteProps {
  checkLoginStatus: () => boolean;
  unauthorizedRedirectTo: string;
  children: React.ReactElement | null;
}

const Redirect = ({ to }: { to: string }) => {
  const location = useLocation();

  return <Navigate to={to} state={{ from: location }} />;
};

export const PrivateRoute = ({
  children,
  checkLoginStatus,
  unauthorizedRedirectTo,
}: PrivateRouteProps): JSX.Element => {
  const isLogged = (checkLoginStatus && checkLoginStatus()) || false;

  if (!children) return <div />;

  return !isLogged ? <Redirect to={unauthorizedRedirectTo} /> : children;
};
