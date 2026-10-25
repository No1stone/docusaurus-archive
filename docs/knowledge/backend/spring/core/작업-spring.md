---
format: md
id: k-작업-spring
title: "작업 spring"
description: "작업 spring"
tags:
  - AWS
  - Java
  - Linux
  - Spring
status: active
slug: /knowledge/k-작업-spring
---
# 작업 spring

```bash
mkdir -p ~/.config/systemd/user

```

```bash
[Unit]
Description=diddda-api
After=network.target

[Service]
Type=forking
Restart=always
RestartSec=1
SuccessExitStatus=143
ExecStart=/home/gw-user/java/api-start.sh

[Install]
WantedBy=default.target

```

```bash
# 사용자 systemd 서비스 재로드
systemctl --user daemon-reexec
systemctl --user daemon-reload

# 서비스 시작
systemctl --user start diddda-api.service

# 부팅 시 자동 시작 설정 (로그인 시)
systemctl --user enable diddda-api.service

```

```jsx
cd /etc/systemd/system
```

```jsx
/home/jbq/bin/collector/start.sh
/home/jbq/bin/service/start.sh
/home/jbq/bin/batch/start.sh
```

```jsx
systemctl daemon-reload

systemctl enable swms-collector.service
systemctl enable swms-service.service
systemctl enable swms-batch.service

systemctl start swms-collector.service
systemctl start swms-service.service
systemctl start swms-batch.service
```
