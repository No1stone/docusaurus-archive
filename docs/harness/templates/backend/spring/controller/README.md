# Controller template

> **개요:** 테이블 입구 컨트롤러입니다. entrance.\{도메인\}에 두고 @Hidden 입니다.

파사드 메서드와 같은 이름으로 한 번만 호출합니다.
`controller` 하위 패키지는 두지 않습니다.
응답은 `CommonResponseUtils.responseSuccess` 입니다.

## Files

- [`ExampleItemController.java`](./ExampleItemController.java)

## Source

### `ExampleItemController.java`

```java
package com.example.template.exampleitem.entrance;

import com.example.template.exampleitem.dto.ExampleItemReq;
import com.example.template.exampleitem.dto.ExampleItemRes;
import com.example.template.exampleitem.facade.ExampleItemFacade;
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
@Tag(name = "ExampleItem", description = "le_example_item")
@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/rest-out-logs")
public class ExampleItemController {

    private final ExampleItemFacade exampleItemFacade;

    @Operation(summary = "목록 조회")
    @GetMapping
    public CommonResponse<Page<ExampleItemRes.Item>> search(@ModelAttribute ExampleItemReq.Filter filter, Pageable pageable) {
        return CommonResponseUtils.responseSuccess(exampleItemFacade.search(filter, pageable));
    }

    @Operation(summary = "생성")
    @PostMapping
    public CommonResponse<ExampleItemRes.Id> save(@RequestBody ExampleItemReq.Create create) {
        return CommonResponseUtils.responseSuccess(exampleItemFacade.save(create));
    }

    @Operation(summary = "일괄 생성")
    @PostMapping("/save-all")
    public CommonResponse<List<ExampleItemRes.Id>> saveAll(@RequestBody List<ExampleItemReq.Create> createList) {
        return CommonResponseUtils.responseSuccess(exampleItemFacade.saveAll(createList));
    }

    @Operation(summary = "단건 조회")
    @GetMapping("/{id}")
    public CommonResponse<ExampleItemRes.Item> findById(@Parameter(description = "ID") @PathVariable(name = "id") Long id) {
        return CommonResponseUtils.responseSuccess(exampleItemFacade.findById(id));
    }

    @Operation(summary = "수정")
    @PutMapping("/{id}")
    public CommonResponse<ExampleItemRes.Id> saveById(@Parameter(description = "ID") @PathVariable(name = "id") Long id, @RequestBody ExampleItemReq.Update update) {
        return CommonResponseUtils.responseSuccess(exampleItemFacade.saveById(id, update));
    }

    @Operation(summary = "삭제")
    @DeleteMapping("/{id}")
    public CommonResponse<?> deleteById(@Parameter(description = "ID") @PathVariable(name = "id") Long id) {
        exampleItemFacade.deleteById(id);
        return CommonResponseUtils.responseSuccess();
    }

    @Operation(summary = "전체 조회")
    @GetMapping("/find-all")
    public CommonResponse<List<ExampleItemRes.Item>> findAll(@ModelAttribute ExampleItemReq.Filter filter) {
        return CommonResponseUtils.responseSuccess(exampleItemFacade.findAll(filter));
    }

    @Operation(summary = "아이디 선택 조회")
    @GetMapping("/find-by-ids")
    public CommonResponse<List<ExampleItemRes.Item>> findByIds(@RequestParam List<Long> ids) {
        return CommonResponseUtils.responseSuccess(exampleItemFacade.findByIds(ids));
    }

    @Operation(summary = "이름 검색")
    @GetMapping("/search-name")
    public CommonResponse<Page<ExampleItemRes.Name>> searchName(@ModelAttribute ExampleItemReq.Filter filter, Pageable pageable) {
        return CommonResponseUtils.responseSuccess(exampleItemFacade.searchName(filter, pageable));
    }

    @Operation(summary = "이름 전체 조회")
    @GetMapping("/find-all-name")
    public CommonResponse<List<ExampleItemRes.Name>> findAllName(@ModelAttribute ExampleItemReq.Filter filter) {
        return CommonResponseUtils.responseSuccess(exampleItemFacade.findAllName(filter));
    }

    @Operation(summary = "아이디 선택 삭제")
    @DeleteMapping("/delete-by-ids")
    public CommonResponse<?> deleteByIds(@RequestParam List<Long> ids) {
        exampleItemFacade.deleteByIds(ids);
        return CommonResponseUtils.responseSuccess();
    }
}
```
