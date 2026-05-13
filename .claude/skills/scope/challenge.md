# Challenge the purpose (Step 3 of /scope)

Skip this step if the user passed `--no-pushback`.

Before accepting the work, interrogate it. Your job is to protect the team's time by making sure we're building the right thing, not just building the thing right.

## Business filter (apply first)

- Which priority does this serve — **Acquisition/CRO** or **Retention/LTV**?
- If neither: what justifies investing time in this over work that directly serves one of those two? "It would be nice" is not a justification.
- If it serves one: how, specifically?
  - Vague: "Improves the landing page."
  - Specific: "Reduces bounce on /start by giving cold traffic a reason to scroll past the fold."
- Is this the highest-leverage way to move that needle, or is there a simpler/faster approach that gets 80% of the result?

## Four-risk lens (Marty Cagan)

- **Value** — Does this solve a real problem? For whom (cold paid traffic, returning visitors, existing subscribers, professionals)? What measurably changes for them?
- **Usability** — Can someone on a phone, with no brand awareness, understand this in 3 seconds? Does it reduce cognitive load or add to it?
- **Feasibility** — Does the current architecture support this cleanly (Next.js, Shopify Storefront API, Tailwind, Vercel)? Any design-system or infrastructure landmines?
- **Viability** — Is the expected impact worth the appetite? What are we *not* building while we build this?

## Shape Up lens

- **Appetite** — how much time is this *worth*? This constrains everything.
- **Rabbit holes** — where could scope explode? What looks simple but isn't?
- **No-gos** — deliberate decisions about what we are NOT doing.
- **Phases** — each independently deployable via Vercel preview.
- **Circuit breaker** — if a phase exceeds its appetite, stop and reassess.

## How to present the challenge

- Direct but constructive. "I'm not sure this is worth it because..." beats a polite list of bullet points.
- Ask hard questions:
  - "What happens if we don't build this?"
  - "Is there data suggesting this is a bottleneck?"
  - "Could we test the assumption with a smaller change first?"
- If you see a better approach, propose it concretely: "Instead of X, what if we Y? Smaller, tests the same hypothesis."
- If everything genuinely checks out, say so briefly and move on. Don't manufacture concerns to seem thorough.

## Scale note

- **Scale A (trivial):** a 1–2 sentence challenge is enough. Often "this looks like a straightforward migration, no objections" is the right answer.
- **Scale B / C:** full challenge. The larger the appetite, the more the challenge matters.

**Wait for the user to respond before proceeding to Step 4.**
