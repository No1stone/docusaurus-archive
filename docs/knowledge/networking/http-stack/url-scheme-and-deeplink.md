---
id: networking-http-url-scheme-and-deeplink
title: URL 스킴과 앱 딥링크
description: "URL 스킴이 주소를 어떻게 처리하는지, 커스텀 스킴과 Universal Links, App Links, Electron 딥링크를 정리합니다."
tags:
  - HTTP
  - deeplink
status: active
slug: /knowledge/networking/http-stack/url-scheme-and-deeplink
---

# URL 스킴과 앱 딥링크

`https://example.com/notifications/123`에서 `https`는 URL의 **스킴(scheme)**입니다.<br />
스킴은 첫 번째 콜론 앞에 있으며, 뒤에 오는 주소를 어떤 규칙으로 해석하고 처리할지 정합니다.

웹 주소에서는 `https://`가 익숙하지만, `mailto:help@example.com`처럼 `//` 없이 쓰는 스킴도 있습니다.<br />
콜론 뒤의 구조는 스킴마다 다릅니다.<br />
[RFC 3986의 URI 스킴](https://www.rfc-editor.org/rfc/rfc3986.html#section-3.1)

## 자주 만나는 URL 스킴

| 스킴 | 예시 | 처리 방식 |
|---|---|---|
| `http`, `https` | `https://example.com/api/notifications` | 브라우저나 HTTP 클라이언트가 서버에 요청 |
| `ws`, `wss` | `wss://example.com/socket` | WebSocket 연결 시작 |
| `file` | `file:///Users/demo/report.html` | 로컬 파일 참조 |
| `git` | `git://example.com/team/repo.git` | Git 전용 프로토콜로 저장소에 접근 |
| `ssh` | `ssh://git@example.com/team/repo.git` | SSH로 Git 저장소에 접근 |
| `mailto`, `tel` | `mailto:help@example.com` | 환경에 등록된 메일 앱이나 전화 기능으로 연결 |
| `data` | `data:text/plain,hello` | 주소 안에 데이터를 직접 포함 |
| `blob` | `URL.createObjectURL(file)`의 반환값 | 브라우저가 관리하는 `Blob`이나 `File`을 주소로 참조 |
| 앱 커스텀 스킴 | `myapp://open/notifications/123` | 운영체제에 등록된 앱으로 URL 전달 |

Git에서 `https://github.com/team/repo.git`를 쓰면 URL 스킴은 `https`입니다.<br />
`git@github.com:team/repo.git`는 Git이 지원하는 SCP 스타일의 SSH 주소입니다.<br />
Git 저장소에 접근할 때 같은 목적을 여러 주소 형식으로 표현할 수 있습니다.<br />
[Git 저장소 URL 형식](https://git-scm.com/docs/git-clone#_git_urls)

## 링크를 눌러 앱의 특정 화면을 엽니다

딥링크는 앱의 특정 콘텐츠나 화면으로 이동하는 링크입니다.<br />
알림을 누르면 앱의 홈 화면을 거치지 않고 해당 알림 상세로 들어가는 동작이 대표적입니다.

```text
myapp://open/notifications/123

scheme   myapp
host     open
path     /notifications/123
```

1. 운영체제가 `myapp`을 처리하도록 등록된 앱을 찾습니다.
2. 앱이 전달받은 URL에서 `/notifications/123`을 읽고 화면 경로와 알림 ID를 확인합니다.
3. 로그인과 조회 권한을 확인한 뒤 알림 상세 화면을 엽니다.

| 방식 | 플랫폼에서 연결하는 방법 |
|---|---|
| **커스텀 스킴** `myapp://…` | iOS, Android, Windows 등에 앱이 처리할 스킴을 등록 |
| **iOS Universal Links** `https://…` | 앱과 웹 도메인의 연결을 설정 |
| **Android App Links** `https://…` | Android가 앱과 웹 도메인의 연결을 검증 |
| **Electron 딥링크** `myapp://…` | `app.setAsDefaultProtocolClient()`로 외부 링크를 받을 앱을 등록 |

HTTPS 주소를 쓰면 웹에서도 같은 주소를 열 수 있습니다.<br />
앱과 도메인의 연결이 설정된 환경에서는 운영체제가 해당 앱의 화면으로 연결할 수 있습니다.<br />
커스텀 스킴을 쓸 때는 설치된 앱이 그 스킴을 처리할 수 있어야 합니다.<br />
[Apple Associated Domains](https://developer.apple.com/documentation/xcode/supporting-associated-domains), [Android App Links](https://developer.android.com/training/app-links), [Windows URI 활성화](https://learn.microsoft.com/en-us/windows/apps/develop/launch/handle-uri-activation), [Electron 딥링크](https://www.electronjs.org/docs/latest/tutorial/launch-app-from-url-in-another-app)

Electron에서는 **외부 링크로 앱을 실행하는 등록**과 **앱 내부에서 `app://` 같은 주소로 리소스를 읽는 등록**을 각각 할 수 있습니다.<br />
외부 링크는 `app.setAsDefaultProtocolClient()`로 운영체제에 등록하고, 내부 리소스 요청은 `protocol.handle()`로 Electron 안에서 처리합니다.<br />
[Electron Protocol API](https://www.electronjs.org/docs/latest/api/protocol)

딥링크에 있는 `123`은 열어볼 알림을 지정합니다.<br />
해당 알림을 읽을 수 있는지는 서버가 로그인한 사용자를 기준으로 확인합니다.
