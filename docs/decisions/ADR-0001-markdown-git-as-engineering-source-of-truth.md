---
id: adr-0001
title: ADR-0001 Markdown and Git as engineering source of truth
description: Choose Markdown + Git as the long-term store for engineering assets
tags:
  - adr
  - archive
status: accepted
---
# ADR-0001: Markdown and Git as engineering source of truth

> **개요:** Markdown + Git을 엔지니어링 SoT로 쓰기로 한 결정과 대안·결과.

## Status

Accepted

## Context

Engineering knowledge, decisions, patterns, templates, and harness rules need a durable home that:

- Humans can browse and search
- AI coding agents can selectively load
- Survives changes of presentation UI or AI product

A separate CMS, database, or AI-vendor-specific store would couple the archive to a transient interface.

## Decision

Use **Markdown files in Git** as the source of truth for Origemite Archive.

- Docusaurus (or a future UI) renders Markdown for humans
- Harness / Index / Profiles / Bundles reference the same Markdown and templates for AI consumption
- Engineering meaning must not depend on Docusaurus-only structures

## Alternatives

1. **Wiki / CMS** — richer editing UX; weaker portability and agent-friendly plain text
2. **AI-vendor knowledge base** — fast for one product; couples the archive to that vendor
3. **Database-backed docs** — flexible querying; higher ops cost and weaker Git history as SoT

## Consequences

- Docs stay readable without Docusaurus
- Progressive context loading (Index → selected docs) becomes practical
- Presentation and agent tooling can evolve independently
- Authors must keep Markdown granularity and metadata discipline

## Related

- [Archive home](../)
- [Controller Design](../knowledge/backend/controller/controller-design.md)

Repo paths: `docs/harness/index.md`, `index/INDEX.md`.
