---
format: md
id: k-hooxiadmin-docker
title: "hooxiAdmin docker"
description: "hooxiAdmin용 Corretto 11 Dockerfile과 수동 배포 선택 이유"
tags:
  - AWS
  - Docker
  - Java
status: active
slug: /knowledge/k-hooxiadmin-docker
---
# hooxiAdmin docker

> **개요:** hooxiAdmin 앱을 Amazon Corretto 11 이미지로 감싸 실행하는 Dockerfile과, 수동 배포를 선택한 이유입니다.

## Dockerfile

```dockerfile
FROM amazoncorretto:11

COPY *.jar app.jar

EXPOSE 8001

ENTRYPOINT ["java","-jar","app.jar"]
```

## 실행 예

```bash
docker run -p 8001:8001 -d adminhooxi
```

## 배포 방식 메모

리눅스 이미지를 가져와 Git으로 받기에는 EC2 용량이 부담스러워 보였습니다.
어드민 페이지 사용자가 개발자라 CD는 필요 없다고 보고, 수동 배포를 선택했습니다.
