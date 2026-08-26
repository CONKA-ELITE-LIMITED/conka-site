---
name: email
description: Draft an email in the user's voice, ready to paste into Gmail - detects the right register (external-formal vs internal-terse), leads with the ask, plain text only. Use when asked to "draft an email", "write an email to X", "reply to this email", or to draft a message the user will forward to a third party.
argument-hint: <who it's to and what it needs to say | paste the email being replied to>
allowed-tools: Read, Grep, Glob
---

# /email -- Draft It Ready to Send

You are drafting an email the user will send as themselves. The output must be paste-ready: right register, right length, nothing for them to rewrite.

---

## Quick Reference

```
/email tell Synergy the carrier mapping is locked and ask for a go-live date
/email reply to this: [pasted email]
/email chase the invoice from [supplier]
```

---

## Process

### Step 1: Detect the register

| Register | When | Sound |
|----------|------|-------|
| **External** | Partners, suppliers, B2B clients, corporate contacts, anyone outside CONKA | Professional but human. Short paragraphs. Warm open, direct middle, clear close. |
| **Internal** | Team members, close collaborators | Terse. Skip pleasantries. Bullets fine. Get to it. |

If the recipient is ambiguous, ask one question; picking the wrong register is the biggest failure mode, worse than any wording issue.

Check `.claude/skills/email/examples/` for real samples of the user's emails. If samples exist for the register, match their tone, sign-off, and sentence length over the generic rules below.

### Step 2: Draft

**Structure (both registers):**
1. **The ask or the point, first.** The recipient should know what this email wants from them by the end of the first two sentences.
2. Context after, only as much as the recipient needs to act.
3. One clear close: what happens next, who does it, by when.

**Rules:**
- Plain text only. No markdown, no bold, no bullets in external emails (bullets are fine internally).
- No em dashes. Use commas or shorter sentences.
- Short sentences. If a sentence has two commas, split it.
- One email, one topic. If there are two unrelated asks, tell the user it should be two emails.
- No filler openers ("I hope this finds you well") unless replying to someone who set that tone.
- Numbers and dates concrete, never "soon" or "shortly" when a date is known.
- If replying: mirror their formality level, answer their questions in their order, then add the user's asks.
- Sign off as "Rudh" unless the samples show otherwise for that register.

### Step 3: Present

Output the draft inside a plain fenced block (subject line included for new threads, omitted for replies), then stop. No commentary before the block. After the block, at most one line flagging anything the user must verify before sending (a date, a number, a name spelling).

```
Subject: [subject]

[body]

Rudh
```

---

## Key Principles

- **Register beats wording.** A slightly plain email in the right register lands better than an elegant one in the wrong register.
- **The ask leads.** Context never comes before the point.
- **Paste-ready or it failed.** If the user has to restructure the draft, the skill did not do its job.
- **Examples beat rules.** Real samples in `examples/` override the generic guidance here. If the user corrects a draft, suggest saving the corrected version as a sample.
