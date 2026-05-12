---
description: Create a pull request for the current Stockman branch. Stages uncommitted changes, commits them, pushes the branch, and opens a PR against main.
disable-model-invocation: true
---

Create a pull request for the current branch in the Stockman project.

## Steps

1. **Check status** — run `git status` and `git diff` to see what has changed.

2. **Commit uncommitted changes** (if any)
   - Stage relevant files (never stage `.env` or secrets)
   - Write a commit message that describes what changed and why
   - Use the PowerShell here-string format for the commit message:
     ```
     git commit -m @'
     <message>

     Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
     '@
     ```

3. **Push the branch**
   ```
   git push -u origin <branch-name>
   ```

4. **Create the PR**
   - If `gh` is available: use `gh pr create` with a title and body
   - If `gh` is not available: output the GitHub URL to create the PR manually:
     `https://github.com/lbredal/stockman/pull/new/<branch-name>`

5. **PR body should include**
   - Summary: what changed and why
   - Domain or layer affected (db / controller / route / component)
   - Anything a reviewer should know (migrations to run, env vars added, etc.)
   - `🤖 Generated with [Claude Code](https://claude.ai/claude-code)`

6. **Wrap the PR URL** in a `<pr-created>` tag on its own line:
   `<pr-created>https://github.com/lbredal/stockman/pull/123</pr-created>`

## Conventions
- PRs always target `main`
- Never commit `.env`, `node_modules`, or build artifacts
- If on `main` branch, ask the user to confirm or create a feature branch first
