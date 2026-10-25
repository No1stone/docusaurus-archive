---
format: md
id: k-docker-설치
title: "docker 설치"
description: "docker 설치"
tags:
  - AWS
  - Docker
  - Git
  - HTTP
  - Java
  - Linux
  - nginx
status: active
slug: /knowledge/k-docker-설치
---
# docker 설치

## 개요

docker 설치입니다.

#!/bin/bash
sudo chmod 666 /var/run/docker.sock
sudo chown root:docker /var/run/docker.sock
cd /home/ec2-user/.myfile/nginx/
docker-compose up -d
java -jar /home/ec2-user/homepage/releasefile/homepage-1.0.war &

## 예제·코드

```bash
sudo amazon-linux-extras install docker
sudo service docker start
sudo usermod -a -G docker ec2-user
sudo chkconfig docker on
sudo reboot

sudo curl -L https://github.com/docker/compose/releases/download/1.22.0/docker-compose-$(uname -s)-$(uname -m) -o /usr/local/bin/docker-compose
	sudo chmod +x /usr/local/bin/docker-compose
	docker-compose version
```

```bash
sudo yum update -y
sudo yum install docker -y
docker -v
sudo service docker start
sudo usermod -aG docker ec2-user

```

```bash
sudo yum update -y
sudo yum install docker -y
docker -v
sudo service docker start
sudo usermod -aG docker ec2-user

sudo curl -L https://github.com/docker/compose/releases/download/1.22.0/docker-compose-$(uname -s)-$(uname -m) -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
docker-compose version

sudo ln -s /usr/local/bin/docker-compose /usr/bin/docker-compose
sudo service docker restart
sudo chmod 666 /var/run/docker.sock
sudo chown root:docker /var/run/docker.sock
```

<details>
<summary>참고 자료</summary>

- [Amazon ECS에서 사용할 컨테이너 이미지 생성 - Amazon Elastic Container Service](https://docs.aws.amazon.com/ko_kr/AmazonECS/latest/developerguide/create-container-image.html) — Amazon ECS에서 사용할 컨테이너 이미지를 생성하는 방법을 알아보세요.
- [https://github.com/docker/compose/releases/download/1.22.0/docker-compose-$(uname](https://github.com/docker/compose/releases/download/1.22.0/docker-compose-$(uname)
</details>
