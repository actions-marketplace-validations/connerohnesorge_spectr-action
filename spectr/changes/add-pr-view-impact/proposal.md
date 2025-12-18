# Change: Add spec impact preview to PR proposal view

## Why
When viewing a proposal PR created with `spectr pr p`, users cannot see:
1. Whether the change has already been archived (merged into specs)
2. What specific impact the change would have on current specs (added, modified, removed requirements)

This makes it difficult to review proposal PRs effectively since reviewers must manually parse delta specs to understand the impact. Showing archived status prevents confusion when reviewing PRs for already-completed changes.

## What Changes
- Add `--preview` flag to `spectr pr p` that shows spec impact without creating a PR
- When creating a proposal PR, include spec impact summary in the PR body
- Check if the change ID matches an archived change and show warning
- Parse delta specs and compute what operations would be applied to each capability
- Display operation counts (added/modified/removed) per capability in PR description

## Impact
- Affected specs: `pr-view` (new capability)
- Affected code:
  - `cmd/pr.go` - Add preview flag to PRProposalCmd
  - `internal/pr/templates.go` - Enhance proposal PR body template
  - `internal/pr/workflow.go` - Add spec impact calculation
  - `internal/discovery/changes.go` - Add archived change detection
