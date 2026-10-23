#!/usr/bin/env python3
"""Supplement Notion-migrated incomplete/link stub docs. Work notes stay out of body."""
from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DOCS = ROOT / "docs"
MAPPING = DOCS / "harness/history/notion-import-mapping.json"
QUEUE = Path("/tmp/notion_supplement_queue.json")
URL_META = Path("/tmp/notion_url_meta.json")

Ref = tuple[str, str]  # description, body without H1


def body(desc: str, overview: str, sections: str, refs: list[str] | None = None) -> Ref:
    parts = [f"> **개요:** {overview}", "", sections.rstrip()]
    if refs:
        parts += ["", "## 참고", ""]
        parts += [f"- {r}" for r in refs]
    return desc, "\n".join(parts).strip()


INCOMPLETE: dict[str, Ref] = {}


def add(title: str, desc: str, overview: str, sections: str, refs: list[str] | None = None) -> None:
    INCOMPLETE[title] = body(desc, overview, sections, refs)


# --- curated incomplete ---
add(
    "AWS CloudFront",
    "CloudFront CDN 역할과 관련 용어 문서 안내",
    "Amazon CloudFront는 콘텐츠를 엣지 로케이션에 캐시해 사용자와 가까운 곳에서 응답하는 CDN입니다.",
    """## 이 글에서 다루는 범위

배포(distribution)에 오리진을 연결하고 캐시·HTTPS·접근 제어를 설정하는 개념입니다.
상세 용어 메모는 [AWS CloudFront Info 용어](./aws-cloudfront-info-용어.md)에 있습니다.

## 확인할 것

- 오리진과 뷰어 프로토콜 정책
- 캐시 키·TTL·무효화
- 서명 URL/쿠키, OAC/OAI""",
    ["[CloudFront 개발자 안내서](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Introduction.html)"],
)
add(
    "Aws Ec2",
    "EC2 인스턴스 기본과 관련 운영 메모 연결",
    "Amazon EC2는 가상 서버 인스턴스를 제공하는 컴퓨트 서비스입니다.",
    """AMI·인스턴스 유형·키 페어·보안 그룹·서브넷을 정해 기동합니다.
Docker Compose 경로 메모는 [AWS EC2 Docker Compose 경로](./aws-ec2-docker-compose-경로.md)를 참고합니다.

## 확인할 것

- VPC·서브넷·퍼블릭 IP
- 보안 그룹 인바운드
- EBS 볼륨과 스냅샷""",
    ["[EC2 사용 설명서](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/concepts.html)"],
)
add(
    "Aws S3",
    "S3 버킷·객체 저장 기본과 관련 문서 안내",
    "Amazon S3는 객체 스토리지입니다. 버킷에 객체를 키로 저장합니다.",
    """구조 메모는 [AWS S3 구조](./aws-s3-구조.md), API 범위는 [Amazon S3 API Reference 안내](./amazon-s3-api-reference.md)를 참고합니다.

## 확인할 것

- 버킷 정책과 IAM
- 퍼블릭 액세스 차단
- 스토리지 클래스·수명 주기""",
    ["[S3 사용 설명서](https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html)"],
)
add(
    "Aws SES",
    "SES 이메일 발송·도메인 검증 기본",
    "Amazon SES는 애플리케이션에서 이메일을 보내고 받을 때 쓰는 서비스입니다.",
    """샌드박스에서는 검증된 주소로만 보낼 수 있습니다.
도메인·DKIM 검증과 반송·Complaint 처리를 함께 설계합니다.
용어 메모는 [AWS SES Info 용어](./aws-ses-info-용어.md)를 참고합니다.""",
    ["[SES 개발자 안내서](https://docs.aws.amazon.com/ses/latest/dg/Welcome.html)"],
)
add(
    "AWS OperationSever",
    "운영 서버를 EC2 등에서 둘 때 확인할 항목",
    "운영 서버는 애플리케이션·프록시·모니터링이 실제로 돌아가는 호스트입니다.",
    """## 확인할 것

- OS·패키지 업데이트 정책
- 프로세스 관리(systemd, Docker)
- 로그 수집과 디스크 용량
- 백업·복구와 접근 통제(SSH, 보안 그룹)""",
)
add(
    "AWS_Ec2 docker-compose 경로",
    "EC2에서 Docker Compose 파일을 두는 경로 관례",
    "EC2에 Compose로 스택을 올릴 때는 파일 위치와 절대·상대 경로를 문서화합니다.",
    """상세 메모는 [AWS EC2 Docker Compose 경로](./aws-ec2-docker-compose-경로.md)에 있습니다.

## 확인할 것

- `docker-compose.yml` 위치와 작업 디렉터리
- 볼륨 마운트 호스트 경로
- 환경 변수 파일(`.env`) 위치와 권한""",
)
add(
    "aws Kendra",
    "Amazon Kendra 지능형 검색 서비스 개요",
    "Amazon Kendra는 기업 문서·데이터 소스를 연결해 자연어 검색을 제공하는 서비스입니다.",
    """인덱스에 데이터 소스를 연결하고, 검색 API로 질의합니다.
권한·문서 메타데이터·동기화 주기를 설계 포인트로 둡니다.""",
    ["[Amazon Kendra 개발자 안내서](https://docs.aws.amazon.com/kendra/latest/dg/what-is-kendra.html)"],
)
add(
    "ec2",
    "EC2 단축 메모 — Aws Ec2 문서와 동일 축",
    "EC2는 AWS의 가상 서버입니다. 자세한 정리는 [Aws Ec2](./aws-ec2.md)를 봅니다.",
    """인스턴스 기동, 보안 그룹, 스토리지만 빠르게 확인할 때 이 글을 진입점으로 씁니다.""",
)
add(
    "vpc",
    "VPC 네트워크 격리와 서브넷·라우팅 기본",
    "Amazon VPC는 클라우드 안의 논리 네트워크입니다.",
    """퍼블릭·프라이빗 서브넷, 라우트 테이블, 인터넷 게이트웨이·NAT를 조합합니다.
원문 「생성순서」처럼 한 줄만 있는 메모는 [불명 보류 목록](../harness/history/notion-import-unclear-holds.md)에 있습니다.""",
    ["[Amazon VPC 사용 설명서](https://docs.aws.amazon.com/vpc/latest/userguide/what-is-amazon-vpc.html)"],
)
add(
    "Postgresql info",
    "PostgreSQL 역할과 기본 운영 포인트",
    "PostgreSQL은 관계형 데이터베이스입니다.",
    """연결 정보(호스트·포트·DB·역할·SSL)를 문서화하고, 백업은 `pg_dump` 또는 스냅샷 전략을 고릅니다.
데이터 타입 메모는 [Postgresql DataType](./postgresql-datatype.md)을 참고합니다.""",
    ["[PostgreSQL 문서](https://www.postgresql.org/docs/current/)"],
)
add(
    "Postgresql DataType",
    "PostgreSQL 주요 데이터 타입 선택 기준",
    "컬럼 타입은 저장 크기·인덱스·비교 규칙에 영향을 줍니다.",
    """## 자주 쓰는 축

- 문자: `text`, `varchar`
- 숫자: `integer`, `bigint`, `numeric`
- 시간: `timestamptz` 권장 경우가 많음
- JSON: `jsonb`

타입을 바꾼 뒤에는 인덱스·캐스트·ORM 매핑을 함께 확인합니다.""",
    ["[Data Types](https://www.postgresql.org/docs/current/datatype.html)"],
)
add(
    "Spring Rest",
    "Spring REST API 계층과 응답 규칙",
    "Spring MVC 또는 WebFlux로 HTTP API를 만들 때 컨트롤러·서비스·직렬화·상태 코드를 맞춥니다.",
    """`@RestController`로 JSON을 내고, `@Valid`와 `@ControllerAdvice`로 검증·예외를 통일합니다.""",
    ["[Building a RESTful Web Service](https://spring.io/guides/gs/rest-service/)"],
)
add(
    "elk",
    "Elasticsearch, Logstash, Kibana 스택 개요",
    "ELK는 검색·수집·시각화 조합을 가리키는 말입니다.",
    """로그 포맷·타임존·인덱스 수명 주기를 먼저 정합니다.
링크 자료는 [elk log](./elk-log.md), Logstash 연동은 [springboot logstash](./springboot-logstash.md)를 참고합니다.""",
    ["[Elastic 문서](https://www.elastic.co/guide/index.html)"],
)
add(
    "제네릭 타입 설명",
    "Java 제네릭 타입 매개변수와 소거",
    "제네릭은 컴파일 타임 타입 검사로 캐스팅을 줄입니다.",
    """타입 매개변수로 API를 재사용하고, 런타임 타입 소거 제약을 이해합니다.
와일드카드(`? extends` / `? super`)로 읽기·쓰기 경계를 표현합니다.""",
    ["[Generics Tutorial](https://docs.oracle.com/javase/tutorial/java/generics/index.html)"],
)
add(
    "Json",
    "JSON 형식과 API 본문에서의 쓰임",
    "JSON은 이름·값 쌍과 배열로 구조를 표현하는 텍스트 형식입니다.",
    """트레일링 쉼표는 표준 JSON에서 허용되지 않습니다.
Java에서는 Jackson·Gson 등으로 직렬화합니다.""",
    ["[json.org](https://www.json.org/json-en.html)"],
)
add(
    "My sql",
    "MySQL 서버·스키마 기본",
    "MySQL은 관계형 데이터베이스이며 InnoDB를 많이 씁니다.",
    """문자셋·격리 수준·인덱스가 성능과 정합성에 영향을 줍니다.
최적화 링크는 [MySql Optimization](./mysql-optimization.md)을 참고합니다.""",
    ["[MySQL 8.0 매뉴얼](https://dev.mysql.com/doc/refman/8.0/en/)"],
)
add(
    "Rest Create",
    "REST 리소스 생성(POST) 규칙",
    "새 리소스는 보통 컬렉션 URL에 `POST`합니다.",
    """성공 시 `201 Created`와 `Location` 또는 본문을 반환하는 패턴이 흔합니다.
멱등이 필요하면 클라이언트 식별자나 Idempotency-Key를 검토합니다.""",
    ["[MDN POST](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/POST)"],
)
add(
    "Security",
    "인증·인가·전송 보호의 기본 축",
    "인증, 인가, HTTPS, 입력 검증을 구분해 설계합니다.",
    """세션과 토큰 중 무엇을 쓸지, CSRF·XSS·주입을 어떻게 막을지가 포인트입니다.""",
    ["[OWASP Top Ten](https://owasp.org/www-project-top-ten/)", "[Spring Security](https://docs.spring.io/spring-security/reference/index.html)"],
)
add(
    "URI브라우저 흐름",
    "브라우저가 URI를 해석해 요청을 보내기까지",
    "스킴·호스트·경로 해석 → DNS → TCP/TLS → HTTP 요청 순으로 진행됩니다.",
    """캐시·HSTS·리다이렉트·CORS는 이 흐름 위의 추가 규칙입니다.
짧은 네트워크 메모(dns, udp)는 [불명 보류 목록](../harness/history/notion-import-unclear-holds.md)에 있습니다.""",
    ["[How the web works](https://developer.mozilla.org/en-US/docs/Learn/Getting_started_with_the_web/How_the_Web_works)"],
)
add(
    "Webex",
    "Webex 봇·REST 개발 진입점",
    "Cisco Webex 개발자 포털에서 봇과 REST API를 제공합니다.",
    """이어지는 링크 자료: [Webex RestAPI](./webex-restapi.md), [Bot](./bot.md).""",
    ["[Webex for Developers](https://developer.webex.com/)"],
)
add(
    "port",
    "TCP/UDP 포트와 방화벽에서의 의미",
    "포트는 한 호스트에서 서비스를 나누는 논리 번호입니다.",
    """잘 알려진 포트와 ephemeral 포트를 구분하고, 필요한 인바운드만 엽니다.""",
    ["[IANA 포트 레지스트리](https://www.iana.org/assignments/service-names-port-numbers/service-names-port-numbers.xhtml)"],
)
add(
    "접속정보생성",
    "접속 정보 문서에 적을 항목",
    "호스트·포트·프로토콜·계정·비밀 저장 위치를 함께 적습니다.",
    """비밀번호·토큰은 Secret 저장소에 두고 문서에는 참조 키만 남깁니다.
예제 비밀번호와 실제 Secret은 구분합니다.""",
)
add(
    "GoogleDialogFlow",
    "Dialogflow 대화 에이전트 개요",
    "인텐트·엔티티·풀필먼트로 대화형 에이전트를 만듭니다.",
    """ES와 CX 제품을 구분하고, 웹훅으로 백엔드를 연결합니다.
인증 JSON 읽기 메모는 [JsonFile읽는법(DialogFlowAuth)](./jsonfile읽는법dialogflowauth.md)를 참고합니다.""",
    ["[Dialogflow 문서](https://cloud.google.com/dialogflow/docs)"],
)
add(
    "JPA Core concepts",
    "JPA 엔티티와 영속성 컨텍스트",
    "JPA는 객체와 테이블을 매핑하는 명세입니다.",
    """엔티티, 영속성 컨텍스트, 엔티티 매니저가 핵심입니다.
지연 로딩·N+1을 의식해 조회를 설계합니다.""",
    ["[Jakarta Persistence](https://jakarta.ee/specifications/persistence/)"],
)
add(
    "PubSub",
    "발행-구독 메시징 모델",
    "발행자가 토픽에 넣고 구독자가 소비하는 비동기 모델입니다.",
    """점대점 큐와 달리 여러 구독자가 같은 이벤트를 받을 수 있습니다.
Redis 구현 메모는 [RedisPubSub](./redispubsub.md)를 참고합니다.""",
)
add(
    "@Lazy",
    "Spring @Lazy 지연 초기화",
    "`@Lazy`는 빈을 실제 사용 시점까지 초기화하지 않도록 합니다.",
    """순환 참조 완화나 무거운 빈의 기동 지연에 씁니다.
프록시가 생기므로 자기 호출·직렬화 시 주의합니다.""",
    ["[Lazy-initialized beans](https://docs.spring.io/spring-framework/reference/core/beans/dependencies/factory-lazy-init.html)"],
)
add(
    "@PostConstruct Predestroy 초기화 폐기",
    "빈 초기화·폐기 콜백",
    "`@PostConstruct`는 의존성 주입 직후, `@PreDestroy`는 컨테이너 종료 전에 호출됩니다.",
    """생성자만으로 부족할 때 자원 확보·해제를 둡니다.
`InitializingBean` / `DisposableBean`과 역할이 겹칠 수 있어 한쪽으로 통일하는 편이 읽기 쉽습니다.""",
)
add(
    "@Required",
    "필수 의존성 표시의 역사적 메모",
    "과거 Spring의 `@Required`는 setter 주입 필수 여부를 표시했습니다.",
    """최근에는 생성자 주입과 컴파일 타임 검증을 더 흔히 씁니다.
새 코드에서는 생성자 주입을 우선 검토합니다.""",
)
add(
    "Addinterceptors",
    "Spring MVC 인터셉터 등록",
    "`WebMvcConfigurer#addInterceptors`로 핸들러 전후에 횡단 로직을 둡니다.",
    """인증 체크·로깅·실행 시간 측정에 쓰입니다.
경로 패턴 include/exclude를 명시합니다.
관련: [HandlerIntercepter](./handlerintercepter.md).""",
)
add(
    "HandlerIntercepter",
    "HandlerInterceptor 콜백 시점",
    "`preHandle` → 컨트롤러 → `postHandle` → 뷰 → `afterCompletion` 순입니다.",
    """`preHandle`에서 `false`를 반환하면 이후 처리를 막습니다.
리액티브 스택에서는 WebFilter를 씁니다.""",
)
add(
    "Caching Annotation",
    "Spring Cache 애노테이션",
    "`@Cacheable`, `@CachePut`, `@CacheEvict`로 메서드 결과를 캐시합니다.",
    """캐시 이름·키·TTL(저장소별)을 정하고, 분산 환경에서는 일관성을 검토합니다.""",
    ["[Cache Abstraction](https://docs.spring.io/spring-framework/reference/integration/cache.html)"],
)
add(
    "Cashing",
    "캐싱 일반 개념(표기 메모)",
    "캐시는 비싼 결과를 잠시 저장해 응답을 빠르게 합니다.",
    """원문 제목 표기(Cashing)를 유지합니다.
Spring 애노테이션은 [Caching Annotation](./caching-annotation.md)을 참고합니다.""",
)
add(
    "CentOs",
    "CentOS·호환 배포판 운영 메모",
    "CentOS는 RHEL 계열 패키지 관리(`yum`/`dnf`)를 쓰는 배포판 계열입니다.",
    """스트림·후속 배포(Rocky, Alma 등) 중 무엇을 쓰는지는 환경에 따릅니다.
제목만 있던 `centos` 보류 항목과 구분해, 여기에는 일반 운영 포인트만 둡니다.""",
)
add(
    "DATA JPA Rerference",
    "Spring Data JPA 레퍼런스 진입",
    "Spring Data JPA는 리포지토리 인터페이스로 흔한 질의·저장을 제공합니다.",
    """메서드 이름 질의, `@Query`, 페이징·정렬이 핵심입니다.
링크 자료 [Spring DATA JPA](./spring-data-jpa.md)와 함께 봅니다.""",
    ["[Spring Data JPA](https://docs.spring.io/spring-data/jpa/reference/)"],
)
add(
    "DATABASE",
    "애플리케이션과 데이터베이스 역할 구분",
    "데이터베이스는 持久화·질의·트랜잭션의 기준 저장소입니다.",
    """스키마 소유권, 마이그레이션(Flyway/Liquibase), 연결 풀, 백업을 애플리케이션 배포와 같이 설계합니다.""",
)
add(
    "Exame Boot,Security,Jwt,RestAPI",
    "Boot·Security·JWT·REST 예제 학습 축",
    "Spring Boot로 REST를 만들고 Security와 JWT로 보호하는 학습용 묶음입니다.",
    """원문 철자(Exame)를 유지합니다.
인증 필터·토큰 만료·권한 클레임을 순서대로 맞춥니다.
예제 비밀번호는 따라 하기용이며 실제 Secret과 구분합니다.""",
)
add(
    "GIT",
    "Git 기본 작업 흐름",
    "Git은 분산 버전 관리 시스템입니다.",
    """커밋·브랜치·머지/리베이스·원격(`push`/`pull`)이 일상 흐름입니다.
히스토리 재정리가 필요하면 [GIT FilterRepo](./git-filterrepo.md)를 참고합니다.""",
    ["[Git Book](https://git-scm.com/book/en/v2)"],
)
add(
    "GIT FilterRepo",
    "git-filter-repo로 히스토리 정리",
    "`git-filter-repo`는 대용량·민감 파일을 히스토리에서 제거할 때 쓰는 도구입니다.",
    """강제 푸시가 필요해질 수 있으므로 공유 브랜치에서는 팀과 합의합니다.""",
    ["[git-filter-repo](https://github.com/newren/git-filter-repo)"],
)
add(
    "Gson To Json",
    "Gson으로 객체를 JSON 문자열로",
    "Google Gson의 `toJson` / `fromJson`으로 변환합니다.",
    """날짜·널 필드·필드 명명 전략(`FieldNamingPolicy`)을 맞춥니다.""",
)
add(
    "HTTP",
    "HTTP 요청·응답의 기본",
    "HTTP는 메서드·상태 코드·헤더·본문으로 자원을 다룹니다.",
    """관련: [Http Request Method](./http-request-method.md), [CONTENT (MIME) TYPE](./content-mime-type.md).""",
    ["[MDN HTTP](https://developer.mozilla.org/en-US/docs/Web/HTTP)"],
)
add(
    "Http Request Method",
    "HTTP 메서드 의미",
    "`GET`·`POST`·`PUT`·`PATCH`·`DELETE` 등의 관례적 의미를 맞춥니다.",
    """안전·멱등 여부를 API 설계와 캐시에 반영합니다.""",
)
add(
    "Http is All",
    "HTTP가 웹·API 통신의 공통 기반이라는 메모",
    "브라우저·모바일·서버 간 API 대부분이 HTTP 위에 올라갑니다.",
    """버전(1.1/2/3), TLS, 프록시 헤더(`X-Forwarded-*`)를 운영에서 함께 봅니다.""",
)
add(
    "Java",
    "Java 언어·런타임 개요",
    "Java는 JVM에서 돌아가는 정적 타입 언어입니다.",
    """버전(LTS), 빌드 도구(Maven/Gradle), 모듈 관리를 프로젝트마다 고정합니다.
관련: [java](./java.md), [SDKMAN](./sdkman.md).""",
)
add(
    "java",
    "Java 단축 진입 메모",
    "언어·JDK 설치·버전 전환의 짧은 진입점입니다.",
    """상세 개념은 [Java](./java.md), 버전 전환은 [SDKMAN](./sdkman.md)을 봅니다.""",
)
add(
    "JsonFile읽는법(DialogFlowAuth)",
    "Dialogflow 서비스 계정 JSON 읽기",
    "서비스 계정 키 JSON을 파일에서 읽어 클라이언트에 주입합니다.",
    """키 파일은 저장소에 커밋하지 말고 환경 변수·시크릿으로 주입합니다.""",
)
add(
    "Linux",
    "Linux 서버 운영 기본",
    "프로세스·파일 권한·패키지·로그가 일상 운영의 축입니다.",
    """관련: [ubuntu](./ubuntu.md), [ CentOs](./centos.md), [ssh](./ssh.md).""".replace(" [ CentOs]", " [CentOs]"),
)
add(
    "MYSQL CLI",
    "mysql 클라이언트 CLI 사용",
    "`mysql` CLI로 SQL을 실행하고 결과를 확인합니다.",
    """접속: `mysql -h HOST -u USER -p`.
스크립트는 `source file.sql` 또는 리다이렉션을 씁니다.""",
)
add(
    "Message",
    "메시징·알림 메시지 추상화 메모",
    "시스템 간 메시지와 사용자 알림 메시지를 구분해 설계합니다.",
    """큐·브로커·웹훅 중 전달 수단을 고르고, 재시도와 중복을 정의합니다.""",
)
add(
    "No1Stone Start Page",
    "Notion 시작 페이지(보관용 제목)",
    "원본 Notion 워크스페이스의 시작 페이지 제목입니다.",
    """아카이브에서는 하위 Knowledge·Architecture 문서로 내용이 나뉘어 있습니다.
이 글은 진입 제목만 보존합니다.""",
)
add(
    "Pulsar",
    "Apache Pulsar 메시징 개요",
    "Pulsar는 토픽·구독·멀티 테넌시를 지원하는 분산 메시징 시스템입니다.",
    """브로커와 BookKeeper 저장을 분리하는 구조가 특징입니다.""",
    ["[Pulsar 문서](https://pulsar.apache.org/docs/)"],
)
add(
    "R2dbc",
    "R2DBC 리액티브 DB 접근",
    "R2DBC는 논블로킹 데이터베이스 드라이버 API입니다.",
    """Spring Data R2DBC와 함께 쓰며, 트랜잭션·스키마 제약를 JDBC와 비교해 확인합니다.
예제 비밀번호 리터럴은 따라 하기용으로 유지합니다.""",
    ["[R2DBC](https://r2dbc.io/)"],
)
add(
    "Reactive Streame API",
    "Reactive Streams 스펙",
    "Publisher·Subscriber·Subscription·Processor로 백프레셔를 정의합니다.",
    """원문 철자(Streame)를 유지합니다.
Reactor의 `Flux`/`Mono`가 이 모델 위에 있습니다.""",
    ["[Reactive Streams](https://www.reactive-streams.org/)"],
)
add(
    "Redis",
    "Redis 인메모리 저장소 개요",
    "Redis는 키-값 인메모리 저장소이며 캐시·세션·간단 큐에 쓰입니다.",
    """영속성(RDB/AOF)·만료·클러스터 모드를 운영에서 정합니다.
Pub/Sub은 [RedisPubSub](./redispubsub.md)를 참고합니다.""",
    ["[Redis 문서](https://redis.io/docs/)"],
)
add(
    "RedisPubSub",
    "Redis Pub/Sub",
    "채널에 publish하고 subscribe로 수신합니다.",
    """메시지 내구성이 필요하면 Streams나 외부 브로커를 검토합니다.""",
)
add(
    "Replication",
    "데이터베이스 복제",
    "복제는 읽기 확장·가용성을 위해 복제본을 두는 기법입니다.",
    """비동기·반동기 차이와 페일오버 절차를 문서화합니다.""",
)
add(
    "RestAPI",
    "REST API 설계 메모(미완성 원문 보완)",
    "자원 URL·HTTP 메서드·상태 코드·표현(JSON)을 맞춥니다.",
    """Webex 쪽 링크 자료 [RestAPI](./restapi.md)와 제목이 겹칠 수 있으니, 링크 글은 외부 문서 안내용입니다.""",
)
add(
    "Router Functions info",
    "WebFlux RouterFunction",
    "어노테이션 컨트롤러 대신 함수형 엔드포인트로 라우팅합니다.",
    """`RouterFunctions.route`와 `HandlerFunction` 조합이 기본입니다.""",
    ["[WebFlux functional](https://docs.spring.io/spring-framework/reference/web/webflux-functional.html)"],
)
add(
    "SDKMAN",
    "SDKMAN으로 JDK 등 SDK 관리",
    "SDKMAN은 JDK·빌드 도구 버전을 사용자 환경에 설치·전환합니다.",
    """`sdk install` / `sdk use`로 프로젝트별 Java 버전을 맞춥니다.""",
    ["[SDKMAN](https://sdkman.io/)"],
)
add(
    "Select hibernate",
    "Hibernate SELECT·조회 전략",
    "엔티티 조회 시 SQL SELECT와 페치 전략이 성능을 좌우합니다.",
    """N+1을 줄이려면 fetch join·EntityGraph·배치 사이즈를 검토합니다.""",
)
add(
    "Sending emails programmatically",
    "코드에서 이메일 보내기",
    "SMTP 또는 클라우드 API(SES 등)로 발송합니다.",
    """자격 증명·템플릿·반송 처리를 애플리케이션 설정과 분리합니다.
AWS는 [Aws SES](./aws-ses.md)를 참고합니다.""",
)
add(
    "Spring Bean Scope",
    "Spring 빈 스코프",
    "`singleton`, `prototype`, `request`, `session` 등이 있습니다.",
    """기본은 싱글톤입니다. 상태 있는 빈은 스코프와 동시성을 함께 검토합니다.""",
)
add(
    "Spring Core",
    "Spring Framework 코어 IoC",
    "IoC 컨테이너가 빈을 생성·주입·생명주기를 관리합니다.",
    """관련: [Spring Bean Scope](./spring-bean-scope.md), [Spring MVC](./spring-mvc.md).""",
)
add(
    "Spring MVC",
    "Spring MVC 요청 처리",
    "DispatcherServlet이 핸들러 매핑·어댑터·뷰 처리를 조율합니다.",
    """REST만 쓰면 뷰 대신 메시지 컨버터가 JSON을 담당합니다.""",
)
add(
    "Streams API",
    "Java Streams API",
    "컬렉션을 선언적으로 map·filter·reduce 처리합니다.",
    """지연 연산과 병렬 스트림의 부작용·순서 보장을 이해합니다.""",
)
add(
    "Token",
    "인증 토큰 개념",
    "액세스 토큰·리프레시 토큰으로 API 호출을 인증합니다.",
    """저장 위치(쿠키·헤더)·만료·폐기 목록을 설계합니다.
실제 토큰 값은 문서에 넣지 않습니다.""",
)
add(
    "TypeException",
    "타입·변환 예외 메모",
    "잘못된 캐스팅·역직렬화·제네릭 경계에서 타입 관련 예외가 납니다.",
    """입력 검증과 명확한 에러 응답으로 클라이언트에 원인을 전달합니다.""",
)
add(
    "URI",
    "URI 구성 요소",
    "스킴, 권한(호스트·포트), 경로, 질의, 프래그먼트로 이뤄집니다.",
    """인코딩 규칙과 URL과의 관계(URI 하위)를 구분합니다.""",
    ["[RFC 3986](https://www.rfc-editor.org/rfc/rfc3986)"],
)
add(
    "UTIL",
    "유틸리티 모음 진입 메모",
    "원본 Notion의 UTIL 영역 진입 제목입니다.",
    """개별 도구 글(GIT, ssh, openssl 등)로 내용이 나뉩니다.""",
)
add(
    "WORK",
    "작업·워크스페이스 메모 진입",
    "원본 WORK 영역 제목입니다.",
    """운영·배포 관련 하위 메모로 연결합니다.""",
)
add(
    "Webflux",
    "Spring WebFlux 리액티브 웹",
    "논블로킹 스택으로 HTTP 서비스를 만듭니다.",
    """`Mono`/`Flux`, 스케줄러, 백프레셔를 이해합니다.
보안은 WebfluxSecurity 링크 자료를 참고합니다.""",
    ["[WebFlux](https://docs.spring.io/spring-framework/reference/web/webflux.html)"],
)
add(
    "Webhook",
    "웹훅 콜백 통합",
    "이벤트 발생 시 등록된 HTTP 엔드포인트로 POST합니다.",
    """서명 검증·재시도·멱등 키로 중복 처리를 설계합니다.""",
)
add(
    "Work Space",
    "워크스페이스·작업 공간 메모",
    "팀·도구의 작업 공간 단위를 가리키는 제목입니다.",
    """구체 도구(IDE, Notion, 클라우드 계정)별로 하위 문서를 둡니다.""",
)
add(
    "application properties",
    "Spring application.properties/.yml",
    "외부 설정으로 포트·데이터소스·로깅을 주입합니다.",
    """프로필(`application-{profile}.yml`)과 비밀 값 분리(환경 변수)를 권장합니다.""",
)
add(
    "apt list update 관리",
    "apt 패키지 목록·업데이트 관리",
    "`apt update`로 인덱스를 갱신하고 `apt upgrade`로 패키지를 올립니다.",
    """자동화 시 unattended-upgrades와 재부팅 정책을 정합니다.
오류 메모는 [apt update err](./apt-update-err.md)를 참고합니다.""",
)
add(
    "apt update err",
    "apt update 실패 점검",
    "미러·GPG·네트워크·디스크 부족이 흔한 원인입니다.",
    """`apt update` 로그의 저장소 URL과 서명 오류 메시지를 먼저 읽습니다.""",
)
add(
    "bashrc(alias)",
    "bashrc에 alias 두기",
    "`~/.bashrc`에 `alias`를 정의해 반복 명령을 줄입니다.",
    """변경 후 `source ~/.bashrc` 또는 새 셸에서 확인합니다.""",
)
add(
    "cast(uni,broad,multi)",
    "유니캐스트·브로드캐스트·멀티캐스트",
    "전송 대상 범위에 따른 주소 지정 방식입니다.",
    """유니는 1:1, 브로드는 서브넷 전체, 멀티는 그룹 구독자입니다.""",
)
add(
    "client server struct",
    "클라이언트-서버 구조",
    "요청하는 쪽과 서비스를 제공하는 쪽을 분리한 모델입니다.",
    """상태 보관 위치·인증·부하 분산을 어디에 둘지 정합니다.""",
)
add(
    "common",
    "공통 모듈·공통 설정 메모",
    "여러 서비스가 공유하는 코드·설정을 두는 자리입니다.",
    """과도한 공통 모듈은 배포 결합을 키우므로 경계를 명확히 합니다.""",
)
add(
    "connetionLess",
    "비연결형 통신(표기 메모)",
    "UDP처럼 연결 설정 없이 데이터그램을 보내는 모델입니다.",
    """원문 철자(connetionLess)를 유지합니다.
신뢰성이 필요하면 상위 계층에서 재전송을 둡니다.""",
)
add(
    "debezium",
    "Debezium CDC 개요",
    "데이터베이스 변경을 캡처해 커넥터로 스트리밍합니다.",
    """아이컴시스 런타임 경로의 Debezium 절과 개념이 맞닿아 있습니다.""",
    ["[Debezium 문서](https://debezium.io/documentation/)"],
)
add(
    "docker 배포 로그",
    "Docker 배포 시 로그 확인",
    "`docker logs`와 로깅 드라이버로 컨테이너 출력을 봅니다.",
    """프로덕션에서는 중앙 수집(ELK 등)과 로그 로테이션을 함께 둡니다.""",
)
add(
    "docker-compose yml",
    "Compose 파일 기본",
    "서비스·네트워크·볼륨을 YAML로 선언합니다.",
    """`depends_on`은 기동 순서만 보장하고 애플리케이션 readiness는 healthcheck로 보완합니다.""",
    ["[Compose specification](https://docs.docker.com/compose/compose-file/)"],
)
add(
    "echo",
    "셸 echo 명령",
    "`echo`는 인자를 표준 출력으로 인쇄합니다.",
    """스크립트 디버깅·환경 변수 확인에 씁니다. 포터블하게 쓰려면 `printf`를 검토합니다.""",
)
add(
    "envVarialbe",
    "환경 변수(표기 메모)",
    "프로세스 환경으로 설정을 주입합니다.",
    """원문 철자(envVarialbe)를 유지합니다.
비밀은 환경 변수나 시크릿 매니저에 두고 저장소에 커밋하지 않습니다.""",
)
add(
    "fileName date",
    "파일명에 날짜 넣기",
    "로그·백업 파일명에 `YYYYMMDD` 등을 넣어 구분을 쉽게 합니다.",
    """타임존과 정렬 가능한 포맷을 고릅니다.""",
)
add(
    "flutter",
    "Flutter 클라이언트 프레임워크",
    "단일 코드베이스로 모바일·웹 등을 만드는 UI 툴킷입니다.",
    """원문에 이미지가 있으면 본문 이미지 경로를 유지합니다.""",
    ["[Flutter 문서](https://docs.flutter.dev/)"],
)
add(
    "flyway",
    "Flyway 스키마 마이그레이션",
    "버전 스크립트로 DB 스키마를 순서대로 적용합니다.",
    """체크섬 변경·baselining·멀티 스키마 정책을 팀과 맞춥니다.""",
    ["[Flyway](https://documentation.red-gate.com/flyway)"],
)
add(
    "hooxiAdmin docker",
    "hooxiAdmin Docker 실행 메모",
    " hooxiAdmin 관련 이미지를 Compose 또는 `docker run`으로 기동하는 메모입니다.".replace(" hooxiAdmin", "hooxiAdmin"),
    """포트 매핑·환경 변수·볼륨만 문서에 남기고, 실제 비밀번호는 시크릿으로 분리합니다.""",
)
add(
    "http message",
    "HTTP 메시지 구조",
    "시작줄·헤더·본문으로 요청과 응답이 구성됩니다.",
    """청크 전송·압축·멀티파트는 헤더와 본문 규칙이 달라집니다.""",
)
add(
    "index",
    "인덱스(목차·DB 인덱스) 메모",
    "문서 목차이거나 DB 인덱스를 가리킬 수 있는 짧은 제목입니다.",
    """DB 맥락이면 선택도·쓰기 비용을 보고 인덱스를 추가합니다.
의도가 문서 목차였다면 상위 카탈로그를 링크합니다.""",
)
add(
    "ip",
    "IP 주소 기본",
    "네트워크에서 호스트를 식별하는 주소입니다.",
    """IPv4/IPv6, 프라이빗 대역, CIDR을 함께 이해합니다.
CIDR 계산 링크는 [Cidr 계산기](./cidr-계산기.md)를 참고합니다.""",
)
add(
    "jenkins setting",
    "Jenkins 기본 설정",
    "잡·자격 증명·에이전트·플러그인을 설정합니다.",
    """Pipeline은 Jenkinsfile로 코드화합니다.
에디터 링크 자료는 [젠킨스 이클립스 에디터](./젠킨스-이클립스-에디터.md)를 참고합니다.""",
)
add(
    "network",
    "네트워크 계층 메모 진입",
    "호스트 간 통신의 주소·라우팅·전송을 다루는 영역입니다.",
    """tcp·port·ip 문서로 나눠 두었습니다.
의도 불명인 짧은 dns/udp 메모는 보류 목록에 있습니다.""",
)
add(
    "old info",
    "오래된 참고 정보 표시",
    "시점 지난 설정·링크를 모아 둔 자리입니다.",
    """수치·콘솔 UI는 변할 수 있으므로 공식 문서의 최신 페이지를 다시 확인합니다.""",
)
add(
    "openssl base64",
    "OpenSSL로 Base64 인코딩",
    "`openssl base64 -e` / `-d`로 인코딩·디코딩합니다.",
    """개행 처리(`-A`)와 바이너리 입출력에 주의합니다.""",
)
add(
    "pg admin",
    "pgAdmin으로 PostgreSQL 관리",
    "GUI로 서버·DB·질의를 관리합니다.",
    """접속 정보는 로컬 저장 암호화·공유 정책을 확인합니다.""",
)
add(
    "plan",
    "계획·체크리스트 메모",
    "작업 계획만 남겨 둔 원문 제목입니다.",
    """실행 결과와 결정이 생기면 Decisions·해당 Knowledge 글로 옮깁니다.""",
)
add(
    "r2dbc mongoDb",
    "R2DBC와 MongoDB 경계 메모",
    "R2DBC는 관계형 논블로킹 API이고, MongoDB는 별도 리액티브 드라이버를 씁니다.",
    """스택을 섞을 때 트랜잭션·일관성 모델을 각각 확인합니다.""",
)
add(
    "rewrite",
    "URL·프록시 rewrite",
    "리버스 프록시나 게이트웨이에서 경로를 바꿉니다.",
    """원본 경로·정규식·리다이렉트 상태 코드를 명시합니다.""",
)
add(
    "scp file down",
    "scp로 파일 받기",
    "`scp user@host:/path localpath`로 원격 파일을 복사합니다.",
    """키 기반 인증과 점프 호스트(`-J`)를 운영 환경에 맞게 씁니다.""",
)
add(
    "sh",
    "셸 스크립트(sh) 기본",
    "포터블 스크립트는 `sh` 문법을 기준으로 씁니다.",
    """`set -eu` 등으로 실패를 드러내고, bash 전용 문법은 shebang을 맞춥니다.""",
)
add(
    "ssh",
    "SSH 원격 접속",
    "암호화된 원격 셸·포트 포워딩을 제공합니다.",
    """키 인증, `~/.ssh/config`, allow 리스트는 [ssh allow](./ssh-allow.md)를 참고합니다.""",
)
add(
    "ssh allow",
    "SSH 접속 허용 설정",
    "`sshd_config`와 방화벽·보안 그룹으로 허용 대상을 제한합니다.",
    """비밀번호 로그인 비활성·Fail2ban 등은 환경 정책에 따릅니다.""",
)
add(
    "tcp",
    "TCP 전송 계층",
    "연결 지향·신뢰성 있는 바이트 스트림을 제공합니다.",
    """핸드셰이크·흐름 제어·재전송이 UDP와 다른 점입니다.""",
)
add(
    "tree meth type is null",
    "트리·메서드·타입 null 점검 메모",
    "트리 구조 데이터나 리플렉션에서 메서드/타입이 null인 경우를 가리키는 짧은 메모로 보입니다.",
    """원문 맥락이 짧아, NPE 방어와 옵셔널·명시적 검증을 일반 지침으로 둡니다.
구체 스택 트레이스가 있으면 이 글에 이어서 붙입니다.""",
)
add(
    "ubuntu",
    "Ubuntu 서버 기본",
    "apt 기반 패키지 관리와 systemd 서비스 운영이 중심입니다.",
    """관련: [ubuntu upgrade](./ubuntu-upgrade.md), [apt list update 관리](./apt-list-update-관리.md).""",
)
add(
    "ubuntu upgrade",
    "Ubuntu 릴리스·패키지 업그레이드",
    "`apt` 업그레이드와 `do-release-upgrade`를 구분해 계획합니다.",
    """프로덕션은 스냅샷·유지 관리 창을 두고 진행합니다.""",
)
add(
    "user",
    "Linux 사용자 계정",
    "UID·홈·셸·그룹으로 사용자를 관리합니다.",
    """최소 권한과 sudoers 정책을 맞춥니다.""",
)
add(
    "배포 jarFile 생성",
    "배포용 JAR 만들기",
    "Spring Boot면 `bootJar`/`package`로 실행 가능 JAR을 만듭니다.",
    """버전·프로파일·의존성 범위를 CI에서 고정합니다.""",
)
add(
    "변경사항 실시간 변경",
    "설정·콘텐츠 실시간 반영",
    "재배포 없이 반영하려면 외부 설정 새로고침·이벤트·웹소켓 등을 검토합니다.",
    """일관성과 캐시 무효화 비용을 함께 봅니다.""",
)
add(
    "빌드패턴1(build pattern)",
    "빌더 패턴(생성) 개요",
    "복잡한 객체를 단계적으로 만들 때 빌더를 씁니다.",
    """필수·선택 인자를 읽기 쉽게 나누고, 불변 객체와 잘 맞습니다.
GoF 생성 패턴 맥락의 학습 메모입니다.""",
)
add(
    "스트래티지 패턴(Strategy Pattern)",
    "스트래티지 패턴 개요",
    "교환 가능한 알고리즘을 인터페이스로 분리합니다.",
    """조건 분기 대신 전략 객체를 주입해 확장합니다.""",
)
add(
    "스프링5 레시피4판",
    "스프링 5 레시피 학습 메모 진입",
    "도서 「스프링 5 레시피」 학습용으로 남겨 둔 제목입니다.",
    """장별 실습 내용이 원문에 거의 없어, 책과 공식 Spring 문서를 함께 보도록 안내만 둡니다.""",
)
add(
    "외부 리소스",
    "외부 리소스·의존 서비스",
    "DB·오브젝트 스토리지·서드파티 API처럼 프로세스 밖 자원입니다.",
    """타임아웃·재시도·서킷브레이커·비밀 관리를 애플리케이션과 같이 설계합니다.""",
)


