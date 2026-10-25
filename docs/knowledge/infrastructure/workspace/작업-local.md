---
format: md
id: k-작업-local
title: "작업 local"
description: "작업 local"
tags:
  - AWS
  - Linux
status: active
slug: /knowledge/k-작업-local
---
# 작업 local

```bash

sudo passwd root
```

```bash
su - root

```

```bash

sudo echo 'PasswordAuthentication yes' >> /etc/ssh/sshd_config
sudo echo 'PermitRootLogin no' >> /etc/ssh/sshd_config
sudo echo 'AllowUsers ubuntu app1-user app2-user data-user' >> /etc/ssh/sshd_config

```

```bash
# 이폴더에 PasswordAuthentication no 되잇는지 확인
cd /etc/ssh/sshd_config.d/
```

```bash
sudo adduser app1-user
sudo passwd app1-user
```

```bash
sudo adduser app2-user
sudo passwd app1-user
```

```bash
sudo adduser data-user
sudo passwd data-user
```

```bash
cat /etc/passwd
```

```bash
sudo groupadd data-group
sudo usermod -aG data-group ubuntu
sudo usermod -aG data-group app1-user
sudo usermod -aG data-group app2-user
sudo usermod -aG data-group data-user
sudo chown -R root:data-group /mnt/data
sudo chown -R :data-group /mnt/data
sudo chmod -R 2775 /mnt/data
sudo find /mnt/data -type d -exec chmod g+s {} \;

```

```bash
sudo groupadd app1-group
sudo usermod -aG app1-group ubuntu
sudo usermod -aG app1-group app1-user
```

```bash
sudo groupadd app2-group
sudo usermod -aG app2-group ubuntu
sudo usermod -aG app2-group app2-user
```

```bash

sudo chown -R app1-user:app1-group /home/app1-user
sudo chown -R app2-user:app2-group /home/app2-user
sudo chown -R data-user:data-group /home/data-user
```

```bash
usermod -aG sudo app1-user
usermod -aG sudo app2-user
```

```bash
sudo cp -r /home/ubuntu/.ssh /home/app1-user/
sudo cp -r /home/ubuntu/.ssh /home/app2-user/
sudo cp -r /home/ubuntu/.ssh /home/data-user/
sudo chown -R app1-user:app1-group /home/app1-user/.ssh
sudo chown -R app2-user:app2-group /home/app2-user/.ssh
sudo chown -R data-user:data-group /home/data-user/.ssh
sudo chmod 750 /home/app1-user
sudo chmod 750 /home/app2-user
sudo chmod 750 /home/data-user
#sudo chmod 750 /home/app1-user/.ssh
#sudo chmod 750 /home/app2-user/.ssh
#sudo chmod 750 /home/data-user/.ssh

```

사용자 비번 접속 혀옹

```bash
sudo vi /etc/ssh/sshd_config

```

```bash
AllowUsers ubuntu app1-user app2-user data-user

```

```bash
#ssh 포트변경 필요시 port를 찾아 변경
sudo vi /etc/ssh/sshd_config

```

```bash
sudo service sshd restart &&
sudo service ssh restart
```

```bash
lsblk
```

```bash
sudo parted /dev/xvdbz

```

```bash
mklabel gpt
quit
```

```bash
sudo parted /dev/xvdbz print
```

```bash
sudo parted /dev/xvdbz

```

```bash
#한개씩 입력
mkpart primary ext4 1MiB 10GiB  # app1-user (10GB)
#한개씩 입력
mkpart primary ext4 10GiB 20GiB # app2-user (10GB)
#한개씩 입력
mkpart primary ext4 20GiB 30GiB # data-user (10GB)
#한개씩 입력
mkpart primary ext4 30GiB 100%  # /mnt/data (남은 공간)
quit

```

```bash
sudo mkfs.ext4 /dev/xvdbz1
sudo mkfs.ext4 /dev/xvdbz2
sudo mkfs.ext4 /dev/xvdbz3
sudo mkfs.ext4 /dev/xvdbz4

```

```bash
sudo mkdir /mnt/app1-home
sudo mount /dev/xvdbz1 /mnt/app1-home
sudo rsync -av /home/app1-user/ /mnt/app1-home/
sudo umount /mnt/app1-home
sudo mount /dev/xvdbz1 /home/app1-user

sudo mkdir /mnt/app2-home
sudo mount /dev/xvdbz2 /mnt/app2-home
sudo rsync -av /home/app2-user/ /mnt/app2-home/
sudo umount /mnt/app2-home
sudo mount /dev/xvdbz2 /home/app2-user

sudo mkdir /mnt/data-home
sudo mount /dev/xvdbz3 /mnt/data-home
sudo rsync -av /home/data-user/ /mnt/data-home/
sudo umount /mnt/data-home
sudo mount /dev/xvdbz3 /home/data-user

sudo mkdir /mnt/data
sudo mount /dev/xvdbz4 /mnt/data

```

```bash
sudo vi /etc/fstab

```
