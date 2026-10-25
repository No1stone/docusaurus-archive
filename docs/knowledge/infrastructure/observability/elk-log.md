---
format: md
id: k-elk-log
title: "elk log"
description: "ELK 로컬 구성부터 배치 로그 전송과 알람 설정까지 정리한 우아한형제들 글 요약"
tags:
  - Spring
  - ELK
  - Logging
status: active
slug: /knowledge/k-elk-log
---
# elk log

## 개요

ELK 로컬 구성부터 배치 로그 전송과 알람 설정까지 정리한 우아한형제들 글 요약입니다.

글에서는 를 clone한 뒤 Logstash 파이프라인을 TCP JSON 입력으로 맞추고 `docker-compose up`으로 올립니다.
Logstash는 5000 포트로 받아 Elasticsearch 인덱스로 보냅니다.
`logstash-logback-encoder`와 `LogstashTcpSocketAppender`를 쓰는 설정이 핵심입니다.
배치 Job에서 info/error 로그를 남기면 Kibana Discover에서 확인할 수 있습니다.
당시 사례는 Open Distro Alert로 Destination(Slack), Monitor(쿼리), Trigger(조건)를 묶습니다.
- ERROR 로그가 최근 구간에 있으면 Slack 알림
- “배치 완료” 로그가 예상 시각에 없으면 미실행 알림
- Slack 메시지에 Kibana Discover 링크를 넣어 바로 조회
플러그인과 ELK 버전은 글 작성 시점(2020) 기준이므로, 현재는 Elastic Stack Alerting이나 다른 스택으로 대체할 수 있습니다.
흐름(로그 수집 → 쿼리 모니터 → 알림)만 가져가면 됩니다.

## 예제·코드

```xml
<appender name="stash" class="net.logstash.logback.appender.LogstashTcpSocketAppender">
    <destination>127.0.0.1:5000</destination>
    <encoder class="net.logstash.logback.encoder.LogstashEncoder" />
</appender>
```

<details>
<summary>참고 자료</summary>

- [deviantony/docker-elk](https://github.com/deviantony/docker-elk) — The Elastic stack (ELK) powered by Docker and Compose. - deviantony/docker-elk
- [ELK 셋팅부터 알람까지 (우아한형제들)](https://techblog.woowahan.com/2659/) — 안녕하세요. 저는 상품시스템팀에서 개발업무를 맡고 있는 이중석입니다. 최근 팀 내에서 로그엔트리를 ELK 로 전환하고 필요한 알람을 셋팅하는 작업을 진행했습니다. 이 과정중 알람을 설정하는 부분이 어렵진 않지만 쉽지도 않았습니다. 그 과정에서 알게된 것들이 다른분께 도움이 될까 싶어 글을 남깁니다. ELK로 로그 쌓아보기
</details>
