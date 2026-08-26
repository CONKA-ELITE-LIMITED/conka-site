---
name: explain
description: ELI5 - explain the thing just discussed in plain, simple language with a real-world analogy, no jargon, short. Use when asked to "explain", "eli5", "explain like I'm 5", "explain that simply", "what does that actually mean", or to break down something just mentioned in conversation.
argument-hint: [optional: the specific thing to explain - defaults to what was just discussed]
allowed-tools: Read, Grep
---

# /explain -- ELI5, Explain It Simply

Explain the topic (the argument if given, otherwise the main thing from the last few exchanges) as if to a smart person with zero background in it. Not actually a 5-year-old: no baby talk, no condescension. Just zero assumed knowledge.

## Rules

- **Lead with a real-world analogy** that carries the core mechanism, then map it back to the actual thing in one or two sentences.
- **Under 150 words.** If it cannot fit, explain only the core idea and offer to go one level deeper.
- **No jargon.** Every technical term either goes, or gets defined in the same sentence using everyday words.
- **One idea.** If the topic has three parts, explain the part that matters most and name the others in passing.
- **Why before how.** Say what problem the thing solves before how it works; the how often becomes obvious.
- **Plain prose.** No headers, no bullets, no code blocks in the answer itself.
- Do not re-read files or docs already discussed this session; explain from context. Only Read something if the user names a file not yet seen.
- Never use em dashes.

## Example shape

"/explain CAPI deduplication" ->

"When someone buys, we tell Meta twice: once from their browser, once from our server, because either message alone can get lost. But Meta must not count it as two sales. So both messages carry the same receipt number, and Meta keeps only one copy. Deduplication breaking means the receipt numbers do not match, so Meta counts double and thinks our ads work better than they do."
