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

```bash
Usage: inspire-react [options] [command]

CLI tool to create resources for InspireIT React Boilerplate

Options:
  -V, --version                                                       output the version number
  -d --destination <destination>                                      Where resources should be created. (default: "./src")
  -h, --help                                                          display help for command

Commands:
  component [options] <module-or-component-or-path> [component-name]
  hook [options] <module-or-hook-or-path> [hook-name]
  page [options] <module> <page-name>
  service [options] <module> <service-name>
  store [options] <module> <store-name>
  domain [options] <module> <domain-name> [domain-type]
  util [options] <path-or-util-name> [util-name]
  file [options] <file-path>
  create-app [options] <app-name>
  help [command]                                                      display help for command
```

#### Create a new React App:
`inspire-react create-app <app-name>`

## TODO

- [X] Add option to choose between `yarn`or `npm`
- [X] Detect if application directory already exists when executing `create-app`
- [X] When creating a resource, request a confirmation input with a summary of what will be created.
- [X] Make selecting a State Library optional when creating an app.
- [x] Add a subcommand to remove resources.
- [ ] Add feature to also create the Boilerplate using NextJS.
- [ ] Automatically add to route configuration when creating a page.
- [ ] Add new command to uninstall TailwindCSS
