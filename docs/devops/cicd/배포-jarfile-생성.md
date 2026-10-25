---
format: md
id: k-배포-jarfile-생성
title: "배포 jarFile 생성"
description: "Eclipse/Maven package로 JAR를 만들고 EC2 경로로 옮기는 메모"
tags:
  - AWS
  - Docker
status: active
slug: /knowledge/k-배포-jarfile-생성
---
# 배포 jarFile 생성

> **개요:** 로컬에서 Maven `package`로 JAR를 만든 뒤, EC2의 작업 경로로 옮기는 절차 메모입니다.

## Run configurations

![Run configurations 화면](/img/배포-jarfile-생성/배포-jarfile-생성-1.png)

Project → Run As → Run Configurations 로 들어갑니다.

![goals 설정 화면](/img/배포-jarfile-생성/배포-jarfile-생성-2.png)

goals를 `package`로 두고 Run 합니다.
다시 빌드할 때는 clean이 필요합니다.

![빌드 결과 화면](/img/배포-jarfile-생성/배포-jarfile-생성-3.png)

빌드가 완료되면 MobaXterm 등에서 파일이 보입니다.

![원격 파일 확인](/img/배포-jarfile-생성/배포-jarfile-생성-4.png)

## 원격 경로

파일이 생기는(또는 올린) 위치 예입니다.

```bash
cd /home/ec2-user
```

파일 이동:

```bash
mv 파일이름 /usr/local/src/app
```

파일 이름 변경:

```bash
mv 파일이름 변경할파일이름
```
