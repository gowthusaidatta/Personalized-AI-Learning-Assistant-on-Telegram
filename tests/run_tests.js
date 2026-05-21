const fs = require('fs');
const assert = require('assert');

function read(path) {
  assert.ok(fs.existsSync(path), `Missing required file: ${path}`);
  return fs.readFileSync(path, 'utf8');
}

function includes(path, text) {
  const content = read(path);
  assert.ok(content.includes(text), `${path} must include: ${text}`);
}

console.log('Running repository checks...');

includes('skills/user-onboarding/SKILL.md', 'user_profile_{{user.id}}');
includes('skills/user-onboarding/SKILL.md', 'memory_store');
includes('skills/user-onboarding/SKILL.md', '"domains": ["string"]');
includes('skills/user-onboarding/SKILL.md', '"level": "string"');
includes('skills/user-onboarding/SKILL.md', '"goals": ["string"]');
includes('skills/user-onboarding/SKILL.md', '"timezone": "string"');

includes('skills/daily-quiz/SKILL.md', '🦞 *Your Daily Tech Brief*');
includes('skills/daily-quiz/SKILL.md', '🧠 *Interview Questions*');
includes('skills/daily-quiz/SKILL.md', "💡 *Today's Tidbits*");
includes('skills/daily-quiz/SKILL.md', 'web_search');
includes('skills/daily-quiz/SKILL.md', 'exactly 5');
includes('skills/daily-quiz/SKILL.md', '3-5');

includes('config/openclaw.json', '"provider": "ollama"');
includes('config/openclaw.json', '"telegram"');
includes('config/openclaw.json', '${env.TELEGRAM_BOT_TOKEN}');

read('Dockerfile');
read('docker-compose.yml');

includes('.env.example', 'TELEGRAM_BOT_TOKEN');
includes('.env.example', 'OLLAMA_URL');
includes('.env.example', 'OPENCLAW_MODEL');

includes('README.md', 'Standing Order');
includes('README.md', 'nightly-tech-brief');
includes('README.md', '0 21 * * *');
includes('README.md', 'docker compose up --build');

console.log('All checks passed.');
