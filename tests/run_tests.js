const fs = require('fs');
const assert = require('assert');

function exists(p){
  if(!fs.existsSync(p)) throw new Error(`Missing required file: ${p}`);
}

function contains(p, substr){
  const s = fs.readFileSync(p,'utf8');
  if(!s.includes(substr)) throw new Error(`File ${p} does not contain required text: ${substr}`);
}

try{
  console.log('Running repository checks...');

  exists('skills/user-onboarding/SKILL.md');
  contains('skills/user-onboarding/SKILL.md','user_profile_{{user.id}}');
  contains('skills/user-onboarding/SKILL.md','timezone');

  exists('skills/daily-quiz/SKILL.md');
  contains('skills/daily-quiz/SKILL.md','🦞 *Your Daily Tech Brief*');
  contains('skills/daily-quiz/SKILL.md','web_search');
  contains('skills/daily-quiz/SKILL.md','Exactly 5 interview questions');

  exists('config/openclaw.json');
  contains('config/openclaw.json','telegram');
  contains('config/openclaw.json','${env.TELEGRAM_BOT_TOKEN}');

  exists('Dockerfile');
  exists('docker-compose.yml');

  exists('.env.example');
  contains('.env.example','TELEGRAM_BOT_TOKEN');

  exists('README.md');
  contains('README.md','openclaw cron trigger');

  console.log('All checks passed.');
  process.exit(0);
} catch (err){
  console.error('Test failed:', err.message);
  process.exit(2);
}
