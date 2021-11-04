import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

interface RouterContextValue {
  checkLoginStatus?: () => boolean;
  unauthorizedRedirectTo?: string;
}

export const RouterContext = React.createContext<RouterContextValue>({});

export const RouterProvider = ({
  children,
  ...props
}: RouterContextValue & { children: React.ReactNode }) => (
  <Router>
    <RouterContext.Provider value={props}>{children}</RouterContext.Provider>
  </Router>
);
