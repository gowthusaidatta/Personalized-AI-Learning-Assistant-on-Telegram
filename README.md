# Personalized AI Learning Assistant on Telegram (OpenClaw)

## Overview
This project implements a personalized daily learning assistant that runs on Telegram using the OpenClaw gateway. It onboards users, stores their preferences, searches the web daily for fresh content, and delivers a formatted daily brief with 5 interview questions and 3–5 technical tidbits.

## Repository layout
- skills/
  - user-onboarding/SKILL.md
  - daily-quiz/SKILL.md
- config/
  - openclaw.json
- Dockerfile
- docker-compose.yml
- .env.example
- README.md

## Quickstart (Local, recommended for development)
1. Install Node.js (LTS) and npm.
2. Install OpenClaw globally:

```bash
npm i -g openclaw
```

3. Ensure you have a model provider available:
- Recommended: install and run Ollama locally (`ollama serve`).
- Alternatively, configure a cloud model and set the model provider in `config/openclaw.json`.

4. Configure your Telegram bot token in a `.env` file based on `.env.example`.

5. Start the gateway locally:

```bash
openclaw gateway start
```

6. Test onboarding by messaging your bot from Telegram (use a separate account or clear chat to simulate a new user).

7. Manually trigger the nightly job for testing:

```bash
openclaw cron trigger "nightly-tech-brief"
```

## Containerized setup (Docker)
1. Copy `.env.example` to `.env` and fill values.
2. Build and run with Docker Compose:

```bash
docker compose up --build -d
```

Notes:
- The container copies `config/openclaw.json` and `skills/` into the image; you can also mount them as volumes to iterate quickly.
- Ollama typically runs on the host; if you run Ollama in a container, add it to `docker-compose.yml` and point `OLLAMA_URL` accordingly.

## Registering triggers (Standing Order + Cron)

This project includes convenience scripts to register the onboarding standing order and a placeholder cron job. There are two options:

- Use the provided scripts (PowerShell or Bash):

```powershell
# Windows PowerShell
.\scripts\register_triggers.ps1
```

```bash
# macOS / Linux
sh ./scripts/register_triggers.sh
```

- Create a cron for a specific user (uses `openclaw memory get` and `openclaw cron add`):

```bash
# Example: register nightly cron for user with ID 12345
node ./scripts/create_user_cron.js 12345
```

The `create_user_cron.js` script reads `user_profile_<id>` from OpenClaw memory, extracts the `timezone` field, and registers a cron job named `nightly-tech-brief` that runs at 21:00 in that timezone. This satisfies the requirement to run the daily-quiz in the user's local timezone.

## Configuration snippet
See the included configuration at [config/openclaw.json](config/openclaw.json).

Important: never commit real secrets. Use environment variables (see `.env.example`) and reference them in `openclaw.json` as shown.

## Onboarding trigger: Standing Order vs Webhook
- Design choice: This submission uses a **Standing Order** approach for onboarding. Reasoning:
  - Standing Orders are simple to implement with OpenClaw and can be defined declaratively to run the onboarding skill when a profile is not present.
  - They are robust to restarts and ensure onboarding runs automatically the first time a new user messages the bot.
  - A webhook approach is also valid but requires additional custom code to inspect messages and decide which skill to invoke.

If you prefer a webhook or custom trigger, the README can be extended with instructions.

## Submission checklist
- [x] `skills/user-onboarding/SKILL.md`
- [x] `skills/daily-quiz/SKILL.md`
- [x] `config/openclaw.json` (no secrets)
- [x] `Dockerfile` and `docker-compose.yml`
- [x] `.env.example`

## Next steps / Testing recommendations
- Run the gateway and test onboarding flow.
- Trigger `openclaw cron trigger "nightly-tech-brief"` to validate daily-quiz behavior.
- Iterate on `SKILL.md` prompts for improved question quality.

## Automated checks
This repository includes a small test harness that verifies the presence and basic contents of required files. It requires only Node.js to run.

Install (if you don't have Node) and run the tests:

```bash
# From the project root
npm test
```

The test runner checks for the two `SKILL.md` files, `config/openclaw.json`, the Docker files, and that `.env.example` contains the `TELEGRAM_BOT_TOKEN` variable.

## Contact
If you find issues or want help testing, open an issue in the repo or message me directly.
