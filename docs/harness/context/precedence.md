# Precedence

> **개요:** 규칙이 충돌할 때 무엇을 우선할지.

When rules conflict, prefer higher rows:

```text
Project Local Rules
        >
Current Harness Standards
        >
Profile
        >
Accepted ADR
        >
Template
        >
General Best Practice
```

## Notes

- Project-local always wins for code living in that project
- Accepted ADRs explain *why* docs/harness/templates look the way they do
- General best practice is a last resort, not a license to invent personal standards here
