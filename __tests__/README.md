# Test Directory Structure

This directory contains tests for the spectr-action project using Node.js built-in test runner.

## Directory Layout

```
__tests__/
├── fixtures/          # Test fixtures and mock data
│   ├── empty-spectr-project/
│   ├── valid-spectr-project/
│   └── ...
├── unit/             # Unit tests for individual functions/modules
│   └── example.test.ts
└── integration/      # Integration tests (if needed)
```

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode (for development)
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## Writing Tests

Tests use Node.js built-in test runner with TypeScript support via tsx.

### Example Test Structure

```typescript
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

describe('Feature Name', () => {
  it('should do something specific', () => {
    const result = myFunction();
    assert.equal(result, expectedValue);
  });

  it('should handle async operations', async () => {
    const result = await asyncFunction();
    assert.equal(result, expectedValue);
  });
});
```

### Assertion Methods

Common assertions from `node:assert/strict`:

- `assert.equal(actual, expected)` - Shallow equality
- `assert.deepEqual(actual, expected)` - Deep equality
- `assert.strictEqual(actual, expected)` - Strict equality (===)
- `assert.ok(value)` - Truthy check
- `assert.throws(() => { ... })` - Sync error handling
- `assert.rejects(async () => { ... })` - Async error handling

## Test Organization

- **Unit tests**: Test individual functions in isolation
- **Integration tests**: Test multiple components working together
- **Fixtures**: Shared test data and mock Spectr projects

## Coverage

Coverage reports are generated using Node.js experimental coverage feature:

```bash
npm run test:coverage
```

This generates an `lcov` report in `coverage.lcov` which can be viewed with coverage tools.

## Best Practices

1. Keep tests focused and atomic
2. Use descriptive test names
3. Follow AAA pattern: Arrange, Act, Assert
4. Mock external dependencies
5. Test both success and failure cases
6. Use fixtures for complex test data
