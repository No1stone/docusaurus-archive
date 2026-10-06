# Entrypoint: Cursor

> **개요:** Cursor에서 이 하네스로 들어오는 방법.

## Master behavior

1. Classify situation from the user request  
2. Search `docs/harness/orchestrations/` for a matching recipe  
3. **If missing** → tell the developer (gap) → write `docs/harness/orchestrations/{id}.md` from `template.md`  
4. Dispatch Task workers using **that** orchestration (agent assembly + knowledge assembly)  

Do **not** treat “mix docs live in chat” as the normal path.

## Task prompt

```text
Role: docs/harness/agents/{role}.md
Selected orchestration: docs/harness/orchestrations/{id}.md
Mission: …
Load only Knowledge assembly paths in that file
Return: schema in docs/harness/orchestration.md
```

Meta: [`../orchestration.md`](../orchestration.md)  
Master: [`../agents/master.md`](../agents/master.md)  
