# exampleitem 도메인 원셋

실무 애플리케이션 도메인 폴더와 같은 뼈대입니다.

```text
exampleitem/
  controller/     # 원셋 확인용 (실무는 entrance)
  facade/
  dto/
  persistence/    # Port + Adapter + entity + repository + spec
```

Outbound 영속만 Port·Adapter를 둡니다. Inbound Port는 두지 않습니다.
