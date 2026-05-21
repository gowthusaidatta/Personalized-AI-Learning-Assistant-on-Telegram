---
name: user-onboarding
description: Conduct a friendly onboarding interview, save the user's preferences, and prepare them for personalized daily briefs.
---

# SKILL: User Onboarding for Personalized Learning Assistant

## GOAL
Conduct a friendly onboarding interview with a new user and store their learning preferences in OpenClaw persistent memory so the agent can send personalized daily tech briefs.

## CONTEXT
This skill is triggered when a user messages the Telegram bot and no profile exists for them in memory. The agent should collect technical domains, experience level, learning goals, and timezone.

## ONBOARDING FLOW
1. Greet the user warmly and introduce yourself as their personal AI learning assistant.
2. Explain briefly that you need to ask a few questions to tailor the daily content.
3. Ask the following questions one at a time. Wait for the user's answer before asking the next question.
   - "What technical domains or programming languages are you most interested in? (e.g., Go, Python, distributed systems, frontend development)"
   - "What is your current experience level? (e.g., junior, mid-level, senior, staff)"
   - "What are your main learning goals? (e.g., preparing for interviews, staying up-to-date, deep-diving into a new topic)"
   - "What is your timezone? Please provide an IANA timezone string (e.g., America/New_York, Europe/London, Asia/Kolkata)."
4. If a user gives a vague answer, ask one concise clarification question.
   - Example: if the user says "developer" for experience level, ask "Would you describe yourself as junior, mid-level, senior, or staff?"
5. Validate the timezone against IANA timezone names.
   - If the timezone is missing, vague, or invalid, default to `UTC`.
   - Tell the user when `UTC` is used and explain that they can update it later.
6. Once all information is gathered, use the `memory_store` tool to save the profile at the key `user_profile_{{user.id}}`.
7. Store the data as a JSON object that exactly follows this schema:

```json
{
  "domains": ["string"],
  "level": "string",
  "goals": ["string"],
  "timezone": "string"
}
```

8. Read the stored preferences back to the user and confirm that the first daily brief will arrive at 9:00 PM in their timezone.
9. Create or update the user's nightly cron job so the daily quiz runs at 21:00 in the stored timezone. If CLI tools are available, run the included helper script:

```bash
node scripts/create_user_cron.js {{user.id}}
```

The helper script reads `user_profile_{{user.id}}`, extracts `timezone`, and registers the OpenClaw cron job named `nightly-tech-brief`.

## STORAGE AND KEYS
- Memory key: `user_profile_{{user.id}}`
- Storage tool: `memory_store`
- Store `domains` and `goals` as arrays.
- Store `level` and `timezone` as strings.

## CONSTRAINTS
- Ask questions sequentially. Do not ask all questions at once.
- Keep the tone conversational, friendly, and concise.
- Do not overwhelm the user with long explanations.
- If an answer is empty, ask once with examples. If the user still skips it, store an empty array for `domains` or `goals`, or an empty string for `level`.
- If the timezone is invalid or missing, default to `UTC` and tell the user.
- The onboarding should take only a few minutes.

## EXAMPLE CONFIRMATION
After saving memory, reply with a confirmation like:

```text
Thanks, I saved your preferences:
Domains: Python, Distributed Systems
Level: Mid-level
Goals: Interview prep
Timezone: Asia/Kolkata

I'll send your first daily brief tonight at 9:00 PM Asia/Kolkata.
```
