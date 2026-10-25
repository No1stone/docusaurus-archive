---
format: md
id: k-work-space
title: "Work Space"
description: "EC2 Work Space 환경의 NVMe 디스크 파티션 구성을 기록한 메모입니다."
tags:
  - AWS
  - Linux
status: active
slug: /knowledge/k-work-space
---
# Work Space

## 개요

EC2 Work Space 인스턴스에서 확인한 NVMe 디스크와 파티션 레이아웃입니다.
WORK 메모와 같은 형태의 출력을 보관합니다.

## 디스크 레이아웃

```bash
nvme1n1     259:2    0 465.8G  0 disk 
├─nvme1n1p1 259:3    0     1G  0 part /boot/efi
└─nvme1n1p2 259:4    0 464.7G  0 part /
```

`nvme1n1p1`은 EFI 부트 파티션이고, `nvme1n1p2`는 루트(`/`)로 마운트된 영역입니다.
