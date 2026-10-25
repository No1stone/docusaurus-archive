---
format: md
id: k-sseemitter
title: "SseEmitter"
description: "SseEmitter"
tags:
  - HTTP
  - Java
  - Spring
status: active
slug: /knowledge/k-sseemitter
---
# SseEmitter

| 소켓 | sse |
| --- | --- |
| 양방향 | 단방향 |
|  | 소켓보다 가벼움  |
| 배터리소모가 크다함 | 배터리소모가 작다함 |
| 연결끊기면 재연결필요 | 자동재연결 |
| 소켓 (80포트필요) | http |

```java
@GetMapping(path = "/test37/{seq}", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter test37(@PathVariable(name = "seq") Long seq) {
        log.info("data - {} , {}", seq);
       return testService.SseEmitter(seq);
    }

    @GetMapping(path = "/test38/{seq}")
    public void test38(@PathVariable(name = "seq") Long seq) {
        log.info("data - {} , {}", seq);
        testService.sendToSseEmitter(seq,"");
    }
```

Map을 이용하여

유니캐스트 구현함

```java
private Map<Long, SseEmitter> emiterMap = new HashMap<>();

public SseEmitter SseEmitter(Long seq) {
        SseEmitter sseEmitter = new SseEmitter(1000L*60L*60L);

        log.info("sse info - {}", new Gson().toJson(sseEmitter));
        emiterMap.put(seq, sseEmitter);
        return sseEmitter;
    }

    public void sendToSseEmitter(Long seq, String data) {
        data = "aaaasssss";
        SseEmitter emitter = emiterMap.get(seq);
        try {
            emitter.send(
                    SseEmitter
                            .event()
                            .id(seq.toString())//데이터만필수값
                            .name("sse")//데이터만필수값
                            .data(data)
            )
            ;
        } catch (IOException exception) {
            throw new RuntimeException("연결 오류!");
        }
    }
```
