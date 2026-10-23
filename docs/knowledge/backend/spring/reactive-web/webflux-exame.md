---
format: md
id: k-webflux-exame
title: "webflux exame"
description: "WebFlux SSE와 리스너 브로드캐스트로 메시지를 흘리는 예제 메모입니다."
tags:
  - HTTP
  - Java
  - Spring
status: active
slug: /knowledge/k-webflux-exame
---
# webflux exame

## 개요

WebFlux에서 `TEXT_EVENT_STREAM`으로 Server-Sent Events(SSE)를 보내고, 구독자 목록에 메시지를 팬아웃하는 예제입니다.
`Flux.create`로 sink를 등록하고, POST로 들어온 문자열을 등록된 listener에 전달합니다.
리액티브 CRUD·튜토리얼 링크는 하단에 모았습니다.

## 메시지 브로드캐스트

```java
@Service
public class MessageProcessor {
    private final List<Consumer<String>> listeners = new CopyOnWriteArrayList<>();

    public void register(Consumer<String> listener) {
        listeners.add(listener);
    }

    public void process(String message) {
        listeners.forEach(c -> c.accept(message));
    }
}
```

## 컨트롤러

```java
@PostMapping("/send")
public String send(@RequestBody String message) {
    processor.process(
            new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new Date()) + " " + message
    );
    return "Done";
}

@GetMapping(path = "/receive", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
public Flux<String> receive() {
    return Flux.create(sink -> processor.register(sink::next));
}

@GetMapping(path = "/timestamps", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
public Flux<String> timestamps() {
    return Flux.interval(Duration.ofMinutes(1))
            .map(sequence -> LocalTime.now().toString());
}
```

구독이 끊길 때 `unregister`를 구현하지 않으면 listener가 쌓입니다.
운영에서는 dispose 시 제거와 backpressure·타임아웃을 같이 봅니다.
함수형 엔드포인트 핸들러 메모는 [WebfluxHandler](./webfluxhandler.md)를 봅니다.

<details>
<summary>참고 자료</summary>

- [Spring WebFlux Tutorial (howtodoinjava)](https://howtodoinjava.com/spring-webflux/spring-webflux-tutorial/)
- [Reactive programming using Spring WebFlux (faun)](https://faun.pub/reactive-programming-using-spring-webflux-ad3cfc6f0471)
- [Reactive CRUD REST API with WebFlux](https://javatechonline.com/how-to-develop-a-reactive-crud-rest-api-with-spring-webflux/)
- [WebFlux Reactive Programming Part 3 (DZone)](https://dzone.com/articles/webflux-reactive-programming-with-spring-part-3)
- [Getting started with Reactive Spring](https://medium.com/cognizantsoftvision-guildhall/getting-started-with-reactive-spring-spring-webflux-3914cc62855e)
- [Spring WebFlux Server-Sent Event](https://javacan.tistory.com/entry/spring-webflux-server-sent-event-2)
- [dongdd WebFlux 메모](https://dongdd.tistory.com/181)
</details>
