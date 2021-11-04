import { useContext } from 'react';
import { Switch, Route } from 'react-router-dom';

import { RouteEntry } from '../../utils';
import { RouterContext } from '../../contexts';
import { createPrivateRoute } from '../PrivateRoute';

interface AppRouterProps {
  routes: RouteEntry[];
  catchNotFound?: boolean;
  notFoundComponent?: React.ComponentClass | React.FunctionComponent;
}

export const RouterMap = ({
  routes,
  catchNotFound = true,
  notFoundComponent: NotFound,
}: AppRouterProps): JSX.Element => {
  const { checkLoginStatus, unauthorizedRedirectTo } =
    useContext(RouterContext);

  const PrivateRoute = createPrivateRoute({
    checkLoginStatus: checkLoginStatus || (() => false),
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
      {catchNotFound && (
        <Route
          path="*"
          render={() => {
            if (!NotFound) return <h2>Oops! 404 not found.</h2>;

            return <NotFound />;
          }}
        />
      )}
    </Switch>
  );
};