def category_fallback(title: str) -> Ref:
    t = title.lower()
    if any(k in t for k in ("spring", "bean", "jpa", "webflux", "mvc")):
        return body(
            f"{title} Spring 관련 개념 정리",
            f"`{title}` 관련 Spring 생태계 개념을 짧은 뼈대로 보완했습니다.",
            "공식 Spring 문서의 해당 절을 기준으로 확장하면 됩니다.\n구체 코드·실측은 확인된 내용만 이어서 붙입니다.",
            ["[spring.io/docs](https://spring.io/docs)"],
        )
    if any(k in t for k in ("aws", "ec2", "s3", "vpc", "ses", "kendra")):
        return body(
            f"{title} AWS 관련 개념 정리",
            f"`{title}` AWS 주제를 일반 개념 수준에서 보완했습니다.",
            "콘솔 메뉴와 한도는 리전·계정에 따라 달라지므로 공식 사용자 안내서를 확인합니다.",
            ["[AWS Documentation](https://docs.aws.amazon.com/)"],
        )
    if any(k in t for k in ("docker", "linux", "ubuntu", "centos", "ssh", "apt")):
        return body(
            f"{title} 운영·인프라 메모 보완",
            f"`{title}` 운영 메모를 일반 절차 수준에서 보완했습니다.",
            "배포 환경의 실제 경로·계정은 시크릿과 런북에 두고, 이 글에는 절차만 남깁니다.",
        )
    return body(
        f"{title} 개념 뼈대 보완",
        f"원문이 짧아 `{title}` 주제를 일반적인 개념과 확인 항목으로 보완했습니다.",
        """## 확인할 것

- 이 주제가 해결하려는 문제
- 적용 계층(인프라, 애플리케이션, 클라이언트)
- 공식 문서나 기준 링크

특정 프로젝트 경험·수치는 확인된 뒤에만 추가합니다.""",
    )


