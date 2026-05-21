# SKILL: User Onboarding for Personalized Learning Assistant

## GOAL
Conduct a friendly onboarding interview with a new user and store their learning preferences in persistent memory so the agent can send personalized daily briefs.

## CONTEXT
This skill triggers when a user messages the bot and no profile for them exists in memory. The agent should collect their technical domains, experience level, learning goals, and timezone.

## ONBOARDING FLOW
1. Greet the user warmly and introduce yourself as their personal AI learning assistant.
2. Explain briefly why you need to ask a few questions to tailor the daily content.
3. Ask the following questions one-by-one, waiting for an answer before asking the next. Wait up to 2 minutes for a reply to each question; if there is no reply within 2 minutes, send one gentle reminder. If there is still no reply after a second reminder, end onboarding and save any collected fields (see step 5). To allow users to skip an optional question, accept the response `skip`.
   - "What technical domains or programming languages are you most interested in? (e.g., Go, Python, distributed systems, frontend)"
   - "What is your current experience level? (e.g., junior, mid-level, senior, staff)"
   - "What are your main learning goals? (e.g., preparing for interviews, staying up-to-date, deep-diving into a topic)"
  - "What is your timezone? Please provide an IANA timezone string (e.g., 'America/New_York', 'Asia/Kolkata')."
4. If a user replies with vague or short answers, ask a concise clarification question to make the response actionable (example: "Do you mean junior, mid-level, or senior?").
5. When all fields are gathered (or onboarding ends due to timeout), construct a JSON object with the following structure and save it to memory using the `memory_store` tool. If onboarding ended early, save the fields that were collected and mark missing fields as empty strings or empty arrays so they can be updated later by the user. Use the user's unique ID as part of the key: `user_profile_{{user.id}}`.

```json
{
  "domains": ["string"],
  "level": "string",
  "goals": ["string"],
  "timezone": "string"
}
```

6. Read back the stored preferences to the user in a friendly confirmation message and tell them when to expect their first daily brief (example: "I'll send your first daily brief tonight at 9:00 PM {timezone}.").

7. (Optional automated step) Create or update a cron job that will run the nightly quiz for this user at 21:00 in their timezone. Example CLI command (replace placeholders):

```
openclaw cron add \
  --name "nightly-tech-brief" \
  --cron "0 21 * * *" \
  --tz "{user.timezone}" \
  --session isolated \
  --message "Run the daily-quiz skill for user {{user.id}} and send the result via Telegram." \
  --announce \
  --channel telegram
```

If you prefer automated registration, run the included script `scripts/create_user_cron.js` after onboarding to create a per-user cron using the stored timezone.

## STORAGE & KEYS
- Memory key: `user_profile_{{user.id}}`
- Store as a JSON object exactly matching the schema above. Use arrays for `domains` and `goals`.

Validation rules:
- Timezone: Validate the supplied timezone string against the IANA timezone database. If the timezone is unrecognized, consider it invalid and default to `UTC` (see Constraints). When defaulting, inform the user that `UTC` was used and tell them how to update it.
- Domains/goals: If the user gives an empty response, prompt one time with an example list; if still empty or the user replies `skip`, store an empty array and continue.

## CONSTRAINTS
- Ask questions sequentially; do not overwhelm the user with multiple questions at once.
- If a timezone is invalid or missing, default to `UTC` and tell the user.
 - If a timezone is invalid or missing, default to `UTC` and tell the user. Validate timezones against IANA names; treat any unrecognized string as invalid.

Prioritization:
- If constraints conflict, prioritize (1) capturing essential fields required to send the daily brief (`domains`, `level`, `timezone`), (2) completing onboarding within a few minutes, and (3) maintaining sequential questioning and a friendly tone. In edge cases, prefer saving a minimal, correct profile quickly over extended clarification loops.
- Keep tone friendly and concise; the onboarding should complete in a few minutes.

## EXAMPLES
- On success, the agent should reply with a confirmation such as:

  "Thanks — I saved your preferences: Domains: Python, Distributed Systems; Level: Mid-level; Goals: Interview prep; Timezone: Asia/Kolkata. I'll send your first daily brief tonight at 9:00 PM Asia/Kolkata."
