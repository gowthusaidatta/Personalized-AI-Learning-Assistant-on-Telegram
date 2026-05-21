---
name: daily-quiz
description: Generate a personalized daily tech brief with fresh web search results, five interview questions, and three to five tidbits.
---

# SKILL: Daily Tech Brief and Quiz Generation

## GOAL
Generate a personalized daily tech brief containing exactly 5 interview questions and 3-5 technical tidbits, then send it to the user on Telegram using Markdown formatting.

Exactly 5 interview questions are required by the project verification.

## CONTEXT
This skill is triggered by a scheduled cron job at 9:00 PM in the user's local timezone. The job provides the user's ID. You must read the user's profile from memory, use `web_search` to gather fresh content, and generate high-quality questions and tidbits tailored to the stored preferences.

## GENERATION WORKFLOW
1. Retrieve the user profile from memory using the key `user_profile_{{user.id}}`.
   - If the profile is missing or invalid, abort and, if possible, notify the user that onboarding is required.
2. Read `profile.domains`, `profile.level`, `profile.goals`, and `profile.timezone`.
3. For each domain in `profile.domains`, run a `web_search` query focused on recent articles, tutorials, release notes, engineering posts, or notable updates.
   - Use queries like `latest Go programming performance tips 2026`, `recent distributed systems design patterns 2026`, or `new Python backend best practices 2026`.
   - Prefer fresh results from the last 6 months when available.
   - Favor high-quality sources such as official documentation, engineering blogs, reputable tutorials, research notes, and release notes.
   - Capture source URLs for tidbits when available.
4. Synthesize 3-5 concise technical tidbits from the search results.
   - A tidbit should be useful, specific, and grounded in the searched content.
   - Avoid generic definitions unless they are tied to a recent change or practical insight.
5. Generate exactly 5 interview questions that meet these criteria:
   - Relevant to the user's domains.
   - Appropriate difficulty for `profile.level`.
   - Include variety across conceptual, coding or algorithmic, system design, debugging, and behavioral styles.
   - Reflect the user's goals where possible, especially interview preparation or deep dives.
   - Avoid repeating recently asked topics. Read `recently_asked_{{user.id}}` if available and avoid the last 10 topics.
6. After sending the brief, update `recently_asked_{{user.id}}` in memory with the topics used in the 5 questions.
7. Assemble the Telegram message using Markdown with the exact structure below.

```text
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
- Use the memory tool to read `user_profile_{{user.id}}`.
- Use the memory tool to write `recently_asked_{{user.id}}` after each successful run.
- Use `web_search` for recent content in each stored domain.
- Use `web_fetch` when a search result needs more detail before you summarize it.

## CONSTRAINTS
- Generate exactly 5 questions.
- Generate 3-5 tidbits.
- The message must be valid Telegram Markdown and readable on mobile.
- The final message must include the title `🦞 *Your Daily Tech Brief* — [Date]`.
- The final message must include the sections `🧠 *Interview Questions*` and `💡 *Today's Tidbits*`.
- The job must run autonomously. Do not ask the user for clarification during the scheduled run.

## FAILURE MODE
If the user profile is missing, abort and log an informative message. If possible, announce to the user that onboarding is required before the daily brief can be generated.

## EXAMPLE
The agent should send a final message titled `🦞 *Your Daily Tech Brief* — 2026-05-23` containing exactly 5 questions and 3-5 tidbits.
