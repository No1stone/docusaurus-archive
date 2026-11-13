---
format: md
id: k-docker-설치
title: "docker 설치"
description: "Amazon Linux와 Ubuntu에서 Docker와 Compose를 설치하고, docker 그룹으로 사용자를 붙이는 절차입니다."
tags:
  - AWS
  - Docker
  - Linux
status: active
slug: /knowledge/k-docker-설치
---

# docker 설치

엔진 설치, 서비스 기동, 사용자를 `docker` 그룹에 넣는 절차를 환경별로 둡니다.<br />
소켓 권한을 `chmod 666`으로 여는 방식은 설치 절차에 넣지 않습니다.<br />
일반 사용자로 쓰려면 `usermod -aG docker` 후 재로그인이 필요합니다.

## Amazon Linux (yum)

```bash
sudo yum update -y
sudo yum install docker -y
docker -v
sudo service docker start
sudo usermod -aG docker ec2-user
```

부팅 시 자동 기동이 필요하면 배포판에 맞게 `chkconfig` 또는 `systemctl enable`을 사용합니다.

```bash
sudo chkconfig docker on
```

일부 이미지에서는 extras를 쓸 수 있습니다.

```bash
sudo amazon-linux-extras install docker
sudo service docker start
sudo usermod -a -G docker ec2-user
```

## Ubuntu (apt)

```bash
sudo apt-get update -y && sudo apt-get upgrade -y
sudo apt install apt-transport-https ca-certificates curl software-properties-common -y
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt update
sudo apt install docker-ce docker-ce-cli containerd.io
sudo usermod -aG docker ${USER}
sudo systemctl start docker
sudo systemctl enable docker
sudo systemctl status docker
```

## docker 그룹과 여러 사용자

그룹이 없으면 만들고, 엔진을 쓸 계정을 그룹에 넣습니다.<br />
계정 이름은 호스트에 맞게 바꿉니다.

```bash
sudo groupadd docker
sudo usermod -aG docker ubuntu
sudo usermod -aG docker ec2-user
```

## Docker Compose

바이너리 설치 예입니다. 버전은 필요에 맞게 바꿉니다.

```bash
sudo curl -L "https://github.com/docker/compose/releases/download/v2.33.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
docker-compose --version
```

PATH에 `/usr/local/bin`이 없으면 심볼릭 링크를 둘 수 있습니다.

```bash
sudo ln -s /usr/local/bin/docker-compose /usr/bin/docker-compose
```

<details>
<summary>참고 자료</summary>

- [Amazon ECS에서 사용할 컨테이너 이미지 생성](https://docs.aws.amazon.com/ko_kr/AmazonECS/latest/developerguide/create-container-image.html)
- [Docker Docs — Install Docker Engine](https://docs.docker.com/engine/install/)
</details>
