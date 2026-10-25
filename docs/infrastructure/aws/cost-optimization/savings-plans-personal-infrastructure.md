---
id: savings-plans-personal-infrastructure
title: "AWS Savings Plans"
description: "개인 인프라를 t3.small + Savings Plans로 월 $8 수준으로 맞춘 운영 기록"
tags:
  - aws
  - savings-plans
  - ec2
  - cost-optimization
  - self-hosting
status: active
sidebar_position: 1
---

# AWS Savings Plans

## **Savings Plans 이란**

**가격 모델**로, 1년 또는 3년 기간 동안 컴퓨팅 리소스 사용량(시간당 달러로 약정)을

약속하면 온디맨드 요금 대비 최대 72%까지 할인된 가격으로 이용할 수 있는 서비스

t3.medium 을 사용중이엇던 내가.. $38 짜리..

환율이 1500원 되기전엔 쓸만햇었다.. 월5만원정도였었는데..

물론 노션도 무료 티스토리도 무료, 컨플루언스도 일부 무료 긴 하지만

나만의 도메인으로 직접 올려서 관리하는 낭만이없기에..

직접 운영을하다

가격이 너무 아파지기 시작하여 t3.small로 변경하며..

$18.92 이것도 뭔가 아파서...

Savings Plans 3년치를 예약!

![AWS Savings Plans 구매 내역](/img/aws/savings-plans/savings-plan-purchase.png)

앞으로 월 $8로 2코어 2기가 인스턴스를 사용하게되었다...

중요한 리소스들은 메모리세팅해서.. 다시올리고 노트북을 프록시로 물려서 사용하게 될듯 하다.

t3.small 작은 인스턴스이기에.. 보험으로 스왑메모리 설정까지 완료

![EC2 t3.small 메모리 및 Swap 상태](/img/aws/savings-plans/ec2-memory-swap.png)

500메가정도 메모리 여유가있어서 불필요한 리소스를 더 띄우지 않고

origemite domain, proxy, bastion host,
blog, gitea, tls/ssl, 개인 인프라운영, aws 백업, 클라우드 스토리지까지

개인이 사용하기에 여러가지것들을 $8 선에서 세팅 완료.

부족한 리소스는 내부 인프라로 포함시킨 집 노트북으로 라우팅해서 사용

[https://next.origemite.com/index.php/apps/collectives/blog-8/Reverse-SSH-4071](https://next.origemite.com/index.php/apps/collectives/blog-8/Reverse-SSH-4071 "preview")

\#참고로 제인스턴스는 nat instance 세팅이되어있어서

aws natgateway 와 같은 역할을 하는 프록시서버입니다

왜 노트북을 연결하는데 nat instance 를 사용했지? 라고 의문이 드시겠지만

원래 목적은 aws vpc private subnet 연결을 해서 최저가 aws 운영을 하다

비용이 부담되서 notebook을 추가로 연결한 상태입니다
