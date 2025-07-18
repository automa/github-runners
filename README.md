# github-runners

This is a [deterministic](https://docs.automa.app/bots/types#deterministic) & [scheduled](https://docs.automa.app/bots/types#scheduled) [bot](https://docs.automa.app/bots/types#non-agent) for [**Automa**](https://automa.app) to migrate GitHub Actions workflow runner labels.

#### Features

- Automatically replaces `runs-on` fields in your GitHub Actions workflows with configured custom runner labels.
- Supports updating runners in `matrix` strategies and reusable workflows inputs.
- Ignores non-exact matches and group labels to avoid unintended changes.
- Configurable via the `UPDATE_MAP` environment variable.

## Getting Started

Since this bot can be further configured, there is no single version of this to be installed on [Automa](https://automa.app) Cloud.

### Self-Hosting

This bot can be self-hosted. You can follow these steps to get it running.

#### Prerequisites

- Have [`git`](https://git-scm.com/) installed.
- Have [`node`](https://nodejs.org/) installed.

#### Automa bot

[Create a bot](https://docs.automa.app/bot-development/create-bot) of [scheduled](https://docs.automa.app/bots/types#scheduled) type on [Automa](https://automa.app) (Cloud or Self-hosted) and point its webhook to your planned server (e.g., `http://your-server-ip:8000/hooks/automa`). Copy the **webhook secret** after it is created.

#### Starting the server

```sh
# Setup environment variables
export NODE_ENV=production
export AUTOMA_WEBHOOK_SECRET=your_secret_here

# Configure bot
export UPDATE_MAP='{"ubuntu-24.04":"blacksmith-4vcpu-ubuntu-2204"}'

# Install dependencies & build
npm install
npm run build

# Start server
node build/index.js
```

## How It Works

1. **Configuration**: The bot reads its configuration from the `UPDATE_MAP` environment variable. This variable should be a JSON string that maps old runner labels to their new counterparts. For example: `{"ubuntu-24.04":"blacksmith-4vcpu-ubuntu-2204"}`.

2. **Update Logic**: For each workflow file in `.github/workflows`, the bot reads the content and uses a regular expression to find and replace the runner labels. The key aspects of the update logic are:

   - It replaces all occurrences of the old runner label with the new one.
   - It automatically handles GitHub's default `*-latest` runners, updating them if a replacement for the corresponding versioned runner is defined in the configuration.
   - It correctly handles runners defined directly in `runs-on` and those within a `matrix` strategy.
   - It avoids making changes to runner groups by ignoring labels inside a `group:` key.
   - It performs an exact match to prevent accidentally updating partial labels.

## Contributing

Contributions and feedback are welcome! Feel free to open an issue or submit a pull request. See [CONTRIBUTING.md](CONTRIBUTING.md) for more details. Here is a list of [Contributors](https://github.com/automa/github-runners/contributors).

## LICENSE

MIT

## Bug Reports

Report [here](https://github.com/automa/github-runners/issues).
