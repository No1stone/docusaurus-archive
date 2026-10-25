---
format: md
id: k-ubuntu-d3b87a
title: "Ubuntu"
description: "Ubuntu"
tags:
  - Linux
status: active
slug: /knowledge/k-ubuntu-d3b87a
---
# Ubuntu

```bash
sudo ufw disable #비활성화
```

```bash
sudo ufw enable #활성화
```

```bash
sudo ufw rerset #초기화
```

정책확인

```bash
ufw show raw #기본 정책 확인
```

```bash
ufw default allow # 기본 정책 허용
```

```bash
ufw default deny # 기본 정책 원복
```

포트허용

```bash
ufw allow 8080/tcp # 포트허용
```

```bash
ufw allow 8000:8100/tcp # 포트 범위허용
```

```bash
ufw deny 8080/tcp # 포트차단
```

```bash
ufw deny 8000:8100/tcp # 포트 범위차단
```

ip허용

```bash
ufw allow forw [ip] # 해당하이피 접근허용
```

```bash
ufw allow from [ ip ] to any [ port ] proto [ protocol ] #해당하이피 접근허용
```

```bash
ufw deny from [ ip ] to any [ port ] proto [ protocol ]
```

ssh 

```bash
ufw allow ssh
```

```bash
ufw deny ssh
```
