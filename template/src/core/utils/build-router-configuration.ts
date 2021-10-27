export interface RouteEntry {
  path: string;
  component?: () => JSX.Element;
  exact?: boolean;
  routes?: RouteEntry[];
  requiresAuth?: boolean;
  unauthorizedRedirectTo?: string;
}

const routesConfigurationReducer =
  (pathPrefix: string[] = []) =>
  (acc: RouteEntry[], curr: RouteEntry): RouteEntry[] => {
    const accRoutes = [...acc];
    const { routes, path, ...route } = curr;

    if (route.component) {
      accRoutes.push({
        ...route,
        path: [...pathPrefix, path].join('/').replace(/\/\//g, '/'),
      });
    }

    if (!routes || !routes.length) {
      return accRoutes;
    }

    return [
      ...accRoutes,
      ...routes.reduce(routesConfigurationReducer([...pathPrefix, path]), []),
    ];
  };

export const buildRouterConfiguration = (config: RouteEntry[]) =>
  config.reduce<RouteEntry[]>(routesConfigurationReducer(['']), []);
