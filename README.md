# Inspire React CLI

This tool was done to help create React resources for Inspire IT React Boilerplate.

### Requirements
  - Node
  - [Yarn](https://yarnpkg.com/) or NPM

## Install:
```bash
yarn global add @inspireitdev/react-cli
```
or
```bash
npm install -g @inspireitdev/react-cli
```

## Commands:
`inspire-react --help`

#### Create a new React App:
`inspire-react create-app <app-name>`

## TODO

- [X] Add option to choose between `yarn`or `npm`
- [X] Detect if application directory already exists when executing `create-app`
- [ ] When creating a resource, request a confirmation input with a summary of what will be created.
- [ ] Add a subcommand to remove resources.
- [ ] Automatically add to route configuration when creating a page.
- [ ] Add new command to uninstall TailwindCSS
