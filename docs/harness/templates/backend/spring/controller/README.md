# Controller template

> **개요:** 테이블 입구 컨트롤러입니다. entrance.{도메인}에 두고 @Hidden 입니다.

파사드 메서드와 같은 이름으로 한 번만 호출합니다.
`controller` 하위 패키지는 두지 않습니다.
응답은 `CommonResponseUtils.responseSuccess` 입니다.

## Files

- [`RestOutLogController.java`](./RestOutLogController.java)

## Source

### `RestOutLogController.java`

```java
package com.example.template.restoutlog.entrance;

import com.example.template.restoutlog.dto.RestOutLogReq;
import com.example.template.restoutlog.dto.RestOutLogRes;
import com.example.template.restoutlog.facade.RestOutLogFacade;
import com.example.template.support.CommonResponseUtils;
import com.example.template.support.CommonResponse;
import io.swagger.v3.oas.annotations.Hidden;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Hidden
@Tag(name = "RestOutLog", description = "le_rest_out_log")
@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/rest-out-logs")
public class RestOutLogController {

    private final RestOutLogFacade restOutLogFacade;

    @Operation(summary = "목록 조회")
    @GetMapping
    public CommonResponse<Page<RestOutLogRes.Item>> search(@ModelAttribute RestOutLogReq.Filter filter, Pageable pageable) {
        return CommonResponseUtils.responseSuccess(restOutLogFacade.search(filter, pageable));
    }

    @Operation(summary = "생성")
    @PostMapping
    public CommonResponse<RestOutLogRes.Id> save(@RequestBody RestOutLogReq.Create create) {
        return CommonResponseUtils.responseSuccess(restOutLogFacade.save(create));
    }

    @Operation(summary = "일괄 생성")
    @PostMapping("/save-all")
    public CommonResponse<List<RestOutLogRes.Id>> saveAll(@RequestBody List<RestOutLogReq.Create> createList) {
        return CommonResponseUtils.responseSuccess(restOutLogFacade.saveAll(createList));
    }

    @Operation(summary = "단건 조회")
    @GetMapping("/{id}")
    public CommonResponse<RestOutLogRes.Item> findById(@Parameter(description = "ID") @PathVariable(name = "id") Long id) {
        return CommonResponseUtils.responseSuccess(restOutLogFacade.findById(id));
    }

    @Operation(summary = "수정")
    @PutMapping("/{id}")
    public CommonResponse<RestOutLogRes.Id> saveById(@Parameter(description = "ID") @PathVariable(name = "id") Long id, @RequestBody RestOutLogReq.Update update) {
        return CommonResponseUtils.responseSuccess(restOutLogFacade.saveById(id, update));
    }

    @Operation(summary = "삭제")
    @DeleteMapping("/{id}")
    public CommonResponse<?> deleteById(@Parameter(description = "ID") @PathVariable(name = "id") Long id) {
        restOutLogFacade.deleteById(id);
        return CommonResponseUtils.responseSuccess();
    }

    @Operation(summary = "전체 조회")
    @GetMapping("/find-all")
    public CommonResponse<List<RestOutLogRes.Item>> findAll(@ModelAttribute RestOutLogReq.Filter filter) {
        return CommonResponseUtils.responseSuccess(restOutLogFacade.findAll(filter));
    }

    @Operation(summary = "아이디 선택 조회")
    @GetMapping("/find-by-ids")
    public CommonResponse<List<RestOutLogRes.Item>> findByIds(@RequestParam List<Long> ids) {
        return CommonResponseUtils.responseSuccess(restOutLogFacade.findByIds(ids));
    }

    @Operation(summary = "이름 검색")
    @GetMapping("/search-name")
    public CommonResponse<Page<RestOutLogRes.Name>> searchName(@ModelAttribute RestOutLogReq.Filter filter, Pageable pageable) {
        return CommonResponseUtils.responseSuccess(restOutLogFacade.searchName(filter, pageable));
    }

    @Operation(summary = "이름 전체 조회")
    @GetMapping("/find-all-name")
    public CommonResponse<List<RestOutLogRes.Name>> findAllName(@ModelAttribute RestOutLogReq.Filter filter) {
        return CommonResponseUtils.responseSuccess(restOutLogFacade.findAllName(filter));
    }

    @Operation(summary = "아이디 선택 삭제")
    @DeleteMapping("/delete-by-ids")
    public CommonResponse<?> deleteByIds(@RequestParam List<Long> ids) {
        restOutLogFacade.deleteByIds(ids);
        return CommonResponseUtils.responseSuccess();
    }
}
```
