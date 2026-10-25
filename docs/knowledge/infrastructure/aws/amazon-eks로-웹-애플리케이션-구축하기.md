---
format: md
id: k-amazon-eks로-웹-애플리케이션-구축하기
title: "Amazon EKS로 웹 애플리케이션 구축하기"
description: "Amazon EKS로 웹 애플리케이션 구축하기"
tags:
  - AWS
  - Git
  - HTTP
  - Kubernetes
  - Linux
status: active
slug: /knowledge/k-amazon-eks로-웹-애플리케이션-구축하기
---
# Amazon EKS로 웹 애플리케이션 구축하기

## 개요

Amazon EKS로 웹 애플리케이션 구축하기입니다.

— version check
— aws cli install
—aws kubectl install
—json tool install
jq는 JSON 형식의 데이터를 다루는 커맨드라인 유틸리티입니다. 아래의 명령어를 통해, jq를 설치합니다.
Bash 쉘에서 kubectl completion script는 **kubectl completion bash**
명령어를 통해 생성할 수 있습니다.
쉘에 completion script를 소싱하면 kubectl 명령어의 자동 완성을 가능하게 만들 수 있습니다.
—eks ctl install

## 예제·코드

```bash
sudo pip install --upgrade awscli

aws --version

```

```bash
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"

unzip awscliv2.zip

sudo ./aws/install
```

```bash
sudo curl -o /usr/local/bin/kubectl  \
   https://amazon-eks.s3.us-west-2.amazonaws.com/1.21.2/2021-07-05/bin/linux/amd64/kubectl

sudo chmod +x /usr/local/bin/kubectl

kubectl version --client=true --short=true
```

<details>
<summary>참고 자료</summary>

- [Workshop Studio](https://aws-eks-web-application.workshop.aws/) — Discover and participate in AWS workshops and GameDays
- [https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip](https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip)
- [https://amazon-eks.s3.us-west-2.amazonaws.com/1.21.2/2021-07-05/bin/linux/amd64/kubectl](https://amazon-eks.s3.us-west-2.amazonaws.com/1.21.2/2021-07-05/bin/linux/amd64/kubectl)
</details>
