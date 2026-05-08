# AI Systems Engineering: Master Notes & Action Plan
*Consolidated Framework based on the 'Afternoon Tea' series by Jake Van Clief*

---

## 1. Stop Building Production-Ready AI: Solve for One
**Video:** [Afternoon Tea #2](https://www.youtube.com/watch?v=AZ1l-oaD3tk)

### Core Concepts
- **The Scaling Trap:** Most builders try to build for a mass market before solving the problem for a single human.
- **Manual First:** Perform the task manually with LLMs 10+ times to understand the nuances before writing a single line of automation code.
- **The Niche Advantage:** Small, specific niches provide the "slack" (forgiveness) needed to iterate and fail without high stakes.

### Actionable Insights
- **Identify the Friction:** Find a high-value manual task.
- **Protocol:** Create a `/proto` folder. Manually guide an LLM through the task to map the logic before automating.

---

## 2. The AI Skill Framework
**Video:** [The AI Skill Framework](https://www.youtube.com/watch?v=rHDA0WMXzy4)

### Core Concepts
- **Skills as Modules:** A "Skill" is a discrete, functional directory containing a `SKILL.md` (instructions), `scripts/` (deterministic code), and `reference/` (standards).
- **YAML Routing:** Use frontmatter descriptions so Claude Code knows exactly when to load a skill.
- **Deterministic vs. Probabilistic:** Use Python/Bash scripts for data processing and the LLM for reasoning.

### Actionable Insights
- **Setup:** Create a `.claude/skills/` directory in your repo.
- **Modularize:** Move your frequent, complex prompts into `SKILL.md` files with clear "Purpose" and "Constraints."

---

## 3. Interpretable Context Methodology (ICM)
**Videos:** [ICM Deep Dive](https://www.youtube.com/watch?v=hALln9wrrQo) & [Agentic Patterns](https://www.youtube.com/watch?v=MkN-ss2Nl10)

### Core Concepts
- **Folders as Memory:** Use numbered folders (e.g., `01_research`, `02_dev`) to represent the state of a project.
- **The CONTEXT.md Contract:** Every folder contains a file defining Inputs, Process, and Outputs.
- **Agentic Patterns:**
    - **Reflection:** The AI reviews its work.
    - **Planning:** The AI writes a `PLAN.md` before executing.
    - **Multi-Agent:** Specialized roles (Coder vs. Tester) across different folders.

### Actionable Insights
- **State-Machine:** Rename folders to reflect project maturity (01, 02, 03).
- **The Handshake:** Ensure the output of Folder 01 is the explicit input requirement for Folder 02.

---

## 4. Unified System Architecture
**Video:** [Creative, Software, and Business Work as One](https://www.youtube.com/watch?v=ZMDXs59Ntjc)

### Core Concepts
- **One Shape for All Work:** Apply the same ICM logic to business strategy, creative writing, and coding to reduce mental context switching.
- **Outcomes over Features:** Define the "Why" in a root `OUTCOMES.md` file.
- **Interpretable Context:** If a human can't understand the project state by looking at the folder tree, the AI will likely fail too.

### Actionable Insights
- **Root Controller:** Create a `CLAUDE.md` at the project root defining the project ethos and tech stack.
- **Goal Alignment:** Start every Claude Code session by asking it to read `OUTCOMES.md`.

---

## 5. Everything as a Skill (Operating System layer)
**Video:** [How to Prompt](https://www.youtube.com/watch?v=SjlCJIU9ODs)

### Core Concepts
- **The OS as an Extension:** The LLM is the brain; the Operating System is the body.
- **Tool Use:** Leverage Claude's ability to execute terminal commands to navigate files and run scripts safely.
- **Safety through Constraints:** Skills provide a "sandbox" of allowed actions.

### Actionable Insights
- **Automation:** Build a "Doc-Update" skill that automatically syncs code changes with your `README.md`.

---

## 6. Claude Design: Programmatic Motion
**Video:** [The Future of Claude Design](https://www.youtube.com/watch?v=pdoSAWWCDO8)

### Core Concepts
- **Living Interfaces:** Moving from static UI to programmatic, code-based animation.
- **3D Assets as Code:** Using Three.js and GSAP to generate 3D scenes from static assets.
- **Remotion:** Using React to "render" frame-perfect video files (MP4) from code.

### Actionable Insights
- **Brand-Aligned Motion:** Provide Claude with CSS variables and brand-identity JSON files to ensure generated animations are "on-brand."
- **Three.js Wrapper:** Ask Claude to map static PNGs onto 3D planes for interactive web elements.

---

## Final Instruction for Claude Code
*Copy and paste this into your session to prime the AI:*

> "I am using the **Interpretable Context Methodology (ICM)**. My project is organized into state-based folders (01, 02, 03). Please reference the `CONTEXT.md` in each directory before performing actions. Always check the root `OUTCOMES.md` for project goals and use the skills defined in `.claude/skills/` for repetitive tasks."
