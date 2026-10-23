---
format: md
id: k-vpc
title: "vpc"
description: "AWS VPC 개념, 생성 순서, NAT 관련 참고 링크 모음"
tags:
  - AWS
  - HTTP
status: active
slug: /knowledge/k-vpc
---
# vpc

## 개요

AWS VPC 개념, 생성 순서, NAT 관련 참고 링크 모음입니다.

서브넷 대역을 나눌 때 CIDR 계산기를 사용한다는 메모입니다.
대역이 겹치지 않게 계산한 뒤 VPC, 서브넷에 반영합니다.
원 노트에서는 아래 글을 따라 VPC 생성 순서를 잡았습니다.
VPC, 서브넷, 라우트 테이블, 인터넷 게이트웨이(또는 NAT) 순으로 보면 됩니다.

<details>
<summary>참고 자료</summary>

- [AWS 가장 쉽게 VPC 개념 잡기](https://medium.com/harrythegreat/aws-%EA%B0%80%EC%9E%A5%EC%89%BD%EA%B2%8C-vpc-%EA%B0%9C%EB%85%90%EC%9E%A1%EA%B8%B0-71eef95a7098)
- [네트워크 구성하기 (VPC, Subnet, Route Table, Internet Gateway)](https://tech.cloud.nongshim.co.kr/2018/10/16/4-%EB%84%A4%ED%8A%B8%EC%9B%8C%ED%81%AC-%EA%B5%AC%EC%84%B1%ED%95%98%EA%B8%B0vpc-subnet-route-table-internet-gateway/)
- [NAT Gateway를 NAT Instance로 대체해 비용 절약](https://inpa.tistory.com/entry/AWS-%F0%9F%93%9A-NAT-Gateway-NAT-Instance-%EB%8C%80%EC%B2%B4%ED%95%B4%EC%84%9C-%EB%B9%84%EC%9A%A9-%EC%A0%88%EC%95%BD) — NAT 인프라 AWS에서 네트워크를 설계할때 NAT의 사용은 필수적이다. 보안상 서버들을 외부에서 접근할 수 없고 확인할 수 없도록 해야하기 때문이다. 그래서 VPC 인프라를 구축할때 Public 서브넷과 Private 서브넷을 만들어 그안에 EC2 인스턴스를 두고, Bastion Host를 통해 Public 서브넷에서
</details>
