---
id: knowledge-backend-notification-inbox-and-read-state
title: 알림함과 읽음 상태
description: "사용자별 알림함 데이터 모델과 목록, 미확인 건수, 읽음 처리 API를 정리합니다."
keywords:
  - 알림함
  - 읽음 상태
  - 미확인 알림
  - inbox
slug: "/knowledge/backend/notification/inbox-and-read-state"
tags:
  - backend
  - notification
status: active
---

# 알림함과 읽음 상태 설계

알림함은 사용자가 어떤 알림을 받았고 언제 읽었는지 기록하는 곳입니다.<br />
웹의 빨간 점과 모바일 앱의 알림 배지는 같은 알림함을 기준으로 계산합니다.<br />
휴대폰에서 마지막 알림을 읽으면 웹에서도 미확인 상태가 해제되는 구조입니다.

## 사용자별 알림을 저장합니다

개인별 알림이 대부분이라면 `notification` 테이블 하나로 시작할 수 있습니다.

| 컬럼 | 용도 |
|---|---|
| `id` | 알림 식별자 |
| `user_id` | 알림을 받은 사용자 |
| `type` | `APPROVAL_COMPLETED` 같은 알림 유형 |
| `title`, `body` | 알림함에 표시할 문구 |
| `target_type`, `target_id` | 알림을 눌렀을 때 열 대상 |
| `created_at` | 알림 생성 시각 |
| `read_at` | 읽은 시각. `NULL`이면 미확인 |

같은 공지를 여러 사용자에게 자주 보낸다면 공지 본문은 `notification`에 한 번 저장하고, 수신자와 읽음 상태는 `notification_recipient(notification_id, user_id, read_at)`에 둘 수 있습니다.<br />
알림 하나를 열 때 표시할 내용은 공유하고, 누가 읽었는지는 사용자별로 관리합니다.

## 빨간 점에는 `hasUnread`만 반환합니다

빨간 점을 켜는 데 필요한 값은 **안 읽은 알림이 하나라도 있는지**입니다.<br />
숫자 배지를 보여주는 화면이라면 별도로 미확인 개수를 조회할 수 있습니다.

```sql
SELECT EXISTS (
    SELECT 1
    FROM notification
    WHERE user_id = ?
      AND read_at IS NULL
) AS has_unread;
```

개인별 알림 테이블에서는 `(user_id, read_at)` 인덱스를 후보로 둘 수 있습니다.<br />
알림함 목록은 최신순으로 조회하고, 생성 시각이 같은 행도 순서가 일정하도록 `created_at DESC, id DESC`처럼 정렬합니다.

| API | 역할 |
|---|---|
| `GET /notifications` | 내 알림함 목록 조회 |
| `GET /notifications/unread-status` | 빨간 점에 필요한 `hasUnread` 조회 |
| `PATCH /notifications/{id}/read` | 내 알림 한 건 읽음 처리 |
| `PATCH /notifications/read-all` | 내 미확인 알림 모두 읽음 처리 |

읽음 처리에는 알림 ID와 인증된 사용자 ID를 함께 사용합니다.<br />
이미 읽은 알림을 다시 처리해도 최초 읽음 시각을 유지할 수 있도록 `read_at IS NULL`인 행만 갱신합니다.

알림 생성이나 읽음 처리가 커밋되면 수신 사용자에게 상태 변경을 알립니다.<br />
이후 웹 SSE나 모바일 푸시를 붙여도 알림함의 저장 구조와 조회 API를 그대로 사용할 수 있습니다.
