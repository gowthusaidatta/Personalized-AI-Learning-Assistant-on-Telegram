# SKILL: Daily Tech Brief and Quiz Generation

## GOAL
Generate a personalized daily tech brief containing exactly 5 interview questions and 3–5 technical tidbits, then send it to the user on Telegram using Markdown formatting.

Exactly 5 interview questions are required by the project verification.

## CONTEXT
This skill is triggered by a scheduled cron job (9 PM daily) and is provided the user's ID. It must read the user's profile from memory, use web_search to gather fresh content, and generate high-quality questions and tidbits tailored to the user.

## GENERATION WORKFLOW
1. Retrieve the user profile from memory using the key `user_profile_{{user.id}}`.
   - If the profile is missing or invalid, abort and (if possible) notify the user that onboarding is required.
2. For each domain in `profile.domains`, run a `web_search` with queries focused on recent articles, tutorials, or notable updates. Prefer results from the last 6 months when possible. Example query: "latest Go performance tips 2025" or "distributed systems design patterns 2025".
   - Prefer results filtered by recency (last 6 months) and favor high-quality sources (tutorials, blog posts from reputable authors, research notes). When available, capture the source URL for each tidbit.
3. Synthesize 3–5 concise technical tidbits from the search results (short, insightful facts or links).
4. Generate exactly 5 interview questions that meet these criteria:
   - Relevant to the user's domains.
   - Appropriate difficulty for `profile.level`.
   - Variety of types: conceptual, coding/algorithmic, system design, and behavioral.
   - Avoid repeating recently-asked topics; use memory to track the last 10 asked topics if available.
   - After sending the brief, write/update a `recently_asked_{{user.id}}` entry in memory with the topics used so the agent can avoid repetition.
5. Assemble the Telegram message using Markdown with the exact structure below.

```
🦞 *Your Daily Tech Brief* — [Date]

━━━━━━━━━━━━━━━━━━━━
🧠 *Interview Questions*
━━━━━━━━━━━━━━━━━━━━

*Q1 [Type — Domain]*
[Question 1 Text]

*Q2 [Type — Domain]*
[Question 2 Text]

*Q3 [Type — Domain]*
[Question 3 Text]

*Q4 [Type — Domain]*
[Question 4 Text]

*Q5 [Type — Domain]*
[Question 5 Text]

━━━━━━━━━━━━━━━━━━━━
💡 *Today's Tidbits*
━━━━━━━━━━━━━━━━━━━━

• [Tidbit 1]

• [Tidbit 2]

• [Tidbit 3]

━━━━━━━━━━━━━━━━━━━━
Reply *answers* to get feedback, or *more* for extra questions.
```

## TOOLS
- Use the memory tool to read the user's profile (key: `user_profile_{{user.id}}`) and to write the `recently_asked_{{user.id}}` tracking key after the run.
- Use `web_search` (and `web_fetch` if needed) to collect recent content. Instruct the search to prefer fresh content and capture source URLs for tidbits when possible.

## CONSTRAINTS
- Exactly 5 questions; 3–5 tidbits.
- Message must be valid Telegram Markdown and readable on mobile.
- Do not request clarification during the automated run — the job must run autonomously.

## FAILURE MODE
- If the user profile is missing, abort and log an informative message. If possible, announce to the user that onboarding is required.

## EXAMPLE
- The agent should send a final message titled "🦞 *Your Daily Tech Brief* — 2025-05-23" containing the two sections and adhering to the formatting above.
