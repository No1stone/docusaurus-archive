# Origemite Archive

> **개요:** Origemite Archive 저장소 안내입니다.
> Engineering Archive, Harness, Templates 구조와 로컬 실행 방법을 적습니다.

Docusaurus 위에 올린 개인 **Engineering Archive**입니다.

엔지니어링 지식, 아키텍처, 결정, 패턴, 구현 참고를 **Markdown과 Git**에 둡니다.
같은 자산을 사람(이 사이트)과 AI 코딩 에이전트(`docs/harness/`, `index/`, `docs/harness/templates/`)가 함께 씁니다.

날짜순 블로그가 아닙니다.
저장소 이름은 `docusaurus-archive`입니다.
공개 주소는 `archive.origemite.com`입니다.

## Origemite Archive란?

| 내용 | 위치 |
|------|------|
| 엔지니어링 지식과 ADR | `docs/` |
| 옮길 수 있는 AI 하네스 | `docs/harness/` |
| 구현 템플릿 | `docs/harness/templates/` |
| 자산 지도 (무엇이 어디에 있는지) | `index/` |
| 에이전트 진입점 | `AGENTS.md` |
| 사람이 보는 화면 | Docusaurus (`src/`, `docusaurus.config.ts`) |

한 번 쓰고, 사람과 AI가 함께 씁니다.

## 저장소 구조

```text
docs/                      Engineering archive (knowledge, architecture, patterns, …)
docs/harness/              Entrypoints, agents, context, workflows, profiles, bundles
docs/harness/templates/    Reusable implementation reference assets
index/                     Engineering asset index / context map
AGENTS.md                  Agent router (not a giant prompt)
src/                       Site UI (homepage, about, theme)
```

## 로컬 실행

도구 체인은 `mise.toml`의 Node(`node = "22"`)입니다.
패키지 관리자는 **npm**입니다.

```bash
mise install          # if needed
npm install
npm run start         # local dev server
npm run build         # production build → build/
npm run typecheck     # TypeScript check
npm run serve         # serve the production build
```

## Engineering Archive

`/docs/`에서 둘러봅니다.

- **Knowledge**: 지금 쓰는 구현 기준입니다. 개념과 기술 문서를 나눕니다.
- **Architecture**: 시스템 설계입니다.
- **Patterns**: 다시 쓰는 패턴입니다.
- **Decisions**: ADR입니다.
- **Experiments / Postmortems / History**: 기본 컨텍스트가 아닙니다. 필요할 때 올리거나 참고합니다.

Markdown은 Docusaurus 없이도 읽을 수 있어야 합니다.

## Harness

[`docs/harness/index.md`](./docs/harness/index.md)와 루트 [`AGENTS.md`](./AGENTS.md)를 봅니다.

에이전트는 아카이브 전체를 읽지 않습니다.
Index, 고른 문서, `docs/harness/templates`와 ADR, 필요할 때만 History 순으로 읽습니다.

## Templates

[`docs/harness/templates/README.md`](./docs/harness/templates/README.md)를 봅니다.
Knowledge와 설계 원칙은 Master가 판단할 때 봅니다.
템플릿이 있으면 임플리먼터는 그 모양대로 구현합니다.
템플릿이 없으면 Master가 판단해서 돕습니다.
임플리먼터는 Knowledge로 구조를 만들지 않습니다.

## 글 작성

이 아카이브는 작성자만 보는 문서가 아닙니다.
외부 독자도 읽습니다.

- 반말을 쓰지 않습니다.
  `한다`, `이다`, `해` 대신 `합니다`, `입니다`를 씁니다.
- 중점 `·`을 쓰지 않습니다.
  쉼표(`, `)를 씁니다.
- 문장을 끝내는 마침표(`.`) 다음에는 다음 문장을 새 줄에 씁니다.
  코드 블록, 표, 식별자는 예외입니다.
- 에이전트가 넣거나 뺄 수 있게 Markdown 단위를 작게 둡니다.
- 필요할 때 가벼운 YAML frontmatter(`id`, `title`, `description`, `tags`, `status`)를 씁니다.
- 있는 문서만 링크합니다.
  없는 큰 트리를 만들지 않습니다.
- 아직 확정되지 않은 개인 코딩 규칙은 아카이브에 올리지 않습니다.
  그때는 TODO나 골격만 둡니다.
- Docusaurus `_category_.json`은 탐색용입니다.
  엔지니어링 의미를 정의하지 않습니다.
