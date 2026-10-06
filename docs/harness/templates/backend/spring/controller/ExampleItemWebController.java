package com.example.template.exampleitem.controller;

import com.example.template.exampleitem.dto.ExampleItemReq;
import com.example.template.exampleitem.dto.ExampleItemRes;
import com.example.template.exampleitem.facade.ExampleItemFacade;
import com.example.template.support.CommonResponse;
import com.example.template.support.CommonResponseUtils;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
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

@RestController
@RequestMapping("/web/example-items")
public class ExampleItemWebController {

    private final ExampleItemFacade exampleItemFacade;

    public ExampleItemWebController(ExampleItemFacade exampleItemFacade) {
        this.exampleItemFacade = exampleItemFacade;
    }

    @GetMapping
    public CommonResponse<Page<ExampleItemRes.Item>> searchForWeb(
            @Valid @ModelAttribute ExampleItemReq.WebListQuery query
    ) {
        return CommonResponseUtils.responseSuccess(exampleItemFacade.searchForWeb(query));
    }

    @PostMapping
    public CommonResponse<ExampleItemRes.WebCreated> createForWeb(
            @Valid @RequestBody ExampleItemReq.WebCreate body
    ) {
        return CommonResponseUtils.responseSuccess(exampleItemFacade.createForWeb(body));
    }

    @PutMapping("/{id}")
    public CommonResponse<ExampleItemRes.WebUpdated> updateForWeb(
            @PathVariable Long id,
            @Valid @RequestBody ExampleItemReq.WebUpdate body
    ) {
        return CommonResponseUtils.responseSuccess(exampleItemFacade.updateForWeb(id, body));
    }

    @GetMapping("/{id}")
    public CommonResponse<ExampleItemRes.Item> findByIdForWeb(@PathVariable Long id) {
        return CommonResponseUtils.responseSuccess(exampleItemFacade.findById(id));
    }

    @DeleteMapping("/delete-by-ids")
    public CommonResponse<Void> deactivateByIdsForWeb(@RequestParam List<Long> ids) {
        exampleItemFacade.deactivateByIdsForWeb(ids);
        return CommonResponseUtils.responseSuccess();
    }
}
