---
id: reverse-ssh
title: "Reverse SSH"
description: "공인 IP 없는 홈 노트북을 AWS EC2 바스티온에 Reverse SSH로 연결하는 구성"
tags:
  - reverse-ssh
  - ssh
  - aws
  - bastion-host
  - self-hosting
status: active
sidebar_position: 2
slug: "/infrastructure/networking/reverse-ssh"
---

# Reverse SSH

**방화벽이나 NAT 등으로 인해 외부에서 직접 접속이 불가능한 내부 서버에 접근하기 위해,**

**내부 서버가 먼저 외부의 공개된 SSH 서버로 접속(터널링)을 생성한 뒤,**

**외부 서버에서 이 터널을 통해 내부 서버로 연결되는 기술**

주로 SSH 포트 포워딩을 이용한 [**역방향 터널링**](https://www.google.com/search?q=%EC%97%AD%EB%B0%A9%ED%96%A5+%ED%84%B0%EB%84%90%EB%A7%81\&sca_esv=579435e9b1f4aa6c\&ei=RUBOaYHKNqqi0-kP8ZucyQM\&ved=2ahUKEwjTpJD37NqRAxXQga8BHdC7H_cQgK4QegQIARAC\&uact=5\&oq=reverse+ssh+%EC%9D%B4%EB%9E%80\&gs_lp=Egxnd3Mtd2l6LXNlcnAiEnJldmVyc2Ugc3NoIOydtOuegDIIECEYoAEYwwQyCBAhGKABGMMEMggQIRigARjDBEiXaFDtBlj7Y3AGeAGQAQCYAb8BoAGtHKoBBDEuMji4AQPIAQD4AQGYAhagApQRwgIKEAAYsAMY1gQYR8ICCRAhGKABGAoYKsICBxAhGKABGArCAgYQABgFGB7CAggQABiABBiiBMICBRAAGO8FwgIGEAAYBxgewgIIEAAYBRgHGB7CAgoQABgFGAcYChgewgIKEC4YgAQYQxiKBcICChAAGIAEGEMYigXCAgsQABiABBixAxiDAcICBRAAGIAEwgIEEAAYA8ICBRAuGIAEwgIZEC4YgAQYQxiKBRiXBRjcBBjeBBjgBNgBAcICCBAAGAcYChgewgIIEAAYogQYiQXCAggQABgIGA0YHpgDAIgGAZAGCroGBggBEAEYFJIHBDYuMTagB8J6sgcEMC4xNrgH7hDCBwgwLjYuMTUuMcgHYIAIAA\&sclient=gws-wiz-serp\&mstk=AUtExfBvMbAQ_3fpKWoh4X-kr9KE7NaADmrSSU56kNjWuh4f-iXjGp9YyClXyExo686o4e-3FSbueDB_ClnYANoIzMz_p17RSURnghmPt6tOOXXhowI4imTPWKRGRJdUHU7AbRgyuYfj5WrVDQch7loYtu3mMpYjTmauWtviUVZ3pwu8JhU\&csui=3)을 의미합니다. 마치 내부에서 외부로 파이프를 뚫어 놓으면,

외부에서 그 파이프를 통해 내부로 물을 보낼 수 있게 되는 것과 같은 원리입니다.

## 적용

개인 인프라를 운영하면서 aws는 비용부담이 크다..

최근환률도 거의 1500원에 육박하고

공인아이피 없이 내 aws ec2 바스티온호스트 네트워크에

포함시키고 싶어서 찾아보다 알게된 Reverse SSH

개인 로컬 서버용으로 쓰고있던 8코어 32기가 메모리를 가진 ubuntu desktop 노트북을

aws ec2 프록시서버에 리버스 ssh를 걸게되었습니다.

## notebook

```plaintext
autossh -M 0 -N \
  -o "ServerAliveInterval 30" \
  -o "ServerAliveCountMax 3" \
  -R 22222:localhost:22 \
  ec2-user@<EC2_PUBLIC_IP>
```

## EC2에서 노트북 접속

```plaintext
ssh -p 22222 user@localhost
```

## 접속이 끊어지더라도 노트북이 다시 ec2에 리버스 ssh 할수잇게

```plaintext
crontab -e
```

```plaintext
*/2 * * * * /usr/bin/autossh -M 0 -N \
  -o "ServerAliveInterval 30" \
  -o "ServerAliveCountMax 3" \
  -o "ExitOnForwardFailure yes" \
  -R 22222:localhost:22 \
  ec2-user@<EC2_PUBLIC_IP>
```

## ec2에서 확인

```plaintext
ss -tnlp | grep 2000
```

image

## 확인

proxy 로 사용중인 ec2 instance에서 20000\~20009 번포트를 이제

내 리소스 처럼 접근 가능

mac -> aws ec2 proxy -> home notebook

```plaintext
ssh -J proxy notebook
```

image

```plaintext
cd /usr/local/bin/
```
