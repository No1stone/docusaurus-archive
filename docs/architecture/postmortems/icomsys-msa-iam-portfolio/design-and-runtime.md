---
id: icomsys-design-and-runtime
title: 설계 개요와 비용
description: AWS·서버 다이어그램, 도메인, ERD, 비용 수치
tags:
  - AWS
  - postmortem
status: active
slug: "/postmortems/icomsys-msa-iam-portfolio/design-and-runtime"
---
# 설계 개요와 비용

> **개요:** 「설계」 아래의 다이어그램·도메인·ERD와 「비용」 수치입니다.
> AWS 콘솔 단계별 캡처는 [AWS 설정](/docs/postmortems/icomsys-msa-iam-portfolio/aws-setting)에 있습니다.

## AWS diagram

인스턴스는 1개만 사용해보려고 합니다.

인스턴스 스펙이 부족할경우

Bastion 구조로 public Nat instance 를 두고

private instance를 추가로 구성하도록 하려합니다. 

(그림은 계속 수정 될 예정입니다.)

![aws-diagram-1.png](/img/icomsys-msa-iam-portfolio/aws-diagram-1.png)

추가를하게되는경우

[https://docs.aws.amazon.com/ko_kr/vpc/latest/userguide/VPC_NAT_Instance.html](https://docs.aws.amazon.com/ko_kr/vpc/latest/userguide/VPC_NAT_Instance.html)

nat instance는 20년부로 사용이종료되었지만

개인포트폴리오 사이트를 만드는것뿐이어서 트레픽과 속도는 무시하고 

절약을 컨셉으로 nat gateway 를사용하는것보다 비용부담이적어서 사용해보려합니다.

## Server diagram

대략적인 서버 리소스 정리와

사용한 기술스텍들 그림입니다.(그림은 계속 수정 될 예정입니다.)

![server-diagram-1.png](/img/icomsys-msa-iam-portfolio/server-diagram-1.png)

Nginx로 APIGateway, jenkins, gitea를 라우팅하려하며

apigateway 뒷단에는 Eureka, configserver, Authserver Customerserver,  

프로메테우스 그라파나를  를 컨트롤하려합니다.

API gateway는 microservice인  Spring서버를 제어하려합니다.

간단한 하게 kafka로 Events driven 구조를 표현해해보려합니다.

Mysql에 데이터가 생성되면

Debezium으로 CDC(Change Data Capture) → Kafka

SinkConnect → Mysql 데이터 저장을 구현하려합니다.

RabbitMq는 Springconfig server의  Spring Bus를 사용하는 메세지큐입니다.

Zipkin은 Spring sleuth 로 로그를 트렉킹 합니다.

Redis는  Auth서버의 토큰과 IAM정보를 저장하며

apigateway가 해당정보로 서버를 라우팅합니다.

카프카 구조

[https://kafka.apache.org/21/documentation/streams/architecture.html](https://kafka.apache.org/21/documentation/streams/architecture.html)

카프카 주요 API

[https://kafka.apache.org/intro](https://kafka.apache.org/intro)

컨플루언트

[https://www.confluent.io/ko-kr/](https://www.confluent.io/ko-kr/)

[https://www.confluent.io/ko-kr/product/confluent-connectors/](https://www.confluent.io/ko-kr/product/confluent-connectors/)

[https://www.confluent.io/hub/confluentinc/kafka-connect-jdbc](https://www.confluent.io/hub/confluentinc/kafka-connect-jdbc)

[https://docs.confluent.io/platform/current/overview.html](https://docs.confluent.io/platform/current/overview.html)

[https://docs.confluent.io/kafka/overview.html](https://docs.confluent.io/kafka/overview.html)[https://docs.confluent.io/kafka-connectors/jdbc/current/index.html](https://docs.confluent.io/kafka-connectors/jdbc/current/index.html)

## Domain Name

도메인 이름짓기

제 이름의 한자는 근원원에 클석입니다.

원석이라는 이름을 영단어로 번역해보았습니다.

1. 源 (원) - 'Source', 'Origin', 'Fountain'
2. 碩 (석) - 'Large', 'Great', 'Eminent'

마음에드는 단어가 없습니다…

이대로 조합하면

greatigin정도..?

의식의 흐름대로…

옛날에 부장님이 저보고 보석이라고 칭찬을 많이해주셧던게 생각납니다..

보석 - ‘Gem’

또 근원원 클석은 근원이 크다… 무한이라는 뜻도 있습니다… - ‘infinite’

마인드맵 형식으로 가야겠습니다.

Origin

Gem
infinite

origemite

오리제마이트

![domain-name-1.png](/img/icomsys-msa-iam-portfolio/domain-name-1.png)

사용이 가능하다.. 행복합니다.. ㅠㅠ

변수 명짓기가 제일어렵다.,..

근원, 보석, 무한 

노다지라는 의미로 써야겠습니다.

## Logo

로고는 이미지돌리기하다가 맘에드는 이미지를 찾았습니다.

[https://www.brandcrowd.com](https://www.brandcrowd.com/)

![origemite2.bmp](/img/icomsys-msa-iam-portfolio/logo-1.png)

피그마로 비슷하게 만들어봐야겠습니다.

약간 뒤틀린모습은 사실좀 별로라 정면으로 만들어보려합니다.

![#615856_2.png](/img/icomsys-msa-iam-portfolio/logo-2.png)

약간 부자연 스럽지만

저는 디자이너가 아니기에.. 이정도로… 만족하며 써야겠습니다.

눈과 눈동자 수염모양으로 도메인 뜻 인피니티의 

무한궤도 모양을 표현해준 아이콘입니다.

## index.html

백엔드개발하기전부터 베이스 구축하는데 시간을 많이쏟았습니다 ㅎㅎ..

전 backend개발자니까 빨리.. 서버 포트폴리오를 만들어햐 하니..

화면은.. simple is best!!

![index-html-1.png](/img/icomsys-msa-iam-portfolio/index-html-1.png)

아무런 프레임워크없이 부트스트랩 html로만 단순하게 설명한페이지를

만들었습니다.

상단에는 서버운영시간에만 켜질 GIT과

노션을 연결해두었습니다

## ERD

![ORIGEMITE-2024-01-31T11_00_20.png](/img/icomsys-msa-iam-portfolio/erd-1.png)

## 2024년 01월 aws비용

![aws-cost-2024-01-1.png](/img/icomsys-msa-iam-portfolio/aws-cost-2024-01-1.png)
![aws-cost-2024-01-2.png](/img/icomsys-msa-iam-portfolio/aws-cost-2024-01-2.png)
![aws-cost-2024-01-3.png](/img/icomsys-msa-iam-portfolio/aws-cost-2024-01-3.png)
![aws-cost-2024-01-4.png](/img/icomsys-msa-iam-portfolio/aws-cost-2024-01-4.png)
![aws-cost-2024-01-5.png](/img/icomsys-msa-iam-portfolio/aws-cost-2024-01-5.png)
![aws-cost-2024-01-6.png](/img/icomsys-msa-iam-portfolio/aws-cost-2024-01-6.png)

19$ 입니다.

비용 17.33 $ + 부가세 1.74 

17.33중

최고금액: 도메인 구입비용 13$

나머지 4.3$

실청구비용 7,816원

2024-02-06 aws에서 크레딧 50$ 를 받아서 등록

2월요금은 걱정없을거같습니다 …^0^)b

## 관련 글

- [AWS 설정](/docs/postmortems/icomsys-msa-iam-portfolio/aws-setting)
- [서버 설정과 데이터 경로](/docs/postmortems/icomsys-msa-iam-portfolio/runtime-data-path)
