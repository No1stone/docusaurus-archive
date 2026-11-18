---
title: "JAR 배포의 Java 버전 고정과 사용자 경로 JDK 교체"
description: "Java4Shell 대응 Corretto를 사용자 홈에 설치하고, systemd ExecStart의 Java 절대 경로와 JAR 릴리스 전환으로 보안 업데이트와 롤백을 관리합니다."
slug: /knowledge/tooling/ci/jar-deployment-with-user-jdk
sidebar_position: 2
tags:
  - Java
  - Linux
  - Deployment
  - Security
status: active
keywords:
  - "JAR 배포"
  - "Corretto"
  - "Java4Shell"
  - "systemd ExecStart"
  - "JAVA_HOME"
  - "사용자 경로 JDK"
  - "java -version"
  - "보안 패치"
  - "롤백"
  - "Linux Java 교체"
---

# JAR 배포의 Java 버전 고정과 사용자 경로 JDK 교체

JAR를 직접 실행하는 서버에서 Java 보안 업데이트를 적용하려면 실제 앱을 실행한 Java부터 확인합니다.
터미널의 `java -version`과 systemd 서비스가 사용하는 Java는 서로 다를 수 있습니다.
시스템에 설치된 Java와 함께 서비스 전용 JDK를 사용자 홈 아래에 두고, 실행 파일의 절대 경로를 지정해 버전을 관리할 수 있습니다.

이 글은 Ubuntu에서 이미 존재하는 `appuser` 계정으로 앱을 운영한다고 가정합니다.
JDK와 JAR는 해당 계정이 읽고 실행할 수 있는 경로에 두고, systemd 시스템 서비스의 등록과 재시작에는 관리자 권한을 사용합니다.

## 보안 패치 버전과 앱 버전을 각각 기록합니다

JAR는 앱 코드와 의존성을 담고, 이를 실행하는 Java 런타임은 별도로 선택합니다.
JAR를 그대로 두고 수정된 Java로 다시 실행할 수 있고, 앱 릴리스 변경과 런타임 교체를 함께 진행할 수도 있습니다.
앱이 사용하는 프레임워크와 라이브러리의 지원 범위는 배포 전에 확인합니다.

| 대상 | 예제 버전 | 변경 시 확인 |
|---|---|---|
| Java 런타임 | Corretto `25.0.5.1.2` | 배포판의 보안 수정 내역과 실제 실행 버전을 확인합니다. |
| 앱 릴리스 | `1.4.3` | 빌드한 JAR와 검증 결과를 연결합니다. |
| 배포 기록 | 앱 버전, JAR 해시, JDK 경로 | 실제 어떤 조합이 실행됐는지 남깁니다. |

