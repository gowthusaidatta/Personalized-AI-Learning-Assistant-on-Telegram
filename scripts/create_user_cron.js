#!/usr/bin/env node

const { spawnSync } = require('child_process');

function runOpenClaw(args, options = {}) {
  const result = spawnSync('openclaw', args, {
    encoding: 'utf8',
    stdio: options.inherit ? 'inherit' : ['ignore', 'pipe', 'pipe']
  });

  if (result.status !== 0) {
    const message = result.stderr || result.stdout || `openclaw exited with ${result.status}`;
    throw new Error(message.trim());
  }

  return result.stdout.trim();
}

function getUserProfile(userId) {
  const output = runOpenClaw(['memory', 'get', `user_profile_${userId}`]);
  return JSON.parse(output);
}

function addCronForUser(userId, timezone) {
  const message = `Run the daily-quiz skill for user ${userId} and send the result via Telegram.`;
  runOpenClaw([
    'cron',
    'add',
    '--name',
    'nightly-tech-brief',
    '--cron',
    '0 21 * * *',
    '--tz',
    timezone,
    '--session',
    'isolated',
    '--message',
    message,
    '--announce',
    '--channel',
    'telegram'
  ], { inherit: true });
}

const userId = process.argv[2];

if (!userId) {
  console.error('Usage: node scripts/create_user_cron.js <telegram-user-id>');
  process.exit(2);
}

try {
  const profile = getUserProfile(userId);

  if (!profile || typeof profile.timezone !== 'string' || profile.timezone.trim() === '') {
    throw new Error('Profile is missing a timezone.');
  }

  addCronForUser(userId, profile.timezone.trim());
  console.log(`Registered nightly-tech-brief for user ${userId} at 21:00 ${profile.timezone.trim()}.`);
} catch (error) {
  console.error(`Failed to register user cron: ${error.message}`);
  process.exit(1);
}
