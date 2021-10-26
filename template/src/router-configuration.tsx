import { RouteEntry, buildRouterConfiguration } from './core';

export const router: RouteEntry[] = [
  {
    path: '/',
    exact: false,
    component: (): JSX.Element => (
      <div className="flex items-center justify-center w-screen h-screen">
        <h1>InspireIT React</h1>
      </div>
    ),
  },
];

export const routerConfiguration = buildRouterConfiguration(router);
