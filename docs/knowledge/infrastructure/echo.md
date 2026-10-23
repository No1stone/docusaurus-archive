---
format: md
id: k-echo
title: "echo"
description: "echo로 bashrc, sshd_config에 설정을 추가하는 메모"
tags:
  - Linux
status: active
slug: /knowledge/k-echo
---
# echo

> **개요:** `echo`와 리다이렉트로 설정 줄을 파일 끝에 붙이는 메모입니다.

## ANDROID_HOME 예

```bash
echo 'export ANDROID_HOME=$HOME/Android/Sdk' >> ~/.bashrc
echo 'export PATH=$ANDROID_HOME/cmdline-tools/latest/bin:$PATH' >> ~/.bashrc
source ~/.bashrc
```

## sshd_config 메모

설정 파일 위치로 이동합니다.

```bash
cd /etc/ssh
sudo vi /etc/ssh/sshd_config
```

비밀번호 인증을 끄는 줄을 붙이는 예입니다.

```bash
sudo echo 'PasswordAuthentication no' >> /etc/ssh/sshd_config
```

권한, 리다이렉트 때문에 `echo ... | sudo tee -a` 형태가 더 안전한 경우가 많습니다.
변경 후 sshd 재시작이 필요할 수 있습니다.
