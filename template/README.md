
# React Boilerplate

This project has the purpose of being used as an initial structure for a React project.

### File structure

```bash
src
├── assets - Application assets, non-specific to a a module. (Eg.: app logo)
├── components - Re-usable components through all application. (Eg.: <TextInput />)
├── core - Core functionalities to run the application.
├── modules
│   └── module-name (Eg.: Auth)
│       ├── assets - Module specific assets.
│       ├── components - Module specific components.
│       │   └── LoginForm (Example)
│       ├── domain - Business logic/rules should be placed here. (Eg.: Entity, Model, Value Objects, etc...)
│       │   ├── user.entity.ts (Example)
│       │   └── user-type.value-object.ts (Example)
│       ├── hooks - Module specific hooks.
│       │   ├── use-login.hook.ts (Example)
│       │   └── use-register.hook.ts (Example)
│       ├── pages - Module specific pages
│       │   ├── LoginPage (Example)
│       │   └── RegisterPage (Example)
│       ├── services - Application logic, calls to external services, etc...
│       │   └── login.service.ts (Example)
│       └── store - Module state
│       │   └── auth.store.ts (Example)
└── utils - Utilities shared through all application.
```

---

#### Start development:
```bash
yarn start
```

#### Build project:
```bash
yarn build
```
#### Create resources:
```bash
yarn cli --help
```
##### *Example:*
```bash
yarn cli page auth login
yarn cli component auth login-form
yarn cli hook auth login
```

---

### Route Configuration
- Application route is configured through `<AppRouter />` component on `src/index.tsx` and `router-configuration.tsx` file.

`<AppRouter />` has the following properties signature:

```typescript
interface AppRouterProps {
  routes: RouteEntry[]; // List of routes (check below how to configure)
  checkLoginStatus?: () => boolean; // Function which will be invoked on Private Routes.
  unauthorizedRedirectTo?: string; // default redirect page path for unauthorized access.
  notFoundComponent?: React.ComponentClass | React.FunctionComponent; // Component for not path's..
}
```


Routes are composed by an array of `RouteEntry` entries, each entry define's a path/endpoint with or without sub-routes (`routes` key):

```typescript
interface RouteEntry {
  path: string; // URL to match route
  component?: () => JSX.Element; // Component/page which will be loaded
  exact?: boolean; // If true, it will only render if url matches exactly the path
  routes?: RouteEntry[]; // Sub-routing configuration
  requiresAuth?: boolean; // If true, it will only render if checkLoginStatus() returns true.
  unauthorizedRedirectTo?: string; // Overwrite the default redirect defined on <AppRouter />
}
```

*Example:*

```typescript
[
  {
    path: '/auth',
    component: LoginPage,
    exact: true, // LoginPage is loaded if user access to /auth endpoint.
    routes: [
      {
        path: '/login',
        component: LoginPage,
        exact: false // LoginPage will be loaded with any endpoint starting by /auth/login
      },
      {
        path: '/register',
        component: RegisterPage,
        exact: true // RegisterPage will be loaded only by accessing /auth/register
      }
    ]
  }
]
```

---
### Documentation for libraries in use

- [React TypeScript Cheat sheet](https://github.com/typescript-cheatsheets/react#reacttypescript-cheatsheets)
- [react-router-dom](https://reactrouter.com/web/guides/quick-start) - Routing management
- [Zustand](https://www.npmjs.com/package/zustand) - State management
- [react-hook-form](hhttps://react-hook-form.com/get-started) - Forms validation
- [TailwindCSS](https://tailwindcss.com/docs) - CSS utility
  - Remove TailwindCSS from the project by reverting the install process:
    - https://tailwindcss.com/docs/guides/create-react-app
