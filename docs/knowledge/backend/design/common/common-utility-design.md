---
id: common-utility-design
title: "공통 유틸리티 설계"
description: "JSON 변환과 객체 매핑처럼 같은 동작을 기대하는 호출부를 기준으로 공통 유틸리티를 두고, 용도별 설정과 의도를 구분하는 방법을 정리합니다."
keywords:
  - 공통 유틸리티
  - JSON 변환
  - 객체 매핑
  - lib-common
tags:
  - backend
  - utility
  - json
status: active
sidebar_position: 5
slug: "/knowledge/backend/common/common-utility-design"
---

# 공통 유틸리티 설계

여러 코드가 JSON을 문자열로 바꾸거나 객체 필드를 복사할 때, 같은 동작과 설정을 반복한다면 공통으로 둘 수 있습니다.<br />
예를 들어 여러 곳에서 로그용 JSON을 만든다면 날짜 형식이나 변환 실패 처리 방식을 한곳에 두고 재사용할 수 있습니다.

공통화하기 전에 **호출부가 실제로 같은 동작을 기대하는지** 확인합니다.<br />
API 응답과 NDJSON 파일은 모두 JSON을 사용하지만, NDJSON에서는 레코드 한 건이 한 줄에 들어가야 합니다.<br />
변환 진입점을 한곳에 모으더라도 용도별 설정은 따로 관리할 수 있습니다.

객체 매핑도 같은 기준으로 봅니다.<br />
이름이 같은 필드를 옮기는 동작은 재사용할 수 있지만, 수정 요청에서 `null`이 **기존 값을 유지하라는 뜻인지, 값을 비우라는 뜻인지**는 기능이 결정합니다.<br />
공통 매핑 API가 두 동작을 표현할 수 있다면 호출부에서 의도를 드러낼 수 있습니다.

유틸리티의 이름과 입력만 보고 처리 결과를 예상할 수 있어야 합니다.<br />
JSON 파싱에 실패하면 예외를 전달하는지, 기본값을 돌려주는지처럼 여러 호출부가 의존할 동작은 공통 구현의 테스트로 고정합니다.

JSON 변환 구현 메모는 [JSON Utils](/docs/knowledge/backend/java/json-utils)를 봅니다.
