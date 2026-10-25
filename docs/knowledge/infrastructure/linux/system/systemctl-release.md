---
format: md
id: k-systemctl-release
title: "systemctl release"
description: "systemd 유닛 등록·권한·기동으로 WAS/UI를 배포할 때 쓰는 systemctl 메모입니다."
tags:
  - Linux
status: active
slug: /knowledge/k-systemctl-release
---
# systemctl release

## 개요

EC2 등에서 앱 기동 스크립트를 systemd 유닛으로 등록해 `systemctl start/enable`로 올리는 메모입니다.
유닛 파일을 넣은 뒤 `daemon-reload`를 하고, 유닛 파일 권한은 보통 `644`입니다.

경로 예:

- `/home/ec2-user/admindev`
- `/svc/was/aicb/cinnamon_ui/startup-ui.sh`
- `/home/ec2-user/homepage/`
- `/home/ec2-user/.myfile/icsdemo.sh`

## 자주 쓰는 명령

```bash
sudo systemctl daemon-reload
systemctl list-unit-files
systemctl list-units
sudo chmod 644 /etc/systemd/system/<service>.service
sudo systemctl enable <service>
sudo systemctl start <service>
sudo systemctl status <service>
```

유닛 내용과 ExecStart 경로는 환경마다 다르므로, 배포 스크립트와 실제 서비스 이름을 맞춰 확인합니다.

<details>
<summary>참고 자료</summary>

- [systemd.service — man](https://www.freedesktop.org/software/systemd/man/systemd.service.html)
</details>
