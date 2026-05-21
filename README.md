# Personalized AI Learning Assistant on Telegram

This project configures an OpenClaw-powered Telegram bot that onboards users, stores their learning preferences, searches the web for fresh technical content, and sends a personalized daily brief every evening.

## What It Does
- Onboards every new Telegram user with a short conversational flow.
- Stores the user's domains, experience level, goals, and timezone in OpenClaw persistent memory.
- Runs a scheduled OpenClaw cron job named `nightly-tech-brief` at 9:00 PM.
- Uses `web_search` during daily quiz generation to find recent content for the user's domains.
- Sends a Telegram Markdown message titled `🦞 *Your Daily Tech Brief* — [Date]` with exactly 5 interview questions and 3-5 tidbits.

## Repository Layout
```text
.
├── config/openclaw.json
├── skills/
│   ├── user-onboarding/SKILL.md
│   └── daily-quiz/SKILL.md
├── scripts/
│   ├── register_triggers.ps1
│   ├── register_triggers.sh
│   └── create_user_cron.js
├── .github/workflows/ci.yml
├── tests/run_tests.js
├── Dockerfile
├── docker-compose.yml
├── .env.example
└── README.md
```

## Prerequisites
- Node.js LTS and npm
- OpenClaw CLI
- Telegram bot token from `@BotFather`
- Ollama with a local model, or another OpenClaw-supported model provider

Install OpenClaw:

```bash
npm i -g openclaw
openclaw --version
```

For the recommended local model setup:

```bash
ollama pull llama3:8b
ollama serve
```

## Configuration
Copy the environment template and fill in values:

```bash
cp .env.example .env
```

The included [config/openclaw.json](config/openclaw.json) uses environment variables, so no real secrets are committed:

```json
{
  "gateway": {
    "name": "personal-learning-assistant"
  },
  "model": {
    "provider": "ollama",
    "providerConfig": {
      "url": "${env.OLLAMA_URL:-http://localhost:11434}",
      "model": "${env.OPENCLAW_MODEL:-llama3:8b}"
    }
  },
  "plugins": {
    "entries": {
      "telegram": {
        "enabled": true,
        "package": "@openclaw/plugin-telegram",
        "config": {
          "botToken": "${env.TELEGRAM_BOT_TOKEN}"
        }
      }
    }
  },
  "tools": {
    "web_search": {
      "provider": "duckduckgo",
      "config": {}
    }
  }
}
```

## Skills
The submission includes both required OpenClaw skills:

- [skills/user-onboarding/SKILL.md](skills/user-onboarding/SKILL.md): asks for technical domains, experience level, learning goals, and timezone, then stores the profile at `user_profile_{{user.id}}`.
- [skills/daily-quiz/SKILL.md](skills/daily-quiz/SKILL.md): reads the profile, invokes `web_search`, generates exactly 5 interview questions and 3-5 tidbits, and formats the Telegram message.

Stored profile schema:

```json
{
  "domains": ["string"],
  "level": "string",
  "goals": ["string"],
  "timezone": "string"
}
```

## Onboarding Trigger
This project uses an OpenClaw Standing Order instead of a custom webhook.

Rationale: a Standing Order is declarative, simple to reproduce, survives gateway restarts, and directly matches the requirement: when a Telegram user has no `user_profile_{{user.id}}` memory entry, the `user-onboarding` skill should run automatically.

Register it:

```bash
openclaw standing-orders add \
  --name "trigger-user-onboarding" \
  --if "memory.user_profile_{{user.id}} does not exist" \
  --run-skill "user-onboarding"
```

Windows PowerShell users can also run:

```powershell
.\scripts\register_triggers.ps1
```

## Daily Cron Job
The required cron job is named `nightly-tech-brief` and uses the schedule `0 21 * * *`.

After onboarding, register the user's cron using their stored timezone:

```bash
node ./scripts/create_user_cron.js <telegram-user-id>
```

The helper script reads `user_profile_<telegram-user-id>` from OpenClaw memory, extracts `timezone`, and runs:

```bash
openclaw cron add \
  --name "nightly-tech-brief" \
  --cron "0 21 * * *" \
  --tz "<stored-user-timezone>" \
  --session isolated \
  --message "Run the daily-quiz skill for user <telegram-user-id> and send the result via Telegram." \
  --announce \
  --channel telegram
```

To trigger it manually for testing:

```bash
openclaw cron trigger "nightly-tech-brief"
```

## Run Locally
1. Copy the skills into your OpenClaw home, or run from this repo if your OpenClaw setup loads local skills.
2. Copy `config/openclaw.json` to `~/.openclaw/openclaw.json`, or point OpenClaw at this config.
3. Start the gateway:

```bash
openclaw gateway start
```

4. Message your Telegram bot.
5. Complete onboarding.
6. Confirm memory:

```bash
openclaw memory get "user_profile_<telegram-user-id>"
```

7. Trigger the nightly job manually:

```bash
openclaw cron trigger "nightly-tech-brief"
```

## Run With Docker
Copy `.env.example` to `.env`, then run:

```bash
docker compose up --build
```

The container mounts:

- `./skills` to `/root/.openclaw/skills`
- `./config/openclaw.json` to `/root/.openclaw/openclaw.json`

If Ollama runs on your host machine, set `OLLAMA_URL` in `.env` to a host-reachable URL such as `http://host.docker.internal:11434` on Docker Desktop.

## Testing
Run the repository checks:

```bash
npm test
```

The test harness verifies the required files, skill content, Telegram/OpenClaw config, Docker files, `.env.example`, and README references.

## Continuous Integration
This repository includes [.github/workflows/ci.yml](.github/workflows/ci.yml), which runs `npm test` on pushes to `main` and on pull requests.

## Troubleshooting
- If `openclaw` is not recognized, install the OpenClaw CLI and ensure it is on your `PATH` before running the gateway or cron commands.
- If `sh` is unavailable on Windows, use the PowerShell script instead:

```powershell
.\scripts\register_triggers.ps1
```
- If Ollama runs on the host machine with Docker Desktop, use `OLLAMA_URL=http://host.docker.internal:11434` in `.env`.

## Submission Checklist
- [x] `skills/user-onboarding/SKILL.md`
- [x] `skills/daily-quiz/SKILL.md`
- [x] Persistent memory schema documented and instructed in onboarding
- [x] Standing Order onboarding trigger documented
- [x] `nightly-tech-brief` cron command documented with `0 21 * * *`
- [x] Telegram Markdown daily brief format documented in the daily quiz skill
- [x] `config/openclaw.json` snippet with model and Telegram plugin
- [x] No real secrets committed
- [x] `Dockerfile`
- [x] `docker-compose.yml`
- [x] `.env.example`
