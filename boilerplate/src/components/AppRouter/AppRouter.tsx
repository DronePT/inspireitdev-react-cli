import { Switch, Route } from 'react-router-dom';
import { RouteEntry } from '../../core';

interface AppRouterProps {
  routes: RouteEntry[];
}

export const AppRouter = ({ routes }: AppRouterProps): JSX.Element => {
  return (
    <Switch>
      {routes.map((route) => (
        <Route
          key={`route-${route.path}`}
          path={route.path}
          exact={route.exact}
          component={route.component}
        />
      ))}
      <Route path='*' render={() => <div>Page not found!</div>} />
    </Switch>
  );
};
