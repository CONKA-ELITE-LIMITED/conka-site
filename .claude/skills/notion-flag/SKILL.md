---
name: notion-flag
description: Plant a flag in the ground on the Notion Flags timeline when a distinct website change goes live, so that when sales or conversion later dip or spike, anyone can look back and see what actually changed and when. Use whenever the user says "flag it", "put a flag in the ground", "add this to the flags", mentions the flags timeline or marking a change on the timeline, or has just shipped something notable to production. This is for user-visible website changes only, and only for distinct changes, not routine updates.
argument-hint: [what shipped] [--date YYYY-MM-DD] [--tag Tech|CONKA|Price|Ops|Marketing|B2B]
allowed-tools: Read, Grep, Glob, Bash, mcp__notion__notion-fetch, mcp__notion__notion-query-data-sources, mcp__notion__notion-create-pages, mcp__notion__notion-update-page
---

# /notion-flag — Mark the day something changed

The Flags timeline exists to answer one question, asked after the fact: "sales moved, what did we change?" It only works if the flags are sparse, accurate, and dated to the day visitors were actually affected. A timeline crowded with every patch tells you nothing, and a flag dated to the day code merged to a branch points at a day when visitors saw nothing.

So the two ways to get this wrong are flagging too much, and flagging the wrong date. Both are worse than not flagging at all, because a wrong flag will be used to explain a real revenue swing.

The timeline: https://app.notion.com/p/38b03d3cdce280f8b6e5e4d47769332c

## Constants

| Thing | Value |
|---|---|
| Flags data source | `collection://38b03d3c-dce2-8061-bb51-000ba2bf2df3` |
| Parent for new rows | `{"type": "data_source_id", "data_source_id": "38b03d3c-dce2-8061-bb51-000ba2bf2df3"}` |
| The date property | `Date`. The timeline is built on it. If a write fails with "no such column", someone renamed it in Notion — confirm the current name with a `SELECT * ... LIMIT 1`, use what the query returns, and update this table. |

## Schema

| Property | Notes |
|---|---|
| `Name` | `🖥️ ` + a short sentence. Title case, no full stop. The desktop emoji leads every website flag, which is how the team spots website changes on a timeline that also holds app, offer and marketing flags. |
| `date:Date:start` | The day it **went live on production**. See below. |
| `date:Date:end` | **start + 6 days**, so the flag spans a week. It is not a claim that the change took a week, it is just enough width for the label to be readable on the timeline. |
| `date:Date:is_datetime` | `0` |
| `Tags` | JSON array string, e.g. `"[\"Tech\"]"`. Propose `Tech` for a website change (`Price` for pricing/offer changes, `Marketing` for landing/ad-surface pushes) and confirm before writing. |

## What earns a flag

A flag is for a change a reasonable person might later point at to explain a movement in sales, conversion, signups or traffic. Ask: if revenue moved next week, would anyone want to know this happened? If not, it is not a flag.

- **Flag it:** a new or rebuilt page visitors can see, a change to the funnel or checkout path, a pricing or offer change, a significant redesign or new hero, a new landing page for paid traffic, a fix for something that was actively broken for visitors.
- **Do not flag it:** routine patches, refactors, copy nits, internal tooling, backend or data-layer work with no visible surface, docs, or anything behind a noindex URL nobody is being sent to yet. (A noindex landing page *does* earn a flag on the day ad spend starts pointing at it — that is the day it reaches people.)

If you are unsure, say so and let the user decide rather than quietly planting one. The cost of a missing flag is small. The cost of a misleading one is that somebody explains a sales dip with the wrong cause.

## The date is the day visitors got it

Anchor the flag to the day the change actually reached production — the day the PR merged to `main` and Vercel deployed it, not the day the feature branch was cut and not the day work finished locally. For an ad landing surface, the meaningful date can instead be the day traffic started being sent to it; use that if the user says so.

Unlike an app release there is no store review lag, so the merge-to-main date is usually the live date and you can often infer it from `git log main` or the merged PR. Still confirm it with the user rather than silently assuming — a change can merge and sit behind a flag, or the deploy can be days after the merge. If they gave a date in the argument, use it.

## Writing the name

It goes on a timeline, so it is read at a glance in a narrow box. Short, concrete, and specific enough to mean something to somebody who was not in the room.

Follow what is already there:

- `🖥️ Website SEO AEO Upgrade`
- `🖥️ Funnel-b UI Simplification`
- `📱 Screen Time Integration IOS`

Name the thing, not the work. "🖥️ New Home Hero Video" beats "🖥️ Merged PR #428", because a PR number tells a future reader nothing about what changed. Name the surface when it matters: "home page", "PDP", "funnel" locate the change for a reader scanning for causes.

## Process

1. **Work out what shipped and whether it earns a flag.** From the argument, or the current branch, recent commits and merged PRs (`git log`, `gh pr list --state merged`). If it looks routine, say so and ask before proceeding.
2. **Check the timeline for a duplicate.** Query the data source and look for an existing flag covering the same change. Two flags for one change is the failure mode that makes the timeline untrustworthy.
   ```
   SELECT "Name", "date:Date:start" FROM "collection://38b03d3c-dce2-8061-bb51-000ba2bf2df3"
   ORDER BY "date:Date:start" DESC
   ```
3. **Get the live date.** Infer it from the merge if you can, then confirm; ask outright if you cannot.
4. **Present, then write.** Show the name, the date range and the tag, and wait. Then create with `notion-create-pages` and give the user the URL.

Notion rate-limits and returns 429s. Wait roughly 30 seconds and retry rather than abandoning the step.
