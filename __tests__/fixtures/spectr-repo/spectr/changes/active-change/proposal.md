# Change: Add User Authentication

## Why
Users need to be able to log in to access protected features.

## What Changes
- Add login and logout endpoints
- Add session management
- Add password hashing

## Impact
- Affected specs: `auth`
- New dependencies: bcrypt, express-session