def split_fm(text: str) -> tuple[str, str]:
    if not text.startswith("---"):
        return "", text
    parts = text.split("---", 2)
    if len(parts) < 3:
        return text, ""
    return "---" + parts[1] + "---", parts[2].lstrip("\n")


def upsert_description(fm: str, description: str) -> str:
    lines = fm.splitlines()
    out = []
    replaced = False
    for line in lines:
        if line.startswith("description:"):
            out.append(f'description: "{description}"')
            replaced = True
        else:
            out.append(line)
    if not replaced:
        # insert after title
        new = []
        for line in out:
            new.append(line)
            if line.startswith("title:") and not replaced:
                new.append(f'description: "{description}"')
                replaced = True
        out = new
    if "format: md" not in fm and "format:" not in fm:
        # after opening ---
        if out and out[0] == "---":
            out.insert(1, "format: md")
    return "\n".join(out) + ("\n" if not out[-1].endswith("\n") else "")


def write_doc(path: Path, description: str, title: str, body_inner: str) -> None:
    text = path.read_text(encoding="utf-8")
    fm, _old = split_fm(text)
    if not fm:
        fm = f'---\nformat: md\ntitle: "{title}"\ndescription: "{description}"\nstatus: active\n---'
    else:
        fm = upsert_description(fm, description)
    body = f"# {title}\n\n{body_inner.strip()}\n"
    path.write_text(fm.rstrip() + "\n" + body, encoding="utf-8")


