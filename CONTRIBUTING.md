# How to Contribute

## Prerequisites

- Have [`git`](https://git-scm.com/) installed.
- Have [`node`](https://nodejs.org/) & [`pnpm`](https://pnpm.io/) installed.
- Have a [scheduled](https://docs.automa.app/agents/types#scheduled) bot in either [Automa](https://automa.app) (Cloud or Self-hosted) or in [automa/monorepo](https://github.com/automa/monorepo) local setup.

## Setup environment variables

```sh
export AUTOMA_WEBHOOK_SECRET=your_secret_here
```

## Installing dependencies

```sh
pnpm install
```

## Starting the server

```sh
pnpm start
```

## CI/CD

#### Testing

```sh
pnpm test
```

#### Linting

```sh
pnpm lint
```

#### Formatting

```sh
pnpm format
```
