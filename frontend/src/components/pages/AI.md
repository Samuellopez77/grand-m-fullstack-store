# AI Usage

This project is a solo learning project, built to practice real-world
software engineering. I use AI assistance (Claude) and I want to be open about
where and how.

## Where AI helps
- Explaining concepts and walking through code so I understand it
- Reviewing code I paste in and pointing out bugs
- Drafting docs, issue and PR descriptions
- Scaffolding tests, CI configuration and ESLint setup
- Debugging error messages and logs

## What I write myself
- Finding and fixing bugs (syntax errors, lint findings, dead code), running and
  verifying lint, build and tests before every push
- Project decisions: stack, database, roles, milestones, issues and labels
- Git, CI and release work: branches, PRs, merges, the CI workflow edits
- Local test database setup on a machine without Docker

## My rules
1. I read and understand every suggestion before it goes into the repo.
2. Nothing is committed until I have run it: lint, build and tests locally,
   then CI on the pull request.
3. I am responsible for everything that is merged, whoever suggested it.
4. I do not paste secrets, `.env` files, tokens or real customer data into
   any AI tool.
5. When I cannot explain a piece of code, I ask for an explanation or rewrite
   it myself rather than merge it.

## Notes
## Notes
- Tool: Claude (Anthropic), used through chat, Codex and Copilot. Code and docs it
  drafted were adapted, run and reviewed by me before committing.
- This is a personal project for a friend's shop and is not graded coursework.
- AI-suggested code is checked by the same gates as everything else: ESLint,
  the test suite against a real Postgres database, the frontend build, and CI
  on every pull request.
- If I merged something I could not yet fully explain, I note it in the PR or
  open an issue to revisit it.
- This file is updated when my AI usage changes.