def rewrite_link_doc(path: Path, title: str, urls: list[str], meta: dict, preview: str) -> None:
    memo_lines = []
    for ln in preview.splitlines():
        s = ln.strip()
        if not s or s.startswith("#"):
            continue
        if s.startswith("http") or s.startswith("[http") or re.match(r"\[.*\]\(https?://", s):
            continue
        if s in {"+", "순서 1", "순서 2", "순서 3", "sam", "rest exame"}:
            continue
        # skip nested notion wiki links leftovers
        if s.startswith("[[") or "AWS%20" in s:
            continue
        memo_lines.append(s)

    link_rows = []
    for u in urls:
        m = meta.get(u) or {}
        t = (m.get("title") or u).strip()
        t = re.sub(r"\s*\|\s*.*$", "", t)[:120]
        d = (m.get("desc") or "").replace("\n", " ").strip()[:200]
        if d:
            link_rows.append(f"- [{t}]({u}) — {d}")
        else:
            link_rows.append(f"- [{t}]({u})")

    sections = []
    if memo_lines:
        sections += ["## 원문 메모", ""] + memo_lines + [""]
    sections += ["## 참고 자료", ""]
    sections += link_rows or ["(원문에 외부 링크가 없습니다.)"]
    sections += [
        "",
        "상세 절차와 최신 옵션은 위 링크의 원문을 확인합니다.",
        "이 글은 링크 보관과 범위 안내만 하며, 특정 환경의 실측 수치를 주장하지 않습니다.",
    ]
    desc = f"{title} 관련 원문 링크 범위 안내"
    overview = f"원문에 모아 둔 {title} 참고 링크를 기준으로, 각 자료가 다루는 범위를 짧게 안내합니다."
    body_inner = f"> **개요:** {overview}\n\n" + "\n".join(sections)
    write_doc(path, desc, title, body_inner)


