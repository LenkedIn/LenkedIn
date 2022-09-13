# LenkedIn

## Developers note

### Install dependancies

`yarn install` this will install depedancies including the workspace

### Run workspace

`yarn start:{workspace_name}`

### Create workspace

Add new folder under ./app, follow instruction from https://classic.yarnpkg.com/lang/en/docs/workspaces/
Remember to put new start command of the workspace to the root package.json file

### Code quality and formatting

Run [ESLint](https://eslint.org/) to analyze the code and catch bugs:

`yarn lint`

Run [ESLint](https://eslint.org/docs/latest/user-guide/command-line-interface#fixing-problems) with --fix

**Please do this before making a new pr**

`yarn lint-fix`

### Useful links

- [Hardhat Basic Env](https://hardhat.org/hardhat-runner/docs/guides/typescript)
- [Hardhat Toolbox](https://hardhat.org/hardhat-runner/plugins/nomicfoundation-hardhat-toolbox)
