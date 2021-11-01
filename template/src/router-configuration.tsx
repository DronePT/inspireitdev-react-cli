import { RouteEntry, buildRouterConfiguration } from './core';
import { HomePage } from './modules';

export const router: RouteEntry[] = [
  {
    path: '/',
    exact: true,
    component: HomePage,
  },
];

export const routerConfiguration = buildRouterConfiguration(router);
