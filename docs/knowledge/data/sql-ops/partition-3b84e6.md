---
format: md
id: k-partition-3b84e6
title: "partition"
description: "partition"
tags:
  - HTTP
  - Linux
status: active
slug: /knowledge/k-partition-3b84e6
---
# partition

## 개요

partition에 대한 메모입니다.

우선 같은 리전에 ebs블록 생성후 인스턴스연결
생성한 마운트 포멧

![partition-3b84e6-image.png](/img/partition-3b84e6/partition-3b84e6-image.png)

## 예제·코드

```bash

 sudo fdisk /dev/xvdf
 
```

```bash
n  ## 새 파티션 생성
 p  ## 프라이빗 파티션
 enter ## 엔터! 디스크 시작구간 부터
 +10M  ## 10메가까지파티션
```

```bash
sudo mkfs.ext4 /dev/xvdf1
sudo mkfs.ext4 /dev/xvdf2
sudo mkfs.ext4 /dev/xvdf3
sudo mkfs.ext4 /dev/xvdf4

```

<details>
<summary>참고 자료</summary>

- [[Linux] Ubuntu 22.04 대용량 디스크 마운트 하기](https://aeong-dev.tistory.com/11) — 1TB SSD 에 4TB HDD 를 추가하여 기기를 받아 디스크를 마운트 해야한다 (부팅은 SSD로 하고 있음) *NOTE* Linux의 경우 2TB 미만인 경우 일반적인 디스크 마운트를 진행하면 되지만, 2TB가 넘을 경우 fdisk를 사용하여 2TB 가 넘는 파티션을 생성하지 못한다 따라서 대용량 디스크를 마운트하려면
</details>
