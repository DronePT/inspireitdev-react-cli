import { useContext } from 'react';
import { useRoutes } from 'react-router-dom';
import { RouterContext } from '../../contexts';

import { buildRouterConfiguration, RouteEntry } from '../../utils';

interface AppRouterProps {
  routes: RouteEntry[];
  catchNotFound?: boolean;
  notFoundComponent?: React.ComponentClass | React.FunctionComponent;
}

export const RouterMap = ({
  routes,
  catchNotFound = true,
  notFoundComponent: NotFound,
}: AppRouterProps): JSX.Element | null => {
  const { checkLoginStatus = () => true, unauthorizedRedirectTo } =
    useContext(RouterContext);

  const routesMapping = buildRouterConfiguration(routes, {
    checkLoginStatus,
    unauthorizedRedirectTo,
  });

  if (catchNotFound) {
    routesMapping.push({
      path: '*',
      element: (NotFound && <NotFound />) || <h1>Page not found!</h1>,
    });
  }

  const element = useRoutes(routesMapping);

  return element;
};
