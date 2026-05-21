#!/usr/bin/env bash
# Register OpenClaw standing order and a placeholder cron job (bash)

# Register standing order to trigger onboarding for new users
openclaw standing-orders add --name "trigger-user-onboarding" --if "memory.user_profile_{{user.id}} does not exist" --run-skill "user-onboarding"

# Create a placeholder nightly job for the primary user. Replace {TIMEZONE} with the real timezone before running.
openclaw cron add --name "nightly-tech-brief" --cron "0 21 * * *" --tz "{TIMEZONE}" --session isolated --message "Run the daily-quiz skill for the primary user." --announce --channel telegram

echo "Standing order and placeholder cron command issued. Replace {TIMEZONE} and re-run the cron add command with a real timezone if needed."