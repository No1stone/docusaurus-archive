# Facade template

> **개요:** 테이블 파사드입니다. 서비스만 주입합니다.

리포지토리, 스펙, 엔티티 저장을 하지 않습니다.
클래스 기본은 `@Transactional(readOnly = true, transactionManager = "transactionManager")` 이고, 쓰기만 `@Transactional` 입니다.
열거형 코드 재설정은 이 파일이 아니라 [enum 템플릿](../enum/) 입니다.

## Files

- [`RestOutLogFacade.java`](./RestOutLogFacade.java)

## Source

### `RestOutLogFacade.java`

```java
package com.example.template.restoutlog.facade;

import com.example.template.restoutlog.dto.RestOutLogReq;
import com.example.template.restoutlog.dto.RestOutLogRes;
import com.example.template.restoutlog.service.RestOutLogService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
@Transactional(readOnly = true, transactionManager = "transactionManager")
public class RestOutLogFacade {

    private final RestOutLogService restOutLogService;

    public Page<RestOutLogRes.Item> search(RestOutLogReq.Filter filter, Pageable pageable) {
        return restOutLogService.search(filter, pageable);
    }

    @Transactional
    public RestOutLogRes.Id save(RestOutLogReq.Create create) {
        return restOutLogService.save(create);
    }

    @Transactional
    public List<RestOutLogRes.Id> saveAll(List<RestOutLogReq.Create> createList) {
        return restOutLogService.saveAll(createList);
    }

    public RestOutLogRes.Item findById(Long id) {
        return restOutLogService.findById(id);
    }

    @Transactional
    public RestOutLogRes.Id saveById(Long id, RestOutLogReq.Update update) {
        return restOutLogService.saveById(id, update);
    }

    @Transactional
    public void deleteById(Long id) {
        restOutLogService.deleteById(id);
    }

    public List<RestOutLogRes.Item> findAll(RestOutLogReq.Filter filter) {
        return restOutLogService.findAll(filter);
    }

    public List<RestOutLogRes.Item> findByIds(List<Long> ids) {
        return restOutLogService.findByIds(ids);
    }

    public Page<RestOutLogRes.Name> searchName(RestOutLogReq.Filter filter, Pageable pageable) {
        return restOutLogService.searchName(filter, pageable);
    }

    public List<RestOutLogRes.Name> findAllName(RestOutLogReq.Filter filter) {
        return restOutLogService.findAllName(filter);
    }

    @Transactional
    public void deleteByIds(List<Long> ids) {
        restOutLogService.deleteByIds(ids);
    }
}
```
