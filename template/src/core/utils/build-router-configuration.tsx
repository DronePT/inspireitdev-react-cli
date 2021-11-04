import { RouteObject } from 'react-router-dom';
import { PrivateRoute } from '../components';

export interface RouteEntry {
  path: string;
  component?: () => React.ReactElement | null;
  exact?: boolean;
  routes?: RouteEntry[];
  requiresAuth?: boolean;
  unauthorizedRedirectTo?: string;
}

const routesConfigurationMap =
  (authSettings: AuthSettings) =>
  (route: RouteEntry): RouteObject => {
    const {
      path,
      component: Component,
      exact = true,
      requiresAuth,
      routes,
      unauthorizedRedirectTo,
    } = route;

    const resolvedPath = [path[0] === '/' ? path.substr(1) : path];

    if (!exact) resolvedPath.push('*');

    const reactRouter: RouteObject = {
      path: resolvedPath.join('/'),
    };

    if (Component && !routes) {
      const {
        checkLoginStatus,
        unauthorizedRedirectTo: defaultUnauthorizedRedirectTo,
      } = authSettings;

      reactRouter.element =
        requiresAuth && checkLoginStatus ? (
          <PrivateRoute
            checkLoginStatus={checkLoginStatus}
            unauthorizedRedirectTo={
              unauthorizedRedirectTo || defaultUnauthorizedRedirectTo || '/'
            }
          >
            <Component />
          </PrivateRoute>
        ) : (
          <Component />
        );
    }

    if (routes) {
      reactRouter.children = routes.map(routesConfigurationMap(authSettings));
    }

    return reactRouter;
  };

interface AuthSettings {
  checkLoginStatus?: () => boolean;
  unauthorizedRedirectTo?: string;
}

export const buildRouterConfiguration = (
  config: RouteEntry[],
  authSettings: AuthSettings
) => config.map(routesConfigurationMap(authSettings));
