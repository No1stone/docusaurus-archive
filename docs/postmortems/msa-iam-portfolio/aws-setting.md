---
id: msa-aws-setting
title: AWS 설정
description: Route 53, ACM, CloudFront, S3, VPC, NAT, EC2, 스케줄, 로드밸런서
tags:
  - AWS
status: active
slug: "/postmortems/msa-iam-portfolio/aws-setting"
---
# AWS 설정

> **개요:** 「AWS Setting」 하위 페이지입니다.

## route53 DNS

DNS 등록

![route53-dns-1.png](/img/msa-iam-portfolio/route53-dns-1.png)

DNS 를 구매했습니다.

무료도메인이나 저렴한 도메인을 구입후

네임서버를 옮겨 사용할수도있으나

돈을 조금 사용하도록 하겠습니다.

## ACM

ACM 발급입니다.

![acm-1.png](/img/msa-iam-portfolio/acm-1.png)

[https://www.notion.so/ACM-ALB-e6f7f646d8644104888c062cc8f9ede3](https://www.notion.so/ACM-ALB-e6f7f646d8644104888c062cc8f9ede3)

인증서는 s3 + cloud front 용으로 버지니아에 하나더 발급받겠습니다.

cname= www

![acm-2.png](/img/msa-iam-portfolio/acm-2.png)

## cloudfront

생성한 s3를 연결하고

Cname과 ACM을 선택해줍니다.

![cloudfront-1.png](/img/msa-iam-portfolio/cloudfront-1.png)

## s3

html 호스팅용 s3 버켓을 하나 생성했습니다.

주소는일부로 잘안보이게 ^^

![s3-1.png](/img/msa-iam-portfolio/s3-1.png)

## route53+cloudfront

route53에서 cloud font 연결!

![route53-cloudfront-1.png](/img/msa-iam-portfolio/route53-cloudfront-1.png)

연결 확인!

![route53-cloudfront-2.png](/img/msa-iam-portfolio/route53-cloudfront-2.png)

손수만들 로고 파비콘까지!

## VPC

VPC 및 퍼블릭 서브넷과 프라이브서브넷 2벌을 생성하였습니다.

![vpc-1.png](/img/msa-iam-portfolio/vpc-1.png)

## Nat Instance AMI

커뮤니티 인스턴스에서 

[https://docs.aws.amazon.com/ko_kr/vpc/latest/userguide/VPC_NAT_Instance.html](https://docs.aws.amazon.com/ko_kr/vpc/latest/userguide/VPC_NAT_Instance.html)

이 문서의 설명과같이 마지막버전 AMI를 찾아서 사용하겠습니다.

![nat-ami-1.png](/img/msa-iam-portfolio/nat-ami-1.png)

## EC2 Instance

인스턴스를 어떤걸 사용할지 확인하고

계산기로 확인후 사용하도록하겠습니다.

인스턴스 유형확인

[https://aws.amazon.com/ko/ec2/instance-types/](https://aws.amazon.com/ko/ec2/instance-types/)

인스턴스 비용확인

[https://calculator.aws/#/](https://calculator.aws/#/)

![ec2-1.png](/img/msa-iam-portfolio/ec2-1.png)

t3.medium 2코어 4기가로 

기초베이스를 만들고 부족하면

private 인스턴스를 바스티온구조로 사용해서 2대를 사용하도록 하겠습니다.

![ec2-2.png](/img/msa-iam-portfolio/ec2-2.png)

접속 확인

![Screenshot from 2024-01-29 13-46-23.png](/img/msa-iam-portfolio/ec2-3.png)

![ec2-4.png](/img/msa-iam-portfolio/ec2-4.png)

![ec2-5.png](/img/msa-iam-portfolio/ec2-5.png)

프라이빗 인스턴스입니다.

![ec2-6.png](/img/msa-iam-portfolio/ec2-6.png)

퍼블릭 ip가 없어도 네트워크가 되는지 

curl 로 구글 네트워크가 되는지 확인되었습니다.

![ec2-7.png](/img/msa-iam-portfolio/ec2-7.png)

sudo curl -L "[https://github.com/docker/compose/releases/download/v2.33.1/docker-compose-$](https://github.com/docker/compose/releases/download/v2.29.3/docker-compose-$)(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

## Instance Schedlue

cloudFormation으로 간단히 만들었습니다.

![instance-schedule-1.png](/img/msa-iam-portfolio/instance-schedule-1.png)

운영시간 월-금 09:00 ~ 18:00 입니다.

![instance-schedule-2.png](/img/msa-iam-portfolio/instance-schedule-2.png)

## LoadBalance

![load-balance-1.png](/img/msa-iam-portfolio/load-balance-1.png)

Alb 생성후 

대상그룹에 라우팅할 인스턴스를 선택합니다.

![load-balance-2.png](/img/msa-iam-portfolio/load-balance-2.png)

규칙 추가 및 ACM 연결

운영시간이 지나서 연결할수없다나옵니다 ^^

인스턴스올라오면 정상적으로 동작합니다.

## 관련 글

- [설계 개요와 비용](/docs/postmortems/msa-iam-portfolio/design-and-runtime)
