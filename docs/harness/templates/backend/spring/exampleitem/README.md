# exampleitem 도메인 원셋

실무 애플리케이션 도메인 폴더와 같은 뼈대입니다.

```text
exampleitem/
  controller/       # 원셋 확인용 진입 (모노리포: api)
  facade/           # DomainFacade (모노리포: model)
  dto/              # 모노리포: model
  persistence/      # 모노리포: model
  support/display/  # DisplayNameResolver (모노리포: model)
```

Outbound 영속만 Port·Adapter를 둡니다. Inbound Port는 두지 않습니다.
DomainFacade는 조회 후 `DisplayNameResolver`로 Name 표시명을 채웁니다.

모노리포: 진입만 api, DomainFacade·Resolver·dto·persistence는 model.
BffFacade·GraphQL은 api (원셋 코드 없음).
자세한 분기는 [ONESET.md](../ONESET)입니다.
