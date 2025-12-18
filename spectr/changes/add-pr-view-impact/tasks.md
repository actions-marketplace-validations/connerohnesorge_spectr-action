## 1. Discovery Enhancement
- [ ] 1.1 Add `GetArchivedChanges` function to discover archived changes in `spectr/changes/archive/`
- [ ] 1.2 Add `IsChangeArchived` function to check if a change ID matches an archived change
- [ ] 1.3 Add `GetArchivedChangeInfo` to return archive date and path for a matched change

## 2. Spec Impact Analysis
- [ ] 2.1 Create `internal/pr/impact.go` with `CalculateSpecImpact` function
- [ ] 2.2 Implement delta spec parsing to extract operation counts per capability
- [ ] 2.3 Add `SpecImpact` struct to hold capability name, operations, and target spec path

## 3. Command Enhancement
- [ ] 3.1 Add `--preview` flag to `PRProposalCmd` struct in `cmd/pr.go`
- [ ] 3.2 Implement preview-only mode that calculates and displays impact without creating PR
- [ ] 3.3 Add archived change warning when creating proposal for already-archived change

## 4. PR Template Enhancement
- [ ] 4.1 Add `SpecImpacts` field to `PRTemplateData` struct
- [ ] 4.2 Add `ArchivedInfo` field to show if change was previously archived
- [ ] 4.3 Update `proposalPRBodyTemplate` to include spec impact table
- [ ] 4.4 Show warning banner for archived changes in PR body

## 5. Testing
- [ ] 5.1 Add unit tests for `GetArchivedChanges` and `IsChangeArchived`
- [ ] 5.2 Add unit tests for `CalculateSpecImpact`
- [ ] 5.3 Add integration test for preview mode output
- [ ] 5.4 Add test for archived change detection and warning
