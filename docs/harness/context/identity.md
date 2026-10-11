# Identity

> **개요:** 이 하네스가 누구의 것인지. 백엔드 기반 개발자 장원석의 개인 엔지니어링 아카이브이고, 여기 적힌 기준은 그 사람이 실제로 쓰는 방식이다.

Who this harness represents. Agents read this to understand whose conventions they are reproducing — and that the conventions are a person's actual practice, not a committee's ideal.

## The archive

- **Origemite Archive** — personal engineering archive at `archive.origemite.com`
- Consumer surfaces: humans (Docusaurus) and AI coding agents (this harness)
- Preference: durable Markdown/Git assets over vendor-locked stores
- Companion sites: GitHub [`No1stone`](https://github.com/No1stone) · Blog `blog.origemite.com` (migrating into this archive)

## The engineer

**장원석 (Wonseok Jang)** — Backend Developer.

Spring Boot has been the center of gravity throughout: modernizing legacy systems and building new platforms, usually with ownership of the backend architecture and the AWS infrastructure underneath it. The recurring work has been the same shape across industries — take an operating system that has grown fragile, make it stable and extensible, and stand up the new platform beside it.

Things that shaped the conventions in this archive:

- **Operations teach architecture.** Transaction boundaries, exception handling, and data-model discipline in this archive come from running services where those were the things that broke. The `REQUIRES_NEW`-per-item batch pattern, explicit joins, soft deletes, and the single response envelope are operational scars, not textbook choices.
- **Legacy modernization is the default situation.** PHP → Spring Boot, eGovFrame → Spring Boot, MyBatis-with-logic → layered JPA. Most templates here assume you are building the clean shape *next to* something older.
- **Platforms, not features.** IoT data pipelines, batch systems, SaaS auth structures — the archive leans toward patterns that survive scale and handoff.

Recently the range has widened on purpose: React and Flutter work on the front end and mobile, and **vibe coding** across all of it — using AI tools not as a code generator but as a design-and-implementation partner. This archive *is* that practice: documents indexed, context assembled per situation, agents given the person's own standards and the tools to verify their output.

Stack in daily use: Java / Spring Boot / Spring Cloud, JPA + QueryDSL (MyBatis where inherited), MySQL-family RDS, Redis, RabbitMQ; AWS, Docker, Kubernetes, Jenkins.

## What this means for agents

- Standards here are **one person's current practice**. When a page says `TODO`, the preference is not yet stable — do not fill it with general best practice.
- The person is reachable and expects to be asked. Master's `high` freedom exists because the developer is in the loop, not because the harness runs unattended.
- Modernization context is assumed: prefer shapes that coexist with legacy code over shapes that require a rewrite.