| Java 계열 | 2026년 11월 18일 확인한 Corretto 정식 릴리스 | 공식 릴리스 |
|---|---|---|
| 11 | `11.0.33.1.1` | [Corretto 11](https://github.com/corretto/corretto-11/releases/tag/11.0.33.1.1) |
| 17 | `17.0.21.1.2` | [Corretto 17](https://github.com/corretto/corretto-17/releases/tag/17.0.21.1.2) |
| 21 | `21.0.13.1.2` | [Corretto 21](https://github.com/corretto/corretto-21/releases/tag/21.0.13.1.2) |
| 25 | `25.0.5.1.2` | [Corretto 25](https://github.com/corretto/corretto-25/releases/tag/25.0.5.1.2) |

Corretto 11은 AWS의 `CVE-2026-114938` 공지에서 영향 없음으로 분류됩니다.
11의 버전은 같은 시기의 다른 취약점 수정을 포함한 정식 보안 업데이트로 함께 기록했습니다.
17, 21, 25의 위 릴리스는 변경 내역에 해당 CVE 수정을 명시합니다.
이 표는 확인 날짜가 있는 배포판별 기록이며 이후 패치에서는 최신 공지를 다시 확인합니다. [AWS CVE 공지](https://explore.alas.aws.amazon.com/CVE-2026-114938.html)

아래 전체 실행 예제는 Java 25를 사용하는 서비스를 가정합니다.
Java 11, 17, 21 서비스는 해당 계열의 버전과 다운로드 파일을 선택하고 같은 절차를 적용합니다.

## 실제 서비스의 Java를 확인합니다

```bash
command -v java
java -version
sudo systemctl cat my-app.service
```

앞의 두 명령은 현재 셸에서 선택한 Java를 보여줍니다.
systemctl cat에서는 서비스 파일과 drop-in의 ExecStart, Environment, WorkingDirectory를 확인합니다.
앱이 시작할 때 런타임 버전을 로그에 남기도록 하면 배포 기록과 대조하기 쉽습니다.

```text
/home/appuser/
├── downloads/
├── jdks/
│   └── corretto-25.0.5.1.2/
│       └── bin/java
└── apps/my-app/
    ├── releases/
    │   ├── 1.4.2/app.jar
    │   └── 1.4.3/app.jar
    ├── current -> releases/1.4.3
    └── app.env
```

JDK는 버전이 드러나는 디렉터리에 설치하고 앱 릴리스도 별도 디렉터리에 보관합니다.
실행 중인 JDK 디렉터리에 새 파일을 덮어쓰면 이미 로드된 코드와 나중에 읽는 라이브러리 구성이 섞일 수 있으므로, 새 버전은 새 경로에 준비합니다.

## 사용자 홈에 Corretto를 다운로드합니다

먼저 서버의 CPU 아키텍처를 확인합니다.
이후 명령은 appuser로 로그인한 셸에서 실행하는 예제입니다.

```bash
uname -m
```

| 출력 | 선택할 아카이브 |
|---|---|
| `x86_64` | `linux-x64.tar.gz` |
| `aarch64` | `linux-aarch64.tar.gz` |

아래는 x86_64 Ubuntu용 Corretto 25 아카이브입니다.
Alpine처럼 musl을 사용하는 환경은 해당 배포판에 맞는 빌드를 따로 선택합니다.

```bash
mkdir -p /home/appuser/downloads /home/appuser/jdks
cd /home/appuser/downloads

curl --fail --location \
  --output amazon-corretto-25.0.5.1.2-linux-x64.tar.gz \
  https://corretto.aws/downloads/resources/25.0.5.1.2/amazon-corretto-25.0.5.1.2-linux-x64.tar.gz
```

공식 릴리스에서 같은 파일의 SHA-256을 확인해 대조합니다.
아래 값은 위 파일에 대해 릴리스에 공개된 체크섬입니다.
다른 버전이나 아키텍처 파일에는 해당 파일의 체크섬을 사용합니다.

```bash
printf '%s  %s\n' \
  '8d2be3f035dbdb7f7475e2f7009b7dc20683bfc351ad41064218c8de596c9644' \
  'amazon-corretto-25.0.5.1.2-linux-x64.tar.gz' | sha256sum --check
```

결과가 OK인 것을 확인한 뒤 새 디렉터리에 압축을 풉니다.
같은 버전 디렉터리가 이미 있다면 기존 사용 여부를 먼저 확인합니다.

```bash
mkdir /home/appuser/jdks/corretto-25.0.5.1.2

tar -xzf amazon-corretto-25.0.5.1.2-linux-x64.tar.gz \
  --directory /home/appuser/jdks/corretto-25.0.5.1.2 \
  --strip-components=1

/home/appuser/jdks/corretto-25.0.5.1.2/bin/java -version
```

Java 17 서버라면 공식 Corretto 17 릴리스의 파일, 체크섬과 경로로 이 과정을 적용합니다.
릴리스 번호와 실제 파일 목록은 [Corretto 다운로드 안내](https://docs.aws.amazon.com/corretto/latest/corretto-25-ug/downloads-list.html)에서 확인합니다.

## Java 11, 17, 21, 25의 경로를 선택합니다

| 계열 | 사용자 홈의 설치 경로 예시 | ExecStart에서 사용할 실행 파일 |
|---|---|---|
| 11 | `/home/appuser/jdks/corretto-11.0.33.1.1` | `/home/appuser/jdks/corretto-11.0.33.1.1/bin/java` |
| 17 | `/home/appuser/jdks/corretto-17.0.21.1.2` | `/home/appuser/jdks/corretto-17.0.21.1.2/bin/java` |
| 21 | `/home/appuser/jdks/corretto-21.0.13.1.2` | `/home/appuser/jdks/corretto-21.0.13.1.2/bin/java` |
| 25 | `/home/appuser/jdks/corretto-25.0.5.1.2` | `/home/appuser/jdks/corretto-25.0.5.1.2/bin/java` |

예를 들어 기존 앱이 Java 21이면 Corretto 21 릴리스에서 아키텍처에 맞는 파일을 받아 해당 경로에 풉니다.
셸 실행 예제와 systemd의 ExecStart, JAVA_HOME을 같은 JDK 경로로 맞춥니다.
파일 이름의 계열과 버전, 체크섬까지 함께 바꾸고 앱의 빌드 대상 Java 계열도 확인합니다.

## 명시적인 Java 경로로 JAR를 실행합니다

새 JDK가 준비되면 기존 JAR를 사용해 기동과 핵심 기능을 검증할 수 있습니다.
운영과 같은 포트를 동시에 사용하지 않도록 테스트 환경의 포트와 외부 연결 대상을 따로 지정합니다.

```bash
/home/appuser/jdks/corretto-25.0.5.1.2/bin/java \
  -Xms64m -Xmx512m \
  -jar /home/appuser/apps/my-app/releases/1.4.3/app.jar \
  --spring.profiles.active=local \
  --server.port=18080
```

메모리는 예시값이며 앱과 컨테이너 또는 호스트의 여유에 맞춰 조절합니다.
프로필 이름만 바꿔도 운영 DB로 연결될 수 있으므로 실제 테스트 설정의 접속 대상도 확인합니다.
Java 실행 파일의 절대 경로를 지정하면 해당 프로세스에서 쓸 런타임이 명확해집니다.

## systemd의 ExecStart를 고정합니다

앱 JAR를 새 릴리스 디렉터리에 배치합니다.
다음은 빌드한 파일이 현재 디렉터리에 있는 경우입니다.

```bash
mkdir -p /home/appuser/apps/my-app/releases/1.4.3
install -m 0644 ./my-app-1.4.3.jar \
  /home/appuser/apps/my-app/releases/1.4.3/app.jar
sha256sum /home/appuser/apps/my-app/releases/1.4.3/app.jar
```

current가 없거나 심볼릭 링크인 구성에서 임시 링크를 만든 뒤 같은 디렉터리에서 교체합니다.
current가 실제 디렉터리라면 먼저 배포 구조를 확인합니다.

```bash
cd /home/appuser/apps/my-app
ln -s releases/1.4.3 current-next
mv -Tf current-next current
```

링크 교체는 다음 실행에 사용할 JAR를 선택합니다.
이미 떠 있는 프로세스의 Java 버전은 재시작할 때 바뀝니다.
아래 파일을 `/etc/systemd/system/my-app.service`에 관리자 권한으로 등록합니다.

```ini
[Unit]
Description=My Spring Boot Application
Wants=network-online.target
After=network-online.target

[Service]
Type=simple
User=appuser
Group=appuser
WorkingDirectory=/home/appuser/apps/my-app
Environment=JAVA_HOME=/home/appuser/jdks/corretto-25.0.5.1.2
EnvironmentFile=/home/appuser/apps/my-app/app.env
ExecStart=/home/appuser/jdks/corretto-25.0.5.1.2/bin/java -Xms64m -Xmx512m -jar /home/appuser/apps/my-app/current/app.jar
Restart=on-failure
RestartSec=5s
TimeoutStopSec=60s

[Install]
WantedBy=multi-user.target
```

ExecStart는 실행 파일의 절대 경로를 사용합니다.
systemd는 로그인 셸의 .bashrc를 읽어 명령을 실행하는 방식과 다르므로, 셸에서 설정한 JAVA_HOME만으로 서비스 런타임이 바뀐다고 가정하지 않습니다.
앱이나 하위 프로세스에서 JAVA_HOME을 사용하는 경우를 위해 같은 경로도 환경에 설정했습니다. [systemd 서비스 설정](https://www.freedesktop.org/software/systemd/man/latest/systemd.service.html), [systemd 실행 환경](https://www.freedesktop.org/software/systemd/man/latest/systemd.exec.html)

app.env에는 서비스의 환경변수를 준비합니다.
다음 파일을 운영 계정만 읽을 수 있도록 저장하고, 비밀번호 등 실제 값은 배포 환경의 시크릿 관리 방식을 따릅니다.

```ini title="app.env"
SPRING_PROFILES_ACTIVE=prod
SERVER_PORT=8080
```

```bash
chmod 600 /home/appuser/apps/my-app/app.env
sudo systemd-analyze verify /etc/systemd/system/my-app.service
sudo systemctl daemon-reload
sudo systemctl enable my-app.service
sudo systemctl restart my-app.service
sudo systemctl status my-app.service
sudo journalctl -u my-app.service --since '5 minutes ago' --no-pager
```

network-online.target은 시스템 네트워크 준비 순서를 정합니다.
DB나 Vault 같은 외부 서비스의 준비 완료를 보장하는 것은 아니므로 앱의 연결 오류와 재시도도 따로 확인합니다.
이 예제는 단일 프로세스를 재시작하므로 짧은 서비스 중단이 발생할 수 있습니다.
무중단이 필요하면 여러 인스턴스와 프록시 전환을 포함한 배포 절차를 사용합니다.

## 실행 중인 프로세스까지 확인합니다

```bash
systemctl show my-app.service --property=MainPID --value
```

출력된 PID가 1234라면 다음과 같이 실행 파일을 확인합니다.

```bash
sudo readlink -f /proc/1234/exe
```

결과가 새 JDK 경로의 bin/java를 가리키는지 확인합니다.
앱 기동 로그의 Java 빌드 번호, 준비 상태와 로그인 등 핵심 기능도 함께 검증합니다.
인증서, 암호화, 시간대 처리처럼 JDK 변경의 영향을 받을 수 있는 경로는 해당 서비스의 테스트에 포함합니다.

## JAR와 Java를 각각 되돌릴 수 있게 합니다

| 문제 | 되돌릴 대상 |
|---|---|
| 앱 코드 변경에서 오류 발생 | current를 검증한 이전 JAR 릴리스로 돌린 뒤 재시작합니다. |
| 새 JDK와 앱의 호환 문제 | ExecStart와 JAVA_HOME을 검증한 런타임으로 조정하고 daemon-reload 후 재시작합니다. |
| 두 가지를 함께 변경 | 검증했던 JAR와 JDK 조합을 배포 기록에서 선택합니다. |

이전 런타임에 알려진 취약점이 있으면 롤백이 해당 문제를 다시 노출할 수 있습니다.
복구 대상과 외부 노출 범위를 함께 판단합니다.
이전 JDK는 해당 런타임을 사용하는 프로세스가 남아 있는지 확인한 뒤 정리합니다.
Docker 방식의 같은 절차는 [이미지 버전과 다이제스트 고정](../../infrastructure/docker/image-tags-and-digest-pinning.md)에서 이어서 볼 수 있습니다.

## 자주 묻는 질문

### 터미널의 `java -version`과 서비스 Java가 다를 수 있나요?

다를 수 있습니다.
systemd는 로그인 셸의 `.bashrc`를 읽지 않으므로, ExecStart에 Java 절대 경로를 두고 `/proc/<pid>/exe`로 실행 중인 파일을 확인합니다.

### JAR는 그대로 두고 JDK만 바꿀 수 있나요?

가능합니다.
런타임과 앱 릴리스를 따로 기록하고, 새 JDK 경로로 기동과 핵심 기능을 검증한 뒤 서비스를 재시작합니다.

### 롤백은 JAR와 JDK를 어떻게 나눕니까?

앱 문제는 이전 JAR 릴리스의 current로, JDK 호환 문제는 검증한 ExecStart와 JAVA_HOME으로 되돌립니다.
이전 런타임에 알려진 취약점이 있으면 롤백 범위와 노출을 함께 판단합니다.
