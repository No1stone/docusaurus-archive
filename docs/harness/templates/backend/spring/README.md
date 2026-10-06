# Spring ExampleItem slice

> **개요:** dto → persistence → service → facade → controller → testing 한 줄 세로 슬라이스. 옆에 `.java` 소스가 있고 README 본문에 코드 블록으로도 보인다.

One vertical reference flow for agents and humans.

## Layers

| Layer | Path |
|-------|------|
| DTO | [dto/](./dto/) |
| Persistence | [persistence/](./persistence/) |
| Service | [service/](./service/) |
| Facade | [facade/](./facade/) |
| Controller | [controller/](./controller/) |
| Support | [support/](./support/) |
| Testing | [testing/](./testing/) |

```text
dto → persistence → service → facade → controller
         ↑______________ support ______________↑
testing covers facade + service
```

Each folder README lists files and embeds the `.java` sources as code blocks. Agents may still copy from the raw `.java` files next to the README.
