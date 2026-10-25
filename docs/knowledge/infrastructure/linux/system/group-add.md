---
format: md
id: k-group-add
title: "group add"
description: "group add"
tags:
  - AWS
  - Linux
  - nginx
status: active
slug: /knowledge/k-group-add
---
# group add

```bash
sudo groupadd nginx-group
sudo usermod -aG nginx-group nginx-user
sudo usermod -aG nginx-group ec2-user

```

```bash
sudo groupadd jenkins-group
sudo usermod -aG jenkins-group jenkins-user
sudo usermod -aG jenkins-group ec2-user

```

```bash
sudo groupadd app1-group
sudo usermod -aG app1-group app1-user
sudo usermod -aG app1-group ec2-user

```

```bash
sudo groupadd app2-group
sudo usermod -aG app2-group app2-user
sudo usermod -aG app2-group ec2-user

```

```bash
sudo groupadd db-group
sudo usermod -aG db-group db-user
sudo usermod -aG db-group ec2-user

```

```bash
sudo groupadd data
sudo usermod -aG app1-group app1-user
sudo usermod -aG app2-group app2-user
sudo usermod -aG db-group db-user

```

권한 부여

```bash
sudo chown -R root:nginx-group /etc/nginx
sudo chmod -R 775 /etc/nginx
sudo find /etc/nginx -type f -exec chmod 664 {} \;
sudo find /etc/nginx -type d -exec chmod 775 {} \;
sudo chmod g+s /etc/nginx

```

권한을 받은 그룹은 시스템 파일에 접근할때 비밀번호 없이 접근가능하게 하여

루트 비밀번호 보호

```bash
sudo visudo
```

```bash
%nginx-group ALL=(ALL) NOPASSWD: /bin/nano /etc/nginx/nginx.conf
```

```bash
%jenkins-group ALL=(ALL) NOPASSWD: /bin/nano {pwd}
```

```bash
%app1-group ALL=(ALL) NOPASSWD: /bin/nano {pwd}
```

```bash
%app2-group ALL=(ALL) NOPASSWD: /bin/nano {pwd}
```

```bash
%db-group ALL=(ALL) NOPASSWD: /bin/nano {pwd}
```
