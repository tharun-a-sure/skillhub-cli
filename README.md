# skillhub CLI

Manage your [SkillHub](https://skillhub.dev) profile from the terminal.

## Install

```bash
npm install -g skillhub
```

## Usage

```bash
skillhub login               # Authenticate with an API key
skillhub whoami              # Show current user
skillhub skills list         # List your skills
skillhub skills add          # Add a skill interactively
skillhub profile             # View your public profile
skillhub profile tharun      # View another user's profile
skillhub logout              # Remove stored credentials
```

## API keys

Generate an API key at https://skillhub.dev/settings/api-keys

Keys start with `sh_` and can be revoked at any time.