def main() -> None:
    queue = json.loads(QUEUE.read_text())
    meta = json.loads(URL_META.read_text()) if URL_META.exists() else {}
    mapping = json.loads(MAPPING.read_text())
    by_dest = {m["dest"]: m for m in mapping if m.get("dest")}

    done_link = done_inc = skipped = curated = fallback = 0

    for item in queue:
        dest = item["dest"]
        path = DOCS / dest
        if not path.exists():
            skipped += 1
            continue
        title = item["title"]
        if item["status"] == "링크자료":
            rewrite_link_doc(path, title, item.get("urls") or [], meta, item.get("body_preview") or "")
            done_link += 1
            if dest in by_dest:
                by_dest[dest]["supplement_status"] = "supplemented"
                by_dest[dest]["supplement_kind"] = "researched_link"
            continue

        content = INCOMPLETE.get(title)
        kind = "researched_incomplete"
        if content is None:
            content = category_fallback(title)
            kind = "researched_stub"
            fallback += 1
        else:
            curated += 1
        desc, body_inner = content
        write_doc(path, desc, title, body_inner)
        done_inc += 1
        if dest in by_dest:
            by_dest[dest]["supplement_status"] = "supplemented"
            by_dest[dest]["supplement_kind"] = kind

    for m in mapping:
        if m.get("status") == "이전" and not m.get("supplement_status"):
            # pilots / cases may already be researched — leave migrate_only for untouched bulk
            m["supplement_status"] = "migrate_only"

    # messenger + pilots mark
    for m in mapping:
        dest = m.get("dest") or ""
        if any(
            x in dest
            for x in (
                "self-hosted-messenger",
                "factory-method",
                "https-on-alb-with-acm",
                "amazon-s3-api-reference",
            )
        ):
            m["supplement_status"] = "supplemented"
            m["supplement_kind"] = "researched"

    MAPPING.write_text(json.dumps(mapping, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"link={done_link} incomplete={done_inc} curated={curated} fallback={fallback} skipped={skipped}")


if __name__ == "__main__":
    main()
