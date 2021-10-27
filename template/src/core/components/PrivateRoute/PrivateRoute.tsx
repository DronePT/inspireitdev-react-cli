import { Route, Redirect } from 'react-router-dom';

interface PrivateRouteProps {
  component?: React.ComponentClass | React.FunctionComponent;
  unauthorizedRedirectTo?: string;
}

interface CreatePrivateRouteParams {
  checkLoginStatus: () => boolean;
  defaultUnauthorizedRedirectTo: string;
}

export const createPrivateRoute =
  ({
    checkLoginStatus,
    defaultUnauthorizedRedirectTo,
  }: CreatePrivateRouteParams) =>
  ({
    component: Component,
    unauthorizedRedirectTo,
    ...rest
  }: PrivateRouteProps) => {
    const isLogged = checkLoginStatus();

    if (!Component) return null;

    return (
      <Route
        {...rest}
        render={(props) => {
          if (!isLogged) {
            return (
              <Redirect
                to={{
                  pathname:
                    unauthorizedRedirectTo || defaultUnauthorizedRedirectTo,
                  state: { from: props.location },
                }}
              />
            );
          }

          return <Component />;
        }}
      />
    );
  };
