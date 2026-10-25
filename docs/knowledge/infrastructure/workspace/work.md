---
format: md
id: k-work
title: "WORK"
description: "EC2 WORK 환경의 NVMe 디스크 파티션 구성을 기록한 메모입니다."
tags:
  - AWS
  - Linux
status: active
slug: /knowledge/k-work
---
# WORK

## 개요

EC2 WORK 인스턴스에서 확인한 NVMe 디스크와 파티션 레이아웃입니다.
부트 EFI와 루트 파일시스템으로 나뉜 구성을 그대로 남겨 둡니다.

## 디스크 레이아웃

```bash
nvme1n1     259:2    0 465.8G  0 disk 
├─nvme1n1p1 259:3    0     1G  0 part /boot/efi
└─nvme1n1p2 259:4    0 464.7G  0 part /
```

`nvme1n1p1`은 EFI 부트 파티션이고, `nvme1n1p2`는 루트(`/`)로 마운트된 영역입니다.
