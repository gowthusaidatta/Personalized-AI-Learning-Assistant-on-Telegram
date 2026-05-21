#!/usr/bin/env node
// create_user_cron.js
// Reads a user's profile from OpenClaw memory and registers a cron job using the user's timezone.

const { execSync } = require('child_process');

function getUserProfile(userId) {
  try {
    const out = execSync(`openclaw memory get "user_profile_${userId}"`, { encoding: 'utf8' });
    return JSON.parse(out);
  } catch (e) {
    console.error('Failed to read user profile:', e.message);
    process.exit(1);
  }
}

function addCronForUser(userId, timezone) {
  const msg = `Run the daily-quiz skill for user ${userId} and send the result via Telegram.`;
  const cmd = `openclaw cron add --name "nightly-tech-brief" --cron "0 21 * * *" --tz "${timezone}" --session isolated --message "${msg}" --announce --channel telegram`;
  console.log('Running:', cmd);
  try {
    const out = execSync(cmd, { stdio: 'inherit' });
  } catch (e) {
    console.error('Failed to add cron job:', e.message);
    process.exit(1);
  }
}

if (process.argv.length < 3) {
  console.error('Usage: node create_user_cron.js <userId>');
  process.exit(2);
}

const userId = process.argv[2];
const profile = getUserProfile(userId);

if (!profile || !profile.timezone) {
  console.error('Profile missing or timezone not set.');
  process.exit(1);
}

addCronForUser(userId, profile.timezone);
