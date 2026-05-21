# Register the standing order that starts onboarding for users without memory.
openclaw standing-orders add `
  --name "trigger-user-onboarding" `
  --if "memory.user_profile_{{user.id}} does not exist" `
  --run-skill "user-onboarding"

Write-Host "Registered trigger-user-onboarding."
Write-Host "After a user completes onboarding, run: node .\scripts\create_user_cron.js <telegram-user-id>"
