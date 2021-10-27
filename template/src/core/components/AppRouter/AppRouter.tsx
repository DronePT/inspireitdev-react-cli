import { Switch, Route } from 'react-router-dom';
import { RouteEntry } from '../..';
import { createPrivateRoute } from '../PrivateRoute';

interface AppRouterProps {
  routes: RouteEntry[];
  checkLoginStatus?: () => boolean;
  unauthorizedRedirectTo?: string;
  notFoundComponent?: React.ComponentClass | React.FunctionComponent;
}

export const AppRouter = ({
  routes,
  notFoundComponent: NotFound,
  checkLoginStatus,
  unauthorizedRedirectTo,
}: AppRouterProps): JSX.Element => {
  const PrivateRoute = createPrivateRoute({
    checkLoginStatus: !!checkLoginStatus ? checkLoginStatus : () => false,
    defaultUnauthorizedRedirectTo: unauthorizedRedirectTo || '/',
  });

  return (
    <Switch>
      {routes.map((route) => {
        const RouteComponent =
          !!checkLoginStatus && route.requiresAuth ? PrivateRoute : Route;

        return (
          <RouteComponent
            key={`route-${route.path}`}
            path={route.path}
            exact={route.exact}
            unauthorizedRedirectTo={route.unauthorizedRedirectTo}
            component={route.component}
          />
        );
      })}
      <Route
        path='*'
        render={() => {
          if (!NotFound) return <h2>Oops! 404 not found.</h2>;

          return <NotFound />;
        }}
      />
    </Switch>
  );
};
