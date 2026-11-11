---
id: knowledge-backend-notification-mobile-and-web-push
title: 모바일 앱 푸시와 웹 푸시
description: "FCM, APNs 기기 토큰과 Web Push 구독, 권한 관리를 정리합니다."
slug: "/knowledge/backend/notification/mobile-and-web-push"
tags:
  - backend
  - notification
  - push
status: active
---

# 모바일 앱 푸시와 웹 푸시 설계

푸시는 사용자가 서비스를 보고 있지 않을 때 새 소식을 알려주는 채널입니다.<br />
예를 들어 배송 완료 알림을 알림함에 저장하고, 앱이 백그라운드에 있는 사용자에게는 운영체제 알림을 보낼 수 있습니다.<br />
사용자가 알림을 누르면 앱에서 해당 배송 내역을 엽니다.

## 앱과 브라우저마다 수신 주소가 있습니다

| 채널 | 서버가 관리하는 값 | 전달 흐름 |
|---|---|---|
| 모바일 앱 푸시 | 앱 설치 단위의 FCM 또는 APNs 토큰 | 서버 → FCM, APNs → 모바일 앱 |
| 웹 푸시 | 브라우저의 푸시 구독 정보 | 서버 → 브라우저 푸시 서비스 → Service Worker |

사용자 한 명이 휴대폰과 태블릿을 같이 쓰면 푸시 수신 주소도 여러 개입니다.<br />
서버에서는 `user_id`, `channel`, `installation_id`, 토큰 또는 구독 정보, 갱신 시각을 관리합니다.<br />
앱이 새 토큰을 받으면 서버에 갱신하고, 발송 서비스가 토큰이 유효하지 않다고 응답하면 해당 수신 주소를 정리합니다.<br />
공용 기기에서 계정을 바꿀 수 있다면 로그아웃 시 기존 사용자와 설치 단위의 연결도 해제합니다.<br />
[FCM 토큰 관리](https://firebase.google.com/docs/cloud-messaging/manage-tokens), [Apple APNs 등록](https://developer.apple.com/documentation/usernotifications/registering-your-app-with-apns)

웹 푸시는 브라우저에서 사용자 권한을 받아 구독합니다.<br />
페이지가 열려 있지 않을 때도 지원 환경에서는 Service Worker가 메시지를 받아 알림을 표시할 수 있습니다.<br />
사용 중인 화면의 빨간 점은 알림함 조회와 SSE 같은 인앱 전달 흐름으로 갱신합니다.<br />
[FCM 웹 메시지 수신](https://firebase.google.com/docs/cloud-messaging/web/receive-messages)

## 발송과 읽음 처리를 구분합니다

알림을 DB에 저장한 뒤 사용자의 채널 설정과 등록된 기기를 확인해 푸시를 보냅니다.<br />
푸시를 누르면 `notificationId`나 화면 이동 정보를 사용해 해당 화면을 엽니다.<br />
읽음은 사용자가 알림을 열거나 읽음 처리 API를 호출할 때 기록합니다.

푸시 제공자가 요청을 수락한 시점, 기기에 알림이 표시된 시점, 사용자가 확인한 시점은 각각 다릅니다.<br />
원셋에서는 **발송 요청 결과와 사용자 읽음 상태를 별도로 관리**하면 됩니다.<br />
푸시 발송에 실패해도 앱을 열었을 때 알림함에서 같은 내용을 볼 수 있습니다.

| 원셋 검증 | 확인할 동작 |
|---|---|
| 기기 두 대를 등록한 사용자에게 발송 | 활성 수신 주소 두 곳으로 발송 요청 |
| 앱 토큰이 바뀐 뒤 발송 | 갱신된 토큰 사용 |
| 푸시 권한이 없거나 토큰이 만료됨 | 알림함에서 알림 조회 가능 |
| 알림을 눌러 앱으로 진입 | 관련 화면을 열고 읽음 처리 기준에 따라 알림함 상태 갱신 |
