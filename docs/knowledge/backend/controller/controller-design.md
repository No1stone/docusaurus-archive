---
id: controller-design
title: Controller Design
description: Controller layer responsibilities and boundaries
tags:
  - backend
  - api
status: active
---
# Controller Design

> **개요:** Controller를 어떻게 설계하는지(책임·경계). Spring MVC 사용법 문서가 아님.

How the controller layer is designed: responsibilities and boundaries.

This document is an **engineering concept**, not a Spring MVC tutorial. Framework-specific usage belongs in technology notes when those exist.

## Intent

Define what belongs at the HTTP/API edge and what must stay out of it.

## Responsibilities (skeleton)

TODO: refine with personal standards when ready.

- Accept and validate input at the boundary
- Map between transport shapes and application commands/queries
- Delegate business work to the service / application layer
- Translate outcomes to HTTP responses

## Non-responsibilities (skeleton)

TODO: refine when ready.

- Core business rules
- Transaction orchestration belonging deeper in the stack
- Persistence details

## Related

- [Backend knowledge](../)
- [Architecture](../../../architecture/)
- [ADR-0001](../../../decisions/ADR-0001-markdown-git-as-engineering-source-of-truth.md)

Repo paths (not rendered as site pages): `docs/harness/profiles/spring-api.md`, `docs/harness/templates/backend/spring/controller/`.

## Templates

Knowledge answers *why / what / responsibility*. Templates show *concrete code shape*. Keep them linked, not duplicated.
