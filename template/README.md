
# React Boilerplate

This project has the purpose of being used as an initial structure for a React project.

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

### File structure

```bash
src
├── assets - Application assets, non-specific to a a module. (Eg.: app logo)
├── components - Re-usable components through all application. (Eg.: <TextInput />)
├── core - Core functionalities to build  up the app.
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

#### Route Configuration
- Application route is configured through `router-configuration.tsx` file.

Routes are composed by an array of `RouteEntry` entries, each entry define's a path/endpoint with or without sub-routes (`routes` key):

```typescript
{
  path: string; // Path to match the URL
  component?: () => JSX.Element; // Component/page to be loaded
  exact?: boolean; // should component be loaded with exact path?
  routes?: RouteEntry[]; //
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

### Documentation for the modules used by this boilerplate

- [React TypeScript Cheat sheet](https://github.com/typescript-cheatsheets/react#reacttypescript-cheatsheets)
- [Recoil - State Management](https://recoiljs.org/docs/introduction/core-concepts)
- [TailwindCSS](https://recoiljs.org/docs/introduction/core-concepts)
  - Remove TailwindCSS from the project by reverting the install process:
    - https://tailwindcss.com/docs/guides/create-react-app
