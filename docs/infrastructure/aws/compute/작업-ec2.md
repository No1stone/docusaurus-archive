---
format: md
id: k-작업-ec2
title: "작업 ec2"
description: "작업 ec2"
tags:
  - AWS
  - Linux
  - nginx
status: active
slug: /knowledge/k-작업-ec2
---
# 작업 ec2

```bash

sudo passwd root
```

```bash

sudo echo 'PasswordAuthentication no' >> /etc/ssh/sshd_config
su - root
```

```bash
sudo adduser gw-user
sudo passwd gw-user
```

```bash
sudo adduser jenkins-user
sudo passwd jenkins-user
```

```bash

cat /etc/passwd
```

```bash
sudo groupadd gw-group
sudo usermod -aG gw-group gw-user
sudo usermod -aG gw-group ubuntu
```

```bash
sudo groupadd jenkins-group
sudo usermod -aG jenkins-group jenkins-user
sudo usermod -aG jenkins-group ubuntu
```

```bash
sudo cp -r /home/ubuntu/.ssh /home/gw-user/
sudo cp -r /home/ubuntu/.ssh /home/jenkins-user/

sudo chown -R gw-user:gw-group /home/gw-user
sudo chown -R jenkins-user:jenkins-group /home/jenkins-user

sudo chown -R gw-group:gw-group /home/gw-user/.ssh
sudo chown -R jenkins-group:jenkins-group /home/jenkins-user/.ssh
sudo chmod 750 /home/gw-user
sudo chmod 750 /home/jenkins-user

```

```bash
sudo service sshd restart
sudo service ssh restart
```

sudo 권한

```jsx

sudo usermod -aG sudo gw-user
sudo usermod -aG sudo jenkins-user

```

nginx folder 권한부여 (nginx 설치 필요)

```bash
sudo apt-get update -y &&
sudo apt-get upgdate -y &&
sudo apt-get install nginx &&
sudo chown -R root:gw-group /etc/nginx &&
sudo chmod -R 775 /etc/nginx &&
sudo find /etc/nginx -type f -exec chmod 664 {} \; &&
sudo find /etc/nginx -type d -exec chmod 775 {} \; &&
sudo chmod g+s /etc/nginx

```

```bash
#sudo su - nginx-user
mkdir -p /home/gw-user/nginx-config
cd /home/gw-user/nginx-config
```

시스템 /ect/nginx 파일을 유저에게 이동후 원래경로에 심볼릭 링크를 설정해서 적용

```bash
sudo mv /etc/nginx/nginx.conf /home/gw-user/nginx-config/nginx.conf
sudo ln -s /home/gw-user/nginx-config/nginx.conf /etc/nginx/nginx.conf

sudo mv /etc/nginx/conf.d /home/gw-user/nginx-config/conf.d
sudo ln -s /home/gw-user/nginx-config/conf.d /etc/nginx/conf.d 
```

소유권

```jsx

sudo chown -R root:gw-group /home/gw-user
sudo chown -R root:jenkins-group /home/jenkins-user

sudo chmod g+s /home/gw-user
sudo chmod g+s /home/jenkins-user

```

```jsx
sudo chown -R jenkins-user:jenkins-group /home/jenkins-user/dockerdir/jenkins_home
sudo chmod -R 775 /home/jenkins-user/dockerdir/jenkins_home

```

필요한 깃 회사계정 나오면 필요

```bash
setting-nginx ## nginx.conf 관리 깃
setting-jenkins ## jenkins_home 관리 깃
setting_v1 ## 백엔드 관리 깃 
setting-infra-docker #infra docker file 관리 깃
  - nginx
  - jenkins
  - postgreSQL
  - redis
  
account
	- aws
	- git
	- godaddy
	- docker

after 번역서비스
ai
chat gpt
perplexity
claude
gemini

번역
naver
DeepL
google

검색
naver
google
microsoft bing
```
