---
format: md
id: k-kubernates-install
title: "Kubernates install"
description: "Linux에 kubectl을 설치하고 바이너리 체크섬을 확인하는 메모입니다."
tags:
  - AWS
  - Kubernetes
  - Linux
status: active
slug: /knowledge/k-kubernates-install
---
# Kubernates install

## 개요

클러스터에 명령을 보내려면 클라이언트 `kubectl`이 필요합니다.
파일명 Kubernates는 원본 표기를 유지합니다.
최신 안정 버전 바이너리를 받거나, 배포판 패키지 저장소로 설치한 뒤 `kubectl cluster-info`로 연결을 확인합니다.

## 바이너리 설치와 체크섬

```bash
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl.sha256"
echo "$(cat kubectl.sha256)  kubectl" | sha256sum --check
sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl
```

## apt 저장소 예

```bash
sudo apt-get install -y apt-transport-https ca-certificates curl
sudo curl -fsSLo /usr/share/keyrings/kubernetes-archive-keyring.gpg https://packages.cloud.google.com/apt/doc/apt-key.gpg
echo "deb [signed-by=/usr/share/keyrings/kubernetes-archive-keyring.gpg] https://apt.kubernetes.io/ kubernetes-xenial main" | sudo tee /etc/apt/sources.list.d/kubernetes.list
sudo apt-get update
sudo apt-get install -y kubectl
kubectl cluster-info
```

패키지 저장소 URL·서명 키는 Kubernetes 문서의 최신 안내로 바꾸는 것이 안전합니다.

<details>
<summary>참고 자료</summary>

- [Install and Set Up kubectl on Linux](https://kubernetes.io/docs/tasks/tools/install-kubectl-linux/)
- [kubectl 안정 버전 문자열](https://dl.k8s.io/release/stable.txt)
</details>
