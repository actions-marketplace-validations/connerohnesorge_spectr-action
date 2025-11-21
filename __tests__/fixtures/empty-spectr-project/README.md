# Empty Spectr Project Fixture

This fixture tests edge cases for a minimal/empty Spectr project setup.

## Structure

```
empty-spectr-project/
└── spectr/
    ├── project.md          # Minimal project metadata
    └── specs/              # Empty directory (no capabilities)
        └── .gitkeep
```

## Test Purpose

This fixture verifies spectr-action's behavior when:
- A valid `spectr/` directory exists
- `project.md` is present but minimal
- `specs/` directory exists but contains no capability subdirectories
- No specifications have been defined yet

## Expected Validation Behavior

Based on testing with `spectr validate --specs --strict`:

**Result**: PASS (gracefully handles empty state)
- Exit code: 0
- Output: "No items to validate"
- Behavior: Treats empty specs directory as valid (nothing to validate)

## Expected List Behavior

Based on testing with `spectr list --specs`:

**Result**: PASS (gracefully handles empty state)
- Exit code: 0
- Output: "No items found"
- Behavior: Reports no specs available

## Use Cases

This fixture is valuable for testing:
1. **Fresh project initialization** - Right after `spectr init` but before adding specs
2. **Empty state handling** - Ensures tools don't crash on minimal projects
3. **Zero-spec validation** - Verifies validation logic handles empty collections
4. **CI/CD edge cases** - Projects that haven't defined any capabilities yet

## Integration with spectr-action

The GitHub Action should:
- Detect this as a valid Spectr project (has `spectr/` directory)
- Complete validation successfully (no specs to validate = pass)
- Report 0 items validated
- Not fail or produce warnings

This ensures the action is friendly to new projects that are just getting started.
