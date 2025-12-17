## ADDED Requirements

### Requirement: Spec Impact Preview
The `spectr pr proposal` command SHALL support a `--preview` flag that displays spec impact without creating a PR.

#### Scenario: Preview mode shows impact summary
- WHEN user runs `spectr pr p <change-id> --preview`
- THEN the system displays spec impact for each affected capability
- AND shows operation counts (added, modified, removed, renamed) per capability
- AND does not create a branch, commit, or PR

#### Scenario: Preview mode with no delta specs
- WHEN user runs `spectr pr p <change-id> --preview` for a change with no delta specs
- THEN the system displays "No spec deltas found"
- AND exits with success

### Requirement: Archived Change Detection
The `spectr pr proposal` command SHALL detect if a change has already been archived and warn the user.

#### Scenario: Warning for archived change
- GIVEN change `add-feature` was archived on 2024-01-15
- WHEN user runs `spectr pr p add-feature`
- THEN the system displays warning: "Change 'add-feature' was archived on 2024-01-15"
- AND prompts for confirmation before proceeding

#### Scenario: No warning for active change
- GIVEN change `new-feature` is not archived
- WHEN user runs `spectr pr p new-feature`
- THEN no archived warning is displayed
- AND the PR creation proceeds normally

### Requirement: Enhanced PR Body
The proposal PR body SHALL include a spec impact summary showing affected capabilities and operation counts.

#### Scenario: PR body includes impact table
- WHEN a proposal PR is created for a change with delta specs
- THEN the PR body includes a "Spec Impact" section
- AND displays a table with columns: Capability, Added, Modified, Removed
- AND shows totals for each operation type

#### Scenario: PR body shows archived warning
- WHEN a proposal PR is created for an archived change (after user confirmation)
- THEN the PR body includes a warning banner
- AND the banner states: "This change was previously archived on <date>"
