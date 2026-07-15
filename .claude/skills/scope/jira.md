# Jira ticket creation (Step 7 of /scope)

Create tickets **only for active phases**. Future phases live in the plan doc, not in Jira — things change during implementation.

## 1. Find the active sprint

Query via `mcp__claude_ai_Atlassian__searchJiraIssuesUsingJql`:

```
project = SCRUM AND sprint in openSprints()
```

Extract the sprint ID from the returned issues.

## 2. Determine issue type

- Fixing something broken? → **Bug**
- User-facing change? → **Story**
- Technical / internal work? → **Task**
- Smaller piece of a larger ticket? → **Subtask**

## 3. Determine the parent epic

| Key | Category | Use for |
|-----|----------|---------|
| SCRUM-763 | Website & CRO | Landing pages, funnel, conversion, website pages, design system |
| SCRUM-765 | Bugs | Bug fixes |
| SCRUM-766 | Analytics & Data | Segment, BigQuery, analytics events |
| SCRUM-767 | Email & Marketing | Klaviyo flows, email templates |
| SCRUM-768 | Shopify & Subscriptions | Shopify store, subscriptions, payments |
| SCRUM-769 | Infrastructure & Ops | Deployment, Vercel config, CI/CD |
| SCRUM-770 | Learning & Spikes | Research, prototyping, investigation |

Most website work falls under **SCRUM-763 (Website & CRO)**.

## 4. Create the ticket

- **cloudId:** `3fc0ea53-78a2-4095-bc58-97377fd07202`
- **projectKey:** `SCRUM`
- **summary:** Clear, concise title. **Prefix with the epic category** (e.g. `[Website & CRO] Add timeline to landing page`) so it reads correctly on the board.
- **description:** Use the template from `docs/workflows/08-jira-workflow.md`. Set `contentFormat: markdown`.
- **additional_fields:** always attach the epic via `parent`, so the ticket lands in the right epic rather than sitting loose on the board.

  ```json
  {
    "customfield_10020": <sprint_id_number>,
    "assignee": {"accountId": "712020:8fe0b345-2030-426a-b15b-9eb2fa3a4db6"},
    "parent": {"key": "SCRUM-763"}
  }
  ```

### Atlassian API gotchas

- Sprint ID must be a **plain number** (e.g. `567`), NOT `{"id": 567}`.
- **Verify the epic actually attached.** Re-query the new ticket with `fields: ["parent"]` after creating it. `parent` has historically been flaky (SCRUM-1131 to 1138 all shipped with the summary prefix but no epic link, because this doc used to say to skip it). It works; it just needs checking. If it genuinely fails, fall back to `editJiraIssue` to set `parent`, and only then ask the user to drag it on the board.
- Always query the active sprint fresh — sprint IDs change each sprint.

## 5. Acceptance criteria

Rules (from `docs/workflows/08-jira-workflow.md`):

- Every criterion independently testable (yes/no)
- Specific, not vague
- Include edge cases (mobile, empty states, error states)
- Include mobile-specific criteria where relevant (390px, tap targets, CTA visibility)
- **Minimum counts:** Story ≥ 3, Task ≥ 2, Bug ≥ 2

## 6. Subtasks

If a ticket has 3+ distinct pieces of work, create subtasks.

Title format:
- `[Frontend] Description`
- `[Shopify] Description`
- `[Analytics] Description`
- `[Infra] Description`

## 7. Link related tickets

If multiple tickets are created for the same scope, link them with "Relates to" via `mcp__claude_ai_Atlassian__createIssueLink`.

## 8. Update the plan document

Add a **Jira tickets** section to the plan doc (from shape.md Step 6) listing:

- Ticket key
- Title
- Phase it belongs to
- Status (initially: To Do)

## 9. Report back

End your turn with a short summary:

- Ticket keys and titles
- Sprint they were added to
- Epic category referenced in the summary prefix
- Any tickets that couldn't be created and why

**Never use em dashes** in ticket summaries, descriptions, or acceptance criteria — use hyphens or rewrite.
