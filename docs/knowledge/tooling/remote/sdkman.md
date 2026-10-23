---
format: md
id: k-sdkman
title: "sdkman"
description: "SDKMAN으로 JDK 등 SDK 버전을 설치·전환하는 메모입니다."
tags:
  - Java
status: active
slug: /knowledge/k-sdkman
---
# sdkman

## 개요

SDKMAN은 셸에서 JDK, Gradle, Maven 등 SDK 버전을 설치하고 `sdk use` / `sdk default`로 바꿉니다.
프로젝트마다 Java 버전이 다를 때(예: 부트베이스 17, 팜프로 25) 로컬 전환에 씁니다.

## 설치와 사용

```bash
curl -s "https://get.sdkman.io" | bash
# 새 셸 또는 source ~/.sdkman/bin/sdkman-init.sh

sdk list java
sdk install java 17.0.12-tem
sdk use java 17.0.12-tem
sdk default java 17.0.12-tem
```

CI나 Docker 이미지에서는 SDKMAN 대신 고정 베이스 이미지를 쓰는 편이 재현성이 좋습니다.

<details>
<summary>참고 자료</summary>

- [SDKMAN Install](https://sdkman.io/install)
</details>
